---
title: "CR-011 - PowerShell Administration Toolkit"
subtitle: "Nova Corp Enterprise Infrastructure Lab - Implementation, Validation and Closure Journal"
author: "David Eti"
date: "22 October 2026"
status: "COMPLETE - validated baseline CR-011-v1.0.0"
---

> **Public evidence note (21 Nov 2026):** this historical journal originally referenced local screenshot assets that are not currently present in the public repository. Broken image embeds have been removed from the rendered page while the exact evidence filenames remain preserved in the Markdown source comments. A smaller curated screenshot set will be republished after privacy review.


# CR-011 - PowerShell Administration Toolkit

**Nova Corp Enterprise Infrastructure Lab**  
**Change Request:** CR-011  
**Business request:** T-011 - Reusable user-lifecycle automation required before recruitment expansion  
**Technical owner:** David Eti  
**Domain:** `nova.corp`  
**Primary implementation host:** `NOVA-DC01`  
**Final release:** `CR-011-v1.0.0`  
**Final state:** **PASS / COMPLETE**  
**Final rollback point:** Proxmox snapshot `cr011-complete...`, created 22 October 2026 08:25:48

> **Purpose of this journal:** preserve the command-level truth of CR-011: what was built, why each part exists, what failed, how failures were diagnosed, the exact validation commands used, the final known-good release baseline, and the evidence required to reproduce or explain the work in an interview or future incident.

---

## 1. Executive Summary

CR-011 created a controlled PowerShell administration toolkit for Active Directory lifecycle, access review, account lockout investigation, password reset, and computer inventory operations.

The original Nova Corp Phase 2.7 requirement listed eight administration scripts:

1. `New-BulkUsers.ps1`
2. `Get-InactiveUsers.ps1`
3. `Disable-OffboardedUser.ps1`
4. `Get-GroupMembership.ps1`
5. `Test-UserAccess.ps1`
6. `Get-LockedAccounts.ps1`
7. `Reset-UserPassword.ps1`
8. `Get-ADComputerReport.ps1`

The later Master Roadmap v2 expanded the operational expectations: safe repeated execution, `-WhatIf`, confirmation, logging, CSV validation, idempotency, access verification, protected-account boundaries, and evidence. The implementation completed those operational goals using eight versioned standalone scripts and a release package.

A strict roadmap wording says "NovaTools module". The accepted CR-011 implementation is instead a **versioned NovaTools release folder containing eight standalone scripts**. The operational behaviors are implemented and validated; converting these scripts into a `.psm1` module is therefore a future refactor, not a reason to discard the validated baseline.

The final release was frozen under:

```text
C:\NovaCorp\PowerShell\NovaTools\CR-011-v1.0.0\
```

with:

```text
Scripts\
Manifest\
VERSION.txt
```

The eight packaged scripts were individually present, parser-clean, SHA-256 hashed, and byte-for-byte equivalent to the working copies by hash comparison.

---

## 2. Business Need and Engineering Objective

Manual administration is acceptable when a lab contains only a few accounts. It does not scale when the fictional company begins onboarding more staff, handling offboarding requests, investigating lockouts, auditing access, and maintaining a support trail.

CR-011 therefore had four engineering goals:

- **Repeatability:** common AD tasks should be executable the same way each time.
- **Safety:** state-changing operations should support preview, confirmation, validation, and rollback behavior.
- **Auditability:** important actions should create useful logs and reports without exposing passwords.
- **Explainability:** the administrator should understand *why* the script behaves as it does, not merely copy commands.

The toolkit was deliberately tested against failure states rather than only happy paths. That produced several of the most valuable lessons in the CR: partial-user rollback, constructed-attribute limitations in AD filters, authorization-group name matching, lockout-event property mapping, and PowerShell variable interpolation errors.

---

## 3. Environment and Baseline

### 3.1 Core environment

| Item | Value |
|---|---|
| Domain | `nova.corp` |
| Primary DC | `NOVA-DC01` |
| Secondary DC visible in domain | `NOVA-DC02` |
| File server | `NOVA-FILES01` |
| Client | `NOVA-CLIENT` |
| PowerShell | Windows PowerShell 5.1 |
| AD module | ActiveDirectory 1.0.1.0 |
| Working root | `C:\NovaCorp\PowerShell` |
| Scripts | `C:\NovaCorp\PowerShell\Scripts` |
| Data | `C:\NovaCorp\PowerShell\Data` |
| Logs | `C:\NovaCorp\PowerShell\Logs` |
| Reports | `C:\NovaCorp\PowerShell\Reports` |
| Tests | `C:\NovaCorp\PowerShell\Tests` |

### 3.2 Initial environment verification

```powershell
hostname

$PSVersionTable

Get-Module -ListAvailable ActiveDirectory |
    Select-Object Name,Version,Path
```

Observed baseline:

```text
Hostname: nova-dc01
PSVersion: 5.1.26100.6899
ActiveDirectory module: 1.0.1.0
```

The key AD cmdlets were then checked:

```powershell
Get-Command `
    Get-ADUser,
    New-ADUser,
    Set-ADUser,
    Disable-ADAccount,
    Move-ADObject,
    Get-ADGroupMember,
    Get-ADComputer |
    Select-Object Name,CommandType
```

This proved the host had the administrative tooling required for the CR before script development began.

### 3.3 Working directory structure

```powershell
Get-ChildItem `
    "C:\NovaCorp\PowerShell" |
    Select-Object Name,FullName
```

Expected structure:

```text
Data
Logs
Reports
Scripts
Tests
```

This separation matters:

- **Data** = controlled input such as CSV files.
- **Logs** = human-readable operational audit trail.
- **Reports** = structured CSV output.
- **Scripts** = operational code.
- **Tests** = disposable test data and future regression helpers.

---

## 4. Active Directory Structure Used by the Toolkit

The scripts rely on the AD design created in earlier Nova Corp CRs.

### 4.1 Employee OUs

```powershell
Get-ADOrganizationalUnit -Filter * |
    Select-Object Name,DistinguishedName |
    Sort-Object DistinguishedName |
    Format-Table -AutoSize
```

Important OUs included:

```text
OU=Finance,OU=Nova Users,DC=nova,DC=corp
OU=HR,OU=Nova Users,DC=nova,DC=corp
OU=IT,OU=Nova Users,DC=nova,DC=corp
OU=Management,OU=Nova Users,DC=nova,DC=corp
OU=Sales,OU=Nova Users,DC=nova,DC=corp
OU=Nova Disabled Objects,DC=nova,DC=corp
OU=Nova Security groups,DC=nova,DC=corp
OU=Nova Service Accounts,DC=nova,DC=corp
OU=Nova-Computers,DC=nova,DC=corp
```

The disabled-object OU was explicitly verified:

```powershell
Get-ADOrganizationalUnit `
    -Identity "OU=Nova Disabled Objects,DC=nova,DC=corp"
```

### 4.2 Department global groups

```powershell
Get-ADGroup -Filter 'Name -like "*_Users"' |
    Select-Object Name,GroupScope,GroupCategory |
    Sort-Object Name |
    Format-Table -AutoSize
```

Observed department groups:

```text
Finance_Users
HR_Users
IT_Users
Management_Users
Sales_Users
```

All were **Global Security** groups.

---

## 5. Core Authorization Model - AGDLP

Nova Corp file authorization follows the Windows **AGDLP** pattern:

```text
Accounts
   -> Global groups
      -> Domain Local groups
         -> Permissions
```

Example:

```text
Alice Finance
   -> Finance_Users                (Global)
      -> DL_FS_Finance_Modify      (Domain Local)
         -> Finance share / NTFS Modify
```

### Global group

A Global group normally answers:

> "Who belongs to this business role or department?"

Examples:

```text
Finance_Users
IT_Users
HR_Users
```

### Domain Local group

A Domain Local group normally answers:

> "Who receives this permission on this resource?"

Examples:

```text
DL_FS_Finance_Modify
DL_FS_IT_Modify
DL_FS_Finance_FullControl
```

This separation is why a Finance user can be moved between business roles without editing every NTFS ACL individually.

---

# PART I - USER LIFECYCLE AUTOMATION

## 6. Script 1 - `New-BulkUsers.ps1`

### 6.1 Purpose

The bulk user script reads controlled HR-style CSV input and creates AD users in the correct department OU, assigns department security groups, sets a temporary password, enables the account, forces password change at next logon, validates the result, and records the outcome.

The design requirement was not merely "create accounts". It was:

> Create a **complete valid account** or leave **no incomplete account behind**.

That distinction became critical during testing.

### 6.2 Example input model

The CR used a CSV such as:

```text
C:\NovaCorp\PowerShell\Data\CR011-NewUsers.csv
```

Test identities included:

```text
cr011.fin
cr011.hr
cr011.it
cr011.mgmt
cr011.sales
```

The department values were constrained to:

```powershell
$AllowedDepartments = @(
    "Finance",
    "HR",
    "IT",
    "Management",
    "Sales"
)
```

Pre-validation:

```powershell
$Users | ForEach-Object {

    [PSCustomObject]@{
        SamAccountName  = $_.SamAccountName
        Department      = $_.Department
        ValidDepartment = $_.Department -in $AllowedDepartments
    }

} | Format-Table -AutoSize
```

All five test rows returned `ValidDepartment = True`.

### 6.3 Existing-account preflight

Before creating anything:

```powershell
$Users | ForEach-Object {

    [PSCustomObject]@{
        SamAccountName = $_.SamAccountName
        Department     = $_.Department
        ExistingUser   = [bool](
            Get-ADUser `
                -Filter "SamAccountName -eq '$($_.SamAccountName)'" `
                -ErrorAction SilentlyContinue
        )
    }

} | Format-Table -AutoSize
```

This prevents accidental duplicate creation on reruns.

### 6.4 Safe `-WhatIf` preview

```powershell
& $ScriptPath `
    -CsvPath "C:\NovaCorp\PowerShell\Data\CR011-NewUsers.csv" `
    -WhatIf
```

Expected behavior:

- describe every intended account operation;
- make **no AD changes**;
- do **not** create production log/report artifacts for changes that never happened.

The final implementation reports:

```text
Execution Mode : WHATIF / PREVIEW
AD Changes     : NONE
Log            : Not written during WhatIf
Report         : Not written during WhatIf
```

This was an improvement over an earlier version that generated empty/preview artifacts in the log folders.

### 6.5 Failure discovered - password policy created half-users

A deliberately weak temporary password was supplied.

The domain policy was verified:

```powershell
Get-ADDefaultDomainPasswordPolicy |
    Format-List `
        MinPasswordLength,
        ComplexityEnabled,
        PasswordHistoryCount,
        MinPasswordAge,
        MaxPasswordAge,
        LockoutThreshold
```

Observed policy:

```text
MinPasswordLength     : 12
ComplexityEnabled     : True
PasswordHistoryCount  : 24
MinPasswordAge        : 1 day
MaxPasswordAge        : 180 days
LockoutThreshold      : 5
```

The first production attempt failed with:

```text
The password does not meet the length, complexity,
or history requirement of the domain.
```

However, investigation showed the AD objects had already been created and were disabled:

```powershell
Get-ADUser `
    -Filter 'SamAccountName -like "cr011.*"' `
    -Properties MemberOf,pwdLastSet |
    Format-List `
        Name,
        SamAccountName,
        Enabled,
        DistinguishedName,
        pwdLastSet,
        MemberOf
```

Observed failure state:

```text
Enabled  : False
pwdLastSet : 0
MemberOf : {}
```

This is a classic automation defect:

```text
Step 1 create object       -> succeeded
Step 2 set password        -> failed
Step 3 group membership    -> never ran
Step 4 enable              -> never ran
```

The script returned "Failed", but the environment was left dirty.

### 6.6 Engineering correction - transaction-like rollback

AD does not provide a general multi-command transaction for this workflow, so the script was changed to emulate one:

```text
BEGIN
  create user in controlled disabled state
  set password
  add group membership
  set required attributes
  enable
  validate final state
COMMIT

IF ANY REQUIRED STEP FAILS
  remove incomplete account
  log rollback result
  return failure
```

The critical rollback behavior used:

```powershell
try {

    Remove-ADUser `
        -Identity $SamAccountName `
        -Confirm:$false `
        -ErrorAction Stop

    $RollbackStatus = "Successful"

    Write-NovaLog `
        "Rolled back incomplete account $SamAccountName" `
        "ROLLBACK"
}
catch {

    $RollbackStatus = `
        "FAILED: $($_.Exception.Message)"

    Write-NovaLog `
        "CRITICAL: Could not rollback $SamAccountName - $($_.Exception.Message)" `
        "CRITICAL"
}
```

The test log then showed:

```text
[ROLLBACK] Rolled back incomplete account cr011.fin
[ERROR] Failed cr011.fin - password policy ... | Rollback: Successful
...
```

and the same for HR, IT, Management and Sales.

Post-failure validation:

```powershell
Get-ADUser `
    -Filter 'SamAccountName -like "cr011.*"' |
    Select-Object Name,SamAccountName,Enabled
```

Only the pre-existing GUI pilot remained. The five failed bulk users were gone.

### 6.7 Successful production run

After entering a password that met policy:

```powershell
& $ScriptPath `
    -CsvPath "C:\NovaCorp\PowerShell\Data\CR011-NewUsers.csv"
```

Final output:

```text
cr011.fin    Finance     Created  Account fully provisioned and validated
cr011.hr     HR          Created  Account fully provisioned and validated
cr011.it     IT          Created  Account fully provisioned and validated
cr011.mgmt   Management  Created  Account fully provisioned and validated
cr011.sales  Sales       Created  Account fully provisioned and validated
```

Validation:

```powershell
Get-ADUser `
    -Filter 'SamAccountName -like "cr011.*"' `
    -Properties MemberOf,pwdLastSet |
    Format-List `
        Name,
        SamAccountName,
        Enabled,
        DistinguishedName,
        pwdLastSet,
        MemberOf
```

Each new account was:

- enabled;
- in the correct OU;
- member of the correct department Global group;
- `pwdLastSet = 0`, meaning password change is required at next logon.

### 6.8 Duplicate / idempotency test

The exact same CSV was rerun.

Expected:

```text
Do not create duplicates.
Do not silently reassign accounts.
```

Observed:

```text
Skipped - User already exists
```

for all five accounts.

This is the required repeated-execution property.

---

## 7. Script 2 - `Get-InactiveUsers.ps1`

### 7.1 Purpose

This script classifies employee accounts based on their last logon and age, without incorrectly labelling a newly created account as inactive merely because it has never logged on.

The initial naive condition:

```powershell
$_.LastLogonDate -lt $CutoffDate -or
$null -eq $_.LastLogonDate
```

is dangerous because **new accounts also have no LastLogonDate**.

### 7.2 Raw account review

```powershell
Get-ADUser `
    -Filter * `
    -Properties LastLogonDate,Enabled,Created |
    Select-Object `
        Name,
        SamAccountName,
        Enabled,
        Created,
        LastLogonDate |
    Sort-Object LastLogonDate |
    Format-Table -AutoSize
```

This established the difference between:

- accounts with a previous logon;
- accounts that had never logged in;
- newly created test users.

### 7.3 90-day report

```powershell
& $ScriptPath
```

Default behavior:

```text
Inactive Threshold : 90 days
New Account Grace  : 30 days
```

Initial classification summary:

```text
Active               7
NeverLoggedIn-New     6
```

### 7.4 Include active accounts

```powershell
& $ScriptPath `
    -IncludeActive
```

This displayed all classified users rather than only actionable inactive accounts.

### 7.5 Shorter threshold test

```powershell
& $ScriptPath `
    -DaysInactive 30 `
    -IncludeActive
```

Observed examples:

```text
fin.test       Active
hr.test        Active
mgmt.test      Active
moyo           Active
sales.test     Active
david.eti      Inactive
john.shaw      Inactive
cr011.*        NeverLoggedIn-New
```

### 7.6 Testing never-logged-in stale logic

To test the branch for accounts that have never logged in but are older than the grace period, the parameter validation for `NewAccountGraceDays` was corrected from:

```powershell
[ValidateRange(1,365)]
```

to:

```powershell
[ValidateRange(0,365)]
```

This allowed a zero-day grace period in a lab test without weakening normal production defaults.

Observed test classification:

```text
NeverLoggedIn-Stale
```

for the new CR-011 accounts when grace was set to zero.

### 7.7 Key lesson

`LastLogonDate = $null` does **not automatically mean "inactive user"**.

Correct logic must distinguish:

```text
Never logged in + recently created  -> new account
Never logged in + old enough        -> stale
Logged in recently                  -> active
Logged in before cutoff             -> inactive
```

---

## 8. Script 3 - `Disable-OffboardedUser.ps1`

### 8.1 Purpose

The script performs a controlled employee offboarding workflow:

```text
employee account
   -> disable
   -> remove direct non-primary memberships
   -> stamp audit description
   -> move to Nova Disabled Objects
   -> validate
   -> write log/report
```

The account is **not deleted**. This preserves identity history and allows controlled recovery if HR or IT made a mistake.

### 8.2 Baseline test user

```powershell
Get-ADUser `
    -Identity "cr011.sales" `
    -Properties MemberOf |
    Select-Object `
        Name,
        SamAccountName,
        Enabled,
        DistinguishedName,
        MemberOf |
    Format-List
```

Baseline:

```text
Enabled : True
DN      : CN=Sarah Sales,OU=Sales,OU=Nova Users,DC=nova,DC=corp
MemberOf: Sales_Users
```

### 8.3 `-WhatIf` preview

```powershell
& $ScriptPath `
    -SamAccountName "cr011.sales" `
    -Reason "CR-011 automated offboarding pilot" `
    -Ticket "LAB-CR011-CP04" `
    -WhatIf
```

Preview described:

```text
Disable, remove direct memberships,
and move to Nova Disabled Objects
```

and explicitly reported:

```text
Execution Mode : WHATIF / PREVIEW
AD Changes     : NONE
Log            : Not written during WhatIf
Report         : Not written during WhatIf
```

Verification after preview:

```powershell
Get-ADUser `
    -Identity "cr011.sales" `
    -Properties MemberOf |
    Select-Object SamAccountName,Enabled,DistinguishedName,MemberOf |
    Format-List
```

The user remained enabled, in Sales, and a member of `Sales_Users`.

### 8.4 Production offboarding

The real run completed:

```text
Disabled      : True
GroupsRemoved : True
Moved         : True
FinalEnabled  : False
Status        : Completed
Message       : Account successfully offboarded and validated
```

The account moved to:

```text
CN=Sarah Sales,OU=Nova Disabled Objects,DC=nova,DC=corp
```

The Description was stamped:

```text
OFFBOARDED 2026-10-21 |
Ticket: LAB-CR011-CP04 |
Reason: CR-011 automated offboarding pilot
```

### 8.5 Group validation

```powershell
Get-ADPrincipalGroupMembership "cr011.sales" |
    Select-Object Name,GroupScope,GroupCategory |
    Format-Table -AutoSize
```

After offboarding only the primary `Domain Users` relationship remained.

### 8.6 Log validation

```powershell
$LatestLog = Get-ChildItem `
    "C:\NovaCorp\PowerShell\Logs" `
    -Filter "Disable-OffboardedUser-cr011.sales*.log" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

Get-Content $LatestLog.FullName
```

Observed log sequence:

```text
[SECURITY] Disabled account cr011.sales
[INFO] Removed direct group memberships from cr011.sales
[INFO] Updated offboarding description for cr011.sales
[INFO] Moved cr011.sales to OU=Nova Disabled Objects,DC=nova,DC=corp
[SUCCESS] Offboarding completed and validated for cr011.sales
```

### 8.7 Protected-account boundaries

The offboarding script was deliberately tested against identities that must not be processed by an employee offboarding workflow.

Built-in Administrator:

```powershell
& $ScriptPath `
    -SamAccountName "Administrator" `
    -Reason "CR-011 protection test" `
    -Ticket "LAB-PROTECT-001" `
    -WhatIf
```

Observed:

```text
REFUSED: Protected built-in account cannot be offboarded.
```

Service account:

```powershell
& $ScriptPath `
    -SamAccountName "svc_backup" `
    -Reason "CR-011 service account protection test" `
    -Ticket "LAB-PROTECT-002" `
    -WhatIf
```

Observed:

```text
REFUSED: Service accounts require a separate service-account process.
```

Already-offboarded account rerun:

```powershell
& $ScriptPath `
    -SamAccountName "cr011.sales" `
    -Reason "CR-011 duplicate offboarding protection test" `
    -Ticket "LAB-PROTECT-003" `
    -WhatIf
```

Observed:

```text
REFUSED: Account is not located under the Nova Users employee OU.
```

This makes the workflow safely non-destructive on rerun.

---

# PART II - GROUP AND ACCESS AUDITING

## 9. Script 4 - `Get-GroupMembership.ps1`

### 9.1 Purpose

This script answers three different questions:

1. What groups is the user **directly** a member of?
2. What groups apply **indirectly/effectively** through nesting?
3. What is the user's **primary group**?

These are not the same query.

### 9.2 Direct membership

Example:

```powershell
Get-ADUser `
    -Identity "cr011.fin" `
    -Properties MemberOf |
    Select-Object `
        Name,
        SamAccountName,
        MemberOf |
    Format-List
```

Observed:

```text
Finance_Users
```

### 9.3 Authorization / effective membership

```powershell
Get-ADAccountAuthorizationGroup `
    -Identity "cr011.fin" |
    Select-Object `
        Name,
        SamAccountName,
        GroupScope,
        GroupCategory |
    Sort-Object Name |
    Format-Table -AutoSize
```

This exposes nested authorization groups such as:

```text
Finance_Users
DL_FS_Finance_Modify
```

plus Windows token/system groups when requested.

### 9.4 Primary group bug

The first version tried to locate the primary group with:

```powershell
Get-ADGroup `
    -LDAPFilter "(primaryGroupToken=$($User.PrimaryGroupID))"
```

AD rejected this with:

```text
A Filter was passed that uses constructed attributes
```

The important lesson is that `primaryGroupToken` is a **constructed attribute**. It cannot be used as if it were an ordinary stored LDAP attribute in this filter.

### 9.5 Correct primary group resolution using SID

The fix was:

```powershell
$DomainSID = $User.SID.AccountDomainSid.Value

$PrimaryGroupSID = `
    "$DomainSID-$($User.PrimaryGroupID)"

$PrimaryGroup = Get-ADGroup `
    -Identity $PrimaryGroupSID `
    -ErrorAction Stop
```

Why this works:

```text
User SID:
S-1-5-21-...-1123

Domain SID:
S-1-5-21-...

PrimaryGroupID:
513

Primary group SID:
Domain SID + "-" + 513
```

For standard users, RID `513` resolves to `Domain Users`.

### 9.6 What is a SID?

**SID = Security Identifier.**

Windows authorization is based on SIDs, not display names.

A SID is roughly:

```text
S-1-5-21-<domain identifier>-<RID>
```

The final number is the Relative Identifier (RID) for the object inside that domain.

This is why renaming a user or group does not destroy its permissions: the SID remains the underlying security identity.

### 9.7 Final script validation

```powershell
$Errors = $null

[System.Management.Automation.Language.Parser]::ParseFile(
    $ScriptPath,
    [ref]$Tokens,
    [ref]$Errors
) | Out-Null

$Errors

& $ScriptPath `
    -SamAccountName "cr011.fin"
```

Observed final result:

```text
Finance_Users             Global       Security  Direct
DL_FS_Finance_Modify      DomainLocal  Security  Nested/Effective
Domain Users              Global       Security  Primary
```

<!-- Evidence reference: images/group_membership.png | Repaired group membership script passes parser and returns direct, nested/effective and primary membership -->

### 9.8 Include Windows/system authorization groups

```powershell
& $ScriptPath `
    -SamAccountName "cr011.fin" `
    -IncludeSystemGroups
```

This additionally returns token groups such as:

```text
Authenticated Users
Everyone
Pre-Windows 2000 Compatible Access
This Organization
Users
```

The default hides these to keep the business access report readable.

---

## 10. Script 5 - `Test-UserAccess.ps1`

### 10.1 Purpose

This script performs an **administrative authorization analysis** for a user and a departmental share.

It compares:

```text
User effective AD authorization groups
            |
            +---- SMB share ACL
            |
            +---- NTFS ACL
```

and then reports whether matching allow groups exist at both layers.

### 10.2 Why both SMB and NTFS matter

For an SMB path, effective access is restricted by both:

```text
Share permission
AND
NTFS permission
```

The most restrictive applicable result wins.

A user can therefore possess NTFS Modify but still fail remotely if the SMB share does not permit that identity, and vice versa.

### 10.3 Baseline SMB review

On `NOVA-FILES01`:

```powershell
Get-SmbShareAccess -Name "IT" |
    Format-Table AccountName,AccessControlType,AccessRight -AutoSize

Get-SmbShareAccess -Name "Finance" |
    Format-Table AccountName,AccessControlType,AccessRight -AutoSize
```

Observed patterns:

```text
IT:
BUILTIN\Administrators       Full
NOVA\DL_FS_IT_Modify         Change

Finance:
NOVA\DL_FS_Finance_FullControl  Full
BUILTIN\Administrators          Full
NOVA\DL_FS_Finance_Modify       Change
```

### 10.4 Baseline NTFS review

```powershell
(Get-Acl "D:\NovaData\IT").Access |
    Select-Object `
        IdentityReference,
        FileSystemRights,
        AccessControlType,
        IsInherited |
    Format-Table -AutoSize
```

IT:

```text
NOVA\DL_FS_IT_Modify   Modify, Synchronize   Allow
```

Finance:

```powershell
(Get-Acl "D:\NovaData\Finance").Access |
    Select-Object `
        IdentityReference,
        FileSystemRights,
        AccessControlType,
        IsInherited |
    Format-Table -AutoSize
```

Finance included:

```text
NOVA\DL_FS_Finance_Modify       Modify, Synchronize
NOVA\DL_FS_Finance_FullControl  FullControl
```

### 10.5 Moyo IT authorization

```powershell
Get-ADAccountAuthorizationGroup "moyo" |
    Where-Object {
        $_.Name -like "IT_Users" -or
        $_.Name -like "DL_FS_*"
    } |
    Select-Object Name,GroupScope,GroupCategory |
    Sort-Object Name |
    Format-Table -AutoSize
```

Observed:

```text
IT_Users             Global
DL_FS_IT_Modify      DomainLocal
```

### 10.6 Matching bug discovered

The first access script incorrectly reported:

```text
SMBMatch  : False
NTFSMatch : False
ExpectedAccess : DENY
```

even for Moyo on the IT share.

Root cause:

```text
AD authorization group:
DL_FS_IT_Modify

ACL identity:
NOVA\DL_FS_IT_Modify
```

The comparison treated these as different strings.

The corrected implementation normalizes identities before comparison so the domain prefix does not break a legitimate match.

### 10.7 Corrected positive and negative tests

Positive:

```powershell
& $ScriptPath `
    -SamAccountName "moyo" `
    -ShareName "IT"
```

Final result:

```text
Matched SMB permissions:
NOVA\DL_FS_IT_Modify   Allow   Change

Matched NTFS permissions:
NOVA\DL_FS_IT_Modify   Modify, Synchronize   Allow

ExpectedAccess : ALLOW
```

Negative:

```powershell
& $ScriptPath `
    -SamAccountName "moyo" `
    -ShareName "Finance"
```

Final result:

```text
ExpectedAccess : DENY
```

Management Full Control:

```powershell
& $ScriptPath `
    -SamAccountName "mgmt.test" `
    -ShareName "Finance"
```

Matched:

```text
DL_FS_Finance_FullControl
```

at both SMB and NTFS layers.

Disabled-user test:

```powershell
& $ScriptPath `
    -SamAccountName "cr011.sales" `
    -ShareName "Sales"
```

Observed interpretation:

```text
DENY - The AD account is disabled.
```

### 10.8 Real user-session validation

The script correctly states that it performs administrative ACL analysis, not actual impersonation.

Real client validation was therefore performed from the user context:

```powershell
whoami

Test-Path "\\nova.corp\shares\IT"
Test-Path "\\nova.corp\shares\Finance"
```

For the IT user Moyo:

```text
\\nova.corp\shares\IT       -> True
\\nova.corp\shares\Finance  -> Access is denied / False
```

This is the strongest type of file-access proof: **authorized user succeeds and unauthorized resource fails**.

---

# PART III - ACCOUNT LOCKOUT AND PASSWORD OPERATIONS

## 11. Script 6 - `Get-LockedAccounts.ps1`

### 11.1 Domain lockout policy

```powershell
Get-ADDefaultDomainPasswordPolicy |
    Select-Object `
        LockoutThreshold,
        LockoutDuration,
        LockoutObservationWindow |
    Format-List
```

Observed:

```text
LockoutThreshold         : 5
LockoutDuration          : 00:15:00
LockoutObservationWindow : 00:15:00
```

Meaning:

- five bad attempts trigger lockout;
- the lockout lasts 15 minutes unless manually unlocked;
- bad-attempt tracking uses a 15-minute observation window.

### 11.2 Creating a controlled lockout

The lab account `fin.test` was used.

Repeated invalid authentication:

```powershell
runas /user:NOVA\fin.test cmd.exe
```

The first attempts returned:

```text
1326: The user name or password is incorrect.
```

The fifth attempt returned:

```text
1909: The referenced account is currently locked out
and may not be logged on to.
```

### 11.3 Direct AD state

```powershell
Get-ADUser `
    -Identity "fin.test" `
    -Properties LockedOut,BadPwdCount,LastBadPasswordAttempt |
    Select-Object `
        Name,
        SamAccountName,
        Enabled,
        LockedOut,
        BadPwdCount,
        LastBadPasswordAttempt |
    Format-List
```

Observed:

```text
Enabled                : True
LockedOut              : True
BadPwdCount             : 5
LastBadPasswordAttempt  : <test timestamp>
```

### 11.4 Domain-wide locked-user query

```powershell
Search-ADAccount `
    -LockedOut `
    -UsersOnly |
    Select-Object `
        Name,
        SamAccountName,
        Enabled,
        LockedOut |
    Format-Table -AutoSize
```

This is the fast "who is locked right now?" command.

### 11.5 Historical lockout evidence - Security Event 4740

Current AD state only tells you whether the account is locked **now**.

The Security log gives historical lockout events:

```powershell
Get-WinEvent `
    -FilterHashtable @{
        LogName = "Security"
        Id      = 4740
    } `
    -MaxEvents 20 |
    Where-Object {
        $_.Message -like "*fin.test*"
    } |
    Select-Object `
        TimeCreated,
        Id,
        MachineName,
        Message |
    Format-List
```

Event ID:

```text
4740 - A user account was locked out
```

This persisted after the account was later unlocked.

That explains an important observation during the CR:

```text
LockedOut = False
```

does **not** mean the historical lockout disappeared. It only means the account's *current* state is unlocked.

### 11.6 Inspecting event XML

```powershell
$LockoutEvent = Get-WinEvent `
    -FilterHashtable @{
        LogName = "Security"
        Id      = 4740
    } `
    -MaxEvents 20 |
    Where-Object {
        $_.Message -like "*fin.test*"
    } |
    Select-Object -First 1

[xml]$EventXml = $LockoutEvent.ToXml()

$EventXml.Event.EventData.Data |
    Select-Object Name,'#text' |
    Format-Table -AutoSize
```

This provides named event fields instead of relying only on formatted message text.

### 11.7 Diagnosing the caller-computer mapping

The first script version left `CallerComputer` blank.

The raw event property array was inspected:

```powershell
$LockoutEvent.Properties.Count

for (
    $i = 0;
    $i -lt $LockoutEvent.Properties.Count;
    $i++
) {

    [PSCustomObject]@{
        Index = $i
        Value = $LockoutEvent.Properties[$i].Value
    }
}
```

Observed values included:

```text
0  fin.test
1  NOVA-DC01
2  <target SID>
3  S-1-5-18
4  NOVA-DC01$
5  NOVA
6  999
```

The corrected mapping produced:

```text
CallerComputer : NOVA-DC01
```

### 11.8 Unlock test

Before:

```powershell
Get-ADUser `
    -Identity "fin.test" `
    -Properties LockedOut |
    Select-Object Name,SamAccountName,Enabled,LockedOut |
    Format-List
```

Then:

```powershell
Unlock-ADAccount `
    -Identity "fin.test"
```

After:

```text
LockedOut : False
```

A subsequent `Search-ADAccount -LockedOut` returned no user.

The historical 4740 event, however, remained available for investigation.

---

## 12. Script 7 - `Reset-UserPassword.ps1`

### 12.1 Purpose

The password-reset workflow:

```text
identify employee
-> protect privileged/service/offboarded identities
-> preview intended action
-> securely request new temporary password
-> reset password
-> optionally unlock
-> force change at next logon
-> validate
-> log/report
```

Passwords are entered as `SecureString` and are not written to the logs.

### 12.2 Parser error discovered

An early version contained a string like:

```powershell
"Password reset failed for $SamAccountName: $FailureMessage"
```

PowerShell interpreted the colon immediately after the variable name as part of a scoped/drive-style variable reference and raised:

```text
InvalidVariableReferenceWithDrive
Variable reference is not valid. ':' was not followed by
a valid variable name character.
```

Correct syntax:

```powershell
"Password reset failed for ${SamAccountName}: $FailureMessage"
```

or:

```powershell
"Password reset failed for $($SamAccountName): $FailureMessage"
```

This is a small syntax issue with a large operational effect: the whole script could not parse until corrected.

### 12.3 Preview

```powershell
& $ScriptPath `
    -SamAccountName "fin.test" `
    -Reason "CR-011 password reset automation test" `
    -Ticket "LAB-CR011-CP08" `
    -WhatIf
```

Preview displayed:

```text
Domain password policy
Minimum Length     : 12
Complexity Enabled : True
Password History   : 24
Minimum Age        : 1 day
Maximum Age        : 180 days

Unlock If Locked : NO
Change At Logon  : YES
```

and:

```text
AD Changes : NONE
Password   : NOT REQUESTED
Log        : Not written during WhatIf
Report     : Not written during WhatIf
```

This design avoids asking for a password during a preview.

### 12.4 Invalid password test

```powershell
$BadPassword = Read-Host `
    "Enter an intentionally invalid test password" `
    -AsSecureString

Set-ADAccountPassword `
    -Identity "fin.test" `
    -Reset `
    -NewPassword $BadPassword
```

AD rejected it with:

```text
The password does not meet the length,
complexity, or history requirement of the domain.
```

The existing password state remained unchanged.

### 12.5 Successful reset

The production workflow was then run with a valid temporary password.

Result:

```text
PasswordReset            : True
ForceChangeAtLogon       : True
ChangeAtLogonValidated   : True
UnlockRequested          : False
UnlockValidated          : True
FinalEnabled             : True
FinalLockedOut           : False
FinalPwdLastSet          : 0
Status                    : Completed
Message                   : Password reset completed and validated
```

### 12.6 Why `pwdLastSet = 0` is correct

After setting:

```powershell
Set-ADUser `
    -Identity "fin.test" `
    -ChangePasswordAtLogon $true
```

AD stores:

```text
pwdLastSet = 0
```

This is a special sentinel meaning:

> The user must change the password at the next logon.

The higher-level `PasswordLastSet` property may therefore appear blank and:

```text
PasswordExpired : True
```

This does **not** mean the reset failed. It proves the forced-change policy was applied.

### 12.7 Is raw `pwdLastSet` measured in seconds?

No.

A normal non-zero `pwdLastSet` value can look like:

```text
134274059515925017
```

because it is a Windows **FILETIME** value: the number of 100-nanosecond intervals since 1 January 1601 UTC.

Human-readable conversion:

```powershell
[DateTime]::FromFileTimeUtc(
    (Get-ADUser `
        -Identity "moyo" `
        -Properties pwdLastSet
    ).pwdLastSet
)
```

So:

```text
pwdLastSet = 0       -> special "change at next logon"
large integer        -> Windows FILETIME timestamp
```

### 12.8 Log verification

```powershell
$LatestLog = Get-ChildItem `
    "C:\NovaCorp\PowerShell\Logs" `
    -Filter "Reset-UserPassword-fin.test-*.log" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

Get-Content $LatestLog.FullName
```

Observed:

```text
[INFO] Password reset initiated for fin.test; Ticket=...
[INFO] Password reset completed for fin.test
[INFO] ChangePasswordAtLogon enabled for fin.test
[SUCCESS] Password reset workflow completed and validated for fin.test
```

### 12.9 Protected identities

Built-in Administrator:

```powershell
& $ScriptPath `
    -SamAccountName "Administrator" `
    -Reason "CR-011 protected account test" `
    -Ticket "LAB-CR011-PROTECT-001" `
    -WhatIf
```

Observed:

```text
REFUSED: Protected built-in account cannot be processed.
```

Service account:

```powershell
& $ScriptPath `
    -SamAccountName "svc_backup" `
    -Reason "CR-011 service account protection test" `
    -Ticket "LAB-CR011-PROTECT-002" `
    -WhatIf
```

Observed:

```text
REFUSED: Service accounts require a separate service-account process.
```

Disabled/offboarded employee:

```powershell
& $ScriptPath `
    -SamAccountName "cr011.sales" `
    -Reason "CR-011 disabled employee protection test" `
    -Ticket "LAB-CR011-PROTECT-003" `
    -WhatIf
```

Observed:

```text
REFUSED: Account is not located under the Nova Users OU.
```

### 12.10 Locked-user reset and optional unlock

The Finance test account was deliberately locked again:

```powershell
Get-ADUser `
    -Identity "fin.test" `
    -Properties LockedOut,BadPwdCount,LastBadPasswordAttempt |
    Select-Object `
        SamAccountName,
        Enabled,
        LockedOut,
        BadPwdCount,
        LastBadPasswordAttempt |
    Format-List
```

Observed:

```text
LockedOut  : True
BadPwdCount: 5
```

Preview:

```powershell
& $ScriptPath `
    -SamAccountName "fin.test" `
    -Reason "CR-011 locked user password reset test" `
    -Ticket "LAB-CR011-LOCKED-001" `
    -UnlockIfLocked `
    -WhatIf
```

Production:

```powershell
& $ScriptPath `
    -SamAccountName "fin.test" `
    -Reason "CR-011 locked user password reset test" `
    -Ticket "LAB-CR011-LOCKED-001" `
    -UnlockIfLocked
```

Observed:

```text
OriginalLockedOut       : True
PasswordReset           : True
ForceChangeAtLogon      : True
UnlockRequested         : True
UnlockValidated         : True
FinalLockedOut          : False
FinalPwdLastSet         : 0
Status                  : Completed
```

Post-validation:

```powershell
Get-ADUser `
    -Identity "fin.test" `
    -Properties `
        LockedOut,
        BadPwdCount,
        LastBadPasswordAttempt,
        PasswordLastSet,
        PasswordExpired,
        pwdLastSet |
    Select-Object `
        SamAccountName,
        Enabled,
        LockedOut,
        BadPwdCount,
        LastBadPasswordAttempt,
        PasswordLastSet,
        PasswordExpired,
        pwdLastSet |
    Format-List
```

Expected final state:

```text
Enabled         : True
LockedOut       : False
BadPwdCount     : 0
PasswordExpired : True
pwdLastSet      : 0
```

---

# PART IV - COMPUTER INVENTORY

## 13. Script 8 - `Get-ADComputerReport.ps1`

### 13.1 Purpose

The script exports domain computer inventory including:

- hostname;
- DNS name;
- enabled state;
- OS;
- OS version;
- IPv4 address;
- creation date;
- last logon;
- days since last logon;
- computer-account password age;
- classification status;
- description;
- distinguished name.

### 13.2 First result and scope problem

The initial search base was:

```text
OU=Nova-Computers,DC=nova,DC=corp
```

This correctly found:

```text
NOVA-CLIENT
NOVA-FILES01
```

but did **not** show domain controllers.

Why?

Domain controllers live under:

```text
OU=Domain Controllers,DC=nova,DC=corp
```

not under `OU=Nova-Computers`.

The script was not malfunctioning. The search scope was too narrow for the requirement "all domain computers".

### 13.3 Domain-wide correction

The default search base was changed from:

```text
OU=Nova-Computers,DC=nova,DC=corp
```

to:

```text
DC=nova,DC=corp
```

The replacement was verified:

```powershell
Select-String `
    -Path $ScriptPath `
    -Pattern 'SearchBase|DC=nova,DC=corp' `
    -Context 0,2
```

### 13.4 Corrected domain report

```powershell
& $ScriptPath
```

Observed inventory:

```text
NOVA-CLIENT    Windows 11 Pro
NOVA-DC01      Windows Server 2025 Standard
NOVA-DC02      Windows Server 2025 Standard
NOVA-FILES01   Windows Server 2025 Standard
```

with addresses:

```text
NOVA-CLIENT   10.10.40.100
NOVA-DC01     10.10.20.10
NOVA-DC02     10.10.20.11
NOVA-FILES01  10.10.20.20
```

### 13.5 Disabled-computer and threshold switches

```powershell
& $ScriptPath `
    -DaysStale 30 `
    -IncludeDisabled
```

The script keeps the threshold configurable instead of hardcoding a single stale-computer policy.

### 13.6 CSV report verification

```powershell
$LatestReport = Get-ChildItem `
    "C:\NovaCorp\PowerShell\Reports" `
    -Filter "ADComputerReport-*.csv" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

Import-Csv $LatestReport.FullName |
    Format-Table `
        Name,
        Enabled,
        OperatingSystem,
        IPv4Address,
        LastLogonDate,
        DaysSinceLastLogon,
        PasswordAgeDays,
        Status `
        -AutoSize
```

This confirmed the saved report and console output represented the same domain inventory.

---

# PART V - RELEASE ENGINEERING AND INTEGRITY

## 14. Toolkit Inventory Gate

Before creating the release, the eight required scripts were enumerated explicitly:

```powershell
$ScriptDirectory = "C:\NovaCorp\PowerShell\Scripts"

$RequiredScripts = @(
    "New-BulkUsers.ps1",
    "Get-InactiveUsers.ps1",
    "Disable-OffboardedUser.ps1",
    "Get-GroupMembership.ps1",
    "Test-UserAccess.ps1",
    "Get-LockedAccounts.ps1",
    "Reset-UserPassword.ps1",
    "Get-ADComputerReport.ps1"
)

$Inventory = foreach ($Script in $RequiredScripts) {

    $Path = Join-Path $ScriptDirectory $Script

    [PSCustomObject]@{
        Script = $Script
        Exists = Test-Path $Path
        Path   = $Path
    }
}

$Inventory | Format-Table -AutoSize
```

All eight returned:

```text
Exists = True
```

---

## 15. Whole-toolkit parser gate

Each script was parsed without executing it:

```powershell
$ParserResults = foreach ($Script in $RequiredScripts) {

    $Path = Join-Path $ScriptDirectory $Script

    $Tokens = $null
    $Errors = $null

    [System.Management.Automation.Language.Parser]::ParseFile(
        $Path,
        [ref]$Tokens,
        [ref]$Errors
    ) | Out-Null

    [PSCustomObject]@{
        Script       = $Script
        ParserErrors = $Errors.Count
        Status       = if ($Errors.Count -eq 0) {
            "PASS"
        }
        else {
            "FAIL"
        }
    }
}

$ParserResults | Format-Table -AutoSize
```

Final result:

```text
All eight scripts:
ParserErrors = 0
Status       = PASS
```

<!-- Evidence reference: images/parser.png | All eight CR-011 scripts pass the PowerShell parser gate -->

This is useful because a syntax regression can be detected before a state-changing script ever touches AD.

---

## 16. SHA-256 working-copy baseline

```powershell
$Hashes = foreach ($Script in $RequiredScripts) {

    $Path = Join-Path $ScriptDirectory $Script

    Get-FileHash `
        -Path $Path `
        -Algorithm SHA256 |
        Select-Object `
            @{Name="Script";Expression={$Script}},
            Algorithm,
            Hash
}

$Hashes | Format-Table -AutoSize
```

Final known-good SHA-256 values:

| Script | SHA-256 |
|---|---|
| `New-BulkUsers.ps1` | `C25A75E65F802635BE3E7FC2BD3FCAEB13E0E6796D37F531E04BB5E0C0FE702A` |
| `Get-InactiveUsers.ps1` | `353962CFC2CBEC93259C25C035DBB1219541965467CDF7DD937B121B50605073` |
| `Disable-OffboardedUser.ps1` | `972DAA7C58A35C829E184D6665C5C7155480057163BED8E94E228DB1CB8421A7` |
| `Get-GroupMembership.ps1` | `D2B9E7D6F2457CC00A2E4DAAA29EF917C04B920E6942B0DECA88570E58987B4E` |
| `Test-UserAccess.ps1` | `01BFA08EC44B8F5007ECF08DB915EB856B6008BF719EA515F23D137DF18AC5F5` |
| `Get-LockedAccounts.ps1` | `B8309B0AEF3E053F074E8DD05E16A389D4BD512098F50FDC6AA32B8606E3FE93` |
| `Reset-UserPassword.ps1` | `2D9477CD19174938404AF7C8555FABC09BA3B5FEE05D1D2EB76D8B9D07CD2A9D` |
| `Get-ADComputerReport.ps1` | `8E119154C3446BBE76AEFC0EA78BFFD9AECDA92432B1CB734130F8F308740483` |

<!-- Evidence reference: images/hashes.png | SHA-256 fingerprints for all eight scripts -->

A cryptographic hash is a file fingerprint. If even one character is changed, the expected and current hashes will no longer match.

---

## 17. Versioned NovaTools package

Release root:

```text
C:\NovaCorp\PowerShell\NovaTools\CR-011-v1.0.0
```

Structure:

```text
CR-011-v1.0.0\
|-- Scripts\
|   |-- New-BulkUsers.ps1
|   |-- Get-InactiveUsers.ps1
|   |-- Disable-OffboardedUser.ps1
|   |-- Get-GroupMembership.ps1
|   |-- Test-UserAccess.ps1
|   |-- Get-LockedAccounts.ps1
|   |-- Reset-UserPassword.ps1
|   `-- Get-ADComputerReport.ps1
|
|-- Manifest\
|   |-- Script-Inventory.csv
|   `-- SHA256-Hashes.csv
|
`-- VERSION.txt
```

### 17.1 Create package structure

```powershell
$NovaToolsRoot = `
    "C:\NovaCorp\PowerShell\NovaTools\CR-011-v1.0.0"

$PackageScripts = `
    Join-Path $NovaToolsRoot "Scripts"

$PackageManifest = `
    Join-Path $NovaToolsRoot "Manifest"

New-Item `
    -Path $PackageScripts `
    -ItemType Directory `
    -Force |
    Out-Null

New-Item `
    -Path $PackageManifest `
    -ItemType Directory `
    -Force |
    Out-Null
```

### 17.2 Copy approved scripts

```powershell
foreach ($Script in $RequiredScripts) {

    $Source = `
        Join-Path $ScriptDirectory $Script

    $Destination = `
        Join-Path $PackageScripts $Script

    Copy-Item `
        -Path $Source `
        -Destination $Destination `
        -Force
}
```

Verify:

```powershell
Get-ChildItem `
    $PackageScripts `
    -Filter "*.ps1" |
    Select-Object `
        Name,
        Length,
        LastWriteTime |
    Format-Table -AutoSize
```

<!-- Evidence reference: images/package_scripts.png | Eight scripts copied into the CR-011-v1.0.0 package -->

### 17.3 Release inventory

```powershell
$ReleaseInventory = foreach ($Script in $RequiredScripts) {

    $Path = `
        Join-Path $PackageScripts $Script

    $Item = Get-Item $Path

    [PSCustomObject]@{
        Script        = $Script
        Exists        = Test-Path $Path
        SizeBytes     = $Item.Length
        LastWriteTime = $Item.LastWriteTime
        Path          = $Path
    }
}

$InventoryPath = `
    Join-Path `
        $PackageManifest `
        "Script-Inventory.csv"

$ReleaseInventory |
    Export-Csv `
        -Path $InventoryPath `
        -NoTypeInformation `
        -Encoding UTF8
```

<!-- Evidence reference: images/inventory.png | Release inventory proves every packaged script exists -->

### 17.4 Package hash comparison

The packaged copy was hashed independently and compared with the working copy:

```powershell
$IntegrityComparison = foreach ($Script in $RequiredScripts) {

    $WorkingPath = `
        Join-Path $ScriptDirectory $Script

    $PackagePath = `
        Join-Path $PackageScripts $Script

    $WorkingHash = (
        Get-FileHash `
            $WorkingPath `
            -Algorithm SHA256
    ).Hash

    $PackageHash = (
        Get-FileHash `
            $PackagePath `
            -Algorithm SHA256
    ).Hash

    [PSCustomObject]@{
        Script      = $Script
        HashMatches = (
            $WorkingHash -eq $PackageHash
        )
    }
}

$IntegrityComparison |
    Format-Table -AutoSize
```

Observed:

```text
8 / 8 HashMatches = True
```

<!-- Evidence reference: images/hashmatch.png | Working scripts and packaged scripts match by SHA-256 -->

This proves the baseline copy was not altered while being packaged.

### 17.5 Version marker

```powershell
$VersionFile = `
    Join-Path $NovaToolsRoot "VERSION.txt"

@"
Nova Corp PowerShell Toolkit
Release: CR-011-v1.0.0
Created: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Domain: nova.corp
Host: $env:COMPUTERNAME
Scripts: 8
Integrity: SHA256
"@ |
    Set-Content `
        -Path $VersionFile `
        -Encoding UTF8
```

Observed:

```text
Nova Corp PowerShell Toolkit
Release: CR-011-v1.0.0
Created: 2026-10-22 08:17:37
Domain: nova.corp
Host: NOVA-DC01
Scripts: 8
Integrity: SHA256
```

<!-- Evidence reference: images/version.png | Version file and final 8-of-8 integrity comparison -->

---

# PART VI - FAILURES, ROOT CAUSES AND LESSONS

## 18. Failure Register

| Failure | Root cause | Engineering fix | Lesson |
|---|---|---|---|
| Bulk user left disabled half-accounts | AD object creation succeeded before password/group steps failed | Transaction-like rollback removes incomplete object | "Failed" output is not enough; validate environment state |
| WhatIf left log/report artifacts | Preview path still executed output-writing code | Suppress production logs/reports in WhatIf | Preview should be side-effect free |
| Result object property error | Code attempted to set a property not present in the object schema | Define result fields consistently before branch updates | PowerShell custom objects are not arbitrary mutable dictionaries |
| New account incorrectly considered inactive | `LastLogonDate = $null` treated as inactivity | Add creation-age grace classification | Null logon is ambiguous |
| Offboarding rerun risk | Already-disabled account could be processed again | Require employee to be inside Nova Users OU | Scope is a safety boundary |
| Primary group query failed | `primaryGroupToken` is constructed | Resolve primary group using domain SID + PrimaryGroupID | Understand AD storage vs constructed attributes |
| IT access falsely denied | `DL_FS_IT_Modify` compared with `NOVA\DL_FS_IT_Modify` | Normalize ACL/account names | Authorization analysis must normalize identity formats |
| Locked-account CallerComputer blank | Wrong Event 4740 property index / mapping | Inspect raw event Properties/XML and map correct field | Never assume event property positions |
| Password-reset script would not parse | `$SamAccountName:` interpreted as invalid variable reference | Use `${SamAccountName}` | String interpolation has parser rules |
| Computer report omitted DCs | Search base limited to `OU=Nova-Computers` | Search domain root | Query scope must match business question |
| Group membership file accidentally edited late in CR | Text replacement touched known-good source | Restore known-good script, parse, run regression test, hash | Release baselines matter |

---

## 19. Key Concepts Learned

### 19.1 `-WhatIf` and `-Confirm`

`-WhatIf` answers:

> "What would this command do if I allowed it to run?"

It should not be treated as a substitute for validation, but it is an excellent safety gate for account-changing commands.

`-Confirm` creates an explicit operator decision before the change.

### 19.2 Idempotency

An idempotent administrative workflow can be repeated without causing duplicate or destructive side effects.

Examples from CR-011:

```text
bulk import rerun -> existing users skipped
offboarding rerun -> account outside active employee OU refused
```

### 19.3 Validation after mutation

A script should not assume that a command succeeded merely because no exception was printed.

CR-011 repeatedly re-read AD state:

```powershell
Get-ADUser ...
Get-ADPrincipalGroupMembership ...
Search-ADAccount ...
```

and checked final attributes before returning `Completed`.

### 19.4 Logs vs reports

**Log:** chronological operations for troubleshooting.

Example:

```text
[INFO] Password reset initiated
[INFO] Password reset completed
[SUCCESS] workflow completed and validated
```

**Report:** structured output suitable for filtering, evidence, audit, or spreadsheet analysis.

Example:

```text
Timestamp,SamAccountName,Status,Message,...
```

### 19.5 Security boundaries

Employee lifecycle scripts intentionally refuse:

- built-in Administrator;
- service accounts;
- already-offboarded objects outside the employee OU.

This is a lightweight example of **least privilege and blast-radius control**.

---

# PART VII - FINAL ACCEPTANCE TEST

## 20. Eight-script acceptance matrix

| Script | Positive test | Negative/failure test | Audit output | Final |
|---|---|---|---|---|
| `New-BulkUsers.ps1` | 5 users fully provisioned | weak password rollback; rerun skipped | log + CSV | PASS |
| `Get-InactiveUsers.ps1` | active/inactive classification | never-logged-in new/stale distinction | CSV | PASS |
| `Disable-OffboardedUser.ps1` | Sales user disabled/moved/ungrouped | built-in, service, rerun refused | log + CSV | PASS |
| `Get-GroupMembership.ps1` | direct/nested/primary resolved | constructed-attribute bug repaired | CSV | PASS |
| `Test-UserAccess.ps1` | Moyo IT ALLOW; mgmt Finance Full | Moyo Finance DENY; disabled user DENY | console analysis | PASS |
| `Get-LockedAccounts.ps1` | current lockout + event 4740 | unlocked current state distinguished from history | report | PASS |
| `Reset-UserPassword.ps1` | reset + force-change + optional unlock | invalid password and protected identities rejected | log + CSV | PASS |
| `Get-ADComputerReport.ps1` | all four domain computers shown | narrow search-scope defect corrected | CSV | PASS |

---

## 21. Final release evidence

### 21.1 Script inventory

All eight required scripts are present in the operational folder and the release package.

### 21.2 Parser gate

All eight scripts:

```text
ParserErrors = 0
Status       = PASS
```

### 21.3 Cryptographic integrity

All eight release hashes match their working-source equivalents:

```text
HashMatches = True
```

### 21.4 Final Proxmox rollback point

After validation and packaging, the domain controller was snapshotted in Proxmox.

Snapshot name is displayed truncated in the UI as:

```text
cr011-complete...
```

Description begins:

```text
CR-011 complete - Nova Corp PowerShell administration toolkit v1.0.0.
8 validated AD administration scripts, logging/reporting, ...
```

Timestamp:

```text
2026-10-22 08:25:48
```

<!-- Evidence reference: images/snapshot.png | Final Proxmox rollback point after CR-011 validation -->

This snapshot is a **short-term lab rollback point**, not a replacement for the independent backup work planned in CR-012.

---

# PART VIII - COMMAND REFERENCE

## 22. Fast troubleshooting commands

### User state

```powershell
Get-ADUser `
    -Identity "fin.test" `
    -Properties * |
    Format-List
```

### Direct group memberships

```powershell
Get-ADUser `
    -Identity "cr011.fin" `
    -Properties MemberOf |
    Select-Object Name,SamAccountName,MemberOf |
    Format-List
```

### Effective authorization groups

```powershell
Get-ADAccountAuthorizationGroup `
    -Identity "cr011.fin" |
    Select-Object Name,GroupScope,GroupCategory |
    Sort-Object Name |
    Format-Table -AutoSize
```

### Current locked accounts

```powershell
Search-ADAccount `
    -LockedOut `
    -UsersOnly
```

### Unlock

```powershell
Unlock-ADAccount `
    -Identity "fin.test"
```

### Lockout history

```powershell
Get-WinEvent `
    -FilterHashtable @{
        LogName = "Security"
        Id      = 4740
    } `
    -MaxEvents 20
```

### Password policy

```powershell
Get-ADDefaultDomainPasswordPolicy |
    Format-List
```

### SMB permissions

```powershell
Get-SmbShareAccess `
    -Name "Finance"
```

### NTFS permissions

```powershell
(Get-Acl "D:\NovaData\Finance").Access |
    Format-Table -AutoSize
```

### Parser test

```powershell
$Tokens = $null
$Errors = $null

[System.Management.Automation.Language.Parser]::ParseFile(
    $ScriptPath,
    [ref]$Tokens,
    [ref]$Errors
) | Out-Null

$Errors
```

### SHA-256

```powershell
Get-FileHash `
    -Path $ScriptPath `
    -Algorithm SHA256
```

---

# PART IX - MINI RUNBOOKS

## 23. Runbook - New employee import

1. Validate HR CSV columns and department values.
2. Confirm target OUs and groups exist.
3. Run `New-BulkUsers.ps1 -WhatIf`.
4. Review intended OU and group for every row.
5. Run production with an approved temporary password.
6. Confirm every account is enabled, in the correct OU, and in the correct group.
7. Confirm `pwdLastSet = 0`.
8. Review log/report.
9. Rerun same CSV and confirm users are skipped.

## 24. Runbook - Offboarding

1. Confirm HR ticket and identity.
2. Verify user is under `OU=Nova Users`.
3. Run offboarding `-WhatIf`.
4. Confirm direct groups that will be removed.
5. Execute.
6. Confirm account disabled.
7. Confirm user moved to `Nova Disabled Objects`.
8. Confirm employee groups removed.
9. Confirm Description contains ticket/reason.
10. Review log and CSV.

## 25. Runbook - Locked account

1. Query:

```powershell
Search-ADAccount -LockedOut -UsersOnly
```

2. Inspect:

```powershell
Get-ADUser `
    -Identity <user> `
    -Properties LockedOut,BadPwdCount,LastBadPasswordAttempt
```

3. Review Event 4740 on the DC.
4. Identify caller computer.
5. Investigate why credentials are repeatedly failing.
6. Unlock only after the cause is understood:

```powershell
Unlock-ADAccount -Identity <user>
```

7. Confirm `LockedOut = False`.

## 26. Runbook - Password reset

1. Verify requester and ticket.
2. Confirm identity is a normal employee.
3. Run script with `-WhatIf`.
4. Execute and enter password through secure prompt.
5. Keep `ChangePasswordAtLogon = True`.
6. Use `-UnlockIfLocked` only when required.
7. Confirm:

```text
Enabled = True
LockedOut = False
pwdLastSet = 0
```

8. Review log/report.
9. Never put the plaintext temporary password in a ticket or log.

---

# PART X - INTERVIEW / CAREER EVIDENCE

## 27. Technical story

**Situation:** A bulk AD onboarding script appeared to fail safely when a password violated domain policy, but validation showed it had actually created disabled, group-less account objects.

**Task:** Make the automation safe enough to rerun without leaving incomplete identities or duplicate access state.

**Action:** Reworked provisioning into a transaction-like workflow: input validation, controlled object creation, password/group configuration, final validation, and rollback removal if any required step fails. Added side-effect-free `-WhatIf`, logs, structured CSV reporting, duplicate checks, and later froze the toolkit with parser gates and SHA-256 integrity checks.

**Result:** Five users were successfully provisioned to correct OUs and groups, a repeated import produced no duplicates, deliberately invalid passwords produced successful rollback, and the final eight-script release passed parser and hash validation.

A factual CV-style statement from this work could be:

> Built and validated an 8-script PowerShell/Active Directory administration toolkit for bulk onboarding, offboarding, account lockouts, password reset, access auditing and computer inventory, including WhatIf/confirmation safeguards, rollback handling, structured logging/reporting and SHA-256 release integrity checks.

---

## 28. Final Closure Statement

CR-011 is closed as a validated operational baseline.

The lab now has:

- repeatable AD onboarding;
- inactive-user reporting;
- safe offboarding;
- direct/effective group auditing;
- SMB + NTFS access analysis;
- lockout detection and historical event investigation;
- controlled password reset and unlock;
- domain computer inventory;
- logs and CSV reports;
- protected-account guardrails;
- whole-toolkit parser validation;
- SHA-256 integrity baselines;
- a versioned `CR-011-v1.0.0` release;
- a Proxmox rollback snapshot.

The next infrastructure change should begin from this frozen state.

**Next planned CR:** CR-012 - Windows Server Backup and Recovery.

---

# Appendix A - Final `Get-GroupMembership.ps1` repaired source

The group-membership script was the file accidentally edited near closure. The following is the restored known-good implementation used for the final parser and runtime validation.

```powershell
<#
.SYNOPSIS
    Audits Active Directory group membership for Nova Corp users.

.DESCRIPTION
    Reports primary, direct, and nested/effective security-group
    memberships for employee accounts under the Nova Users OU.

    By default, nested/effective results are limited to Nova Corp
    security groups to keep access-review reports readable.

    Use -IncludeSystemGroups to include Windows built-in and
    authorization-token groups.
#>

[CmdletBinding()]
param(
    [string]$SamAccountName,
    [switch]$IncludeSystemGroups
)

Import-Module ActiveDirectory -ErrorAction Stop

$UserSearchBase = "OU=Nova Users,DC=nova,DC=corp"
$NovaSecurityOU = "OU=Nova Security groups,DC=nova,DC=corp"
$ReportDirectory = "C:\NovaCorp\PowerShell\Reports"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$ReportPath = Join-Path `
    $ReportDirectory `
    "GroupMembership-$Timestamp.csv"

if (-not (Test-Path $ReportDirectory)) {
    New-Item `
        -Path $ReportDirectory `
        -ItemType Directory `
        -Force |
        Out-Null
}

if ($SamAccountName) {

    $Users = @(
        Get-ADUser `
            -Identity $SamAccountName `
            -Properties `
                MemberOf,
                PrimaryGroupID,
                Enabled,
                DistinguishedName,
                SID `
            -ErrorAction Stop
    )

    if (
        $Users[0].DistinguishedName `
            -notlike "*,$UserSearchBase"
    ) {
        throw `
            "User is not located under the Nova Users employee OU."
    }
}
else {

    $Users = @(
        Get-ADUser `
            -Filter * `
            -SearchBase $UserSearchBase `
            -Properties `
                MemberOf,
                PrimaryGroupID,
                Enabled,
                DistinguishedName,
                SID `
            -ErrorAction Stop
    )
}

$Results = foreach ($User in $Users) {

    $DomainSID = $User.SID.AccountDomainSid.Value

    $PrimaryGroupSID = `
        "$DomainSID-$($User.PrimaryGroupID)"

    $PrimaryGroup = Get-ADGroup `
        -Identity $PrimaryGroupSID `
        -ErrorAction Stop

    [PSCustomObject]@{
        UserName       = $User.Name
        SamAccountName = $User.SamAccountName
        UserEnabled    = $User.Enabled
        GroupName      = $PrimaryGroup.Name
        GroupScope     = $PrimaryGroup.GroupScope
        GroupCategory  = $PrimaryGroup.GroupCategory
        MembershipType = "Primary"
        GroupDN        = $PrimaryGroup.DistinguishedName
    }

    $DirectGroups = @(
        foreach ($GroupDN in @($User.MemberOf)) {

            if ($GroupDN) {
                Get-ADGroup `
                    -Identity $GroupDN `
                    -ErrorAction Stop
            }
        }
    )

    foreach ($Group in $DirectGroups) {

        [PSCustomObject]@{
            UserName       = $User.Name
            SamAccountName = $User.SamAccountName
            UserEnabled    = $User.Enabled
            GroupName      = $Group.Name
            GroupScope     = $Group.GroupScope
            GroupCategory  = $Group.GroupCategory
            MembershipType = "Direct"
            GroupDN        = $Group.DistinguishedName
        }
    }

    $AuthorizationGroups = @(
        Get-ADAccountAuthorizationGroup `
            -Identity $User.SamAccountName `
            -ErrorAction Stop
    )

    $DirectGroupDNs = @(
        $DirectGroups |
            ForEach-Object {
                $_.DistinguishedName
            }
    )

    foreach ($Group in $AuthorizationGroups) {

        if (
            $Group.DistinguishedName `
                -eq $PrimaryGroup.DistinguishedName
        ) {
            continue
        }

        if (
            $Group.DistinguishedName `
                -in $DirectGroupDNs
        ) {
            continue
        }

        if (
            -not $IncludeSystemGroups -and
            $Group.DistinguishedName `
                -notlike "*,$NovaSecurityOU"
        ) {
            continue
        }

        [PSCustomObject]@{
            UserName       = $User.Name
            SamAccountName = $User.SamAccountName
            UserEnabled    = $User.Enabled
            GroupName      = $Group.Name
            GroupScope     = $Group.GroupScope
            GroupCategory  = $Group.GroupCategory
            MembershipType = "Nested/Effective"
            GroupDN        = $Group.DistinguishedName
        }
    }
}

$Results |
    Sort-Object `
        SamAccountName,
        MembershipType,
        GroupName |
    Export-Csv `
        -Path $ReportPath `
        -NoTypeInformation `
        -Encoding UTF8

Write-Host ""
Write-Host `
    "===== Nova Corp Group Membership Audit =====" `
    -ForegroundColor Cyan

if ($SamAccountName) {
    Write-Host "User               : $SamAccountName"
}
else {
    Write-Host "Scope              : All Nova Users"
}

Write-Host `
    "Include System     : $([bool]$IncludeSystemGroups)"

Write-Host ""

$Results |
    Sort-Object `
        SamAccountName,
        MembershipType,
        GroupName |
    Format-Table `
        SamAccountName,
        UserEnabled,
        GroupName,
        GroupScope,
        GroupCategory,
        MembershipType `
        -AutoSize

Write-Host ""
Write-Host `
    "===== Membership Summary =====" `
    -ForegroundColor Yellow

$Results |
    Group-Object MembershipType |
    Sort-Object Name |
    Select-Object Name,Count |
    Format-Table -AutoSize

Write-Host ""
Write-Host "Report: $ReportPath"
```

---

# Appendix B - Evidence Index

| Evidence | What it proves |
|---|---|
| Group membership final run | repaired script parses and returns Direct/Nested/Primary correctly |
| Parser gate | all 8 scripts syntactically valid |
| Package scripts listing | all 8 approved scripts copied into v1.0.0 |
| Release inventory | all package entries exist with size/timestamp/path |
| SHA-256 list | baseline fingerprints captured |
| Hash comparison | working and packaged copies are identical |
| Version marker | release identity, host, domain, script count, integrity method |
| Proxmox snapshot | final known-good DC restore point after CR closure |

---

**End of CR-011 Journal**

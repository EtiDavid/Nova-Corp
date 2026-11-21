# Domain password and account-lockout policy

**Purpose:** Help protect domain accounts from weak passwords and repeated failed sign-in attempts.

## Settings documented in the policy baseline

| Setting | Value |
| --- | --- |
| Minimum password length | 12 characters |
| Complexity | Enabled |
| Maximum password age | 90 days |
| Lockout threshold | 5 failed attempts |
| Lockout duration | 15 minutes |
| Reset counter after | 15 minutes |

## Why it matters

One domain policy makes account requirements consistent. A repeated failed logon can lock an account, which support staff must be able to identify and recover safely.

## Connected services and tests

[Active Directory](../services/ACTIVE_DIRECTORY.md) · [Kerberos / KDC](../services/KERBEROS.md) · [Account scripts](../AUTOMATION.md).

The lockout detection and password reset workflows were included in the PowerShell administration toolkit and controlled tests.

**Original technical details:** [Group Policy implementation](../../Documentation/Change-Requests/Journal-CR-006.md) · [PowerShell account-lockout tests](../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

[← All policies](../POLICIES.md)
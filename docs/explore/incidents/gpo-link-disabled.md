# Company wallpaper policy stops applying

**Closed · PASS** · **Investigation:** `INC-CR014-03` · **Category:** Nova Corp incident response

## What happened?

The company wallpaper disappeared for a user while another Group Policy still processed normally.

## Why this test mattered

A GPO can exist with correct settings but fail to reach users if the link to their OU is disabled.

## What caused it?

The wallpaper GPO link on the parent Nova Users OU was disabled. This was not a whole-domain Group Policy or SYSVOL failure.

## Investigation — commands, expected results and actual findings

### 1. Which policies does the user receive?

```text
gpresult /r /scope:user
```

**Expected / hypothesis:** Wallpaper should be applied when healthy.

**Actual recorded result:** Wallpaper appeared under Filtered GPOs: Disabled (Link); drive mapping still applied.

### 2. Can the client locate a DC?

```text
nltest /dsgetdc:nova.corp /force
```

**Expected / hypothesis:** Select a healthy DC.

**Actual recorded result:** Selected NOVA-DC02.

### 3. Can it reach policy files?

```text
Test-Path "\\nova.corp\SYSVOL"
Test-Path "\\nova-dc01\SYSVOL"
Test-Path "\\nova-dc02\SYSVOL"
```

**Expected / hypothesis:** All policy-share paths accessible.

**Actual recorded result:** All True.

### 4. Is policy processing itself healthy?

```text
gpupdate /force
```

**Expected / hypothesis:** User and computer refresh should complete.

**Actual recorded result:** Both completed; wallpaper still filtered as Disabled (Link).

### 5. After re-enabling the link, does wallpaper apply?

```text
gpresult /r /scope:user
```

**Expected / hypothesis:** Wallpaper and drive mapping appear as Applied.

**Actual recorded result:** Both listed under Applied GPOs; no Disabled (Link).

### 6. Does the wallpaper configuration point to a real file?

```text
Test-Path "\\nova.corp\SYSVOL\nova.corp\wallpapers\NovaCorp-wallpaper.png"
```

**Expected / hypothesis:** True.

**Actual recorded result:** True; user wallpaper registry values restored, WallpaperStyle 4.

## Repair / resolution

Re-enable the existing OU link without rebuilding the GPO; refresh and retest user policy.

## Additional engineering lesson

The original incident notes use 'Cooperate wallpaper'. The configured policy is named 'Nova Corp - Coperate wallpaper' (including the typo). The engineering journal preserves the older wording, so readers can follow the investigation without assuming the names were identical.

## See the original test results

The full illustrated [incident engineering journal (PDF)](../../Documentation/Change-Requests/Nova_Corp_CR-014_Engineering_Journal_and_Evidence.pdf) contains the execution evidence, screenshots, exact command history and troubleshooting decisions. The brief [public incident-exercise overview](../../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) explains the wider exercise.

Source evidence identifiers (see the full journal): `image(20261116-213526).png`; `image(20261116-213629).png`; `image(20261116-214726).png`.

## Explore connected services

[Wallpaper policy](../policies/WALLPAPER.md) · [Group Policy explorer](../POLICIES.md) · [SYSVOL](../services/SYSVOL_NETLOGON.md).

[← All investigations](../TESTS_AND_RECOVERY.md) · [Company explorer](../../EXPLORE_NOVACORP.md)

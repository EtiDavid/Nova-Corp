---
title: "Test accounts used in Nova Corp"
sourcePath: "docs/explore/people/TEST_ACCOUNTS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/TEST_ACCOUNTS.md"
section: "explore"
---

# Test accounts used in Nova Corp

Not every account in the directory represents a permanent employee. The lab also created controlled identities to test onboarding, access, lockout and offboarding.

| Test account | How it was used | Related topic |
| --- | --- | --- |
| `john.shaw` | Contractor GPO/USB targeting | [John Shaw](/reference/explore/people/JOHN_SHAW/) |
| `cr011.fin` | Finance bulk-user creation scenario | [Automation](/reference/explore/AUTOMATION/) |
| `cr011.hr` | HR bulk-user creation scenario | [Automation](/reference/explore/AUTOMATION/) |
| `cr011.it` | IT bulk-user creation scenario | [Automation](/reference/explore/AUTOMATION/) |
| `cr011.mgmt` | Management bulk-user creation scenario | [Automation](/reference/explore/AUTOMATION/) |
| `cr011.sales` | Sales user and disabled-account denial test; account disabled | [Sarah Sales](/reference/explore/people/accounts/cr011-sales/) |
| `cr011.gui` | Disabled account from administration testing | [CR011 GUI pilot](/reference/explore/people/accounts/cr011-gui/) |
| `mgmt.test` | Management Finance Full Control access analysis | [File access](/reference/explore/FILE_SERVICES/) |
| `fin.test` | Controlled account-lockout experiment | [Password and lockout policy](/reference/explore/policies/DOMAIN_PASSWORD/) |

These are the usernames described in the historical engineering tests. A test account may have been disabled, removed or reset during cleanup.

The lab also created `svc_backup`, `svc_monitoring` and `svc_fileserver` as separate service-account identities during directory setup.

**[Company directory: accounts, groups and computers](/reference/explore/DIRECTORY_SNAPSHOT_2026-11-22/)**

**Original records:** [People/groups](/reference/Documentation/Change-Requests/Journal-CR-005/) · [Account scripts and tests](/reference/Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit/).

[← People and Departments](/reference/explore/PEOPLE_AND_DEPARTMENTS/)
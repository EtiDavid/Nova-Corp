# Test accounts used in Nova Corp

Not every account in the directory represents a permanent employee. The lab also created controlled identities to test onboarding, access, lockout and offboarding.

| Test account | How it was used | Related topic |
| --- | --- | --- |
| `john.shaw` | Contractor GPO/USB targeting | [John Shaw](JOHN_SHAW.md) |
| `cr011.fin` | Finance bulk-user creation scenario | [Automation](../AUTOMATION.md) |
| `cr011.hr` | HR bulk-user creation scenario | [Automation](../AUTOMATION.md) |
| `cr011.it` | IT bulk-user creation scenario | [Automation](../AUTOMATION.md) |
| `cr011.mgmt` | Management bulk-user creation scenario | [Automation](../AUTOMATION.md) |
| `cr011.sales` | Sales user and disabled-account denial test; account disabled | [Sarah Sales](accounts/cr011-sales.md) |
| `cr011.gui` | Disabled account from administration testing | [CR011 GUI pilot](accounts/cr011-gui.md) |
| `mgmt.test` | Management Finance Full Control access analysis | [File access](../FILE_SERVICES.md) |
| `fin.test` | Controlled account-lockout experiment | [Password and lockout policy](../policies/DOMAIN_PASSWORD.md) |

These are the usernames described in the historical engineering tests. A test account may have been disabled, removed or reset during cleanup.

The lab also created `svc_backup`, `svc_monitoring` and `svc_fileserver` as separate service-account identities during directory setup.

**[Full 22 November 2026 directory inventory](../DIRECTORY_SNAPSHOT_2026-11-22.md)**

**Original records:** [People/groups](../../Documentation/Change-Requests/Journal-CR-005.md) · [Account scripts and tests](../../Documentation/Change-Requests/CR-011_PowerShell_Administration_Toolkit.md).

[← People and Departments](../PEOPLE_AND_DEPARTMENTS.md)
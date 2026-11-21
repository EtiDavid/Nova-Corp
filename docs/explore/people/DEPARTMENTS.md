# Nova Corp departments

The fictional company is organized into **Finance, Human Resources, IT, Management and Sales**, with a separate area for contractor accounts.

These departments appear as OUs in the directory so that accounts and policies can be managed by purpose.

## Finance

<a id="finance"></a>
Finance handles the fictional company's finance documents.

- OU: `Nova Users → Finance`
- Group: [Finance_Users](../GROUPS.md#finance_users)
- Resource: [Finance share](../FILE_SERVICES.md#finance)
- Related groups: `DL_FS_Finance_Modify`, `DL_FS_Finance_FullControl`
- Test: Moyo's IT account was **denied** access to Finance.

## Human Resources

<a id="human-resources"></a>
HR is the department used to model employee administration.

- OU: `Nova Users → HR`
- Group: [HR_Users](../GROUPS.md#hr_users)
- Related automation: [Bulk user creation and offboarding](../AUTOMATION.md)

## IT

<a id="it"></a>
IT operates the lab.

- OU: `Nova Users → IT`
- Group: [IT_Users](../GROUPS.md#it_users)
- Profiles: [David](DAVID.md), [Moyo](MOYO.md)
- Resource: [IT share](../FILE_SERVICES.md#it)

[Open IT department](IT_DEPARTMENT.md).

## Management

<a id="management"></a>
Management is used for access-control scenarios.

- OU: `Nova Users → Management`
- Group: [Management_Users](../GROUPS.md#management_users)
- Resource test identity: `mgmt.test` received Finance Full Control in the documented access analysis.

## Sales

<a id="sales"></a>
Sales has its own OU and group for onboarding, permissions and offboarding exercises.

- OU: `Nova Users → Sales`
- Group: [Sales_Users](../GROUPS.md#sales_users)
- Automation example: the disabled test account `cr011.sales` was correctly denied access.

## Contractors

Contractor accounts are separated for policy targeting.

- OU: `Nova Users → Contractors`
- Test account: [John Shaw](JOHN_SHAW.md)
- Policy: [Contractor removable-storage denial](../POLICIES.md#contractor-usb-restriction)

[← People & Departments](../PEOPLE_AND_DEPARTMENTS.md) · [Directory tree](../DIRECTORY.md)
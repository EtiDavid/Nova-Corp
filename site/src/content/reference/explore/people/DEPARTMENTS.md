---
title: "Nova Corp departments"
sourcePath: "docs/explore/people/DEPARTMENTS.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/DEPARTMENTS.md"
section: "explore"
---

# Nova Corp departments

The fictional company is organized into **Finance, Human Resources, IT, Management and Sales**, with a separate area for contractor accounts.

These departments appear as OUs in the directory so that accounts and policies can be managed by purpose.

## Finance

<a id="finance"></a>
Finance handles the fictional company's finance documents.

- OU: `Nova Users → Finance`
- Group: [Finance_Users](/reference/explore/GROUPS/#finance_users)
- Resource: [Finance share](/reference/explore/files/finance/)
- Related groups: `DL_FS_Finance_Modify`, `DL_FS_Finance_FullControl`
- Test: Moyo's IT account was **denied** access to Finance.

## Human Resources

<a id="human-resources"></a>
HR is the department used to model employee administration.

- OU: `Nova Users → HR`
- Group: [HR_Users](/reference/explore/GROUPS/#hr_users)
- Related automation: [Bulk user creation and offboarding](/reference/explore/AUTOMATION/)

## IT

<a id="it"></a>
IT operates the lab.

- OU: `Nova Users → IT`
- Group: [IT_Users](/reference/explore/GROUPS/#it_users)
- Profiles: [David](/reference/explore/people/DAVID/), [Moyo](/reference/explore/people/MOYO/)
- Resource: [IT share](/reference/explore/files/it/)

[Open IT department](/reference/explore/people/IT_DEPARTMENT/).

## Management

<a id="management"></a>
Management is used for access-control scenarios.

- OU: `Nova Users → Management`
- Group: [Management_Users](/reference/explore/GROUPS/#management_users)
- Resource test identity: `mgmt.test` received Finance Full Control in the documented access analysis.

## Sales

<a id="sales"></a>
Sales has its own OU and group for onboarding, permissions and offboarding exercises.

- OU: `Nova Users → Sales`
- Group: [Sales_Users](/reference/explore/GROUPS/#sales_users)
- Automation example: the disabled test account `cr011.sales` was correctly denied access.

## Contractors

Contractor accounts are separated for policy targeting.

- OU: `Nova Users → Contractors`
- Test account: [John Shaw](/reference/explore/people/JOHN_SHAW/)
- Policy: [Contractor removable-storage denial](/reference/explore/POLICIES/#contractor-usb-restriction)

[← People & Departments](/reference/explore/PEOPLE_AND_DEPARTMENTS/) · [Directory tree](/reference/explore/DIRECTORY/)
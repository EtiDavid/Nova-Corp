---
title: "IT Department"
sourcePath: "docs/explore/people/IT_DEPARTMENT.md"
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/people/IT_DEPARTMENT.md"
section: "explore"
---

# IT Department

IT is the team used to administer Nova Corp's domain, servers, workstations and support tasks.

## Directory location

`nova.corp → Nova Users → IT`

Security group: [IT_Users](/reference/explore/GROUPS/#it_users)

## People in the IT department

- [David Eti](/reference/explore/people/DAVID/)
- [Moyo Agunbiade](/reference/explore/people/MOYO/)
- [Isaac Technology](/reference/explore/people/accounts/cr011-it/)

The original directory exercise placed David and Moyo here. The current directory record also shows Isaac Technology: all three are enabled and are direct members of **IT_Users**. Moyo's file-access results were separately tested from a real user session.

## What IT works with

[Domain Controllers](/reference/explore/SYSTEMS/) · [PowerShell administration](/reference/explore/AUTOMATION/) · [Group Policy](/reference/explore/POLICIES/) · [File services](/reference/explore/FILE_SERVICES/) · [Incident investigations](/reference/explore/TESTS_AND_RECOVERY/)

## Which user policies reach this department?

The **Nova Users** parent OU has the [corporate wallpaper](/reference/explore/policies/WALLPAPER/) and [department drive mapping](/reference/explore/policies/DRIVE_MAPPING/) links. These can be inherited by child departments such as IT when Windows processes policies for the user.

The domain root also links the [password and Kerberos policy](/reference/explore/policies/DOMAIN_PASSWORD/).

## Example: employee needs the IT share

1. Sign in using a domain account.
2. Account belongs to `IT_Users`.
3. Its authorization includes `DL_FS_IT_Modify`.
4. Share and NTFS permissions permit the required access.
5. A user-side test confirms the result.

[Follow Moyo's real tested access path](/reference/explore/people/MOYO/) · [View the original group journal](/reference/Documentation/Change-Requests/Journal-CR-005/).

[← Departments](/reference/explore/people/DEPARTMENTS/)
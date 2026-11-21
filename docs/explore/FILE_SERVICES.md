# File Storage & Access

## Why Nova Corp needs a file server

Departments need shared files, but the right person should see only the folders they are authorized to use.

**NOVA-FILES01** is the Phase 2 file server. It provides SMB shares and DFS namespace integration; Shadow Copies and Windows Server Backup add recovery paths.

## How the access decision works

```text
User signs in
   ↓
Active Directory confirms identity
   ↓
Security-group membership is evaluated
   ↓
SMB share permission + NTFS permission
   ↓
Authorized departmental folder
```

An OU organizes people; it is **not** itself a permission grant.

## File-server profile

- Hostname: `NOVA-FILES01.nova.corp`
- IP: `10.10.20.20`
- Main role: departmental SMB shares, DFS, Shadow Copies, backup
- User-facing domain path: `\\nova.corp\shares`

**Documentation:** [File server deployment PDF](../Documentation/Change-Requests/NovaCorp_CR-008_File_Server_Deployment_Journal.pdf) · [Department permissions PDF](../Documentation/Change-Requests/NovaCorp_CR-009_Departmental_Shares_and_Drive_Mapping.pdf) · [DFS/Shadow Copies PDF](../Documentation/Change-Requests/NovaCorp_CR-010_DFS_and_Shadow_Copies_CORRECTED.pdf).

## Why negative tests matter

A positive test proves an authorized user can open an allowed folder. A negative test proves that someone else cannot open a restricted folder. Both are required.

[Open the incident and validation summary](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md).

## What the site will add

Each department share will become a clickable profile:

- business purpose;
- linked department;
- sanitized SMB/NTFS access rules;
- groups that grant access;
- authorized and denied test examples;
- DFS path;
- recovery options;
- screenshots and full journal.

The full current access matrix must be reconciled from validated evidence before every rule appears publicly.

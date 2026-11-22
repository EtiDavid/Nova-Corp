---
title: "The folder was visible, but access was denied."
summary: "Moyo could reach the IT share but could not read one test subfolder. The failure was a deliberately introduced folder permission."
date: "November 2026"
outcome: "Targeted permission repair verified"
status: "tested"
systems: ["nova-files01", "nova-client", "nova-dc01"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/file-permission-denial.md"
---

## The symptom

A documented IT account could see the department share but could not read a particular incident-test folder. The visible folder path did not mean that file access was permitted.

## How it was isolated

- DNS resolved correctly, and TCP port **445** was reachable.
- The IT department's SMB share still allowed the intended resource group.
- The account's logon token contained the authorized **DL_FS_IT_Modify** group.
- The child folder's NTFS permissions contained a separate **explicit DENY** entry for the test account.

The issue was not network routing, DNS or the parent share.

## Why the group permission wasn't enough

Windows evaluates the folder's NTFS rules as well as the share's network rules. The explicit child-folder denial overrode the inherited Modify permission for this test.

## Repair and actual result

Only the temporary account-specific DENY entry was removed. The inherited department permission and administrative permissions were preserved.

A repeat test succeeded for folder traversal, reading and creating a file.

## What this demonstrates

Repairing a permission problem requires identifying **which layer** denied access. Giving everyone broader rights would not have been an appropriate solution. This was a controlled exercise; the incident-specific DENY was removed after the test.

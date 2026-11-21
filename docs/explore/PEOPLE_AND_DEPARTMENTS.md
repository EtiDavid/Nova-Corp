# People & Departments

## How staff are organized

Nova Corp is a **fictional organization**. Its directory was built to model how departments and IT policies can be managed centrally.

The historical directory-structure journal records these parent OUs:

```text
nova.corp
├── Nova Administrative Accounts
├── Nova Computers
│   ├── Servers
│   └── Workstations
├── Nova Disabled Objects
├── Nova Resources
├── Nova Security Groups
├── Nova Service Accounts
└── Nova Users
    ├── Finance
    ├── HR
    ├── IT
    ├── Management
    └── Sales
```

**Historical source:** [Directory and OU structure](../Documentation/Change-Requests/Journal-CR-005.md). This is an implemented/historical tree, not a live directory export.

## Why these categories matter

- **Departments / OUs** place accounts where administrators can manage them consistently.
- **Security groups** decide who can access resources or target some policies.
- **Computers** can receive different policies from people.
- **Administrative and service accounts** are separated for clearer responsibility.
- **Disabled objects** have a designated place rather than being left among active accounts.

## Staff profiles on the future site

Each safe, fictional staff profile will show:

| Field | Example of the information type |
| --- | --- |
| Display name | Approved fictional/alias name |
| Role / department | IT, Finance, HR, Management or Sales |
| Logon name | Sanitized or fictional username only |
| OU | Directory location |
| Security groups | Only approved sanitized group names |
| Policies | Relevant policy links (actual application must be evidenced) |
| File permissions | Why access is allowed or denied |
| Related tests | The user-access incident/validation |
| Status | Verified, historical, test account, or planned |

**Do not publish actual personal information, real credentials, passwords, email addresses, identity secrets or an unreviewed AD export.**

The CR-005 journal described initial IT accounts. That historical fact is **not** proof of the present-day enabled-account list. A fresh approved inventory is needed before claiming current staff counts or full profiles.

## Browse connected topics

[Identity](IDENTITY.md) · [Policies](POLICIES.md) · [File Access](FILE_SERVICES.md) · [Tests](TESTS_AND_RECOVERY.md)

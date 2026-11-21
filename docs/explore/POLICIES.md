# Rules & Group Policy

## What is a Group Policy?

A **Group Policy** lets IT configure Windows settings centrally rather than manually adjusting every workstation or user.

A policy only affects the intended object when targeting, linking, security filtering and processing are correct.

## What can be explored?

- Workstation security settings
- User restrictions and contractor controls
- Removable-storage policy and approved exceptions
- Firewall/legacy-protocol hardening
- Policy targeting (OU links and security filtering)
- Troubleshooting and rollback

**Engineering source:** [Group Policy implementation and validation](../Documentation/Change-Requests/Journal-CR-006.md).

## Important difference

An **OU** is where an object is organized. A **security group** can be used to target or authorize. A **GPO** is the policy definition. Effective policy depends on scope and processing, not merely on the GPO existing.

A complete website policy card will show:
- purpose;
- exact public-safe settings;
- link target;
- filter/group target;
- affected user/computer class;
- evidence of application;
- exceptions/deferred tests;
- linked incidents;
- exact documentation/PDF link.

The full current seven-GPO settings/targeting inventory is **not yet published as structured website data**; it will be populated only after auditing the current exported GPO backups and available test evidence. Seven GPOs were reconciled in the CR-015 baseline.

## Failure story

The lab recorded policy targeting and processing problems, including how a policy can appear in older `gpresult` data while a fresh processing attempt fails.

[Read incident exercises](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md).

## Connect policies to the company

[People and OUs](PEOPLE_AND_DEPARTMENTS.md) · [Identity](IDENTITY.md) · [Systems](SYSTEMS.md)

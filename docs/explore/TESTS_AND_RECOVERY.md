# Tests, Failures & Recovery

The Nova Corp lab is not only a configuration demo. It also records what happened when things broke.

## Browse by problem

| Incident / test | What was demonstrated | Read more |
| --- | --- | --- |
| **DC01 outage** | Continued AD/DNS and client operation through DC02; recovery/reconvergence | [AD resilience](../Documentation/Change-Requests/CR-013_Secondary_Domain_Controller_and_AD_Resilience_Journal.md) |
| **Client DNS misconfiguration** | File access looked broken, but the server still responded by IP | [Incident summary](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| **Share/NTFS access issue** | Authentication, group membership, SMB and NTFS were tested separately | [Incident summary](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| **Group Policy failure** | Processing failure and recovery were preserved | [Incident summary](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| **Backup target unavailable** | Real failure, repair, fresh backup, deleted-file restore and hash match | [Backup/incident summary](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| **Multiple simultaneous faults** | DNS and authorization problems were solved independently | [Incident summary](../Documentation/Change-Requests/CR-014_Phase_2_Incident_Exercises.md) |
| **Management path too open** | CLIENT reachability corrected and regression-tested | [Final validation](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |
| **Snapshot capacity risk** | 20 old snapshots retired, ~125.72 GiB reclaimed | [Final validation](../Documentation/Change-Requests/CR-015_Phase_2_Validation_and_Closure.md) |

## Proof matters

A passing configuration screen is not the same as an end-to-end test. The strongest backup example restored a deleted file and showed that original and recovered SHA-256 hashes matched.

## Future interactive incident browser

Each incident will be a separate clickable object with:
- symptom;
- affected system/user;
- timeline;
- hypothesis/test/finding;
- exact relevant evidence;
- repair;
- positive/negative retest;
- lessons;
- related system/policy/backup;
- original technical source.

No fake production ticket numbers or invented incidents will be used.

[Return to company map](../EXPLORE_NOVACORP.md)

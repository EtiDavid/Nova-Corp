---
title: "An IT admin blocked from PowerShell by a lockdown policy meant for other departments."
summary: "A tabletop exercise: an IT administrator cannot use PowerShell, because a policy linked at the parent OU applies to every user beneath it. It was reasoned through on paper and never executed."
date: "2026"
outcome: "Tabletop only: not executed"
status: "tested"
systems: ["nova-client"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/Journal-CR-006.md"
type: "tabletop"
cr: "CR-006"
services: ["group-policy"]
lines: ["identity"]
segment: null
pin: { col: 20.5, row: 24 }
shortTitle: "An IT admin blocked from PowerShell by a lockdown policy meant for other departments."
saw: "Finance and HR could not use PowerShell, which was expected. The IT administrator could not either, which was not."
cause: "Not executed. The scenario's finding: a user lockdown policy linked to the parent OU, Nova Users, applies to everyone beneath it, including the IT OU, because it filters on Authenticated Users."
fix: "Proposed: inspect scope, filtering and inheritance, then add a conflicting policy on the IT OU, because a child-linked policy can override a parent one when the parent is not enforced. Blocking inheritance on IT was rejected as the default."
proof: "Expected: the IT administrator gets PowerShell back and other departments stay restricted. This was not tested."
limits: "This is a paper exercise. No policy was changed and nothing was tested on a live account, so it is not evidence of a tested recovery."
copyStatus: "rewritten"
---

## Scenario

A simulated incident. Finance and HR cannot use PowerShell, which is expected. The IT administrator cannot either, which is not. The affected computer is NOVA-CLIENT, and `gpresult` in the scenario lists the user lockdown policy, the corporate wallpaper and the Default Domain Policy.

## Proposed response

1. Confirm whether the restriction is expected for the role.
2. Find the user's OU, groups, workstation and logon context.
3. Test another IT user, a user in the same department and a user in another department.
4. Use `gpresult` or RSoP to find the winning policy and the exact setting.
5. In Group Policy Management, check scope and links, security filtering, delegation, inheritance on the IT OU, the settings report and any WMI filter.
6. Change a policy only after the responsible policy and the wrong scope are confirmed.

**Simulated discovery:** the lockdown policy is linked to Nova Users with Authenticated Users in its filtering, and the IT OU is a child of Nova Users. It applied to every authenticated user beneath it, wider than the intended group.

**Options:** blocking inheritance on IT was rejected as the default, since it may also block other parent policies IT should keep receiving. A conflicting allow policy on IT is valid when the parent is not enforced and the child sets the same setting to the opposite value.

## Not executed

None of this was run against live accounts.

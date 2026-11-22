---
title: "What happened when an identity server went offline?"
summary: "A controlled outage tested whether the second Domain Controller could keep company sign-ins and resources available."
date: "November 2026"
outcome: "Directory continuity verified"
status: "tested"
systems: ["nova-dc01", "nova-dc02", "nova-client"]
sourceUrl: "https://github.com/EtiDavid/Nova-Corp/blob/main/docs/explore/incidents/domain-controller-outage.md"
---

## The situation

NOVA-DC01 was deliberately taken offline. The test was designed to check how the company behaves when one of its two identity servers is unavailable.

## What we expected

Employees should still be able to discover a Domain Controller, obtain authentication tickets and reach authorized company resources through NOVA-DC02.

## What the tests actually showed

- The unavailable DC01 did not respond to its LDAP connection check, even though its DNS record still existed.
- DC02 accepted LDAP and Kerberos connection checks.
- A workstation selected DC02 when forced to discover a Domain Controller again.
- SYSVOL, Group Policy refresh and the authorized IT file share remained accessible.
- Fresh Kerberos tickets identified DC02 as the serving Domain Controller.
- An object written on DC02 during the outage appeared on DC01 after recovery.

## After the service returned

Replication was checked across five naming contexts. The recorded summary showed zero failures for the tested direction and period. The controlled outage was concluded without seizing server roles or rebuilding Active Directory.

## What this demonstrates

A real client continued using directory-backed resources with one Domain Controller offline. It does **not** prove that every imaginable directory outage is covered or that a complete System State restoration has been performed.

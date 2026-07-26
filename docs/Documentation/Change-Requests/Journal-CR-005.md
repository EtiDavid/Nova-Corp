# CR-005 - Volume 1
# Organizational Unit (OU) Structure - Objectives & Enterprise Theory

## Objective

The objective of this Change Request was to redesign the Active Directory structure from the default installation into an enterprise-ready organizational hierarchy.

Instead of storing all users, computers and service accounts inside the default Active Directory containers, we designed a logical Organizational Unit (OU) structure that reflects how a real company manages its infrastructure.

This structure will become the foundation for future Change Requests including:

- Group Policy
- File Server permissions
- Administrative delegation
- Service Accounts
- Windows Backup
- PowerShell automation

Planning the directory correctly now will make the environment easier to manage as Nova Corp continues to grow.

---

# Why Organizational Units are Important

When Active Directory is first installed, Microsoft automatically creates several default containers such as:

- Users
- Computers
- Domain Controllers

These containers work, but they are not designed for long-term enterprise administration.

As a company grows, thousands of users, computers, groups and service accounts may exist inside Active Directory.

Without a proper structure:

- locating objects becomes difficult
- applying Group Policy becomes complicated
- administration becomes inconsistent
- troubleshooting takes longer

Organizational Units solve this problem by allowing administrators to group objects into logical business units.

Instead of thinking about individual users, administrators begin thinking about departments and organizational structure.

---

# Why We Built a New OU Structure

Nova Corp currently has only a few users and one workstation.

However, the goal of this lab is not to build a small network.

The goal is to build an enterprise environment that can continue expanding throughout future Change Requests.

Rather than waiting until hundreds of objects exist, we decided to create the proper structure now.

This follows an important engineering principle:

> Build for future growth rather than current size.

A well-designed Active Directory should be able to support a company with ten users just as easily as one with ten thousand users.

---

# Difference Between Containers and Organizational Units

One of the first concepts learned during this Change Request was the difference between a Container and an Organizational Unit.

Containers are created automatically when Active Directory is installed.

Examples include:

- Users
- Computers
- Builtin

Containers can store objects, but they have important limitations.

For example, Group Policy Objects (GPOs) cannot be linked directly to most default containers.

Organizational Units, on the other hand, are created by administrators.

Unlike containers, OUs provide additional management capabilities such as:

- Group Policy assignment
- Administrative delegation
- Better organization
- Easier management
- Logical separation of departments

Because of these advantages, enterprise administrators normally create their own OU hierarchy instead of relying on the default containers.

---

# Enterprise Planning Before Implementation

Before creating any Organizational Units, we first designed the complete Active Directory hierarchy on paper.

This allowed us to think about how the company should be organized instead of creating objects randomly.

The planned structure included separate areas for:

- Users
- Computers
- Service Accounts
- Security Groups
- Administrative Accounts
- Resources
- Disabled Objects

Designing first and implementing second reduced the chances of restructuring the environment later.

This is the same approach used in enterprise infrastructure projects, where architecture is planned before deployment begins.

---

# What We Expected to Achieve

By the end of CR-005 we expected to have:

- A clean enterprise OU hierarchy
- Departmental separation of users
- Separate locations for computers and servers
- Dedicated OU for service accounts
- Dedicated OU for security groups
- A scalable Active Directory design ready for future Group Policy deployment

Rather than simply making Active Directory look organized, the objective was to build a directory structure that supports security, automation, delegation and future expansion.

---

# Key Lessons Learned

This Change Request introduced an important shift in thinking.

Instead of viewing Active Directory as a collection of individual users and computers, it should be viewed as an enterprise directory where objects are organized according to business function.

Good directory design is not about appearance.

It is about making administration, security and future growth easier.

# CR-005 - Volume 2
# Designing and Implementing the Nova Corp Organizational Unit Structure

## Planning the Directory Structure

Before creating any Organizational Units (OUs), I first planned the structure of the Active Directory environment.

Rather than creating OUs as they became necessary, I designed the complete hierarchy first. This follows the same approach used in enterprise environments, where infrastructure is planned before deployment begins.

The goal was to ensure that future services such as Group Policy, File Servers, PowerShell automation and delegated administration could all fit naturally into the directory structure without requiring major redesign later.

---

# Why I Used the "Nova" Prefix

While planning the directory, I noticed that Active Directory already contains several default containers such as:

- Users
- Computers
- Builtin
- Domain Controllers

These objects are created automatically during the installation of Active Directory and are used internally by Windows Server.

To avoid confusion between Microsoft's default containers and the organizational structure I was building, I decided to prefix all custom Organizational Units with **Nova**.

For example:

- Nova Users
- Nova Computers
- Nova Security Groups
- Nova Service Accounts

This makes it immediately clear which objects belong to the company's directory structure and which belong to Windows itself.

It also follows a common enterprise practice of clearly separating custom administrative structures from system-created objects.

---

# Designing the OU Hierarchy

The planned hierarchy was designed around business functions rather than individual users.

The following parent Organizational Units were created:

```text
nova.corp
│
├── Nova Administrative Accounts
├── Nova Computers
├── Nova Disabled Objects
├── Nova Resources
├── Nova Security Groups
├── Nova Service Accounts
└── Nova Users
```

Some of these parent OUs required additional child OUs.

For example:

```text
Nova Computers
├── Servers
└── Workstations
```

and

```text
Nova Users
├── Finance
├── HR
├── IT
├── Management
└── Sales
```

This hierarchy separates different types of Active Directory objects into logical administrative areas.

---

# Why Child OUs Were Created

The child Organizational Units were created to separate objects based on their purpose inside the company.

For example, not every computer should receive the same Group Policy.

Servers normally require different security settings compared to employee workstations.

Separating them now makes future Group Policy deployment much easier.

The same idea applies to users.

Different departments may eventually require different:

- Desktop settings
- Drive mappings
- Printer assignments
- Security policies
- Software deployments

By placing each department inside its own OU, these policies can later be targeted only where they are needed.

---

# Creating the Organizational Units

After completing the design, I created the Organizational Units using **Active Directory Users and Computers (ADUC).**

The parent OUs were created first.

Once the parent OUs existed, I created the required child OUs underneath their respective parents.

Creating the hierarchy from the top down ensured that every object was placed in the correct location from the beginning.

---

# Replication Verification

Because Nova Corp now has two Domain Controllers, every major Active Directory change was verified through replication.

To confirm replication, I intentionally created Organizational Units from different Domain Controllers.

For example:

- A parent OU was created on NOVA-DC02.
- A child OU was created on NOVA-DC01.

After allowing Active Directory replication to occur, I confirmed that both Domain Controllers contained the same Organizational Unit hierarchy.

This verified that replication was functioning correctly and that both Domain Controllers maintained identical copies of the directory.

Testing replication after major configuration changes has become a standard validation step throughout the Nova Corp project.

---

# Why Replication Was Verified

Active Directory uses multi-master replication.

This means changes can be made on either Domain Controller.

If replication fails, the two Domain Controllers gradually become inconsistent.

This could result in:

- Missing users
- Missing groups
- Group Policy inconsistencies
- Authentication failures
- Administrative confusion

By verifying replication immediately after creating the Organizational Units, I confirmed that the new directory structure existed consistently across the domain.

---

# Design Decisions

Several important design decisions were made during this stage.

Instead of using Microsoft's default containers for long-term administration, I created dedicated Organizational Units for company objects.

Instead of mixing users, computers and service accounts together, each object type received its own administrative location.

Instead of creating a flat directory, departmental child OUs were used to support future Group Policy deployment.

Finally, every major structural change was verified through Active Directory replication before moving to the next checkpoint.

These decisions created a clean and scalable Active Directory design that will support the remaining phases of the Nova Corp infrastructure project.

---

# Key Lessons Learned

Good Active Directory design begins long before the first user account is created.

Planning the Organizational Unit hierarchy first makes future administration significantly easier.

Separating users, computers, security groups and service accounts into dedicated Organizational Units improves organization, simplifies policy management and prepares the environment for future expansion.

Verifying replication after creating the OU structure also confirmed that both Domain Controllers were synchronized and ready for the next stages of the project.

---

# Terminology

## Organizational Unit (OU)

An Organizational Unit is a logical container created by administrators to organize Active Directory objects. OUs can contain users, computers, groups and even other OUs. They also allow administrators to apply Group Policies and delegate administrative control.

---

## Parent OU

A Parent OU is an Organizational Unit that contains one or more child OUs beneath it.

Example:

```text
Nova Users
```

is the parent OU for:

- Finance
- HR
- IT
- Management
- Sales

---

## Child OU

A Child OU is an Organizational Unit located inside another Organizational Unit.

Child OUs allow administrators to organize objects into smaller logical departments while still remaining part of the larger company structure.

Example:

```text
Nova Computers
    ├── Servers
    └── Workstations
```

Servers and Workstations are child OUs of Nova Computers.

---

## Active Directory Users and Computers (ADUC)

Active Directory Users and Computers is the Microsoft management console used to create, modify and organize Active Directory objects such as users, computers, groups and Organizational Units.

It is one of the primary administration tools used by Windows Server administrators.

# CR-005 - Volume 3
# Organizing Existing Active Directory Objects

## Objective

After creating the Organizational Unit hierarchy, the next objective was to organize the existing Active Directory objects into their appropriate locations.

When Active Directory is first installed, newly created users and computers are placed inside Microsoft's default containers.

Although these containers function correctly, they do not reflect how enterprise environments organize their directory services.

The goal of this stage was to move users and computers into the newly created Organizational Units while preserving a clean and scalable directory structure.

---

# Why Existing Objects Needed to be Moved

Creating Organizational Units alone does not automatically organize Active Directory.

Any existing users and computers remain in their original locations until an administrator manually relocates them.

Leaving objects inside the default containers creates several long-term problems.

For example:

- Departmental Group Policies become difficult to apply.
- Finding users becomes more time-consuming.
- Computer management becomes inconsistent.
- Administrative delegation becomes harder.
- The directory gradually becomes disorganized.

Rather than waiting until hundreds of objects existed, I decided to organize the directory immediately after creating the OU structure.

This follows the engineering principle of building a clean foundation before expanding the environment.

---

# Organizing User Accounts

The current environment contained two standard user accounts.

- David Eti
- Moyo Agunbiade

Since both users currently belong to the IT department, they were moved into:

```text
Nova Users
    └── IT
```

This reflects the organizational structure of Nova Corp rather than simply storing users inside the default Users container.

As new employees are created in future Change Requests, they will be placed directly into their respective departmental Organizational Units.

---

# Why Users are Organized by Department

One of the biggest advantages of Organizational Units is the ability to apply administration based on departments instead of individual users.

For example, future Group Policies may only apply to:

- HR
- Finance
- Sales
- IT

Examples include:

- Desktop wallpaper
- Printer deployment
- Drive mappings
- USB restrictions
- Password policies
- Software deployment

By placing users into departmental OUs now, these policies can later be applied without reorganizing the directory.

---

# Organizing Computer Objects

The domain workstation was also relocated.

Computer moved:

```text
NOVA-CLIENT
```

Destination:

```text
Nova Computers
    └── Workstations
```

Separating workstations from servers allows different security policies to be applied in future Change Requests.

For example:

Workstations may receive:

- Automatic software installation
- Desktop restrictions
- USB control
- Windows Update policies

Servers will require completely different policies focused on:

- Stability
- Security
- Administrative access
- Server-specific configurations

Keeping these object types separate greatly simplifies enterprise administration.

---

# Why Domain Controllers Were Not Moved

One important design decision was made during this stage.

Although a dedicated Servers Organizational Unit had already been created, the Domain Controllers remained inside Microsoft's built-in:

```text
Domain Controllers
```

Organizational Unit.

This was done intentionally.

Unlike the default Users and Computers containers, the Domain Controllers OU is a special Organizational Unit created automatically by Active Directory.

Microsoft links the **Default Domain Controllers Policy** to this OU.

This policy contains security settings specifically designed for Domain Controllers.

Moving Domain Controllers into another OU without careful planning could prevent these policies from applying correctly.

For this reason, enterprise administrators normally leave Domain Controllers inside their dedicated Organizational Unit.

Future member servers such as:

- File Server
- Backup Server
- Monitoring Server

will instead be placed inside:

```text
Nova Computers
    └── Servers
```

This keeps Domain Controllers separated from ordinary servers while preserving Microsoft's recommended Active Directory design.

---

# Replication Validation

After moving both users and computer objects, replication between the two Domain Controllers was verified.

The objective was to confirm that object relocation had successfully synchronized throughout the domain.

Replication completed successfully and both Domain Controllers displayed the updated Organizational Unit structure.

Verifying replication after administrative changes has become a standard validation step throughout the Nova Corp project.

---

# Enterprise Benefits

By organizing Active Directory according to departments and device types, the directory now supports future enterprise administration.

This structure will simplify:

- Group Policy deployment
- File Server permissions
- Administrative delegation
- PowerShell automation
- User management
- Computer management

Instead of managing individual objects, administrators can now manage entire departments.

This significantly improves scalability as the organization grows.

---

# Key Lessons Learned

Creating Organizational Units is only the first step in organizing Active Directory.

The real value comes from placing objects into their correct administrative locations.

Separating users by department and computers by function allows future administration to be performed at the Organizational Unit level rather than the individual object level.

Leaving Domain Controllers inside their dedicated Organizational Unit also reinforces Microsoft's recommended enterprise design and ensures that domain-specific security policies continue to apply correctly.

---

# Terminology

## User Object

A User Object represents an individual identity within Active Directory.

User objects can authenticate to the domain, access resources and receive Group Policies.

Examples include:

- David Eti
- Moyo Agunbiade

---

## Computer Object

A Computer Object represents a domain-joined computer.

Computer objects also receive Group Policies and participate in domain authentication.

Examples include:

- NOVA-CLIENT
- NOVA-DC01
- NOVA-DC02

---

## Object Relocation

Object Relocation is the process of moving an Active Directory object from one Organizational Unit or container to another.

Moving an object does not recreate or delete it.

Instead, it changes the object's location within the directory while preserving its identity, permissions and attributes.

---

## Domain Controllers Organizational Unit

The Domain Controllers Organizational Unit is a special OU automatically created when Active Directory is installed.

Unlike the default Users and Computers containers, this OU is specifically designed to store Domain Controllers.

Microsoft links the Default Domain Controllers Policy to this OU, making it the recommended location for all Domain Controllers within the domain.

---

## Replication Validation

Replication Validation is the process of confirming that changes made on one Domain Controller have successfully synchronized to all other Domain Controllers.

Administrators should verify replication after significant Active Directory changes to ensure every Domain Controller contains identical directory information.

# CR-005 - Volume 4
# Security Groups and the AGDLP Permission Model

## Objective

After organizing the Active Directory structure, the next objective was to implement an enterprise security model using Security Groups.

Instead of assigning permissions directly to individual users, access should always be managed through groups whenever possible.

This approach improves security, simplifies administration and follows Microsoft's recommended Active Directory design.

During this stage, departmental Security Groups were created and users were assigned to the appropriate groups based on their role within the organization.

---

# Why Security Groups are Important

One of the biggest mistakes new administrators make is assigning permissions directly to user accounts.

For example:

David

↓

Read / Write

↓

IT Folder

Although this works, it quickly becomes difficult to manage as the company grows.

Imagine Nova Corp hires fifty new IT employees.

Each employee would need permissions assigned individually.

If an employee leaves the company, every permission would also need to be removed manually.

This approach is time-consuming and increases the risk of security mistakes.

Enterprise environments avoid this problem by assigning permissions to groups instead of individual users.

---

# Identity-Based Access Control

Security Groups separate a user's identity from the resources they can access.

Instead of asking:

"What permissions should David have?"

Administrators ask:

"What department does David belong to?"

Once David becomes a member of the IT department, Active Directory automatically grants access through group membership rather than individual permissions.

This makes administration significantly easier.

---

# Microsoft's AGDLP Model

During this Change Request, Microsoft's recommended permission model was introduced.

AGDLP stands for:

```text
Accounts

↓

Global Groups

↓

Domain Local Groups

↓

Permissions
```

Each part of the model has a specific responsibility.

---

# Accounts

Accounts represent individual users.

Examples:

- David Eti
- Moyo Agunbiade

Accounts should never receive permissions directly unless there is a very specific business requirement.

Instead, users become members of Security Groups.

---

# Global Groups

Global Groups represent **who a user is** inside the organization.

Examples include:

- IT_Users
- HR_Users
- Finance_Users
- Sales_Users
- Management_Users

These groups identify departmental membership rather than resource access.

For example, David belongs to the IT department.

Therefore:

```text
David Eti

↓

IT_Users
```

The group describes David's identity within the company.

---

# Domain Local Groups

Although Domain Local Groups were not created during CR-005, they are an important part of the AGDLP model.

Unlike Global Groups, Domain Local Groups represent resources rather than people.

Examples include:

- IT_Folder_RW
- Finance_Printer
- HR_Share_Read

These groups are assigned permissions on resources such as:

- Shared folders
- Printers
- Applications
- File servers

Later, Global Groups become members of Domain Local Groups.

This creates a flexible permission structure.

---

# Permissions

Permissions are assigned only to the Domain Local Group.

The user never receives permissions directly.

For example:

```text
David Eti

↓

IT_Users

↓

IT_Folder_RW

↓

Modify Permission

↓

\\NovaFS01\IT
```

This design makes future administration much easier.

If David leaves the IT department, the administrator simply removes him from IT_Users.

No folder permissions need to be modified.

---

# Security Groups Created

The following Global Security Groups were created inside:

```text
Nova Security Groups
```

| Group Name | Purpose |
|------------|---------|
| IT_Users | IT Department |
| HR_Users | Human Resources |
| Finance_Users | Finance Department |
| Sales_Users | Sales Department |
| Management_Users | Management |

Each group was created using:

- Group Scope: Global
- Group Type: Security

---

# Why Global Groups Were Used

During group creation, three different Group Scopes were available.

- Domain Local
- Global
- Universal

Global Groups were selected because they represent users who belong to the same domain.

Since Nova Corp currently operates as a single-domain environment, Global Groups provide the correct level of administration.

Universal Groups become useful in multi-domain forests.

Domain Local Groups will be introduced later when resource permissions are configured.

---

# Assigning Users to Groups

After creating the Security Groups, existing users were added to their department.

Current membership:

```text
IT_Users

├── David Eti
└── Moyo Agunbiade
```

Although only two users currently exist, this structure can easily scale to hundreds or thousands of employees.

Whenever a new IT employee joins Nova Corp, the administrator simply adds the user to:

```text
IT_Users
```

No further permission changes are required.

---

# Why Direct Permissions Should Be Avoided

During implementation, an important security scenario was discussed.

Imagine an employee from the Finance department requires temporary access to the IT printer.

One possible solution would be to add the Finance employee to:

```text
IT_Users
```

However, this would unintentionally grant the user every permission assigned to the IT department.

This violates the Principle of Least Privilege.

A better solution is to create a separate Security Group such as:

```text
IT_Printer_Users
```

The Finance employee becomes a member of that group only.

This grants access to the printer without providing unnecessary access to other IT resources.

This demonstrates why Security Groups should always represent a specific business function or resource rather than being used as shortcuts.

---

# Enterprise Benefits

Using Security Groups instead of assigning permissions directly to users provides several advantages.

- Easier administration
- Reduced risk of permission errors
- Simpler onboarding of new employees
- Faster employee offboarding
- Better auditing
- Improved scalability
- Stronger security

As Nova Corp continues to expand, these advantages become increasingly important.

---

# Key Lessons Learned

Security Groups should represent organizational roles rather than individual people.

Permissions should always be assigned to groups instead of users whenever possible.

Separating identity from resource permissions creates a more secure and scalable Active Directory environment.

The AGDLP model provides a structured method for managing access that can scale from a small business to a large enterprise.

Although only Global Security Groups were implemented during this Change Request, the remaining components of AGDLP will be completed during the File Server deployment in a later Change Request.

---

# Terminology

## Security Group

A Security Group is an Active Directory object used to organize users and assign permissions to resources.

Instead of assigning permissions directly to users, administrators assign permissions to Security Groups.

---

## Group Scope

Group Scope determines how a Security Group can be used within Active Directory.

The three available scopes are:

- Global
- Domain Local
- Universal

Each scope serves a different purpose depending on the size and design of the Active Directory environment.

---

## Global Group

A Global Group contains users who belong to the same domain.

Global Groups normally represent departments or job roles.

Examples include:

- IT_Users
- HR_Users
- Finance_Users

---

## Domain Local Group

A Domain Local Group represents access to a specific resource.

Examples include:

- IT_Folder_RW
- HR_Printer
- Finance_Share_Read

Permissions are assigned to Domain Local Groups rather than directly to users.

---

## Universal Group

A Universal Group is used to combine groups from multiple domains.

Universal Groups are most commonly used in large enterprise forests that contain more than one domain.

Nova Corp does not currently require Universal Groups because it operates as a single-domain environment.

---

## AGDLP

AGDLP is Microsoft's recommended Active Directory permission model.

It stands for:

- Accounts
- Global Groups
- Domain Local Groups
- Permissions

This model separates user identity from resource permissions, making Active Directory easier to manage and more secure.

---

## Principle of Least Privilege

The Principle of Least Privilege states that users and services should receive only the permissions required to perform their job.

Granting unnecessary permissions increases security risk and expands the impact of a compromised account.

---

## Identity-Based Access Control

Identity-Based Access Control is an access management approach where permissions are granted according to a user's role or group membership rather than their individual account.

This allows administrators to manage access at the organizational level instead of the individual user level.

# CR-005 - Volume 5
# Service Accounts and the Principle of Least Privilege

## Objective

The final implementation stage of CR-005 was to introduce dedicated Service Accounts into the Active Directory environment.

Rather than allowing enterprise services to run using highly privileged administrative accounts, separate identities were created specifically for future infrastructure services.

Although these accounts are not yet actively used, creating them now establishes a secure identity management foundation for future Change Requests.

---

# What is a Service Account?

A Service Account is a dedicated Active Directory user account created specifically for an application, service or automated process.

Unlike normal user accounts, Service Accounts are not intended for daily human use.

Instead, they provide an identity that allows services to authenticate and access only the resources required to perform their function.

Examples include:

- Backup software
- SQL Server
- Monitoring systems
- Web servers
- Scheduled automation tasks

Each service receives its own identity rather than sharing an administrative account.

---

# Why Not Use the Administrator Account?

One of the most important security discussions during this Change Request was why enterprise services should never routinely run using the built-in Administrator account.

The Administrator account has extensive privileges throughout the domain.

If a service running as Administrator becomes compromised, an attacker may inherit those privileges.

This could allow unauthorized access to:

- Active Directory
- File Servers
- DNS
- Group Policy
- Other critical infrastructure

Using the Administrator account therefore increases the impact of a security breach.

---

# The Principle of Least Privilege

To reduce this risk, enterprise environments follow the Principle of Least Privilege.

This principle states:

> Every user, service or application should receive only the permissions necessary to perform its intended function.

Nothing more.

Applying least privilege limits the potential damage caused by accidental misuse or malicious attacks.

Rather than giving every service unrestricted access, permissions are granted according to the service's specific role.

---

# Reducing the Blast Radius

During this Change Request, another important security concept was introduced.

Blast Radius refers to the amount of damage that can occur after a system or account has been compromised.

If every service runs using the Administrator account, compromising one service effectively compromises the entire environment.

However, if each service has its own dedicated identity with limited permissions, the attacker gains access only to the resources available to that specific service.

This significantly reduces the impact of a security incident.

---

# Service Accounts Created

The following Service Accounts were created inside:

```text
Nova Service Accounts
```

| Service Account | Purpose |
|-----------------|---------|
| svc_backup | Backup services |
| svc_monitoring | Monitoring systems |
| svc_fileserver | File Server related services and automation |

Each account was created with a clear description explaining its intended purpose.

This improves documentation and simplifies future administration.

---

# Naming Convention

A consistent naming convention was adopted.

Every Service Account begins with:

```text
svc_
```

Examples include:

- svc_backup
- svc_monitoring
- svc_fileserver

Using a standard prefix allows administrators to quickly distinguish Service Accounts from normal user accounts.

As the environment grows, additional accounts can follow the same convention.

Examples might include:

- svc_sql
- svc_iis
- svc_ca
- svc_aadconnect

Maintaining consistent naming conventions improves readability and reduces administrative errors.

---

# Future Expansion

Although only three Service Accounts were created during CR-005, the structure supports future enterprise services.

Whenever a new infrastructure component is introduced, a dedicated Service Account can be created specifically for that service.

This ensures that every service maintains its own identity and follows the Principle of Least Privilege.

---

# Replication Validation

After creating the Service Accounts, Active Directory replication was verified between both Domain Controllers.

The Service Accounts successfully appeared on the second Domain Controller, confirming that replication remained healthy.

Replication verification concluded the implementation phase of CR-005.

---

# Enterprise Benefits

Implementing Service Accounts provides several important advantages.

- Improved security
- Better auditing
- Reduced attack surface
- Easier administration
- Consistent identity management
- Reduced blast radius during compromise

These benefits become increasingly important as additional enterprise services are deployed.

---

# Key Lessons Learned

Every enterprise service should have its own identity.

Using dedicated Service Accounts instead of highly privileged administrative accounts significantly improves security and supports the Principle of Least Privilege.

This design also prepares Nova Corp for future infrastructure components such as backup software, monitoring systems, databases and web applications.

Creating Service Accounts before they are needed ensures that future deployments follow a consistent enterprise standard rather than relying on temporary administrative credentials.

---

# Terminology

## Service Account

A Service Account is a dedicated Active Directory user account used by applications or services instead of human administrators.

It provides an identity that allows the service to authenticate securely while limiting its permissions.

---

## Principle of Least Privilege

The Principle of Least Privilege is a security practice that grants users, services and applications only the permissions required to perform their intended tasks.

This reduces security risks and limits the impact of compromised accounts.

---

## Blast Radius

Blast Radius describes the amount of damage that can occur after a security incident.

Limiting account permissions reduces the number of systems or resources that can be affected if an account is compromised.

---

## Identity

In Active Directory, an identity is any security principal capable of authentication.

Examples include:

- User accounts
- Service Accounts
- Computer accounts

Each identity can be granted permissions according to its role within the environment.

---

## Authentication

Authentication is the process of verifying the identity of a user, computer or service before access is granted.

Active Directory performs authentication before authorizing access to protected resources.

---

## Authorization

Authorization occurs after authentication.

It determines which resources an authenticated identity is permitted to access based on its assigned permissions and group memberships.

# CR-005 - Volume 6
# Enterprise Validation and Best Practices

## Objective

The final stage of CR-005 was to validate that the Active Directory environment had been implemented according to enterprise best practices.

Rather than assuming every configuration was correct, each major component of the deployment was reviewed and verified.

This validation confirmed that the directory structure was consistent across both Domain Controllers and was ready to support future Change Requests including Group Policy, File Services, Windows Backup and PowerShell automation.

Successful validation marks the completion of CR-005.

---

# Validation 1 – Organizational Unit Structure

## Objective

Verify that the Organizational Unit hierarchy matches the approved Nova Corp design.

## Validation Performed

The following parent Organizational Units were confirmed:

- Nova Administrative Accounts
- Nova Users
- Nova Computers
- Nova Security Groups
- Nova Service Accounts
- Nova Disabled Objects
- Nova Resources

The following child Organizational Units were also verified.

Under Nova Users:

- Finance
- HR
- IT
- Management
- Sales

Under Nova Computers:

- Servers
- Workstations

## Expected Result

Every Organizational Unit should exist in the correct location.

## Result

Successful.

The Organizational Unit hierarchy matched the approved enterprise design.

---

# Validation 2 – User Organization

## Objective

Verify that user accounts are stored inside the correct departmental Organizational Unit.

## Validation Performed

The following user accounts were inspected.

- David Eti
- Moyo Agunbiade

Both users were successfully located inside:

```text
Nova Users
    └── IT
```

## Expected Result

Users should no longer remain inside the default Users container.

## Result

Successful.

Users were correctly organized according to department.

---

# Validation 3 – Computer Organization

## Objective

Verify that workstation objects are stored inside the correct Organizational Unit.

## Validation Performed

The domain workstation:

```text
NOVA-CLIENT
```

was confirmed inside:

```text
Nova Computers
    └── Workstations
```

The Domain Controllers remained inside Microsoft's built-in Domain Controllers Organizational Unit.

## Expected Result

Workstations should be separated from servers.

Domain Controllers should remain inside their dedicated Organizational Unit.

## Result

Successful.

The directory follows Microsoft's recommended enterprise design.

---

# Validation 4 – Security Groups

## Objective

Verify that departmental Security Groups were created successfully.

## Validation Performed

The following groups were confirmed.

- IT_Users
- HR_Users
- Finance_Users
- Sales_Users
- Management_Users

Each group was configured as:

- Global
- Security

## Expected Result

Every department should have its own Global Security Group.

## Result

Successful.

All Security Groups were created correctly.

---

# Validation 5 – Group Membership

## Objective

Verify that users belong to the correct Security Group.

## Validation Performed

Membership of:

```text
IT_Users
```

was inspected.

Confirmed members:

- David Eti
- Moyo Agunbiade

## Expected Result

Users should inherit permissions through group membership rather than direct permission assignments.

## Result

Successful.

Group membership accurately reflects departmental identity.

---

# Validation 6 – Service Accounts

## Objective

Verify that dedicated Service Accounts exist for future infrastructure services.

## Validation Performed

The following accounts were confirmed.

- svc_backup
- svc_monitoring
- svc_fileserver

Each account exists inside:

```text
Nova Service Accounts
```

## Expected Result

Every Service Account should exist with a clear purpose and remain separate from human user accounts.

## Result

Successful.

The Service Account structure is ready for future enterprise services.

---

# Validation 7 – Active Directory Replication

## Objective

Verify that all directory changes replicated successfully between both Domain Controllers.

## Validation Performed

During implementation, replication was continuously verified after major changes including:

- Organizational Unit creation
- User relocation
- Computer relocation
- Security Group creation
- Service Account creation

Objects created on NOVA-DC01 appeared on NOVA-DC02.

Objects created on NOVA-DC02 appeared on NOVA-DC01.

This confirmed that Active Directory replication remained healthy throughout CR-005.

## Expected Result

Both Domain Controllers should contain identical directory information.

## Result

Successful.

Replication completed without errors.

---

# Validation 8 – Naming Convention

## Objective

Verify that the Active Directory naming convention remains consistent.

## Validation Performed

The following standards were confirmed.

Organizational Units

- Nova Users
- Nova Computers
- Nova Security Groups

Security Groups

- IT_Users
- HR_Users
- Finance_Users

Service Accounts

- svc_backup
- svc_monitoring
- svc_fileserver

Computers

- NOVA-DC01
- NOVA-DC02
- NOVA-CLIENT

## Expected Result

Naming should remain predictable and consistent throughout the directory.

## Result

Successful.

The naming convention supports future automation and administration.

---

# Best Practices Applied

Throughout CR-005 several enterprise best practices were followed.

- Designed the Active Directory structure before implementation.
- Used Organizational Units instead of relying on default containers.
- Organized users according to business departments.
- Separated workstations from servers.
- Left Domain Controllers inside Microsoft's default Domain Controllers Organizational Unit.
- Assigned users to Security Groups rather than granting permissions directly.
- Created dedicated Service Accounts following the Principle of Least Privilege.
- Verified Active Directory replication after every major administrative change.
- Maintained consistent naming conventions across the environment.

Following these practices improves scalability, security and long-term manageability.

---

# CR-005 Outcome

The Active Directory environment now provides an enterprise-ready identity management structure.

The environment is prepared for:

- Group Policy deployment
- File Server permissions
- Windows Backup
- PowerShell automation
- Administrative delegation
- Future infrastructure expansion

The completion of CR-005 establishes the identity management foundation that future Change Requests will build upon.

---

# Engineering Reflection

One of the most important lessons learned during this Change Request is that Active Directory is far more than a database of users and computers.

A well-designed directory reflects the structure of the organization itself.

By organizing identities according to departments, separating services from people, using Security Groups instead of direct permissions and validating every configuration through replication, Nova Corp now follows many of the same design principles used in enterprise environments.

This Change Request also reinforced an important engineering habit that has been applied throughout the Nova Corp project:

**Design first. Implement second. Validate third. Document everything.**

Following this workflow has produced a more reliable infrastructure while also creating clear technical documentation for future reference.

# CR-005 - Volume 7
# Technical Glossary and Concepts Learned

This glossary summarizes the important technical concepts introduced during CR-005.

Rather than simply defining technical terms, each explanation describes why the concept is important within an enterprise Active Directory environment.

---

# Active Directory

Active Directory (AD) is Microsoft's directory service used to centrally manage users, computers, groups and other network resources.

Instead of storing accounts separately on every computer, Active Directory provides a central database that allows users to authenticate and access shared resources throughout the domain.

For Nova Corp, Active Directory serves as the foundation of identity management.

---

# Directory Service

A Directory Service is a centralized database that stores information about network objects such as users, computers, groups and printers.

It allows administrators to locate, organize and manage resources across an organization.

Active Directory is Microsoft's implementation of a Directory Service.

---

# Organizational Unit (OU)

An Organizational Unit (OU) is a logical container created by administrators to organize Active Directory objects.

Unlike Microsoft's default containers, OUs allow administrators to:

- Apply Group Policy
- Delegate administration
- Organize objects logically
- Simplify management

Organizational Units form the foundation of enterprise Active Directory administration.

---

# Parent OU

A Parent OU is an Organizational Unit that contains one or more child Organizational Units.

Example:

```text
Nova Users
```

contains:

- IT
- HR
- Finance
- Sales
- Management

---

# Child OU

A Child OU is an Organizational Unit located inside another Organizational Unit.

Child OUs provide additional organization by separating objects into smaller administrative areas.

For example:

```text
Nova Computers
│
├── Servers
└── Workstations
```

Servers and Workstations are child OUs.

---

# Container

A Container is an object automatically created by Active Directory during installation.

Examples include:

- Users
- Computers
- Builtin

Containers can store Active Directory objects but provide fewer management capabilities than Organizational Units.

Most enterprise administrators create their own OU structure instead of relying on the default containers.

---

# User Object

A User Object represents an individual identity within Active Directory.

User objects authenticate to the domain and receive permissions based on their group memberships.

Examples:

- David Eti
- Moyo Agunbiade

---

# Computer Object

A Computer Object represents a domain-joined computer.

Like users, computer objects also authenticate to Active Directory and can receive Group Policy settings.

Examples:

- NOVA-CLIENT
- NOVA-DC01
- NOVA-DC02

---

# Security Group

A Security Group is an Active Directory object used to organize users and assign permissions.

Instead of granting permissions directly to users, permissions should normally be assigned to Security Groups.

This simplifies administration and improves security.

Examples:

- IT_Users
- HR_Users
- Finance_Users

---

# Group Scope

Group Scope defines how a Security Group can be used inside Active Directory.

The available scopes are:

- Global
- Domain Local
- Universal

Each scope has a different administrative purpose.

---

# Global Group

A Global Group represents a collection of users who share the same role or department.

Global Groups answer the question:

> "Who is this user?"

Examples:

- IT_Users
- HR_Users
- Finance_Users

Global Groups normally contain user accounts.

---

# Domain Local Group

A Domain Local Group represents a resource rather than a person.

Examples include:

- IT_Folder_RW
- Finance_Printer
- HR_Share_Read

Permissions are assigned to Domain Local Groups.

Global Groups later become members of Domain Local Groups.

---

# Universal Group

A Universal Group combines users or groups from multiple domains.

Universal Groups are most commonly used in large enterprise forests.

Since Nova Corp currently contains only one domain, Universal Groups are not yet required.

---

# AGDLP

AGDLP is Microsoft's recommended Active Directory permission model.

It stands for:

Accounts

↓

Global Groups

↓

Domain Local Groups

↓

Permissions

This model separates user identity from resource permissions.

Instead of assigning permissions directly to users, administrators assign permissions to groups.

This greatly improves scalability and simplifies administration.

---

# Authentication

Authentication is the process of verifying the identity of a user, computer or service.

Examples include:

- Logging into Windows
- Joining a computer to the domain
- A service connecting to Active Directory

Authentication answers the question:

> "Who are you?"

---

# Authorization

Authorization occurs after authentication.

It determines what an authenticated user or service is allowed to do.

Authorization answers the question:

> "What are you allowed to access?"

---

# Identity

An Identity is any security principal capable of authenticating within Active Directory.

Examples include:

- User accounts
- Computer accounts
- Service Accounts

Every identity can receive permissions according to its role.

---

# Service Account

A Service Account is a dedicated user account created specifically for applications or services.

Unlike normal user accounts, Service Accounts are not intended for everyday interactive use.

Examples created during this Change Request:

- svc_backup
- svc_monitoring
- svc_fileserver

Using dedicated Service Accounts improves security and simplifies administration.

---

# Principle of Least Privilege

The Principle of Least Privilege states that every user, service or application should receive only the permissions required to perform its intended task.

Granting unnecessary permissions increases security risk and expands the potential impact of a compromised account.

Least Privilege is one of the most important principles in enterprise security.

---

# Blast Radius

Blast Radius describes the amount of damage that can occur if an account or system is compromised.

The larger the permissions assigned to an account, the larger the blast radius.

Using dedicated Service Accounts and Security Groups helps reduce the blast radius of future security incidents.

---

# Replication

Replication is the process of synchronizing Active Directory information between multiple Domain Controllers.

Whenever an administrator creates or modifies an object on one Domain Controller, Active Directory copies that change to the remaining Domain Controllers.

Healthy replication ensures that every Domain Controller contains identical directory information.

Throughout CR-005, replication was verified after every major administrative change.

---

# Naming Convention

A Naming Convention is a standardized method of naming objects throughout an infrastructure.

Examples used within Nova Corp include:

Organizational Units

- Nova Users
- Nova Computers
- Nova Security Groups

Security Groups

- IT_Users
- HR_Users
- Finance_Users

Service Accounts

- svc_backup
- svc_monitoring
- svc_fileserver

Consistent naming improves readability, reduces mistakes and simplifies PowerShell automation.

---

# Scalability

Scalability is the ability of an infrastructure to continue growing without requiring major redesign.

Although Nova Corp currently contains only a small number of users and computers, the Organizational Unit structure was designed to support hundreds or even thousands of objects in the future.

Building for scalability is one of the core principles of enterprise infrastructure design.

---

# Key Engineering Lessons from CR-005

CR-005 introduced several important engineering principles that will continue throughout the remainder of the Nova Corp project.

The most important lessons learned were:

- Design infrastructure before implementation.
- Build for future growth rather than current size.
- Organize Active Directory using Organizational Units instead of relying on default containers.
- Group users according to business departments.
- Separate workstations from servers.
- Keep Domain Controllers inside the dedicated Domain Controllers Organizational Unit.
- Assign permissions to Security Groups instead of individual users.
- Follow Microsoft's AGDLP permission model.
- Create dedicated Service Accounts for enterprise services.
- Apply the Principle of Least Privilege whenever permissions are assigned.
- Verify Active Directory replication after every significant administrative change.
- Maintain consistent naming conventions throughout the environment.
- Document every engineering decision and validate every implementation.

These principles transformed Active Directory from a default installation into a structured enterprise identity management system.

The completion of CR-005 establishes the organizational and security foundation that future Change Requests will build upon, beginning with Group Policy Management in CR-006.
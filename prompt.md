Use this prompt with your AI IDE. It removes **Status** and **Last verified** from every table and focuses only on the requested implementation.

````markdown
# Sixthgear Documentation Improvement Implementation

## Objective

Implement the approved improvements to these areas of the Sixthgear Mintlify documentation:

1. Top navigation
2. Accounts and Access
3. Shopify vs Loyverse
4. Hardware Recommendations
5. Final Recommendation

Do not modify unrelated documentation sections.

The user remains the final decision-maker.

---

# 1. Writing requirements

Write in clear, professional, and human English.

The documentation must be detailed enough that management, staff, and developers can understand:

- What each system does
- Why the information matters
- What decision needs to be made
- What Sixthgear should keep
- What Sixthgear should remove
- What equipment Sixthgear should reuse
- What equipment Sixthgear should purchase
- What steps should happen next

Avoid:

- Unexplained jargon
- Robotic wording
- Vague recommendations
- Excessive repetition
- Overly technical explanations
- One-sentence placeholder pages
- Conclusions that still leave the reader unsure what to do

Technical terms may be used when necessary.

At the first meaningful use of a technical term:

1. Italicize the term.
2. Explain it immediately in plain English.
3. Use normal formatting when the term appears again.

Example:

```mdx
A *source of truth* is the main system considered authoritative for a
specific type of information.
````

Use:

* Bold for interface names and important labels
* Backticks for commands, routes, files, and technical values
* Italics for first-use technical terminology
* Tooltips for brief definitions
* Links for longer explanations

---

# 2. Audit before editing

Inspect the current project and report:

* Current `docs.json` navigation
* Existing top navigation labels
* Existing Accounts and Access pages
* Existing Shopify vs Loyverse pages
* Existing internal links
* Existing Mintlify components
* Pages that will be renamed
* Pages that will be removed
* Content that needs to be transferred before removal

Do not delete a page until useful information from it has been preserved in the correct remaining page.

---

# 3. Top navigation

The current top navigation is too generic.

Replace or reorganize the top navigation using:

```text
Start Here
Shopify
Sixthgear CMS
Storefront
SEO & Growth
Accounts & Access
Resources
```

Use `Resources` as a dropdown when supported by the current Mintlify navigation schema.

Recommended Resources links:

```text
Troubleshooting
Glossary
Turnover & Maintenance
Documentation Updates
```

## Navigation behavior

* Clicking the `sixthgear` text brand should open the Overview page.
* The top navigation should switch between the main documentation areas.
* The left sidebar should display the pages inside the selected area.
* Do not add an unnecessary Home tab when the brand already links to the Overview.
* Do not use generic labels such as Platform, Apps, or Integrations.
* Do not create links to pages that do not exist.
* Preserve unrelated working navigation.

---

# 4. Accounts and Access restructuring

Remove these pages from navigation:

```text
MFA and Recovery
Request and Grant Access
```

Delete their files only after checking that they do not contain unique information that still needs to be preserved.

Rename:

```text
Credentials and Password Manager
```

to:

```text
Account Directory
```

Use this structure:

```text
accounts-and-access/
├── overview.mdx
├── account-directory.mdx
├── social-media-accounts.mdx
├── email-directory.mdx
├── platform-access.mdx
└── device-directory.mdx
```

Do not create Status or Last Verified columns anywhere in this section.

---

# 5. Accounts and Access overview

Create or improve:

```text
accounts-and-access/overview.mdx
```

Explain:

* What the Accounts and Access section contains
* Why Sixthgear maintains an account directory
* What information is recorded
* How the reader should use the directory
* Where to find social media, email, website platform, and device records

Use a suitable `CardGroup` linking to:

* Account Directory
* Social Media Accounts
* Email Directory
* Website Platform Access
* Device Directory

Do not include actual passwords.

---

# 6. Account Directory page

Create or improve:

```text
accounts-and-access/account-directory.mdx
```

This page should act as the main entry point and source of truth for account ownership and responsibility.

Explain that the documentation records:

* Account or platform name
* Login email
* Account purpose
* Who monitors it
* Who handles the password
* Who can grant access
* Whether MFA is required
* Which devices are signed in

Use a `Note`:

```mdx
<Note>
This directory records who handles each account and where it is used.
Actual passwords are not written in the documentation.
</Note>
```

Do not use:

```text
Password: ******
```

Use:

```text
Password handled by
```

Use a `CardGroup` to open each detailed directory.

---

# 7. Social Media Accounts

Create or improve:

```text
accounts-and-access/social-media-accounts.mdx
```

Use this exact table structure:

| Platform | Account or handle | Login email | Password handled by | Recovery number | Monitored by | MFA required? | Access granted by | Signed-in devices |
| -------- | ----------------- | ----------- | ------------------- | --------------- | ------------ | ------------- | ----------------- | ----------------- |

## Column guidance

### Platform

Use verified social platforms only.

Possible examples include:

* Facebook
* Instagram
* TikTok
* YouTube

Do not add accounts that cannot be confirmed.

### Account or handle

Use the actual account name, page name, or username.

### Login email

Use the email connected to the account.

When unknown, write:

```text
To verify
```

### Password handled by

Enter the person or position responsible for maintaining or retrieving the password.

Never enter the real password.

### Recovery number

Use a complete number only when it is a company-owned business number.

When it is a personal number, use:

* The responsible person’s name, or
* Only the final four digits

Do not expose a complete personal mobile number unnecessarily.

### Monitored by

State who regularly checks:

* Messages
* Comments
* Notifications
* Account activity

### MFA required?

Use only:

```text
Yes
No
To verify
```

### Access granted by

State who owns or administers the account and can approve another user.

### Signed-in devices

Keep the device name short.

Examples:

```text
Marketing iPhone
Office MacBook
Store tablet
```

Do not include serial numbers or device passwords.

## Components

Use suitable components such as:

* `Note` for table instructions
* `Warning` for unclear ownership
* `Tooltip` for account terminology
* `AccordionGroup` for optional explanations

Do not add components only for decoration.

---

# 8. Email Directory

Create or improve:

```text
accounts-and-access/email-directory.mdx
```

Use this exact table:

| Email address | Display name | Password handled by | Purpose | MFA required? | Access granted by | Signed-in devices |
| ------------- | ------------ | ------------------- | ------- | ------------- | ----------------- | ----------------- |

Explain these email types in simple language:

* Shared inbox
* Email alias
* Sender-only email
* Individual company email
* System or service email

Clearly identify sender-only addresses that are not monitored.

Example:

```text
This address sends automated order notifications. Incoming replies are
not regularly checked.
```

Do not invent email addresses.

Use only:

* Verified documentation
* Existing configuration
* Confirmed platform settings
* Information supplied by the user

When information is uncertain, use:

```text
To verify
```

## Components

Use:

* `Info` for email-type explanations
* `Warning` for unmonitored addresses
* `Tooltip` for unfamiliar terms
* `AccordionGroup` for additional notes

---

# 9. Website Platform Access

Create or improve:

```text
accounts-and-access/platform-access.mdx
```

This page is specifically for accounts used to operate the Sixthgear website and related systems.

Use this exact table:

| Platform | Login email | Password handled by | MFA required? | Access granted by | Signed-in devices | Purpose |
| -------- | ----------- | ------------------- | ------------- | ----------------- | ----------------- | ------- |

Audit possible platforms including:

* Shopify
* Sixthgear CMS
* GitHub
* Vercel
* Mintlify
* Domain or DNS provider
* Google Search Console
* Google Analytics
* Transactional email platform
* Payment provider
* Loyverse

Include only platforms that are confirmed.

For each platform, write a clear purpose.

Example:

```text
Shopify manages Sixthgear products, collections, prices, inventory,
customers, orders, and other ecommerce information.
```

## Components

Use:

* `CardGroup` for major platform summaries
* `Tooltip` for technical definitions
* `Warning` for missing ownership
* A complete table for the directory

---

# 10. Device Directory

Create or improve:

```text
accounts-and-access/device-directory.mdx
```

Use this exact table:

| Equipment name | Equipment type | Platforms signed in | Account or email used | Used for |
| -------------- | -------------- | ------------------- | --------------------- | -------- |

## Equipment name

Use short internal names.

Examples:

```text
Store iMin POS
Marketing iPhone
Office MacBook
Inventory tablet
```

## Equipment type

Examples:

```text
All-in-one POS
Laptop
Tablet
Mobile phone
Payment terminal
```

## Platforms signed in

List the platforms currently signed into the device.

## Account or email used

List the company account or email used on the device.

Do not include:

* Device password
* Device PIN
* Recovery code
* Unlock pattern
* API token

## Used for

Explain the business purpose of the equipment.

Examples:

```text
In-store checkout and receipt printing
Managing social media accounts
Website development and deployment
Inventory checking
```

## Components

Use:

* `CardGroup` for equipment categories
* `Note` for naming guidance
* `Warning` for unknown device ownership
* `Check` for a basic device review checklist

---

# 11. Shopify vs Loyverse structure

Remove these pages:

```text
decision-record.mdx
imin-hardware-assessment.mdx
cost-and-risk-analysis.mdx
pilot-and-migration-plan.mdx
```

Before removing them, preserve useful content as follows:

| Removed page                   | Move relevant content to                                        |
| ------------------------------ | --------------------------------------------------------------- |
| `imin-hardware-assessment.mdx` | `hardware-recommendations.mdx`                                  |
| `cost-and-risk-analysis.mdx`   | `comparison-and-pros-cons.mdx` and `final-recommendation.mdx`   |
| `pilot-and-migration-plan.mdx` | A concise implementation sequence in `final-recommendation.mdx` |
| `decision-record.mdx`          | Do not move unless it contains an approved management decision  |

The final page structure must be:

```text
shopify/shopify-vs-loyverse/
├── overview.mdx
├── sixthgear-requirements.mdx
├── platform-capabilities.mdx
├── comparison-and-pros-cons.mdx
├── commerce-architecture.mdx
├── philippines-payments-and-compliance.mdx
├── hardware-recommendations.mdx
└── final-recommendation.mdx
```

Update navigation and internal links.

Do not leave broken references to removed pages.

---

# 12. Components in Shopify vs Loyverse

Improve readability using suitable Mintlify components.

Do not force every component onto every page.

## Overview

Use:

* `Badge` for recommendation status
* `CardGroup` for major findings
* `Note` for Sixthgear’s current situation
* `Mermaid` for the platform relationship

## Sixthgear Requirements

Use:

* `CardGroup` for requirement categories
* `Check` for mandatory requirements
* `Warning` for unresolved requirements
* A priority table

## Platform Capabilities

Use:

* `Tabs` for Shopify and Loyverse
* `AccordionGroup` for advanced capabilities
* `Tooltip` for technical terms
* A feature table

## Comparison and Pros and Cons

Use:

* `Tabs`
* `Tip`
* `Warning`
* A detailed comparison table
* Cards for the two removal scenarios

## Commerce Architecture

Use:

* `Tabs` for architecture options
* `Mermaid` diagrams
* `Info` for the source-of-truth explanation
* `Warning` for synchronization risk

## Philippines Payments and Compliance

Use:

* `Steps` for payment processing
* `Warning` for external payment limitations
* `AccordionGroup` for payment types
* `Note` for requirements needing accountant or BIR confirmation

## Hardware Recommendations

Use:

* `CardGroup` for required and optional hardware
* `Tabs` for the modular Shopify POS setup and existing iMin reuse
* `Frame` for hardware images
* `Check` for compatibility requirements
* `Warning` for unverified hardware
* Detailed comparison tables

## Final Recommendation

Use:

* `Badge` for the preferred direction
* `Check` for the recommendation
* `CardGroup` for keep, remove, reuse, and purchase
* `Steps` for implementation order
* A final recommendation table

Do not hide conclusions inside accordions.

---

# 13. Improve Comparison and Pros and Cons

Create or improve:

```text
shopify/shopify-vs-loyverse/comparison-and-pros-cons.mdx
```

The page must contain:

1. Quick comparison
2. Shopify advantages
3. Shopify disadvantages
4. Loyverse advantages
5. Loyverse disadvantages
6. What happens if Sixthgear removes Shopify
7. What happens if Sixthgear removes Loyverse
8. Clear conclusion

## What happens if Sixthgear removes Shopify?

Explain the impact on:

* Products
* Product variants
* Collections
* Prices
* Inventory
* Customers
* Orders
* Online checkout
* Online payments
* Existing Next.js integration
* Data migration
* Development effort
* Long-term maintenance

Include this conclusion in natural wording:

```text
Removing Shopify is not only a POS change. It would require replacing
the ecommerce system that currently supports the Sixthgear online store.
```

Explain that Loyverse alone is not a complete native replacement for the existing ecommerce architecture.

## What happens if Sixthgear removes Loyverse?

Explain:

* Shopify remains the ecommerce platform.
* Physical-store selling moves to Shopify POS.
* Products, prices, inventory, customers, and orders remain in one environment.
* A separate Shopify-to-Loyverse synchronization process is no longer needed.
* Store personnel need Shopify POS training.
* Compatible POS hardware is required.
* External payment handling may remain separate.
* Loyverse sales records should be exported before removal.

State clearly:

```text
Removing Loyverse is the lower-risk consolidation option because it does
not require replacing the existing online commerce backend.
```

## Required conclusion

Conclude clearly:

```text
Keep Shopify.

Move physical-store selling to Shopify POS.

Retire Loyverse after the replacement workflow and hardware are working.
```

Do not present both platforms as equally suitable when the current Sixthgear architecture favors Shopify.

---

# 14. Improve Hardware Recommendations

Create or improve:

```text
shopify/shopify-vs-loyverse/hardware-recommendations.mdx
```

The page must directly answer:

* What device is needed to run Shopify POS?
* Can the existing iMin terminal be reused?
* What receipt printer is recommended?
* Is a barcode scanner needed?
* Is a cash drawer needed?
* How are card and QR payments handled?
* What hardware must be purchased?
* What hardware is optional?
* What hardware should not be purchased?

## Explain the preferred setup

Explain that Shopify POS runs on a supported iOS or Android phone or tablet.

It does not run as the standard Shopify POS application on a Windows or macOS computer.

Recommend a modular setup:

```text
iPad or supported Android tablet
+ Shopify-supported receipt printer
+ optional barcode scanner
+ optional cash drawer
+ external Philippine payment terminal
```

Explain why this is preferred:

* Easier to replace individual equipment
* Easier to verify compatibility
* Easier to upgrade
* Less dependent on one all-in-one manufacturer
* More reliable for long-term Shopify POS use

---

# 15. Existing iMin terminal

State only:

```text
Sixthgear currently owns an iMin all-in-one POS terminal.
```

Do not assume:

* Exact model
* Android version
* RAM
* Storage
* Printer type
* Receipt width
* Shopify compatibility
* Loyverse compatibility
* Warranty
* Original purchase price

Explain that the iMin may be reusable only when:

* Its Android version meets Shopify POS requirements
* Google Play Services are available
* Shopify POS can be installed
* The device is not rooted or using an unsupported operating system
* The built-in printer works with Shopify POS
* Receipt formatting is correct
* The device remains stable during actual store use

Add a `Warning` explaining:

```text
The ability to install Shopify POS does not guarantee that the built-in
iMin receipt printer will work with Shopify.
```

Move any useful information from the removed iMin assessment page into this section.

---

# 16. Required hardware research

Research and recommend only hardware that:

* Is currently supported by Shopify POS
* Is available from a Philippine seller
* Has a current Philippine price
* Can reasonably be purchased by Sixthgear
* Has clear model information
* Has warranty or seller support information

Use official sources for compatibility:

* Shopify Help Center
* Official manufacturer specifications
* Official Apple Philippines
* Official Epson documentation

Use reputable Philippine sellers for:

* Current price
* Availability
* Warranty
* Purchasing information

Include the research date for each product inside the hardware page.

Do not recommend:

* Unsupported printers
* Overseas-only products
* Discontinued equipment
* Products that are currently unavailable without clearly stating that they are order-basis
* Hardware based only on brand compatibility

---

# 17. Required hardware categories

## Primary Shopify POS device

Research and recommend a practical iPad or supported Android tablet.

Preferred candidate to verify:

```text
Apple iPad 11-inch with A16
Wi-Fi
128GB
```

Document:

* Exact model
* Display size
* Processor
* Storage
* Port
* Operating-system support
* Official Philippine price
* Philippine store
* Warranty
* Why it is suitable for Shopify POS

Do not recommend an iPad Pro or other expensive model unless a Sixthgear requirement justifies it.

## Receipt printer

Research an exact Shopify-supported receipt-printer model available in the Philippines.

Preferred candidate to verify:

```text
Epson TM-m30III
```

Document:

* Exact model number
* Shopify compatibility
* Printing method
* Paper width
* Printing speed
* Resolution
* Automatic cutter
* Available connections
* Philippine seller
* Current price
* Warranty
* Availability
* Research date

Clearly distinguish between:

* USB
* Ethernet
* Bluetooth
* Wi-Fi

Explain which connection is recommended for the selected tablet.

## Barcode scanner

Explain that Shopify POS may use the tablet camera for barcode scanning.

A dedicated barcode scanner should be optional at the beginning.

Recommend a separate scanner only when:

* Checkout volume is high
* Staff scan many products continuously
* Faster scanning is necessary

If recommending a model, verify:

* Shopify compatibility
* Exact model
* Connection type
* Philippine seller
* Current price
* Availability

## Cash drawer

Explain that a cash drawer is needed only when the store accepts and stores cash at the counter.

Explain that a connected drawer normally plugs into the receipt printer.

Verify:

* Printer compatibility
* Drawer cable
* Required voltage
* Philippine availability
* Price
* Warranty

Do not claim that a generic cash drawer is officially Shopify-supported without evidence.

## External payment terminal

Explain that a separate Philippine card or QR payment terminal may be required.

Describe the expected workflow:

1. Create the sale in Shopify POS.
2. Enter or confirm the amount on the external payment terminal.
3. Receive payment.
4. Mark the correct payment type in Shopify POS.
5. Confirm that both totals match.

Do not recommend unavailable Shopify card readers.

## Tablet stand

Include a secure tablet stand as a recommended purchase.

Research:

* Compatibility with the selected tablet
* Philippine availability
* Price
* Seller
* Counter stability
* Cable access
* Whether it can be secured to the counter

---

# 18. Hardware recommendation tables

Include a detailed product table:

| Hardware category | Recommended product | Important specifications | Shopify compatibility | Philippine price | Philippine seller | Availability |
| ----------------- | ------------------- | ------------------------ | --------------------- | ---------------: | ----------------- | ------------ |

Include a purchase-priority table:

| Hardware | Required or optional | When it is needed | Recommendation |
| -------- | -------------------- | ----------------- | -------------- |

Include estimated setups:

### Essential Shopify POS setup

* Tablet
* Receipt printer
* Tablet stand
* External payment terminal when non-cash payments are accepted

### Cash-enabled setup

* Essential setup
* Compatible cash drawer

### Higher-volume setup

* Cash-enabled setup
* Dedicated barcode scanner

Provide a total estimated cost for each setup using verified current prices.

Clearly state that prices may change.

---

# 19. Improve Final Recommendation

Create or improve:

```text
shopify/shopify-vs-loyverse/final-recommendation.mdx
```

Remove the vague Conditions section.

Use these sections:

```text
Recommended decision
What Sixthgear should keep
What Sixthgear should retire
What Sixthgear should reuse
What Sixthgear should buy
Why this is the best fit
Implementation order
Management summary
```

## Recommended decision

State directly:

```text
Sixthgear should keep Shopify as its primary commerce platform and move
physical-store selling to Shopify POS.

Loyverse should be retired after the replacement in-store workflow is
working and its required historical data has been preserved.
```

Do not weaken the recommendation with excessive conditional language.

## What Sixthgear should keep

Include:

* Shopify ecommerce backend
* Existing Next.js storefront
* Shopify products
* Shopify collections
* Shopify customers
* Shopify inventory
* Shopify orders
* Required Shopify integrations

## What Sixthgear should retire

Include:

* Loyverse as the long-term POS platform
* Duplicate product maintenance
* Duplicate inventory maintenance
* Integration processes that exist only to synchronize Shopify and Loyverse

Explain that Loyverse should remain only during the transition.

## What Sixthgear should reuse

Include:

* Existing iMin terminal only when compatibility testing succeeds
* Existing payment terminal when it supports the approved workflow
* Existing scanner or cash drawer only when compatible

Do not promise that the iMin printer will work with Shopify.

## What Sixthgear should buy

Provide a clear purchase list:

1. Recommended tablet
2. Recommended Shopify-supported receipt printer
3. Secure tablet stand
4. Compatible cash drawer when cash is accepted
5. Dedicated scanner only when needed
6. External payment terminal from the selected Philippine provider

Include estimated prices based on verified current research.

## Why this is the best fit

Explain:

* Shopify already supports the online store.
* The Next.js storefront already depends on Shopify.
* One platform reduces duplicate work.
* Products and inventory are easier to maintain.
* Orders and customers remain in one environment.
* Fewer integrations need monitoring.
* Long-term development is simpler.
* Removing Loyverse changes the in-store workflow only.
* Removing Shopify would require replacing the ecommerce backend and rebuilding important parts of the online store.

## Implementation order

Use `Steps`:

1. Export and preserve required Loyverse information.
2. Confirm the exact iMin model.
3. Test Shopify POS on the iMin as a reuse option.
4. Purchase modular hardware when the iMin is unsuitable.
5. Configure Shopify POS payment types.
6. Test complete store transactions.
7. Train personnel.
8. Confirm inventory, receipts, refunds, and daily reconciliation.
9. Stop entering new transactions in Loyverse.
10. Preserve the Loyverse export for reference.

## Management summary

End with:

| Decision area                       | Recommendation                                  |
| ----------------------------------- | ----------------------------------------------- |
| Online commerce platform            | Keep Shopify                                    |
| Main source of commerce information | Shopify                                         |
| Long-term in-store POS              | Shopify POS                                     |
| Loyverse                            | Retire after transition                         |
| Existing iMin                       | Reuse only when fully compatible                |
| Primary POS device                  | Use the verified recommended tablet             |
| Receipt printer                     | Use the verified Shopify-supported model        |
| Barcode scanner                     | Optional initially                              |
| Payment handling                    | External local terminal recorded in Shopify POS |
| Main reason                         | One unified commerce environment                |

The page must leave management with a clear direction.

---

# 20. Validation

Run the available Mintlify validation commands.

Verify:

* Top navigation works
* The Resources dropdown works
* Removed pages are no longer linked
* Useful content was transferred before deletion
* Accounts and Access tables contain no Status column
* Accounts and Access tables contain no Last Verified column
* No actual password is written
* The password responsibility column is labeled `Password handled by`
* Tables display correctly on desktop and mobile
* Shopify vs Loyverse navigation works
* The comparison explains the impact of removing each platform
* The hardware page identifies required and optional equipment
* Only currently available Philippine hardware is recommended
* Shopify compatibility is supported by reliable sources
* Hardware prices include sources and research dates
* The final recommendation is direct
* No broken links remain

---

# Required implementation report

Return:

```markdown
# Sixthgear Documentation Implementation Report

## Navigation Changes

## Accounts and Access Changes

## Pages Removed

## Pages Renamed

## Tables Implemented

## Shopify vs Loyverse Improvements

## Comparison Improvements

## Hardware Research and Recommendations

## Final Recommendation Improvements

## Files Created

## Files Modified

## Files Deleted

## Sources Used

## Validation Results

## Information Still Needed
```

List all exact file paths.

Do not modify unrelated documentation.

```
```

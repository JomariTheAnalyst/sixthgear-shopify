Use this focused implementation prompt for your AI IDE. It is grounded in the nine-step Sanity invitation walkthrough and the verified SixthGear CMS setup at `/studio`.  

````md
# Implement the SixthGear CMS invitation walkthrough

## Role

Act as a senior Mintlify documentation engineer.

Create a clear, detailed, human-written walkthrough showing an invited staff member how to accept a Sanity project invitation and confirm access to SixthGear CMS.

The Mintlify documentation skill is already installed. Read and follow that skill before editing so all components, frontmatter, image handling, and configuration use currently supported Mintlify syntax.

Do not modify the SixthGear storefront, Sanity schemas, CMS integration, or any application code.

---

## Project context

The SixthGear documentation project already exists.

Locate the active Mintlify project containing:

```text
docs.json
sanity/
images/
````

The SixthGear storefront uses Sanity Studio mounted at:

```text
/studio
```

The source guide follows this general sequence:

1. Open the email account that received the invitation.
2. Find and open the Sanity invitation.
3. Select **Accept invitation**.
4. Check the account currently displayed by Sanity.
5. Switch accounts only when the wrong account appears.
6. Sign in using the correct Google or Sanity identity.
7. Select the exact account that received the invitation.
8. Approve the sign-in request.
9. Accept the project invitation.
10. Open SixthGear CMS and confirm access.

Improve this workflow rather than copying the reference wording exactly.

---

## Scope

Implement or replace only this page:

```text
sanity/get-access.mdx
```

Update `docs.json` only when needed to make the page appear under the existing **SixthGear CMS** navigation.

Do not create unrelated CMS pages in this task.

Do not rewrite other documentation categories.

---

## Page frontmatter

Use:

```yaml
---
title: "Accept your SixthGear CMS invitation"
description: "Join the SixthGear Sanity project, sign in with the correct account, and confirm your CMS access."
---
```

Do not add another manual H1 inside the page body.

---

## Audience

Write for:

* The business owner
* Managers
* Content editors
* Staff members with limited technical experience
* Anyone receiving SixthGear CMS access for the first time

Assume the reader has never used Sanity.

Explain every necessary action without sounding childish or overly technical.

---

## Writing style

Write like an experienced colleague guiding another staff member.

Use:

* Second person
* Active voice
* Short paragraphs
* Exact interface labels in bold
* Direct instructions
* Clear expected results after each important action
* Practical security guidance
* Natural transitions

Avoid:

```text
seamlessly
effortlessly
robust
leverage
unlock
delve into
comprehensive solution
simply
it is important to note
in conclusion
```

Do not use generic AI-style introductions, repetitive summaries, marketing language, or filler.

---

## Required Mintlify components

Use supported components from the installed Mintlify documentation skill.

Use:

* `<Info>` for prerequisites
* `<Steps>` and `<Step>` for the walkthrough
* `<Frame>` for every screenshot placeholder
* `<Warning>` for identity and security risks
* `<Tip>` for helpful but optional guidance
* `<Tabs>` for invited-user and administrator verification
* `<Check>` for the final successful result
* `<AccordionGroup>` and `<Accordion>` for troubleshooting

Do not use components only for decoration.

Do not hide essential steps inside accordions.

---

## Shared placeholder image

Use one reusable placeholder image throughout the page:

```text
/images/placeholders/screenshot-reserved.svg
```

If it does not exist, create it.

The placeholder must:

* Use a `1280 × 720` or equivalent 16:9 canvas
* Work in light and dark mode
* Have a subtle border
* Have rounded corners
* Show a simple image or camera icon
* Display `Screenshot reserved`
* Display `Replace with the actual SixthGear CMS screenshot`
* Contain no external image assets
* Contain no personal or project information

Use the same placeholder for every screenshot location.

Every `<Frame>` must have:

* A unique caption
* Unique descriptive alt text
* A nearby MDX replacement comment
* A final intended filename
* Instructions describing what the real screenshot should show
* Instructions describing what must be hidden or blurred

Do not create visible broken-image placeholders.

---

# Required page content

## Introduction

Start with a short explanation:

* A SixthGear administrator must invite the user before they can open the CMS.
* The invitation is connected to one specific email address.
* The user must sign in with the same account and identity provider.
* The process normally takes only a few minutes.
* No password should be shared with another employee.

Add:

```mdx
<Info>
You need access to the exact email account that received the Sanity invitation. Keep that inbox open while completing this guide.
</Info>
```

---

## Before you begin

Include a short checklist:

* Access to the invited email account
* The Sanity invitation email
* A supported browser
* The correct Google or Sanity sign-in method
* Approval from the responsible SixthGear administrator

Add a warning explaining that using the wrong Google account or another sign-in provider can create a separate Sanity identity without SixthGear access.

Do not claim that every user must use Google. Explain that the reader should use the sign-in method connected to the invited Sanity identity.

---

# Invitation walkthrough

Use `<Steps>`.

## Step 1 — Open the invited email account

Explain:

* Open the inbox for the email address that received the invitation.
* Use the general Gmail link when the account uses Gmail:

```text
https://mail.google.com/
```

* Do not use a Gmail URL containing `/u/1/`, `/u/2/`, or `/u/3/`.
* Check **Inbox**, **Spam**, **Junk**, **Promotions**, and **Updates**.
* Search for `Sanity`, `invited you`, or the SixthGear project name.

Add a placeholder frame.

Use this replacement comment structure:

```mdx
{/* REPLACE SCREENSHOT
Final file: /images/sanity/access/01-invitation-inbox.png
Capture: The inbox containing the Sanity invitation
Show: The Sanity sender and invitation subject
Hide: Personal email addresses, unrelated messages, avatars, labels, and notifications
Crop: The invitation row and enough inbox context to identify it
*/}
```

Caption:

```text
Reserved screenshot: Inbox showing the Sanity project invitation
```

---

## Step 2 — Open and inspect the invitation

Explain:

* Open the message sent by Sanity.
* Confirm that the email refers to the SixthGear project.
* Confirm that the invitation was expected.
* Do not continue when the project or sender looks unfamiliar.
* Do not forward the invitation to another user.
* The invitation is intended for the original recipient.

Add a placeholder for the opened invitation email.

Final intended filename:

```text
/images/sanity/access/02-open-invitation-email.png
```

The actual screenshot should show:

* Sanity sender
* Project name
* **Accept invitation** button

It must hide:

* Personal inbox content
* Personal email addresses
* Other messages
* Avatars
* Private browser information

---

## Step 3 — Select Accept invitation

Explain:

* Select **Accept invitation** inside the email.
* Sanity should open in a new browser page.
* Confirm the browser opens an official Sanity page before entering credentials.
* The invitation email should not request the user’s password directly.

Add a security warning.

Add a placeholder.

Final filename:

```text
/images/sanity/access/03-accept-invitation-email-button.png
```

---

## Step 4 — Check the displayed account

Explain:

* Read the account shown on the Sanity invitation screen.
* Continue when it matches the invited email.
* Select **Switch accounts** only when Sanity shows the wrong account.
* Do not accept the invitation using another employee’s account.
* Do not use a personal account when a business account was invited.

Make it clear that **Switch accounts** is conditional, not always required.

Add a placeholder.

Final filename:

```text
/images/sanity/access/04-check-sanity-account.png
```

The final screenshot should show:

* Current account
* Project name
* **Switch accounts** option

Hide:

* Full personal email where unnecessary
* Project ID
* Organization ID
* Account avatar
* Private browser information

---

## Step 5 — Sign in using the correct method

Explain:

* Select **Continue with Google** when the invited account uses Google authentication.
* Use the email sign-in option only when that is the established Sanity login method.
* Do not change login providers during the process.
* Using the same email through another provider may create a separate Sanity identity.

Add a placeholder.

Final filename:

```text
/images/sanity/access/05-select-sign-in-method.png
```

---

## Step 6 — Select the invited account

Explain:

* Select the exact account that received the invitation.
* Carefully compare similar personal and business email addresses.
* Use **Use another account** only when the invited address is not listed.
* Stop and contact the administrator if the invited account cannot be accessed.

Add a placeholder.

Final filename:

```text
/images/sanity/access/06-select-invited-account.png
```

The final screenshot must not expose unrelated Google accounts.

---

## Step 7 — Approve the sign-in request

Explain:

* Review the account shown by Google or the selected authentication provider.
* Select **Continue**, **Magpatuloy**, or the equivalent button.
* Button language may follow the user’s account language.
* Do not approve the sign-in when the wrong account is displayed.

Add a placeholder.

Final filename:

```text
/images/sanity/access/07-approve-google-sign-in.png
```

---

## Step 8 — Accept the Sanity project invitation

Explain:

* Confirm that the SixthGear project is shown.
* Confirm that the correct account is displayed.
* Select **Accept invitation**.
* Wait for Sanity to finish adding the account.
* Do not repeatedly select the button.
* Access may take a short time to appear after acceptance.

Add a placeholder.

Final filename:

```text
/images/sanity/access/08-final-accept-invitation.png
```

---

## Step 9 — Open SixthGear CMS

Explain that the Studio is mounted at:

```text
/studio
```

Use the public CMS link only when the production domain has been verified.

If this URL is already confirmed, add:

```md
[Open SixthGear CMS](https://sixthgearmoto.com/studio)
```

If it cannot be verified from the repository or existing documentation, do not publish a potentially incorrect link. Instead, add an internal MDX comment:

```mdx
{/* VERIFY BEFORE PUBLISHING
Confirm the production SixthGear CMS URL.
Expected pattern: https://sixthgearmoto.com/studio
*/}
```

Explain:

* Open SixthGear CMS.
* Sign in using the same identity used to accept the invitation.
* Wait a few minutes and refresh when access was accepted recently.
* Confirm that the page title identifies SixthGear CMS.
* Confirm that the expected content sections are visible.
* Do not edit content during the first access check.

Add a placeholder.

Final filename:

```text
/images/sanity/access/09-first-studio-view.png
```

---

## Step 10 — Confirm access

Use:

```mdx
<Tabs>
  <Tab title="Invited user">
    Explain how to confirm that SixthGear CMS opens, expected content types are visible, and available editing or publishing controls match the assigned role.
  </Tab>

  <Tab title="Administrator">
    Explain how to open Sanity Manage, select the SixthGear project, open Members, and confirm that the user appears with the intended role.
  </Tab>
</Tabs>
```

Use the official Sanity management link:

```md
[Open Sanity Manage](https://www.sanity.io/manage)
```

Do not tell the invited user that they must always open **Members**. That is primarily an administrator verification step.

Add:

```mdx
<Check>
Access is complete when the invited user can open SixthGear CMS with the correct account and see the content allowed by the assigned role.
</Check>
```

---

# Troubleshooting

Add an `<AccordionGroup>` containing these issues.

## The invitation email did not arrive

Include:

* Check Spam, Junk, Promotions, and Updates.
* Search for Sanity.
* Confirm the invited email with the administrator.
* Ask the administrator to review pending invitations.
* Resend the invitation when appropriate.

## Sanity opens the wrong account

Include:

* Select **Switch accounts**.
* Sign out of unrelated Sanity sessions.
* Use a private browser window when needed.
* Sign in with the exact invited account.

## The invitation was accepted using the wrong account

Include:

* Stop before editing CMS content.
* Notify the administrator.
* Remove or revoke the incorrect membership.
* Send a new invitation to the correct account.
* Do not share the incorrect account.

## The invitation expired

Include:

* Ask the administrator to review the pending invitation.
* Revoke the expired invitation if required.
* Send a new invitation.
* Use only the newest invitation email.

## The user can open the project but cannot edit

Include:

* Confirm the assigned role.
* Some roles are read-only.
* Ask the administrator to review the role and current Sanity plan.
* Do not share an administrator account.

Do not claim that an Editor role is available unless verified in the Sanity dashboard.

## The user can edit but cannot publish

Include:

* Check for field validation errors.
* Confirm that required fields are complete.
* Confirm the assigned role allows publishing.
* Ask the administrator to review access.

## SixthGear CMS is blank or does not load

Include:

* Refresh the browser.
* Wait a few minutes after accepting the invitation.
* Confirm the correct account.
* Open a private browser window.
* Temporarily disable browser extensions.
* Record the browser, time, URL, and visible error before escalating.

## The project appears, but SixthGear CMS does not

Include:

* Confirm the production Studio URL.
* Confirm the correct Sanity project.
* Confirm the expected dataset where visible.
* Verify that the website deployment is online.
* Escalate to the SixthGear website administrator.

---

# Role guidance

Add a short section explaining:

* Access is based on the role assigned by the administrator.
* A read-only role allows viewing but not editing.
* A broader role may allow editing, publishing, or project administration.
* The administrator should grant only the access required for the user’s work.
* Do not document unsupported role names as guaranteed.
* Do not tell staff to share one administrator account.

Do not claim that the current Sanity plan includes a specific role unless verified externally.

---

# Security requirements

Never include:

* Actual passwords
* API tokens
* Recovery codes
* Private keys
* Full personal email addresses in screenshots
* Unrelated inbox messages
* Customer information
* Billing details
* Project tokens
* Sanity secrets
* Private environment values

The reference screenshots must not be copied directly because they expose personal email accounts, inbox messages, account choices, and project identifiers.

Use placeholders only in this implementation.

---

# Internal screenshot plan

Create or update:

```text
_internal/image-capture-guide.md
```

Add an entry for every screenshot required by this page.

For every image, document:

```text
Target page
Final filename
Where to capture it
What to show
What to hide
Recommended crop
Caption
Alt text
```

Keep `_internal/` excluded from publication through `.mintignore`.

---

# Links

Include only these verified external links:

```text
https://mail.google.com/
https://www.sanity.io/manage
```

Add the SixthGear CMS production link only after verification.

Do not use the personal Gmail link from the source guide.

---

# Quality requirements

The finished page must:

* Read like a complete walkthrough
* Be understandable without verbal assistance
* Explain both the action and expected result
* Use appropriate Mintlify components
* Avoid long walls of text
* Include all placeholder image locations
* Cover both successful access and common failures
* Separate invited-user and administrator responsibilities
* Avoid claims unsupported by repository or dashboard evidence
* Sound human and practical

---

# Validation

Run from the Mintlify project:

```powershell
mint validate
mint broken-links --check-anchors --check-redirects
mint a11y
mint dev --port 3333
```

Verify:

* The page appears under **SixthGear CMS**.
* The page title and description are correct.
* All Mintlify components compile.
* Every placeholder image renders.
* Every image has descriptive alt text.
* All captions are unique.
* Gmail and Sanity Manage links work.
* No unverified CMS production URL is published.
* No secrets or personal information appear.
* No unrelated documentation page was modified.
* No storefront or Sanity application file was modified.

---

# Completion report

Return:

## Files changed

List every created or modified documentation file.

## Page structure

Summarize the implemented sections and components.

## Placeholder images

List every placeholder location and final intended filename.

## Links

List the links included and identify any CMS URL still requiring verification.

## Security review

Confirm that no personal information, passwords, tokens, recovery codes, or private identifiers were added.

## Validation results

Report:

* `mint validate`
* Broken links
* Accessibility
* Local preview
* Missing assets

## Application integrity

Confirm that no storefront or Sanity application source files were modified.

```

This prompt follows the requested production-prompt structure: explicit role, context, scope, output, constraints, and verification requirements. :contentReference[oaicite:2]{index=2}
```

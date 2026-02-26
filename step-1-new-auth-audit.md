# Step 1 — Auth Audit Report

This document contains the findings from the Step 1 audit for the new authentication and account experience improvements.

## 1. Register Form Component

**File:** `src/modules/account/components/register/index.tsx`

**Current State:**

- Has `firstName`, `lastName`, `email`, `phone` fields.
- Has `password` field with show/hide toggle. **(To be removed)**
- Has `confirm_password` field. **(To be removed)**
- Has `showPassword` state. **(To be removed)**
- Has `handleSubmit` with password validation logic (min 8 chars, match confirm). **(To be removed)**
- Uses `useActionState(signup, null)`.
- Redirects to `/register/success` when `message === null`.
- Uses `SubmitButton` from `@modules/common/components/submit-button`.
- Has Google SSO button placeholder and divider.

## 2. Register Success Page

**File:** `src/app/[countryCode]/(auth)/register/success/page.tsx`

**Current State:**

- Uses **orange** accent: `bg-orange-50`, `text-orange-600`. **(Must become black/white/gray)**
- SVG mail icon inline. **(Should use `Mail` from `lucide-react`)**
- Headline: "Check your inbox".
- Body copy about activation.
- "Go to Sign In" button (bg-black).
- "Return to homepage" link.
- Uses `rounded-xl` throughout. _(Prompt notes `rounded-lg` might be needed for consistency)_
- Lacks a subtle card border or constrained centered card layout (currently just vertically/horizontally centered text).

## 3. Forgot Password Template

**File:** `src/modules/account/templates/forgot-password-template.tsx`

**Current State:**

- Uses `useActionState(requestPasswordReset, null)`.
- Success state uses **green** accents: `bg-green-50`, `border-green-200`, `text-green-600`. **(Must become black/white/gray to match the new register success page)**
- Uses a text checkmark `✓` as the success icon. **(Should use `Mail` from `lucide-react` in black)**
- Form state uses the shared `SubmitButton`.

## 4. `requestPasswordReset()` Server Action

**File:** `src/lib/data/customer.ts`

**Current State:**

```ts
export async function requestPasswordReset(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string
  if (!email) return "Email is required."

  const allowed = await authRateLimit.check(5)
  if (!allowed) return "Too many requests..."

  try {
    await shopifyCustomerRecover(email)
    // Always report success — never reveal if email exists
    return "success"
  } catch (error) {
    console.error("[requestPasswordReset] Error:", error)
    return "Something went wrong. Please try again."
  }
}
```

**Observation:** The function calls `shopifyCustomerRecover(email)` and swallows the result. There is no diagnostic logging. We cannot tell from the UI if the GraphQL mutation actually succeeded or failed silently (e.g., due to unverified sender email in Shopify Admin). Diagnostic logging is required before fixing.

## 5. SubmitButton Component

**File:** `src/modules/common/components/submit-button/index.tsx`

**Current State:**

```tsx
const { pending } = useFormStatus()
// ...
{
  pending ? "Saving…" : children
}
```

- Shows text "Saving…" during the pending state. **(Must use `<Loader2 />` spinner from `lucide-react`)**
- Uses `disabled={pending}` correctly.
- This component is shared across all auth forms, so updating it here will propagate to Login, Register, Forgot Password, Reset Password, Activate Account, and Profile forms.

## 6. Skeleton Components

**Existing Directory:** `src/modules/skeletons/` contains 17 skeleton components/templates.

- **Current State:**
  - `lucide-react` is installed (`^0.468.0`).
  - Account pages currently **lack** proper `loading.tsx` files.
  - `@dashboard/loading.tsx` exists but only renders a generic `<Spinner />`, not a structural skeleton.
  - `@dashboard/orders/loading.tsx`, `@dashboard/addresses/loading.tsx`, and `@dashboard/profile/loading.tsx` do not exist.

## Additional Observations

- **`customerCreate` Mutation TypeScript Type:** In `src/lib/shopify/mutations/customer.ts`, it currently requires `password: string`. This needs to be made optional since we are removing the password field from the register form.
- **`signup()` Server Action:** Still reads `password` from `formData` and passes it to `shopifyCustomerCreate`. This needs to be stripped out.

---

## Action Plan

1. **Improvement 1:** Remove password fields from `register/index.tsx`, update `signup()` in `customer.ts`, and update the `customerCreate` mutation type.
2. **Improvement 2:** Update `SubmitButton` to use the `<Loader2 />` spinner.
3. **Improvement 6 (Diagnostics):** Add `console.log` to `requestPasswordReset` to diagnose the silent failure of account recovery emails.
4. **Improvement 6 (Fix):** Apply the fix based on diagnostic findings.
5. **Improvement 4:** Revamp `register/success/page.tsx` to the strict black/white/gray minimal card layout.
6. **Improvement 5:** Update `forgot-password-template.tsx`'s success state to exactly match the new register success layout.
7. **Improvement 3:** Ensure `shadcn/ui` skeleton is available, then create structural `loading.tsx` files for the 5 specified account routes.

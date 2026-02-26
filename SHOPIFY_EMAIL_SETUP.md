# Shopify Email Template — Custom Password Reset URL

## Why This Is Needed

When a customer clicks "Forgot Password" on your storefront, Shopify sends a
password reset email. By default, that email links to Shopify's own hosted
reset page (e.g. `your-store.myshopify.com/account/reset/...`). Since we want
the customer to stay on **your custom domain** (sixthgear storefront), we need
to update the Shopify email template to point to your Next.js reset-password
page instead.

---

## Step-by-Step Instructions

### 1. Open Shopify Admin → Settings → Notifications

Navigate to:

```
https://admin.shopify.com/store/YOUR_STORE/settings/notifications
```

### 2. Find "Customer Account Password Reset"

Under **Customer notifications**, find and click on:
**"Customer account password reset"**

### 3. Edit the Email Template

In the template editor, find the line that generates the reset password link.
It will look something like:

```liquid
<a href="{{ customer.reset_password_url }}" ...>Reset your password</a>
```

Replace it with:

```liquid
{% assign reset_url_encoded = customer.reset_password_url | url_encode %}
<a href="https://YOUR_DOMAIN.com/ph/reset-password?url={{ reset_url_encoded }}"
   class="button__text"
   style="...existing styles..."
>
  Reset your password
</a>
```

> **Replace `YOUR_DOMAIN.com`** with your actual storefront domain.  
> **Replace `/ph/`** with your default country code if different.

### 4. How It Works

1. Shopify generates a unique reset URL like:
   `https://your-store.myshopify.com/account/reset/1234/abcdef`
2. We URL-encode that entire URL and pass it as a `?url=` parameter
3. Your storefront's `/reset-password` page reads the `?url=` search param
4. The `resetPassword` Server Action calls `customerResetByUrl` with that URL
5. Shopify validates the token, resets the password, and returns a new access token

### 5. Save and Preview

- Click **Save** in the template editor
- Click **Preview** to verify the link renders correctly
- Send a **test email** to yourself to confirm the full flow works

---

## Optional: Account Activation Email

If you enable "Account activation" emails (for invite-only registration),
apply the same pattern to the **"Customer account invite"** template:

```liquid
{% assign activation_url_encoded = customer.account_activation_url | url_encode %}
<a href="https://YOUR_DOMAIN.com/ph/activate?url={{ activation_url_encoded }}">
  Activate your account
</a>
```

> Note: The `/activate` page is not yet implemented. This is a placeholder
> for future work.

---

## Verification Checklist

- [ ] Email template updated with custom storefront URL
- [ ] Test email received with correct link
- [ ] Clicking link opens your storefront's reset-password page
- [ ] Resetting password works end-to-end
- [ ] User is auto-logged in after successful reset

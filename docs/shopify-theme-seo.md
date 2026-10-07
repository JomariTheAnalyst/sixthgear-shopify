# Shopify Online Store theme: stop it competing with the headless site

**Why:** the Shopify Online Store theme (Horizon) is public on `checkout.sixthgearmoto.com`
(and `sixthgearmoto.myshopify.com`, which 301s there). Every product and collection is
served there with a self-referencing canonical, no `noindex`, and its own sitemap.
Google can treat those pages as the originals and fold `www.sixthgearmoto.com` into
them as duplicates.

**What this does**, on theme pages only:

1. `<meta name="robots" content="noindex,nofollow">`
2. `<link rel="canonical">` pointing at the matching `https://www.sixthgearmoto.com` URL
3. A JavaScript redirect for visitors to that same URL

It **does not run** on paths that start with `/cart`, `/checkouts`, `/checkout`,
`/account`, `/apps`, `/tools`, `/services` or `/policies`, so checkout, customer
login, account emails, app proxies and policies keep working.

| Theme URL | Canonical and redirect target |
|---|---|
| `/` | `https://www.sixthgearmoto.com/` |
| `/products/{handle}` (also `/collections/x/products/{handle}`) | `https://www.sixthgearmoto.com/products/{handle}` |
| `/collections/{handle}` | `https://www.sixthgearmoto.com/collections/{handle}` |
| `/collections/all` | `https://www.sixthgearmoto.com/store` |
| `/pages/contact` | `https://www.sixthgearmoto.com/contact` |
| `/pages/*` (any other page) | `https://www.sixthgearmoto.com/about` |
| `/blogs/*` | `https://www.sixthgearmoto.com/rider-stories` |
| `/search` | `https://www.sixthgearmoto.com/store` |
| anything else | `https://www.sixthgearmoto.com/` |

---

## Step 1: back up the theme

Shopify admin → **Online Store → Themes** → on the live theme (Horizon) click **⋯ → Duplicate**.
Edit the live theme; the copy is your rollback.

## Step 2: create the snippet

**⋯ → Edit code** → **Snippets** → **Add a new snippet** → name it `sg-headless-seo` →
paste this exactly and **Save**:

```liquid
{%- comment -%}
  Headless SEO guard. The public storefront is https://www.sixthgearmoto.com.
  Theme pages get noindex + a canonical to the matching www URL + a JS redirect.
  Checkout, cart, account, apps, tools, services and policies are left alone.
{%- endcomment -%}
{%- liquid
  assign sg_www = 'https://www.sixthgearmoto.com'
  assign sg_path = request.path
  assign sg_skip = false
  assign sg_skip_prefixes = '/cart,/checkouts,/checkout,/account,/apps,/tools,/services,/policies' | split: ','

  for sg_prefix in sg_skip_prefixes
    assign sg_prefix_slash = sg_prefix | append: '/'
    assign sg_prefix_len = sg_prefix_slash.size
    assign sg_head = sg_path | slice: 0, sg_prefix_len
    if sg_path == sg_prefix or sg_head == sg_prefix_slash
      assign sg_skip = true
    endif
  endfor

  assign sg_target = sg_www | append: '/'
  case template.name
    when 'product'
      assign sg_target = sg_www | append: '/products/' | append: product.handle
    when 'collection'
      if collection.handle == 'all'
        assign sg_target = sg_www | append: '/store'
      else
        assign sg_target = sg_www | append: '/collections/' | append: collection.handle
      endif
    when 'page'
      if page.handle == 'contact'
        assign sg_target = sg_www | append: '/contact'
      else
        assign sg_target = sg_www | append: '/about'
      endif
    when 'blog' or 'article'
      assign sg_target = sg_www | append: '/rider-stories'
    when 'search'
      assign sg_target = sg_www | append: '/store'
  endcase
-%}
{%- unless sg_skip -%}
  <meta name="robots" content="noindex,nofollow">
  <link rel="canonical" href="{{ sg_target }}">
  <script>window.location.replace({{ sg_target | json }} + window.location.search);</script>
{%- endunless -%}
```

## Step 3: render it and remove the theme's own canonical

1. Open **Layout → `theme.liquid`**. Directly after the opening `<head>` tag, add:

   ```liquid
   {% render 'sg-headless-seo' %}
   ```

2. Find the theme's existing canonical tag. Use the code editor search (Ctrl/Cmd + Shift + F)
   for `canonical_url`. In Horizon it is usually in `snippets/meta-tags.liquid` or in
   `theme.liquid`, and looks like:

   ```liquid
   <link rel="canonical" href="{{ canonical_url }}">
   ```

   Two canonical tags on one page are a conflicting signal. Wrap the existing one so it
   only prints where the snippet is skipped:

   ```liquid
   {%- liquid
     assign sg_keep_theme_canonical = false
     assign sg_first = request.path | split: '/' | slice: 1 | first
     if sg_first == 'cart' or sg_first == 'checkouts' or sg_first == 'checkout' or sg_first == 'account' or sg_first == 'apps' or sg_first == 'tools' or sg_first == 'services' or sg_first == 'policies'
       assign sg_keep_theme_canonical = true
     endif
   -%}
   {%- if sg_keep_theme_canonical -%}
     <link rel="canonical" href="{{ canonical_url }}">
   {%- endif -%}
   ```

3. **Save** both files.

> If the store ever uses Markets subfolders (e.g. `/en-us/products/x`), `request.path`
> starts with that locale and the skip list will not match. There are none today
> (single market, PH).

## Step 4: check in a private browser window (do all of these)

| Check | Expected |
|---|---|
| `https://checkout.sixthgearmoto.com/products/arai-rx-7x` | Lands on `https://www.sixthgearmoto.com/products/arai-rx-7x` |
| View source of that theme URL (`view-source:` before the redirect, or `curl`) | Contains `noindex,nofollow` and the www canonical |
| `https://checkout.sixthgearmoto.com/collections/helmet` | Lands on `https://www.sixthgearmoto.com/collections/helmet` |
| `https://checkout.sixthgearmoto.com/` | Lands on `https://www.sixthgearmoto.com/` |
| **Checkout:** on www, add a product to cart → Checkout | Shopify checkout opens on `checkout.sixthgearmoto.com/checkouts/...` and **does not redirect** |
| **Payment:** complete one test order with the Xendit method (or a 100% discount code) | Thank-you / order status page loads normally |
| **Customer login:** `https://checkout.sixthgearmoto.com/account/login` | Login page loads, no redirect |
| **Password reset / account activation email** (send one to yourself) | The link opens and works |
| `https://checkout.sixthgearmoto.com/policies/privacy-policy` | Loads, no redirect |
| `https://checkout.sixthgearmoto.com/cart` | Loads, no redirect |

Quick source check without a browser:

```bash
curl -s https://checkout.sixthgearmoto.com/products/arai-rx-7x | grep -iE 'noindex|rel="canonical"|location.replace'
curl -s https://checkout.sixthgearmoto.com/account/login | grep -ciE 'noindex'    # expect 0
```

**Rollback:** remove the `{% render 'sg-headless-seo' %}` line and restore the canonical tag,
or publish the duplicate theme from Step 1.

## Step 5: after it is live

- Do **not** add `Disallow` rules for the theme in `robots.txt.liquid` yet. Google must keep
  crawling those URLs to see the `noindex`.
- In Google Search Console, add `checkout.sixthgearmoto.com` (or use the Domain property for
  `sixthgearmoto.com`) and watch **Pages → Excluded by 'noindex' tag** grow as theme URLs drop out.
- Optional, once the theme URLs are gone from Google (weeks): password-protect the Online
  Store. Test checkout again first.

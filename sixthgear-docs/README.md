# SixthGear Docs

SixthGear Docs is the private internal manual for administering, maintaining, deploying, and recovering the SixthGear website.

## Local preview

Run these commands from this directory:

```powershell
mint validate
mint broken-links --check-anchors --check-redirects
mint a11y
mint dev --port 3333
```

The public page tree is defined in `docs.json`. Authoring notes under `_internal/` are excluded by `.mintignore`.

## Security

Do not add passwords, tokens, recovery codes, private keys, customer data, order data, payment information, or environment values. Store credentials in the approved password manager.

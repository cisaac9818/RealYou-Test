# RealYou – production email verification

These templates are for the hosted Supabase project `RealYou-App2` (`zjjctmwatmpkjjgzyqen`).
**They are not automatically installed by pushing to GitHub.** Apply in Supabase Dashboard →
Authentication → Email Templates:

- **Confirm signup**: subject `Your RealYou verification code`
- **Magic Link**: subject `Your RealYou sign-in code`

Both templates must contain `{{ .Token }}` so the customer receives a six-digit code to enter directly in RealYou.
The app already supports verifying an OTP at `/auth/v1/verify` without leaving the website.
Using a code avoids the broken `localhost:3000` redirect on mobile.

## Confirm signup – HTML body

```html
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="background:#f1f5f9;margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#111827">
  <div style="max-width:520px;margin:auto;background:#fff;border-radius:18px;padding:32px;border:1px solid #dbeafe">
    <div style="font-size:26px;font-weight:800;letter-spacing:-.5px;color:#312e81">RealYou<span style="color:#7c3aed">™</span></div>
    <div style="font-size:13px;color:#475569;margin-top:5px">Discover your RealYou Personality Snapshot</div>
    <h1 style="font-size:24px;margin:28px 0 10px">Verify your email</h1>
    <p style="font-size:16px;line-height:1.6">Enter this one-time code in RealYou to confirm your email address and restore your assessment or paid plan.</p>
    <div style="text-align:center;letter-spacing:8px;font-weight:800;font-size:32px;padding:18px 12px;background:#eef2ff;border-radius:12px;margin:22px 0;color:#312e81">{{ .Token }}</div>
    <p style="font-size:14px;line-height:1.6;color:#475569">Return to <a href="https://realyou.nmomediagrp.com/" style="color:#4338ca">realyou.nmomediagrp.com</a> and enter the code in the Restore Premium section. Do not purchase again.</p>
    <p style="font-size:12px;line-height:1.5;color:#64748b;border-top:1px solid #e2e8f0;padding-top:18px">If you did not request this code, you can ignore this message. This email is sent to protect your RealYou account.</p>
  </div>
</body>
</html>
```

## Magic link / one-time sign-in – HTML body

Use the same body above, or this shorter version:

```html
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="background:#f1f5f9;margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#111827">
  <div style="max-width:520px;margin:auto;background:#fff;border-radius:18px;padding:32px;border:1px solid #dbeafe">
    <div style="font-size:26px;font-weight:800;color:#312e81">RealYou™</div>
    <h1 style="font-size:24px;margin:24px 0 10px">Your RealYou sign-in code</h1>
    <p style="font-size:16px;line-height:1.6">Enter this code at <a href="https://realyou.nmomediagrp.com/" style="color:#4338ca">RealYou</a> to verify your email and restore your purchase.</p>
    <div style="text-align:center;letter-spacing:8px;font-weight:800;font-size:32px;padding:18px 12px;background:#eef2ff;border-radius:12px;margin:22px 0;color:#312e81">{{ .Token }}</div>
    <p style="font-size:12px;color:#64748b">Didn't request this? No action is needed.</p>
  </div>
</body>
</html>
```

## Essential Supabase settings

1. Authentication → URL Configuration → **Site URL**: `https://realyou.nmomediagrp.com/`
2. Add `https://realyou.nmomediagrp.com/**` to **Redirect URLs**.
3. Authentication → Email Templates → replace **Confirm signup** and **Magic Link** with branded code templates.
4. Authentication → SMTP Settings → configure **custom SMTP** with an address belonging to your business domain. Set Sender name to `RealYou`. Do not distribute SMTP passwords in GitHub.
5. Test on Android using a new account and on an existing paid account. Confirm no `localhost:3000` links, correct Sender name, code verification, and server-verified Premium entitlement.

**Important:** Supabase's built-in mail service is intended for testing, not production; without custom SMTP, general customer delivery may fail. Never allow a typed email alone to grant Premium.

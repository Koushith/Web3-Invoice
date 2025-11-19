# Email Setup Guide - DefInvoice

## Current Status: TEMPORARY FIX APPLIED ✅

Your production `.env` has been updated to use `onboarding@resend.dev` (Resend's test domain).
**This will work immediately** but emails will come from Resend's domain.

---

## Permanent Solution: Verify Your Domain

Since you own `definvoice.xyz`, here's how to set it up properly:

### Step 1: Add Domain to Resend

1. Go to https://resend.com/domains
2. Log in with your Resend account
3. Click **"Add Domain"**
4. Enter: `definvoice.xyz`

### Step 2: Add DNS Records

Resend will give you DNS records to add. Go to your domain registrar (Namecheap, GoDaddy, etc.) and add:

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

**DKIM Record:**
```
Type: TXT
Name: resend._domainkey
Value: [Resend will provide this - copy from dashboard]
```

**DMARC Record (Optional but recommended):**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:your-email@gmail.com
```

### Step 3: Verify in Resend

1. After adding DNS records, go back to Resend dashboard
2. Click **"Verify"** on your domain
3. Wait 5-10 minutes for DNS to propagate
4. Resend will confirm verification ✅

### Step 4: Update Your `.env`

Once verified, update `/server/.env`:

```bash
RESEND_FROM_EMAIL=noreply@definvoice.xyz
# or
RESEND_FROM_EMAIL=invoices@definvoice.xyz
# or
RESEND_FROM_EMAIL=hello@definvoice.xyz
```

### Step 5: Restart Your Server

```bash
# If running locally
npm run dev

# If deployed on Railway
# Push changes to GitHub, Railway will auto-deploy
git add server/.env
git commit -m "fix: update email sender domain"
git push
```

---

## Alternative: Use a Subdomain

If you want to keep your main domain separate:

1. Create subdomain: `mail.definvoice.xyz`
2. Verify `mail.definvoice.xyz` in Resend
3. Use: `RESEND_FROM_EMAIL=invoices@mail.definvoice.xyz`

---

## Important Notes

❌ **Cannot use:**
- `koushith97@gmail.com` (you don't own gmail.com)
- Any `@gmail.com`, `@yahoo.com`, `@outlook.com` addresses
- Any domain you don't own

✅ **Can use:**
- `definvoice.xyz` (you own this!)
- Any subdomain of `definvoice.xyz`
- Any other domain you own

---

## Testing

After setup, test by:
1. Creating an invoice in your app
2. Sending it to a customer
3. Check if email arrives from `noreply@definvoice.xyz`

---

## Troubleshooting

**DNS not propagating?**
- Wait 24 hours (usually takes 5-10 mins)
- Check DNS with: https://dnschecker.org

**Still getting errors?**
- Verify all 3 DNS records are added correctly
- Check Resend dashboard for verification status
- Make sure `.env` is updated and server restarted

**Need help?**
- Resend support: https://resend.com/support
- Check logs: `railway logs` or check Railway dashboard

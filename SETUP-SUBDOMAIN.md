# Setting Up book.robocode.dev Subdomain

This guide walks through configuring `book.robocode.dev` to serve The Book of Robocode from GitHub Pages.

---

## Prerequisites

- You own the domain `robocode.dev` via Namecheap
- The repository `robocode-dev/book-of-robocode` exists on GitHub
- You have admin access to both Namecheap and the GitHub repository

---

## Step 1: Configure Namecheap DNS

### 1.1 Log in to Namecheap

1. Go to [namecheap.com](https://www.namecheap.com/) and sign in.
2. Navigate to **Dashboard** → **Domain List**.
3. Find `robocode.dev` and click **Manage**.

### 1.2 Add CNAME Record for Subdomain

1. Click the **Advanced DNS** tab.
2. In the **Host Records** section, click **Add New Record**.
3. Configure the new record:

   | Field | Value |
   |-------|-------|
   | **Type** | `CNAME Record` |
   | **Host** | `book` |
   | **Value** | `robocode-dev.github.io` |
   | **TTL** | `Automatic` (or 30 min) |

4. Click the **checkmark** (✓) to save.

### 1.3 Verify DNS (Optional but Recommended)

After saving, wait 5–30 minutes for DNS propagation. You can verify with:

```powershell
nslookup book.robocode.dev
```

Expected output should show `robocode-dev.github.io` as the canonical name.

---

## Step 2: Configure GitHub Repository

### 2.1 Verify CNAME File Exists

The file `book/public/CNAME` should contain exactly:

```
book.robocode.dev
```

> ✅ This file already exists in your repository. No action needed.

### 2.2 Configure GitHub Pages Settings

1. Go to your repository: [github.com/robocode-dev/book-of-robocode](https://github.com/robocode-dev/book-of-robocode)
2. Click **Settings** (gear icon in the top menu).
3. In the left sidebar, click **Pages** (under "Code and automation").
4. Under **Build and deployment**:
   - **Source**: Select `GitHub Actions`
5. Under **Custom domain**:
   - Enter: `book.robocode.dev`
   - Click **Save**
6. Wait for DNS check to complete (GitHub will verify the CNAME record).
7. Once verified, check the box: **☑ Enforce HTTPS**

> ⚠️ **Note**: The "Enforce HTTPS" option will only appear after GitHub successfully provisions an SSL certificate. 
> This can take up to 24 hours after DNS verification.

### 2.3 Verify Deployment Workflow

The existing `.github/workflows/deploy.yml` is already configured correctly. It will:
- Build the VitePress site on push to `main`
- Deploy to GitHub Pages
- The CNAME file in `book/public/` ensures the custom domain is preserved

---

## Step 3: Update Repository References

After the subdomain is live, update these files:

### 3.1 README.md

Change the live site URL from:
```markdown
🔗 **Live Site**: https://robocode-dev.github.io/robocoding/
```

To:
```markdown
🔗 **Live Site**: https://book.robocode.dev/
```

### 3.2 Verify Social Links

In `book/.vitepress/config.js`, the GitHub link should point to:
```javascript
{ icon: 'github', link: 'https://github.com/robocode-dev/book-of-robocode' }
```

> ✅ This is already correct.

---

## Step 4: Verification Checklist

After completing all steps, verify:

- [ ] DNS propagated: `nslookup book.robocode.dev` returns `robocode-dev.github.io`
- [ ] GitHub Pages shows custom domain as verified (green checkmark)
- [ ] HTTPS is enforced in GitHub Pages settings
- [ ] Site loads at: https://book.robocode.dev/
- [ ] HTTP redirects to HTTPS: http://book.robocode.dev/ → https://book.robocode.dev/
- [ ] README.md updated with new URL

---

## Troubleshooting

### DNS Not Propagating

- Wait up to 48 hours (rare, usually 5–30 minutes)
- Clear local DNS cache: `ipconfig /flushdns` (Windows)
- Try a different DNS checker: [dnschecker.org](https://dnschecker.org/)

### GitHub Shows "DNS Check Unsuccessful"

- Verify the CNAME record value is exactly `robocode-dev.github.io` (no trailing dot)
- Ensure no conflicting A records exist for `book` subdomain
- Wait 10–15 minutes and refresh the GitHub Pages settings page

### HTTPS Certificate Not Ready

- GitHub uses Let's Encrypt and provisions certificates automatically
- Can take up to 24 hours after DNS verification
- Ensure "Enforce HTTPS" is unchecked until certificate is ready, then enable it

### 404 Errors After Deployment

- Verify the CNAME file exists at `book/public/CNAME`
- Check that the build output includes the CNAME file
- Verify the deployment workflow completed successfully in Actions tab

---

## Future: Linking from Tank Royale Documentation

When ready to link from `robocode.dev` (Tank Royale docs) to the book:

1. In the Tank Royale repository (`robocode-dev/tank-royale`), edit the documentation.
2. Add links to `https://book.robocode.dev/` where appropriate.
3. Example navigation link:
   ```markdown
   [The Book of Robocode](https://book.robocode.dev/) — Comprehensive guide to bot development
   ```

---

## Summary of Changes Made

| Location | Change |
|----------|--------|
| Namecheap DNS | Add CNAME record: `book` → `robocode-dev.github.io` |
| GitHub Pages Settings | Set custom domain to `book.robocode.dev`, enforce HTTPS |
| `book/public/CNAME` | Already contains `book.robocode.dev` ✅ |
| `README.md` | Update live site URL to `https://book.robocode.dev/` |

---

*Last updated: January 2026*

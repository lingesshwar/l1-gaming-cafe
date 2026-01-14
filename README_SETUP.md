# L1 Gaming Cafe - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email (.env file)
Make sure your `.env` file has all required values:
- SMTP_HOST
- SMTP_PORT  
- SMTP_USER
- SMTP_PASS
- STAFF_EMAIL

### 3. Start the Server
**Option A:** Double-click `START_SERVER.bat`

**Option B:** Run in terminal:
```bash
npm start
```

You should see: `[L1] Backend listening on http://localhost:4000`

### 4. Open Your Website
**IMPORTANT:** Open in browser:
```
http://localhost:4000/index.html
```

**DO NOT** open `index.html` directly (file://) - it won't work!

---

## Troubleshooting "Can't reach booking server" Error

### Check 1: Is the server running?
- Look for the message: `[L1] Backend listening on http://localhost:4000`
- If you don't see it, the server isn't running

### Check 2: Check for errors in terminal
- Look for red error messages
- Common issues:
  - Missing `.env` file
  - Wrong email credentials
  - Port 4000 already in use

### Check 3: Are you opening the right URL?
- ✅ CORRECT: `http://localhost:4000/index.html`
- ❌ WRONG: Opening `index.html` file directly

### Check 4: Test the server
Open in browser: `http://localhost:4000/health`
- Should show: `{"ok":true,"message":"L1 Gaming Cafe backend up"}`

---

## Gmail Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Create password for "Mail"
   - Use that password (not your regular password) in `.env`

---

## Need Help?
- Check terminal for error messages
- Make sure Node.js is installed: `node --version`
- Make sure all npm packages are installed: `npm install`

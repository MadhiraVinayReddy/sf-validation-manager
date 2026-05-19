# SF Validation Manager
### CloudVandana ASE Assignment — React + Salesforce Tooling API

A full-stack web application to manage Salesforce Account validation rules — fetch, toggle, and deploy changes directly from the browser using OAuth 2.0 and the Salesforce Tooling API.

---

## Live Demo
🌐 **Frontend**: https://jazzy-donut-517471.netlify.app
⚙️ **Backend API**: https://sf-validation-manager-hmd5.onrender.com

---

## GitHub Repository
https://github.com/MadhiraVinayReddy/sf-validation-manager

---

## Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Login button to connect to any Salesforce org | ✅ |
| 2 | Works with Production and Sandbox orgs | ✅ |
| 3 | Fetch all Account validation rules via Tooling API | ✅ |
| 4 | Display rules with Active/Inactive status | ✅ |
| 5 | Toggle individual rules on/off | ✅ |
| 6 | Enable All / Disable All bulk actions | ✅ |
| 7 | Deploy changes to Salesforce with confirmation | ✅ |
| 8 | Deployed online | ✅ |

---

## Tech Stack

- **Frontend**: React 18, CSS3 (custom)
- **Backend**: Node.js + Express (API proxy server)
- **Salesforce APIs**: OAuth 2.0 Implicit Flow, Tooling API v59.0
- **Deployment**: Netlify (frontend) + Render (backend)

---

## How to Use the Live App

1. Go to https://jazzy-donut-517471.netlify.app
2. Create a Connected App in your Salesforce org:
   - Go to Setup → App Manager → New Connected App
   - Enable OAuth Settings
   - Add Callback URL: `https://jazzy-donut-517471.netlify.app/oauth/callback`
   - Add OAuth Scope: `Manage user data via APIs (api)`
   - Save and get your Consumer Key
3. Enter your **Consumer Key** in the app
4. Select **Production** or **Sandbox**
5. Click **Log in with Salesforce**
6. Authorize the app
7. Click **Get Validation Rules**
8. Toggle rules on/off
9. Click **Deploy** to push changes to Salesforce

---

## Architecture

```
Browser (React App - Netlify)
    │
    │ 1. User enters Consumer Key + selects org type
    │ 2. Redirect to Salesforce OAuth
    ▼
Salesforce OAuth (login.salesforce.com or test.salesforce.com)
    │
    │ 3. Access token returned in URL hash
    ▼
React App
    │
    │ 4. Calls backend API proxy (Render)
    ▼
Express Backend (Render)
    │
    │ 5. Proxies requests to Salesforce Tooling API
    ▼
Salesforce Tooling API
```

---

## Salesforce Setup (for your own org)

### Step 1: Create a Developer Org
1. Go to https://developer.salesforce.com/signup
2. Fill in details and sign up
3. Verify your email and log in

### Step 2: Create 5 Validation Rules on Account Object
Go to Setup → Object Manager → Account → Validation Rules → New

**Rule 1: Account_Name_Required**
- Formula: `ISBLANK(Name)`
- Error: `Account Name cannot be blank.`

**Rule 2: Phone_Format_Validation**
- Formula: `NOT(ISBLANK(Phone)) && NOT(REGEX(Phone, "^[0-9\\-\\+\\(\\)\\s]{7,15}$"))`
- Error: `Phone number must be 7-15 digits.`

**Rule 3: Website_URL_Validation**
- Formula: `NOT(ISBLANK(Website)) && NOT(BEGINS(Website, "http://") || BEGINS(Website, "https://"))`
- Error: `Website must start with http:// or https://`

**Rule 4: Annual_Revenue_Positive**
- Formula: `NOT(ISBLANK(AnnualRevenue)) && AnnualRevenue < 0`
- Error: `Annual Revenue cannot be negative.`

**Rule 5: Billing_Country_Required_For_Industry**
- Formula: `AND(NOT(ISPICKVAL(Industry, "")), ISBLANK(BillingCountry))`
- Error: `Billing Country is required when Industry is specified.`

### Step 3: Create a Connected App
1. Setup → App Manager → New Connected App
2. Enable OAuth Settings
3. Callback URL: `https://jazzy-donut-517471.netlify.app/oauth/callback`
4. OAuth Scope: `Manage user data via APIs (api)`
5. Save → get Consumer Key

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone the project
```bash
git clone https://github.com/MadhiraVinayReddy/sf-validation-manager.git
cd sf-validation-manager
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```
SF_CLIENT_SECRET=your_consumer_secret
SF_LOGIN_URL=https://login.salesforce.com
PORT=5000
NODE_ENV=development
```

### 5. Start Backend Server
```bash
cd server
node index.js
# Runs on http://localhost:5000
```

### 6. Start React Frontend (new terminal)
```bash
set PORT=3001 && npm start
# Runs on http://localhost:3001
```

### 7. Test the App
1. Open `http://localhost:3001`
2. Enter your Consumer Key
3. Select org type
4. Click Log in with Salesforce
5. Get Validation Rules → Toggle → Deploy

---

## Deployment

- **Frontend**: Netlify — https://jazzy-donut-517471.netlify.app
- **Backend**: Render — https://sf-validation-manager-hmd5.onrender.com

---

## Project Structure

```
sf-validation-manager/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # OAuth flow, session management
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── components/
│       ├── LoginPage.js    # Login with Consumer Key input
│       ├── LoginPage.css
│       ├── Dashboard.js    # Rules management
│       ├── Dashboard.css
│       ├── ValidationRuleCard.js
│       ├── ValidationRuleCard.css
│       ├── DeployModal.js
│       └── DeployModal.css
├── server/
│   ├── index.js            # Express API proxy
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Submission Checklist

- [x] Salesforce Developer Org created
- [x] 5 Account Validation Rules created
- [x] Connected App configured with OAuth 2.0
- [x] Works with any Salesforce org
- [x] Login button with Consumer Key input
- [x] Fetch all validation rules via Tooling API
- [x] Display rules with Active/Inactive state
- [x] Toggle individual rules
- [x] Enable All / Disable All
- [x] Deploy changes to Salesforce
- [x] App deployed online
- [x] Repository link shared

---

## Author
Madhira Vinay Kumar Reddy
📧 madhiravinaykumarreddy@gmail.com
📱 +91 8978225860

Built for CloudVandana ASE Assignment 2026
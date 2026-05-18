# SF Validation Manager
### CloudVandana ASE Assignment — React + Salesforce Tooling API

A full-stack web application to manage Salesforce Account validation rules — fetch, toggle, and deploy changes directly from the browser using OAuth 2.0 and the Salesforce Tooling API.

---

## Live Demo

🌐 Frontend: https://jazzy-donut-517471.netlify.app  
⚙️ Backend API: https://sf-validation-manager-hmd5.onrender.com

---

## GitHub Repository

https://github.com/MadhiraVinayReddy/sf-validation-manager

---

## Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Login button to connect to Salesforce via OAuth 2.0 | ✅ |
| 2 | Fetch all Account validation rules via Tooling API | ✅ |
| 3 | Display rules with Active/Inactive status | ✅ |
| 4 | Toggle individual rules on/off | ✅ |
| 5 | Enable All / Disable All bulk actions | ✅ |
| 6 | Deploy changes to Salesforce with confirmation modal | ✅ |
| 7 | Pending change tracking before deploy | ✅ |
| 8 | Deployed online | ✅ |

---

## Tech Stack

- **Frontend**: React 18, CSS3 (custom, no UI library)
- **Backend**: Node.js + Express (OAuth proxy server)
- **Salesforce APIs**: OAuth 2.0 Implicit Flow, Tooling API v59.0
- **Deployment**: Netlify (frontend) + Render (backend)

---

## Architecture

```text
Browser (React App - Netlify)
    │
    │ 1. Redirect to Salesforce for login (OAuth Implicit Flow)
    ▼
Salesforce OAuth
    │
    │ 2. Access token returned in URL hash
    ▼
React App
    │
    │ 3. Calls backend API proxy (Render)
    ▼
Express Backend (Render)
    │
    │ 4. Proxies requests to Salesforce Tooling API
    ▼
Salesforce Tooling API
```

---

## Part 1 — Salesforce Setup

### Step 1: Create a Developer Org
1. Go to https://developer.salesforce.com/signup
2. Fill in details and sign up
3. Verify your email and log in

### Step 2: Create Validation Rules on Account Object

1. Go to **Setup** (gear icon → Setup)
2. In the Quick Find box, type **Object Manager**
3. Click **Account** → **Validation Rules** → **New**

Create these 5 validation rules:

**Rule 1: Account_Name_Required**
- Rule Name: `Account_Name_Required`
- Error Condition Formula: `ISBLANK(Name)`
- Error Message: `Account Name cannot be blank.`
- Description: `Ensures Account Name is always provided`

**Rule 2: Phone_Format_Validation**
- Rule Name: `Phone_Format_Validation`
- Error Condition Formula: `NOT(REGEX(Phone, "^[0-9\\-\\+\\(\\)\\s]{7,15}$"))`
- Error Message: `Phone number must be 7-15 digits (numbers, dashes, parentheses allowed).`
- Description: `Validates phone number format`

**Rule 3: Website_URL_Validation**
- Rule Name: `Website_URL_Validation`
- Error Condition Formula: `NOT(ISBLANK(Website)) && NOT(BEGINS(Website, "http://") || BEGINS(Website, "https://"))`
- Error Message: `Website must start with http:// or https://`
- Description: `Ensures website URL has proper protocol`

**Rule 4: Annual_Revenue_Positive**
- Rule Name: `Annual_Revenue_Positive`
- Error Condition Formula: `NOT(ISBLANK(AnnualRevenue)) && AnnualRevenue < 0`
- Error Message: `Annual Revenue cannot be a negative value.`
- Description: `Validates Annual Revenue is non-negative`

**Rule 5: Billing_Country_Required_For_Industry**
- Rule Name: `Billing_Country_Required_For_Industry`
- Error Condition Formula: `NOT(ISBLANK(Industry)) && ISBLANK(BillingCountry)`
- Error Message: `Billing Country is required when Industry is specified.`
- Description: `Requires Billing Country when Industry is set`

### Step 3: Create a Connected App

1. In Setup, search **App Manager** → **New Connected App**
2. Fill in:
   - **Connected App Name**: `SF Validation Manager`
   - **API Name**: `SF_Validation_Manager`
   - **Contact Email**: your email
3. Under **API (Enable OAuth Settings)**:
   - ✅ Check **Enable OAuth Settings**
   - **Callback URL**: `http://localhost:3001/oauth/callback`
     *(Also add your production URL when deploying, e.g., `https://jazzy-donut-517471.netlify.app/oauth/callback`)*
   - **Selected OAuth Scopes**: Add:
     - `Access and manage your data (api)`
4. Click **Save** → **Continue**
5. Wait 2–10 minutes for the app to activate

### Step 4: Get Your Credentials
1. Go back to **App Manager** → find your app → **View**
2. Click **Manage Consumer Details**
3. Copy:
   - **Consumer Key** → this is your `SF_CLIENT_ID`

---

## Part 2 — Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone / Download the project

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

Edit `.env` with your Salesforce credentials:

```env
SF_CLIENT_ID=your_consumer_key
SF_CLIENT_SECRET=your_consumer_secret
SF_LOGIN_URL=https://your-org.salesforce.com

REACT_APP_SF_CLIENT_ID=your_consumer_key
REACT_APP_SF_REDIRECT_URI=http://localhost:3001/oauth/callback
REACT_APP_SF_LOGIN_URL=https://your-org.salesforce.com

PORT=5000
NODE_ENV=development
```

### 5. Start the Backend Server

```bash
cd server
node index.js
```

Server runs on:

```text
http://localhost:5000
```

### 6. Start the React Frontend (new terminal)

```bash
set PORT=3001 && npm start
```

App runs on:

```text
http://localhost:3001
```

### 7. Test the App

1. Open `http://localhost:3001`
2. Click **"Log in with Salesforce"**
3. Authorize the app
4. Click **"Get Validation Rules"**
5. Toggle rules on/off
6. Click **Deploy** to push changes to Salesforce

---

## Part 3 — Deployment

### Frontend

Netlify  
https://jazzy-donut-517471.netlify.app

### Backend

Render  
https://sf-validation-manager-hmd5.onrender.com

---

## API Reference

### Tooling API — Query Validation Rules

```text
GET /services/data/v59.0/tooling/query/
  ?q=SELECT Id, ValidationName, Active, Description, ErrorMessage
     FROM ValidationRule
     WHERE EntityDefinition.QualifiedApiName = 'Account'
```

### Tooling API — Update (Activate/Deactivate) a Rule

```text
PATCH /services/data/v59.0/tooling/sobjects/ValidationRule/{Id}
Content-Type: application/json

{ "Metadata": { "active": true } }
```

---

## Project Structure

```text
sf-validation-manager/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── components/
│       ├── LoginPage.js
│       ├── Dashboard.js
│       ├── ValidationRuleCard.js
│       └── DeployModal.js
├── server/
│   ├── index.js
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
- [x] Connected App configured with OAuth
- [x] Login button → Salesforce OAuth 2.0 flow
- [x] Fetch all validation rules button
- [x] Display rules with Active/Inactive state
- [x] Toggle individual rules
- [x] Enable All / Disable All
- [x] Deploy button with confirmation
- [x] Changes deployed to Salesforce via Tooling API
- [x] App deployed online
- [x] Repository link shared

---

## Author

### Madhira Vinay Kumar Reddy

📧 madhiravinaykumarreddy@gmail.com  
📱 +91 8978225860

Built for CloudVandana ASE Assignment 2026
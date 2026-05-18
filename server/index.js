const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const SF_CONFIG = {
  clientId: process.env.SF_CLIENT_ID,
  clientSecret: process.env.SF_CLIENT_SECRET,
  loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com',
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/userinfo', async (req, res) => {
  const { instanceUrl, token } = req.query;
  try {
    const response = await fetch(`${instanceUrl}/services/oauth2/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

app.get('/api/rules', async (req, res) => {
  const { instanceUrl, token } = req.query;
  try {
    const query = encodeURIComponent(`SELECT Id, ValidationName, Active, Description, ErrorMessage, ErrorDisplayField FROM ValidationRule WHERE EntityDefinition.QualifiedApiName = 'Account' ORDER BY ValidationName ASC`);
    const url = `${instanceUrl}/services/data/v59.0/tooling/query/?q=${query}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rules/update', async (req, res) => {
  const { instanceUrl, token, ruleId, active } = req.body;
  try {
    const getUrl = `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${ruleId}`;
    const getResponse = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const ruleData = await getResponse.json();
    const metadata = { ...ruleData.Metadata, active: active };
    const patchResponse = await fetch(getUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Metadata: metadata }),
    });
    if (patchResponse.ok || patchResponse.status === 204) {
      res.json({ success: true });
    } else {
      const data = await patchResponse.json();
      res.status(400).json({ error: data[0]?.message || 'Update failed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/token', async (req, res) => {
  const { code, redirectUri, codeVerifier } = req.body;
  if (!code || !redirectUri) return res.status(400).json({ error: 'Missing code or redirectUri' });
  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: SF_CONFIG.clientId,
      client_secret: SF_CONFIG.clientSecret,
      redirect_uri: redirectUri,
      code,
    });
    if (codeVerifier) params.append('code_verifier', codeVerifier);
    const response = await fetch(`${SF_CONFIG.loginUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error_description || data.error });
    res.json({ access_token: data.access_token, instance_url: data.instance_url, refresh_token: data.refresh_token });
  } catch (err) {
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ SF Validation Manager server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Salesforce Login URL: ${SF_CONFIG.loginUrl}`);
});
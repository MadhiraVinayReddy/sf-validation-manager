import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

const REDIRECT_URI = 'https://jazzy-donut-517471.netlify.app/oauth/callback';

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false, accessToken: null,
    instanceUrl: null, userInfo: null, loading: true,
  });

  useEffect(() => {
    const fullUrl = window.location.href;
    console.log('Full URL on load:', fullUrl);

    if (fullUrl.includes('access_token')) {
      const hashPart = fullUrl.split('#')[1];
      const params = new URLSearchParams(hashPart);
      const accessToken = params.get('access_token');
      const instanceUrl = decodeURIComponent(params.get('instance_url') || '');
      console.log('Access token found:', accessToken ? 'YES' : 'NO');
      console.log('Instance URL:', instanceUrl);

      if (accessToken && instanceUrl) {
        window.history.replaceState({}, document.title, '/');
        const session = { accessToken, instanceUrl };
        localStorage.setItem('sf_session', JSON.stringify(session));
        fetchUserInfo(session);
        return;
      }
    }

    const stored = localStorage.getItem('sf_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        fetchUserInfo(session);
      } catch {
        localStorage.removeItem('sf_session');
        setAuthState(s => ({ ...s, loading: false }));
      }
    } else {
      setAuthState(s => ({ ...s, loading: false }));
    }
  }, []);

  const fetchUserInfo = async (session) => {
    try {
      console.log('Fetching user info for:', session.instanceUrl);
      const res = await fetch(
        `https://sf-validation-manager-hmd5.onrender.com/api/userinfo?instanceUrl=${encodeURIComponent(session.instanceUrl)}&token=${session.accessToken}`
      );
      console.log('UserInfo response status:', res.status);
      if (!res.ok) throw new Error('Invalid token');
      const userInfo = await res.json();
      console.log('UserInfo:', userInfo);
      setAuthState({
        isAuthenticated: true,
        accessToken: session.accessToken,
        instanceUrl: session.instanceUrl,
        userInfo,
        loading: false,
      });
    } catch (err) {
      console.error('fetchUserInfo error:', err);
      localStorage.removeItem('sf_session');
      setAuthState(s => ({ ...s, loading: false }));
    }
  };

  const handleLogin = (loginUrl, clientId) => {
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      scope: 'api',
    });
    window.location.href = `${loginUrl}/services/oauth2/authorize?${params}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('sf_session');
    setAuthState({
      isAuthenticated: false, accessToken: null,
      instanceUrl: null, userInfo: null, loading: false,
    });
  };

  if (authState.loading) return (
    <div className="app-loading">
      <div className="loading-spinner" />
      <p>Connecting to Salesforce...</p>
    </div>
  );

  return (
    <div className="app">
      {!authState.isAuthenticated
        ? <LoginPage onLogin={handleLogin} />
        : <Dashboard
            accessToken={authState.accessToken}
            instanceUrl={authState.instanceUrl}
            userInfo={authState.userInfo}
            onLogout={handleLogout}
          />
      }
    </div>
  );
}

export default App;
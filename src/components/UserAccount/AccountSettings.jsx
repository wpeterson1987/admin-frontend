// src/components/UserAccount/AccountSettings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      showProfile: true,
      shareActivity: false
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York'
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the user's settings from your API
        // For this example, we'll just use the default settings after a delay
        setTimeout(() => {
          // const response = await axios.get('/api/user/settings');
          // setSettings(response.data.settings);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load account settings');
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: checked
      }
    });
  };
  
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [name]: checked
      }
    });
  };
  
  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [name]: value
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // In a real app, you would save the settings to your API
      // await axios.put('/api/user/settings', settings);
      // For this example, we'll just show a success message after a delay
      setTimeout(() => {
        setLoading(false);
        alert('Settings saved successfully!');
      }, 500);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      setLoading(false);
    }
  };
  
  if (loading && !settings) {
    return <div>Loading settings...</div>;
  }
  
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Account Settings</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Notification Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h3>Notification Preferences</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="email"
                checked={settings.notifications.email}
                onChange={handleNotificationChange}
                style={{ marginRight: '10px' }}
              />
              Receive email notifications
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="push"
                checked={settings.notifications.push}
                onChange={handleNotificationChange}
                style={{ marginRight: '10px' }}
              />
              Receive push notifications
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="sms"
                checked={settings.notifications.sms}
                onChange={handleNotificationChange}
                style={{ marginRight: '10px' }}
              />
              Receive SMS notifications
            </label>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h3>Privacy Settings</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="showProfile"
                checked={settings.privacy.showProfile}
                onChange={handlePrivacyChange}
                style={{ marginRight: '10px' }}
              />
              Show my profile to family members
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="shareActivity"
                checked={settings.privacy.shareActivity}
                onChange={handlePrivacyChange}
                style={{ marginRight: '10px' }}
              />
              Share my activity with family members
            </label>
          </div>
        </div>
        
        {/* Preferences */}
        <div style={{ marginBottom: '30px' }}>
          <h3>Application Preferences</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="theme" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={settings.preferences.theme}
              onChange={handlePreferenceChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="language" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Language
            </label>
            <select
              id="language"
              name="language"
              value={settings.preferences.language}
              onChange={handlePreferenceChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="timezone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={settings.preferences.timezone}
              onChange={handlePreferenceChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
        </div>
        
        {/* Security Section - Password Change */}
        <div style={{ marginBottom: '30px' }}>
          <h3>Security</h3>
          
          <button
            type="button"
            style={{
              padding: '10px 20px',
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => alert('This would navigate to a password change form in a real app')}
          >
            Change Password
          </button>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
// src/components/UserAccount/AccountLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountNavigation from './AccountNavigation';

const AccountLayout = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>My Account</h1>
      
      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Sidebar Navigation */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <AccountNavigation />
        </div>
        
        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '20px'
          }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
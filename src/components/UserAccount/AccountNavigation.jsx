// src/components/UserAccount/AccountNavigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AccountNavigation = () => {
  const location = useLocation();
  
  // Navigation items with their paths and labels
  const navItems = [
    { path: '/account/profile', label: 'Profile' },
    { path: '/account/subscription', label: 'Subscription' },
    { path: '/account/payment-methods', label: 'Payment Methods' },
    { path: '/account/settings', label: 'Account Settings' },
    { path: '/account/notifications', label: 'Notifications' }
  ];
  
  return (
    <div className="account-navigation" style={{ 
      backgroundColor: '#fff', 
      borderRadius: '8px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '30px',
      padding: '15px'
    }}>
      <h2 style={{ margin: '0 0 15px 0', padding: '0 15px' }}>Account</h2>
      
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0, 
        display: 'flex',
        flexDirection: 'column'
      }}>
        {navItems.map((item, index) => (
          <li key={index} style={{ margin: '0' }}>
            <Link 
              to={item.path} 
              style={{ 
                display: 'block',
                padding: '12px 20px',
                color: location.pathname === item.path ? '#2196F3' : '#333',
                textDecoration: 'none',
                borderLeft: location.pathname === item.path ? '4px solid #2196F3' : '4px solid transparent',
                backgroundColor: location.pathname === item.path ? '#f0f7ff' : 'transparent',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountNavigation;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [affiliateStats, setAffiliateStats] = useState({
    links: 0,
    clicks: 0,
    conversions: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, this would fetch data from your API
    // For now, using mock data
    setTimeout(() => {
      setUserCount(124);
      setFamilyCount(35);
      setSubscriptionCount(28);
      setAffiliateStats({
        links: 87,
        clicks: 1243,
        conversions: 53,
        earnings: 782.45
      });
      setLoading(false);
    }, 800);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Logout
        </button>
      </div>
      
      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{userCount}</p>
              <p style={{ margin: '0', color: '#666' }}>Total registered users</p>
            </div>
            
            <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Families</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{familyCount}</p>
              <p style={{ margin: '0', color: '#666' }}>Active family units</p>
            </div>
            
            <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Subscriptions</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{subscriptionCount}</p>
              <p style={{ margin: '0', color: '#666' }}>Active subscriptions</p>
            </div>
            
            <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Affiliate Links</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{affiliateStats.links}</p>
              <p style={{ margin: '0', color: '#666' }}>Active tracking links</p>
            </div>
            
            <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Affiliate Earnings</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>${affiliateStats.earnings.toFixed(2)}</p>
              <p style={{ margin: '0', color: '#666' }}>Total commission earned</p>
            </div>
          </div>
          
          {/* Main Management Cards */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* User Management Card */}
            <div style={{ 
              flex: '1 1 300px', 
              padding: '20px', 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ margin: '0 0 15px 0' }}>User Management</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                Manage admin and regular users, reset passwords, and manage user permissions.
              </p>
              <Link 
                to="/users" 
                style={{ 
                  display: 'inline-block',
                  padding: '10px 15px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                Manage Users
              </Link>
            </div>
            
            {/* Family Management Card */}
            <div style={{ 
              flex: '1 1 300px', 
              padding: '20px', 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ margin: '0 0 15px 0' }}>Family Management</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                Manage family units, membership, and family settings.
              </p>
              <Link 
                to="/families" 
                style={{ 
                  display: 'inline-block',
                  padding: '10px 15px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                Manage Families
              </Link>
            </div>
            
            {/* Subscription Management Card */}
            <div style={{ 
              flex: '1 1 300px', 
              padding: '20px', 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ margin: '0 0 15px 0' }}>Subscription Management</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                Manage subscription plans, tiers, and payment processing. Test webhook integrations.
              </p>
              <Link 
                to="/subscriptions" 
                style={{ 
                  display: 'inline-block',
                  padding: '10px 15px',
                  backgroundColor: '#03A9F4',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                Manage Subscriptions
              </Link>
            </div>
            
            {/* Affiliate Marketing Card */}
            <div style={{ 
              flex: '1 1 300px', 
              padding: '20px', 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ margin: '0 0 15px 0' }}>Affiliate Marketing</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                Manage affiliate links, networks, view analytics, and track conversions.
              </p>
              <Link 
                to="/affiliate" 
                style={{ 
                  display: 'inline-block',
                  padding: '10px 15px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                Manage Affiliate Marketing
              </Link>
            </div>
            
            {/* System Settings Card */}
            <div style={{ 
              flex: '1 1 300px', 
              padding: '20px', 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ margin: '0 0 15px 0' }}>System Settings</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                Manage system configuration, backups, and maintenance tasks.
              </p>
              <Link 
                to="/settings" 
                style={{ 
                  display: 'inline-block',
                  padding: '10px 15px',
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                System Settings
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
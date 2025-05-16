// src/components/UserDashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  // const [familyData, setFamilyData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user data, family data, and subscription data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await axios.get('/api/user/profile');
        setUserData(userResponse.data.user);
        
        // Fetch family data
        const familyResponse = await axios.get('/api/user/family');
        setFamilyData(familyResponse.data.family);
        
        // Fetch subscription data
        try {
          const subscriptionResponse = await axios.get('/api/subscriptions/current');
          setSubscriptionData(subscriptionResponse.data.subscription);
        } catch (err) {
          console.log('No active subscription found');
          setSubscriptionData(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {userData ? userData.first_name : 'User'}</h1>
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
        <p>Loading your dashboard...</p>
      ) : (
        <>
          {/* Subscription Card */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginTop: 0 }}>Your Subscription</h2>
            
            {subscriptionData ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Current Plan:</p>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{subscriptionData.plan.name}</p>
                  </div>
                  
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Billing:</p>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                      ${subscriptionData.plan.price}/{subscriptionData.plan.billing_cycle === 'monthly' ? 'month' : 'year'}
                    </p>
                  </div>
                  
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Next Billing Date:</p>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                      {new Date(subscriptionData.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Link 
                  to="/account/subscription" 
                  style={{ 
                    display: 'inline-block',
                    padding: '10px 15px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                >
                  Manage Your Subscription
                </Link>
              </>
            ) : (
              <>
                <p>You don't have an active subscription.</p>
                <Link 
                  to="/account/subscription" 
                  style={{ 
                    display: 'inline-block',
                    padding: '10px 15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                >
                  Choose a Plan
                </Link>
              </>
            )}
          </div>
          
          {/* Feature Cards */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* App Feature Card 1 */}
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
              <h2 style={{ margin: '0 0 15px 0' }}>Tasks & Projects</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                Manage your tasks, projects, and workflows for both work and family life.
              </p>
              <Link 
                to="/tasks" 
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
                View Tasks
              </Link>
            </div>
            
            {/* App Feature Card 2 */}
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
              <h2 style={{ margin: '0 0 15px 0' }}>Family Calendar</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                View and manage your family calendar, events, and schedules.
              </p>
              <Link 
                to="/calendar" 
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
                View Calendar
              </Link>
            </div>
            
            {/* App Feature Card 3 */}
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
              <h2 style={{ margin: '0 0 15px 0' }}>Family Settings</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                Manage family members, permissions, and sharing settings.
              </p>
              <Link 
                to="/family-settings" 
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
                Family Settings
              </Link>
            </div>
            
            {/* App Feature Card 4 */}
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
              <h2 style={{ margin: '0 0 15px 0' }}>Account Settings</h2>
              <p style={{ margin: '0 0 20px 0', color: '#666', flex: 1 }}>
                Manage your profile, notifications, and account preferences.
              </p>
              <Link 
                to="/account/settings" 
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
                Account Settings
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
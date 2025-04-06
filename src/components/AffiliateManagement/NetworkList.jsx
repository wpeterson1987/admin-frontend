import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NetworkList = () => {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Using mock data to avoid API issues for now
    setTimeout(() => {
      setNetworks([
        {
          id: 1,
          name: 'amazon',
          display_name: 'Amazon Associates',
          affiliate_id: 'example-20',
          is_active: true,
          base_commission_rate: 3.5
        },
        {
          id: 2,
          name: 'walmart',
          display_name: 'Walmart Affiliate',
          affiliate_id: 'affiliate123',
          is_active: true,
          base_commission_rate: 4.0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Affiliate Networks</h1>
        <div>
          <Link 
            to="/"
            style={{ marginRight: '10px', padding: '8px 15px', backgroundColor: '#2196F3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Loading networks...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Affiliate ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Commission Rate</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {networks.map(network => (
              <tr key={network.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{network.display_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{network.affiliate_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: network.is_active ? '#4CAF50' : '#f44336',
                    color: 'white'
                  }}>
                    {network.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{network.base_commission_rate}%</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button 
                    style={{ padding: '4px 8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    style={{ padding: '4px 8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NetworkList;
// src/components/FamilyManagement/FamiliesLanding.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Add this import

const FamiliesLanding = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching families from admin endpoint');
        
        const response = await axios.get('/api/admin/families');
        console.log('Received families response:', response.data);
        
        setFamilies(response.data.families || []);
      } catch (error) {
        console.error('Error fetching families:', error);
        setError('Failed to load families. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFamilies();
  }, []);
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Family Management</h1>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading families...</p>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="m-0">All Families</h3>
                  <button className="btn btn-primary">Create New Family</button>
                </div>
                <div className="card-body">
                  {families && families.length === 0 ? (
                    <p>No families found.</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Family Name</th>
                          <th>Members</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {families && families.map(family => (
                          <tr key={family.id}>
                            <td>{family.family_name || family.name}</td>
                            <td>{family.Members ? family.Members.length : (family.memberCount || 0)}</td>
                            <td>
                              <Link to={`/families/${family.id}`} className="btn btn-sm btn-info me-2">
                                View
                              </Link>
                              <Link to={`/families/edit/${family.id}`} className="btn btn-sm btn-primary">
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h3 className="m-0">User Family Management</h3>
                </div>
                <div className="card-body">
                  <p>Select a user to manage their family associations:</p>
                  <Link to="/users" className="btn btn-primary">
                    Go to User Management
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FamiliesLanding;
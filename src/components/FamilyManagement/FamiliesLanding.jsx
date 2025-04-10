// src/components/FamilyManagement/FamiliesLanding.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FamiliesLanding = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch families data
    // Replace with your actual API call
    const fetchFamilies = async () => {
      try {
        // Mock data for now
        setTimeout(() => {
          setFamilies([
            { id: 1, name: 'Smith Family', memberCount: 4 },
            { id: 2, name: 'Johnson Family', memberCount: 3 },
            // Add more families as needed
          ]);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching families:', err);
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
      
      {loading ? (
        <div>Loading families...</div>
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
                  {families.length === 0 ? (
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
                        {families.map(family => (
                          <tr key={family.id}>
                            <td>{family.name}</td>
                            <td>{family.memberCount}</td>
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
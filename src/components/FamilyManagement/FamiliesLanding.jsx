// src/components/FamilyManagement/FamiliesLanding.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import axios from 'axios';

const FamiliesLanding = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // New state for create family modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFamily, setNewFamily] = useState({ family_name: '', subscription_tier_id: 'basic' });
  
  const navigate = useNavigate(); // For navigation
  
  useEffect(() => {
    fetchFamilies();
  }, []);
  
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
  
  // Function to handle opening the create family modal
  const handleCreateFamily = () => {
    setShowCreateModal(true);
  };
  
  // Function to submit new family
  const handleSubmitFamily = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/admin/families', newFamily);
      console.log('Family created:', response.data);
      
      // Close modal and refresh families
      setShowCreateModal(false);
      setNewFamily({ family_name: '', subscription_tier_id: 'basic' });
      fetchFamilies();
      
    } catch (error) {
      console.error('Error creating family:', error);
      setError('Failed to create family. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to view a family's details
  const handleViewFamily = (familyId) => {
    navigate(`/admin/families/${familyId}`);
  };
  
  // Function to edit a family
  const handleEditFamily = (familyId) => {
    navigate(`/admin/families/edit/${familyId}`);
  };
  
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
      
      {loading && !families.length ? (
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
                  <button 
                    className="btn btn-primary"
                    onClick={handleCreateFamily}
                  >
                    Create New Family
                  </button>
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
                          <th>Subscription</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {families && families.map(family => (
                          <tr key={family.id}>
                            <td>{family.family_name}</td>
                            <td>
                              {family.Members ? family.Members.length : 0} members
                            </td>
                            <td>
                              {family.SubscriptionTier ? family.SubscriptionTier.name : 
                               (family.subscription_tier_id || 'Basic')}
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-info me-2"
                                onClick={() => handleViewFamily(family.id)}
                              >
                                View
                              </button>
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEditFamily(family.id)}
                              >
                                Edit
                              </button>
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
      
      {/* Create Family Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Family</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitFamily}>
                  <div className="mb-3">
                    <label htmlFor="familyName" className="form-label">Family Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="familyName"
                      value={newFamily.family_name}
                      onChange={(e) => setNewFamily({...newFamily, family_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subscriptionTier" className="form-label">Subscription Tier</label>
                    <select
                      className="form-select"
                      id="subscriptionTier"
                      value={newFamily.subscription_tier_id}
                      onChange={(e) => setNewFamily({...newFamily, subscription_tier_id: e.target.value})}
                    >
                      <option value="basic">Basic</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Create Family
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </div>
  );
};

export default FamiliesLanding;
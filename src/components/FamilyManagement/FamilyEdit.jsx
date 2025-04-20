// src/components/FamilyManagement/FamilyEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const FamilyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [family, setFamily] = useState(null);
  const [formData, setFormData] = useState({
    family_name: '',
    subscription_tier_id: '',
    billing_email: ''
  });
  const [subscriptionTiers, setSubscriptionTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch family details
        const familyResponse = await axios.get(`/api/admin/families/${id}`);
        const familyData = familyResponse.data.family;
        setFamily(familyData);
        
        // Set initial form data
        setFormData({
          family_name: familyData.family_name || '',
          subscription_tier_id: familyData.subscription_tier_id || '',
          billing_email: familyData.billing_email || ''
        });
        
        // Fetch subscription tiers
        const tiersResponse = await axios.get('/api/admin/subscription/tiers');
        setSubscriptionTiers(tiersResponse.data.tiers || []);
        
      } catch (err) {
        console.error('Error fetching family data:', err);
        setError('Failed to load family data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`/api/admin/families/${id}`, formData);
      navigate(`/admin/families/${id}`);
    } catch (err) {
      console.error('Error updating family:', err);
      setError('Failed to update family: ' + (err.response?.data?.message || err.message));
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/admin/families/${id}`);
  };
  
  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading family data...</p>
    </div>
  );
  
  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
      <Link to={`/admin/families/${id}`} className="btn btn-primary">Back to Family Details</Link>
    </div>
  );
  
  if (!family) return (
    <div className="container py-5">
      <div className="alert alert-warning" role="alert">
        Family not found
      </div>
      <Link to="/families" className="btn btn-primary">Back to Families</Link>
    </div>
  );
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit Family: {family.family_name}</h1>
        <Link to="/families" className="btn btn-secondary">Back to Families</Link>
      </div>
      
      <div className="card">
        <div className="card-header bg-light">
          <h3 className="mb-0">Family Information</h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="family_name" className="form-label">Family Name</label>
              <input
                type="text"
                className="form-control"
                id="family_name"
                name="family_name"
                value={formData.family_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="subscription_tier_id" className="form-label">Subscription Tier</label>
              <select
                className="form-select"
                id="subscription_tier_id"
                name="subscription_tier_id"
                value={formData.subscription_tier_id}
                onChange={handleChange}
              >
                <option value="">None</option>
                {subscriptionTiers.map(tier => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="billing_email" className="form-label">Billing Email</label>
              <input
                type="email"
                className="form-control"
                id="billing_email"
                name="billing_email"
                value={formData.billing_email}
                onChange={handleChange}
                placeholder="example@domain.com"
              />
              <div className="form-text">
                Email address for subscription billing notifications
              </div>
            </div>
            
            <div className="d-flex justify-content-end mt-4">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header bg-light">
          <h3 className="mb-0">Advanced Settings</h3>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            <strong>Warning:</strong> These actions cannot be undone.
          </div>
          
          <button 
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete the family "${family.family_name}"? This action cannot be undone.`)) {
                // Handle delete action
                alert('Delete functionality will be implemented later');
              }
            }}
          >
            Delete Family
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyEdit;
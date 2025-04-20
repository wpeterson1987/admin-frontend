// src/components/FamilyManagement/FamilyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FamilyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFamily = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/families/${id}`);
        console.log('Family details:', response.data);
        setFamily(response.data.family);
      } catch (err) {
        console.error('Error fetching family details:', err);
        setError('Failed to load family details: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchFamily();
  }, [id]);
  
  const handleAddMember = () => {
    // We'll implement this later
    alert('Add member functionality will be implemented soon');
  };
  
  const handleEditMember = (memberId) => {
    // We'll implement this later
    alert(`Edit member ${memberId} functionality will be implemented soon`);
  };
  
  const handleRemoveMember = (memberId) => {
    // We'll implement this later
    alert(`Remove member ${memberId} functionality will be implemented soon`);
  };
  
  const handleEditFamily = () => {
    navigate(`/admin/families/edit/${id}`);
  };
  
  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading family details...</p>
    </div>
  );
  
  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
      <Link to="/families" className="btn btn-primary">Back to Families</Link>
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
        <h1>Family Details: {family.family_name}</h1>
        <div>
          <button onClick={handleEditFamily} className="btn btn-primary me-2">
            Edit Family
          </button>
          <Link to="/families" className="btn btn-secondary">
            Back to Families
          </Link>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h3 className="mb-0">Basic Information</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Family ID:</strong> {family.id}</p>
              <p><strong>Name:</strong> {family.family_name}</p>
              <p>
                <strong>Subscription:</strong> {
                  family.SubscriptionTier ? family.SubscriptionTier.name : 
                  (family.subscription_tier_id ? `Tier ${family.subscription_tier_id}` : 'None')
                }
              </p>
            </div>
            <div className="col-md-6">
              <p><strong>Created:</strong> {new Date(family.createdAt).toLocaleDateString()}</p>
              <p>
                <strong>Subscription Expiry:</strong> {
                  family.subscription_expiry ? 
                  new Date(family.subscription_expiry).toLocaleDateString() : 
                  'N/A'
                }
              </p>
              <p>
                <strong>Created By:</strong> {
                  family.Creator ? 
                  `${family.Creator.first_name} ${family.Creator.last_name}` : 
                  `User ID: ${family.created_by_user_id}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Family Members</h3>
          <button className="btn btn-success" onClick={handleAddMember}>
            Add Member
          </button>
        </div>
        <div className="card-body">
          {!family.Members || family.Members.length === 0 ? (
            <div className="alert alert-info">
              No members in this family yet
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Admin</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {family.Members.map(member => (
                    <tr key={member.id}>
                      <td>
                        {member.User ? 
                          `${member.User.first_name || ''} ${member.User.last_name || ''}`.trim() || 
                          member.User.email : 
                          'Unknown User'}
                      </td>
                      <td>{member.User?.email || 'N/A'}</td>
                      <td>
                        <span className={`badge bg-${getRoleBadgeColor(member.role)}`}>
                          {member.role || 'Member'}
                        </span>
                      </td>
                      <td>
                        {member.is_admin ? 
                          <span className="badge bg-success">Yes</span> : 
                          <span className="badge bg-secondary">No</span>}
                      </td>
                      <td>
                        {member.joined_at ? 
                          new Date(member.joined_at).toLocaleDateString() : 
                          new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEditMember(member.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get badge color based on role
function getRoleBadgeColor(role) {
  switch(role?.toLowerCase()) {
    case 'parent':
      return 'primary';
    case 'child':
      return 'info';
    case 'guardian':
      return 'warning';
    case 'admin':
      return 'danger';
    default:
      return 'secondary';
  }
}

export default FamilyDetails;
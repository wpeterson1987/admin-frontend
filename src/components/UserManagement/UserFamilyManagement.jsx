// src/components/UserManagement/UserFamilyManagement.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getUserFamilies, 
  addUserToFamily, 
  removeUserFromFamily, 
  updateUserFamilyRole, 
  getAvailableFamilies,
  createFamily 
} from '../../utils/api';
import './UserFamilyManagement.css';

const UserFamilyManagement = () => {
  const { id: userId } = useParams();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [roleSelection, setRoleSelection] = useState('member');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Create family form state
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [newFamilyData, setNewFamilyData] = useState({
    family_name: '',
    subscription_tier: 'basic'
  });

  useEffect(() => {
    fetchUserFamilies();
    fetchAvailableFamilies();
  }, [userId]);

  const fetchUserFamilies = async () => {
    try {
      setLoading(true);
      const response = await getUserFamilies(userId);
      setFamilies(response.families || []);
      setError('');
    } catch (err) {
      console.error('Error fetching user families:', err);
      setError('Failed to load family associations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableFamilies = async () => {
    try {
      const response = await getAvailableFamilies(userId);
      setAvailableFamilies(response.available_families || []);
    } catch (err) {
      console.error('Error fetching available families:', err);
    }
  };

  const handleAddToFamily = async (e) => {
    e.preventDefault();
    if (!selectedFamily) {
      setError('Please select a family');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      await addUserToFamily(selectedFamily, userId, {
        role: roleSelection,
        is_admin: isAdmin
      });
      
      setSuccess('User added to family successfully');
      fetchUserFamilies(); // Refresh the list
      fetchAvailableFamilies(); // Refresh available families
      setSelectedFamily('');
      setRoleSelection('member');
      setIsAdmin(false);
    } catch (err) {
      console.error('Error adding user to family:', err);
      setError('Failed to add user to family');
    }
  };

  const handleRemoveFromFamily = async (familyId) => {
    try {
      setError('');
      setSuccess('');
      
      await removeUserFromFamily(familyId, userId);
      
      setSuccess('User removed from family successfully');
      fetchUserFamilies(); // Refresh the list
      fetchAvailableFamilies(); // Refresh available families
    } catch (err) {
      console.error('Error removing user from family:', err);
      setError('Failed to remove user from family');
    }
  };

  const handleUpdateRole = async (familyId, role, adminStatus) => {
    try {
      setError('');
      setSuccess('');
      
      await updateUserFamilyRole(familyId, userId, {
        role,
        is_admin: adminStatus
      });
      
      setSuccess('User role updated successfully');
      fetchUserFamilies(); // Refresh the list
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };
  
  const handleCreateFamilyChange = (e) => {
    const { name, value } = e.target;
    setNewFamilyData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateFamily = async (e) => {
    e.preventDefault();
    
    if (!newFamilyData.family_name) {
      setError('Family name is required');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      // Create the family
      const response = await createFamily({
        ...newFamilyData,
        created_by_user_id: userId
      });
      
      // Add the user to the newly created family as an admin
      if (response && response.family && response.family.id) {
        await addUserToFamily(response.family.id, userId, {
          role: 'parent',
          is_admin: true
        });
      }
      
      setSuccess('Family created successfully and user added as admin');
      fetchUserFamilies(); // Refresh the list
      fetchAvailableFamilies(); // Refresh available families
      
      // Reset form
      setNewFamilyData({
        family_name: '',
        subscription_tier: 'basic'
      });
      setShowCreateFamily(false);
    } catch (err) {
      console.error('Error creating family:', err);
      setError('Failed to create family');
    }
  };

  if (loading && families.length === 0) {
    return <div className="loading">Loading family information...</div>;
  }

  return (
    <div className="user-family-management">
      <div className="card mb-4">
        <div className="card-header">
          <h3>Family Associations</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <h4>Current Families</h4>
          {families.length === 0 ? (
            <p className="text-muted">User is not a member of any families</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Family Name</th>
                  <th>Role</th>
                  <th>Admin Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {families.map(family => (
                  <tr key={family.id}>
                    <td>{family.name}</td>
                    <td>
                      <select 
                        value={family.role}
                        onChange={(e) => handleUpdateRole(family.id, e.target.value, family.isAdmin)}
                        className="form-control form-control-sm"
                      >
                        <option value="parent">Parent</option>
                        <option value="child">Child</option>
                        <option value="member">Member</option>
                      </select>
                    </td>
                    <td>
                      <div className="form-check">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          checked={family.isAdmin}
                          onChange={(e) => handleUpdateRole(family.id, family.role, e.target.checked)}
                        />
                        <label className="form-check-label">Admin</label>
                      </div>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleRemoveFromFamily(family.id)}
                        className="btn btn-sm btn-danger"
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {/* Create New Family Section */}
          <div className="create-family-section mt-4">
            <h4>Create New Family</h4>
            {showCreateFamily ? (
              <form onSubmit={handleCreateFamily} className="create-family-form">
                <div className="form-group">
                  <label htmlFor="family_name">Family Name</label>
                  <input
                    type="text"
                    id="family_name"
                    name="family_name"
                    value={newFamilyData.family_name}
                    onChange={handleCreateFamilyChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subscription_tier">Subscription Tier</label>
                  <select
                    id="subscription_tier"
                    name="subscription_tier"
                    value={newFamilyData.subscription_tier}
                    onChange={handleCreateFamilyChange}
                    className="form-control"
                  >
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowCreateFamily(false)}
                    className="btn btn-secondary mr-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Family
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCreateFamily(true)}
                className="btn btn-primary"
              >
                <i className="fas fa-plus"></i> Create New Family
              </button>
            )}
          </div>
          
          <h4 className="mt-4">Add to Existing Family</h4>
          {availableFamilies.length === 0 ? (
            <p className="text-muted">No available families to join</p>
          ) : (
            <form onSubmit={handleAddToFamily} className="add-family-form">
              <div className="form-group">
                <label htmlFor="familySelect">Select Family</label>
                <select 
                  id="familySelect"
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">-- Select Family --</option>
                  {availableFamilies.map(family => (
                    <option key={family.id} value={family.id}>{family.family_name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="roleSelect">Role</label>
                <select 
                  id="roleSelect"
                  value={roleSelection}
                  onChange={(e) => setRoleSelection(e.target.value)}
                  className="form-control"
                >
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="member">Member</option>
                </select>
              </div>
              
              <div className="form-group">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    id="adminCheck"
                    className="form-check-input" 
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="adminCheck">
                    Admin Privileges
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-plus"></i> Add to Family
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFamilyManagement;
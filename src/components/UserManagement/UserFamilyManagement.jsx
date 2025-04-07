// src/components/UserManagement/UserFamilyManagement.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserFamilies, addUserToFamily, removeUserFromFamily, updateUserFamilyRole } from '../../utils/api';
import './UserFamilyManagement.css';

const UserFamilyManagement = ({ user }) => {
  const { id: userId } = useParams();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [roleSelection, setRoleSelection] = useState('member');
  const [isAdmin, setIsAdmin] = useState(false);

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
      // This would be a new API endpoint to get families the user isn't already in
      // For now, we'll use mock data
      setAvailableFamilies([
        { id: 1, name: 'Smith Family' },
        { id: 2, name: 'Johnson Family' },
        { id: 3, name: 'Williams Family' }
      ]);
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
          
          <h4 className="mt-4">Add to Family</h4>
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
                  <option key={family.id} value={family.id}>{family.name}</option>
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
        </div>
      </div>
    </div>
  );
};

export default UserFamilyManagement;
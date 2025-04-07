// src/components/UserManagement/UserList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../utils/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data.users || []);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. ' + (err.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (userId) => {
    setDeleteConfirm(userId);
  };
  
  const handleDeleteConfirm = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsers(); // Refresh the list
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. ' + (err.response?.data?.message || ''));
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };
  
  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }
  
  return (
    <div className="user-list">
      <div className="header">
        <h1>User Management</h1>
        <Link to="/users/new" className="btn btn-primary">Add New User</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {users.length === 0 ? (
        <div className="no-data">No users found.</div>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="actions">
                  <Link to={`/users/${user.id}`} className="btn btn-sm btn-info">Edit</Link>
                  {user.id !== 1 && ( // Prevent deleting admin user
                    <button 
                      onClick={() => handleDeleteClick(user.id)} 
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  )}
                  
                  {deleteConfirm === user.id && (
                    <div className="delete-confirm">
                      <p>Are you sure?</p>
                      <button 
                        onClick={() => handleDeleteConfirm(user.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Yes
                      </button>
                      <button 
                        onClick={handleDeleteCancel}
                        className="btn btn-sm btn-secondary"
                      >
                        No
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
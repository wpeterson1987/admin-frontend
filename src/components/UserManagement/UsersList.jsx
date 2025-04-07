// src/components/UserManagement/UsersList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../utils/api';
import { logout } from '../../utils/auth';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. ' + (err.response?.data?.message || ''));
    }
  };
  
  return (
    <div className="users-list">
      <div className="header">
        <h1>User Management</h1>
        <div>
          <Link to="/" className="btn btn-secondary">Dashboard</Link>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
      </div>
      
      <div className="actions">
        <Link to="/users/new" className="btn btn-primary">Add New User</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/users/${user.id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
                    <Link to={`/users/${user.id}/password`} className="btn btn-sm btn-info">Password</Link>
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="btn btn-sm btn-danger"
                      disabled={user.id === 1} // Prevent deleting the first user (usually admin)
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
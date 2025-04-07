// src/components/UserManagement/UserList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../utils/api';
import './UserList.css'; // Make sure this CSS file exists

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
    <div className="user-list-container">
      <div className="page-header">
        <h1>User Management</h1>
        <Link to="/users/new" className="btn btn-primary">
          <i className="fas fa-plus"></i> Add New User
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {users.length === 0 && !loading ? (
        <div className="alert alert-info">No users found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/users/${user.id}`} className="btn btn-sm btn-info">
                        <i className="fas fa-edit"></i> Edit
                      </Link>
                      {user.id !== 1 && (
                        <button 
                          onClick={() => handleDeleteClick(user.id)} 
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      )}
                    </div>
                    
                    {deleteConfirm === user.id && (
                      <div className="delete-confirm mt-2">
                        <div className="alert alert-warning">
                          <p>Are you sure you want to delete this user?</p>
                          <div className="btn-group">
                            <button 
                              onClick={() => handleDeleteConfirm(user.id)}
                              className="btn btn-sm btn-danger"
                            >
                              <i className="fas fa-check"></i> Yes, Delete
                            </button>
                            <button 
                              onClick={handleDeleteCancel}
                              className="btn btn-sm btn-secondary"
                            >
                              <i className="fas fa-times"></i> Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
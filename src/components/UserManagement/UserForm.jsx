// src/components/UserManagement/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUser, createUser, updateUser } from '../../utils/api';
import ChangePasswordForm from './ChangePasswordForm';
import UserFamilyManagement from './UserFamilyManagement';
import './UserForm.css';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewUser = !id || id === 'new';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Only used for new users
    role: 'user'
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showFamilySection, setShowFamilySection] = useState(false);
  
  const [loading, setLoading] = useState(!isNewUser);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      if (isNewUser) {
        // Reset form for new user
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'user'
        });
        setLoading(false);
        return;
      }
      
      try {
        const data = await getUser(id);
        if (data && data.user) {
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            password: '', // Password is not returned from API
            role: data.user.role || 'user'
          });
        }
        setError('');
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user details. ' + (err.response?.data?.message || ''));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id, isNewUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      if (isNewUser) {
        // Ensure password is provided for new users
        if (!formData.password || formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setSaving(false);
          return;
        }
        
        await createUser(formData);
        setSuccess('User created successfully!');
        
        // Clear form for another add or redirect
        setTimeout(() => {
          navigate('/users');
        }, 1500);
      } else {
        // Don't send password in update (using underscore convention for unused variables)
        const { password: _, ...updateData } = formData;
        await updateUser(id, updateData);
        setSuccess('User updated successfully!');
        
        // No auto-redirect on update, let user see the success message
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user. ' + (err.response?.data?.message || ''));
    } finally {
      setSaving(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }
  
  return (
    <div className="user-form-container">
      <div className="navbar">
        <Link to="/" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
        <div>
          <Link to="/users" className="btn btn-outline-primary mr-2">
            <i className="fas fa-users"></i> User List
          </Link>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
      
      <div className="page-header">
        <h1>{isNewUser ? 'Add New User' : 'Edit User'}</h1>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            {isNewUser && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required={isNewUser}
                  minLength={6}
                />
                <small className="form-text text-muted">Password must be at least 6 characters.</small>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-actions">
              <Link to="/users" className="btn btn-secondary">Cancel</Link>
              
              {!isNewUser && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(true)}
                    className="btn btn-warning mx-2"
                  >
                    <i className="fas fa-key"></i> Change Password
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowFamilySection(!showFamilySection)}
                    className="btn btn-info mx-2"
                  >
                    <i className="fas fa-users"></i> {showFamilySection ? 'Hide Family Management' : 'Manage Family Connections'}
                  </button>
                </>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Save User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {!isNewUser && showPasswordForm && (
        <div className="mt-4">
          <ChangePasswordForm
            userId={id}
            onSuccess={() => {
              setShowPasswordForm(false);
              setError('');
              setSuccess('Password updated successfully!');
            }}
            onCancel={() => setShowPasswordForm(false)}
          />
        </div>
      )}
      
      {!isNewUser && showFamilySection && (
        <div className="mt-4">
          <UserFamilyManagement userId={id} />
        </div>
      )}
    </div>
  );
};

export default UserForm;
// src/components/UserManagement/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUser, createUser, updateUser } from '../../utils/api';
import ChangePasswordForm from './ChangePasswordForm';

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
        // Don't send password in update (empty string)
        const { password, ...updateData } = formData;
        await updateUser(id, updateData);
        setSuccess('User updated successfully!');
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user. ' + (err.response?.data?.message || ''));
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }
  
  return (
    <div className="user-form">
      <div className="header">
        <h1>{isNewUser ? 'Add New User' : 'Edit User'}</h1>
        <Link to="/users" className="btn btn-secondary">Back to Users</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
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
              value={formData.password}
              onChange={handleChange}
              required={isNewUser}
              minLength={6}
            />
            <small className="form-text">Password must be at least 6 characters.</small>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
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
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="btn btn-secondary mr-2"
            >
              Change Password
            </button>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save User'}
          </button>
        </div>
      </form>
      
      {!isNewUser && showPasswordForm && (
        <ChangePasswordForm
          userId={id}
          onSuccess={() => {
            setShowPasswordForm(false);
            setError('');
            setSuccess('Password updated successfully!');
          }}
          onCancel={() => setShowPasswordForm(false)}
        />
      )}
    </div>
  );
};

export default UserForm;
// src/components/UserManagement/PasswordForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUser, changeUserPassword } from '../../utils/api';

const PasswordForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser(id);
        setUser(data.user);
        setError('');
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user details. ' + (err.response?.data?.message || ''));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setSaving(true);
    
    try {
      await changeUserPassword(id, { password: formData.password });
      navigate('/users');
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to update password. ' + (err.response?.data?.message || ''));
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }
  
  return (
    <div className="password-form">
      <div className="header">
        <h1>Change Password for {user?.name}</h1>
        <Link to="/users" className="btn btn-secondary">Back to Users</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <small className="form-text">Password must be at least 6 characters.</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <Link to="/users" className="btn btn-secondary">Cancel</Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
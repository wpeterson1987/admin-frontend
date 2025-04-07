import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import NetworkList from './components/AffiliateManagement/NetworkList';
import { isAuthenticated } from './utils/auth';
import './App.css';
import UsersList from './components/UserManagement/UsersList';
import UserForm from './components/UserManagement/UserForm';
import PasswordForm from './components/UserManagement/PasswordForm';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/networks" element={
          <ProtectedRoute>
            <NetworkList />
          </ProtectedRoute>
        } />

        {/* User Management Routes */}
        <Route path="/users" element={
          <ProtectedRoute>
            <UsersList />
          </ProtectedRoute>
        } />
        
        <Route path="/users/:id/edit" element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        } />
        
        <Route path="/users/new" element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        } />
        
        <Route path="/users/:id/password" element={
          <ProtectedRoute>
            <PasswordForm />
          </ProtectedRoute>
        } />
        
        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
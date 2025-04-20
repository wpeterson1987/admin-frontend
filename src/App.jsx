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
import FamiliesLanding from './components/FamilyManagement/FamiliesLanding';
import FamilyDetails from './components/FamilyManagement/FamilyDetails';
import FamilyEdit from './components/FamilyManagement/FamilyEdit';
import AffiliateMarketingDashboard from './components/AffiliateManagement/AffiliateMarketingDashboard';
import AffiliateNetworksTable from './components/AffiliateManagement/AffiliateNetworksTable';
import AffiliateLinkForm from './components/AffiliateManagement/AffiliateLinkForm';
import AffiliateLinkStats from './components/AffiliateManagement/AffiliateLinkStats';
import SystemSettings from './components/SystemSettings/SystemSettings';
import SubscriptionManagement from './components/Admin/SubscriptionManagement';

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

        {/* Family Management Routes */}
        <Route path="/families" element={
          <ProtectedRoute>
            <FamiliesLanding />
          </ProtectedRoute>
        } />
        
        {/* New Family Detail Routes */}
        <Route path="/admin/families/:id" element={
          <ProtectedRoute>
            <FamilyDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/families/edit/:id" element={
          <ProtectedRoute>
            <FamilyEdit />
          </ProtectedRoute>
        } />

        {/* Subscription Management Routes */}
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <SubscriptionManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/subscriptions/:id" element={
          <ProtectedRoute>
            <SubscriptionManagement />
          </ProtectedRoute>
        } />

        {/* Affiliate Management Routes */}
        <Route path="/affiliate" element={
          <ProtectedRoute>
            <AffiliateMarketingDashboard />
          </ProtectedRoute>
        } />
        <Route path="/affiliate/links" element={
          <ProtectedRoute>
            <AffiliateMarketingDashboard />
          </ProtectedRoute>
        } />
        <Route path="/affiliate/networks" element={
          <ProtectedRoute>
            <AffiliateNetworksTable />
          </ProtectedRoute>
        } />
        <Route path="/affiliate/links/new" element={
          <ProtectedRoute>
            <AffiliateLinkForm />
          </ProtectedRoute>
        } />
        <Route path="/affiliate/links/edit/:id" element={
          <ProtectedRoute>
            <AffiliateLinkForm />
          </ProtectedRoute>
        } />
        <Route path="/affiliate/links/stats/:id" element={
          <ProtectedRoute>
            <AffiliateLinkStats />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <SystemSettings />
          </ProtectedRoute>
        } />
        
        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
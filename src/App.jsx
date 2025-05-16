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
import AdminSubscriptionManagement from './components/Admin/SubscriptionManagement';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// User components
import UserDashboard from './components/UserDashboard/UserDashboard';
import AccountLayout from './components/UserAccount/AccountLayout';
import UserSubscriptionManagement from './SubscriptionManagement/UserSubscriptionManagement';
import UserProfile from './components/UserAccount/UserProfile';
import AccountSettings from './components/UserAccount/AccountSettings';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key');

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Admin route wrapper
const AdminRoute = ({ children }) => {
  // This is a simplified check - you'd likely have more robust role checking
  if (!isAuthenticated() || !localStorage.getItem('isAdmin')) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* User routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* User Account routes with layout */}
          <Route path="/account" element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }>
            <Route path="profile" element={<UserProfile />} />
            <Route path="subscription" element={<UserSubscriptionManagement />} />
            <Route path="settings" element={<AccountSettings />} />
            {/* Add other account-related routes here */}
            <Route index element={<Navigate to="/account/profile" replace />} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          
          <Route path="/networks" element={
            <AdminRoute>
              <NetworkList />
            </AdminRoute>
          } />

          {/* User Management Routes */}
          <Route path="/users" element={
            <AdminRoute>
              <UsersList />
            </AdminRoute>
          } />
          
          <Route path="/users/:id/edit" element={
            <AdminRoute>
              <UserForm />
            </AdminRoute>
          } />
          
          <Route path="/users/new" element={
            <AdminRoute>
              <UserForm />
            </AdminRoute>
          } />
          
          <Route path="/users/:id/password" element={
            <AdminRoute>
              <PasswordForm />
            </AdminRoute>
          } />

          {/* Family Management Routes */}
          <Route path="/families" element={
            <AdminRoute>
              <FamiliesLanding />
            </AdminRoute>
          } />
          
          {/* New Family Detail Routes */}
          <Route path="/admin/families/:id" element={
            <AdminRoute>
              <FamilyDetails />
            </AdminRoute>
          } />
          
          <Route path="/admin/families/edit/:id" element={
            <AdminRoute>
              <FamilyEdit />
            </AdminRoute>
          } />

          {/* Admin Subscription Management Routes */}
          <Route path="/subscriptions" element={
            <AdminRoute>
              <AdminSubscriptionManagement />
            </AdminRoute>
          } />
          
          <Route path="/admin/subscriptions/:id" element={
            <AdminRoute>
              <AdminSubscriptionManagement />
            </AdminRoute>
          } />

          {/* Affiliate Management Routes */}
          <Route path="/affiliate" element={
            <AdminRoute>
              <AffiliateMarketingDashboard />
            </AdminRoute>
          } />
          <Route path="/affiliate/links" element={
            <AdminRoute>
              <AffiliateMarketingDashboard />
            </AdminRoute>
          } />
          <Route path="/affiliate/networks" element={
            <AdminRoute>
              <AffiliateNetworksTable />
            </AdminRoute>
          } />
          <Route path="/affiliate/links/new" element={
            <AdminRoute>
              <AffiliateLinkForm />
            </AdminRoute>
          } />
          <Route path="/affiliate/links/edit/:id" element={
            <AdminRoute>
              <AffiliateLinkForm />
            </AdminRoute>
          } />
          <Route path="/affiliate/links/stats/:id" element={
            <AdminRoute>
              <AffiliateLinkStats />
            </AdminRoute>
          } />

          <Route path="/settings" element={
            <AdminRoute>
              <SystemSettings />
            </AdminRoute>
          } />
          
          {/* Redirect any unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Elements>
    </BrowserRouter>
  );
}

export default App;
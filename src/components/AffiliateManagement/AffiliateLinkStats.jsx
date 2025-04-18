import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import layout components
// import AdminLayout from './layout/AdminLayout';

// Import page components
import Dashboard from '../Dashboard/Dashboard';
import LoginPage from '../Auth/LoginPage';
import UserList from '../UserManagement/UsersList';
import UserForm from '../UserManagement/UserForm';
import FamiliesLanding from '../FamilyManagement/FamiliesLanding';

// Import affiliate marketing components
import AffiliateMarketingDashboard from '../AffiliateManagement/AffiliateMarketingDashboard';
import AffiliateLinksTable from '../AffiliateManagement/AffiliateLinksTable';
import AffiliateNetworksTable from '../AffiliateManagement/AffiliateNetworksTable';
import AffiliateLinkForm from '../AffiliateManagement/AffiliateLinkForm';
import AffiliateLinkStats from '../AffiliateManagement/AffiliateLinkStats';

// Auth guard component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes with admin layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* User Management */}
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          
          {/* Family Management */}
          <Route path="families" element={<FamilyList />} />
          <Route path="families/:id" element={<FamilyDetails />} />
          
          {/* Affiliate Marketing */}
          <Route path="affiliate" element={<AffiliateMarketingDashboard />} />
          <Route path="affiliate/links" element={<AffiliateMarketingDashboard />} />
          <Route path="affiliate/networks" element={<AffiliateNetworksTable />} />
          <Route path="affiliate/links/new" element={<AffiliateLinkForm />} />
          <Route path="affiliate/links/edit/:id" element={<AffiliateLinkForm />} />
          <Route path="affiliate/links/stats/:id" element={<AffiliateLinkStats />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
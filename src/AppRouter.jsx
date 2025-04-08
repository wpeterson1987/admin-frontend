import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import layout components
import AdminLayout from './layout/AdminLayout';

// Import page components
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import FamilyList from './pages/FamilyList';
import FamilyDetails from './pages/FamilyDetails';

// Import affiliate marketing components
import AffiliateMarketingDashboard from './components/affiliate/AffiliateMarketingDashboard';
import AffiliateLinksTable from './components/affiliate/AffiliateLinksTable';
import AffiliateNetworksTable from './components/affiliate/AffiliateNetworksTable';
import AffiliateLinkForm from './components/affiliate/AffiliateLinkForm';
import AffiliateLinkStats from './components/affiliate/AffiliateLinkStats';

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
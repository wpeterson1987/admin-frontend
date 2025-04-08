import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Navbar, 
  Nav, 
  Dropdown, 
  Offcanvas, 
  Button
} from 'react-bootstrap';
import { 
  BsPeople, 
  BsHouseDoor, 
  BsLink45Deg, 
  BsList, 
  BsGear, 
  BsPerson, 
  BsBoxArrowRight,
  BsShield
} from 'react-icons/bs';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Helper to determine if a nav item is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Button 
            variant="outline-light" 
            className="d-lg-none me-2"
            onClick={() => setShowSidebar(true)}
          >
            <BsList />
          </Button>
          
          <Navbar.Brand as={Link} to="/">Valortek Admin</Navbar.Brand>
          
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto d-none d-lg-flex">
              <Nav.Link 
                as={Link} 
                to="/" 
                active={location.pathname === '/'}
              >
                <BsHouseDoor className="me-1" /> Dashboard
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/users" 
                active={isActive('/users')}
              >
                <BsPeople className="me-1" /> Users
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/families" 
                active={isActive('/families')}
              >
                <BsShield className="me-1" /> Families
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/affiliate" 
                active={isActive('/affiliate')}
              >
                <BsLink45Deg className="me-1" /> Affiliate Marketing
              </Nav.Link>
            </Nav>
            
            <Nav>
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                  <BsPerson className="me-1" /> Admin
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    <BsPerson className="me-2" /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">
                    <BsGear className="me-2" /> Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <BsBoxArrowRight className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Sidebar (visible on mobile) */}
      <Offcanvas 
        show={showSidebar} 
        onHide={() => setShowSidebar(false)}
        responsive="lg"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Valortek Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
              onClick={() => setShowSidebar(false)}
            >
              <BsHouseDoor className="me-2" /> Dashboard
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/users" 
              active={isActive('/users')}
              onClick={() => setShowSidebar(false)}
            >
              <BsPeople className="me-2" /> Users
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/families" 
              active={isActive('/families')}
              onClick={() => setShowSidebar(false)}
            >
              <BsShield className="me-2" /> Families
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/affiliate" 
              active={isActive('/affiliate')}
              onClick={() => setShowSidebar(false)}
            >
              <BsLink45Deg className="me-2" /> Affiliate Marketing
            </Nav.Link>
            
            <hr />
            
            <Button variant="outline-danger" onClick={handleLogout}>
              <BsBoxArrowRight className="me-2" /> Logout
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      
      {/* Main Content */}
      <div className="flex-grow-1">
        <Outlet />
      </div>
      
      {/* Footer */}
      <footer className="bg-light py-3 mt-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 text-muted">
              © {new Date().getFullYear()} Valortek Lai App Ecosystem
            </p>
            <p className="mb-0 text-muted">
              Admin Dashboard v1.0
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default AdminLayout;
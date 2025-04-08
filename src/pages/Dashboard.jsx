import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  BsPeople, 
  BsShield, 
  BsLink45Deg, 
  BsGear,
  BsBarChart,
  BsBoxArrowRight
} from 'react-icons/bs';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        // This would be an API call in production
        // const response = await axios.get('/api/admin/dashboard/stats');
        
        // Mock data for development
        setTimeout(() => {
          const mockStats = {
            users: {
              total: 328,
              new_this_month: 42
            },
            families: {
              total: 95,
              premium: 48
            },
            affiliate: {
              clicks_today: 124,
              conversions_today: 8,
              commission_today: 64.75,
              links: 87,
              networks: 5
            }
          };
          
          setStats(mockStats);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Error loading dashboard data: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="mb-4 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">User Management</h5>
                <BsPeople size={24} className="text-primary" />
              </div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h3 className="mb-0">{stats?.users.total}</h3>
                      <p className="text-muted">Total Users</p>
                    </div>
                    <div>
                      <h3 className="mb-0">{stats?.users.new_this_month}</h3>
                      <p className="text-muted">New This Month</p>
                    </div>
                  </div>
                </>
              )}
              <div className="d-grid gap-2">
                <Button as={Link} to="/users" variant="primary">
                  Manage Users
                </Button>
                <Button as={Link} to="/users/new" variant="outline-primary">
                  Add New User
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Family Management</h5>
                <BsShield size={24} className="text-success" />
              </div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h3 className="mb-0">{stats?.families.total}</h3>
                      <p className="text-muted">Total Families</p>
                    </div>
                    <div>
                      <h3 className="mb-0">{stats?.families.premium}</h3>
                      <p className="text-muted">Premium</p>
                    </div>
                  </div>
                </>
              )}
              <div className="d-grid gap-2">
                <Button as={Link} to="/families" variant="success">
                  Manage Families
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Affiliate Marketing</h5>
                <BsLink45Deg size={24} className="text-warning" />
              </div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h3 className="mb-0">{stats?.affiliate.links}</h3>
                      <p className="text-muted">Total Links</p>
                    </div>
                    <div>
                      <h3 className="mb-0">${stats?.affiliate.commission_today}</h3>
                      <p className="text-muted">Today's Commission</p>
                    </div>
                  </div>
                </>
              )}
              <div className="d-grid gap-2">
                <Button as={Link} to="/affiliate" variant="warning">
                  Affiliate Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h2>Quick Actions</h2>
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body className="text-center py-4">
              <BsPeople size={32} className="mb-3 text-primary" />
              <h5>User Management</h5>
              <p className="text-muted">Manage users and permissions</p>
              <Button as={Link} to="/users" variant="outline-primary">Go</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body className="text-center py-4">
              <BsShield size={32} className="mb-3 text-success" />
              <h5>Family Management</h5>
              <p className="text-muted">Manage family units and access</p>
              <Button as={Link} to="/families" variant="outline-success">Go</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body className="text-center py-4">
              <BsLink45Deg size={32} className="mb-3 text-warning" />
              <h5>Affiliate Links</h5>
              <p className="text-muted">Manage affiliate marketing links</p>
              <Button as={Link} to="/affiliate/links" variant="outline-warning">Go</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body className="text-center py-4">
              <BsBarChart size={32} className="mb-3 text-info" />
              <h5>Network Settings</h5>
              <p className="text-muted">Configure affiliate networks</p>
              <Button as={Link} to="/affiliate/networks" variant="outline-info">Go</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">System Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={4}><strong>Version:</strong></Col>
                <Col sm={8}>1.0.0</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={4}><strong>Server Status:</strong></Col>
                <Col sm={8}>
                  <span className="text-success">● Online</span>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm={4}><strong>Last Backup:</strong></Col>
                <Col sm={8}>April 6, 2025 - 01:30 AM</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={4}><strong>System Health:</strong></Col>
                <Col sm={8}>
                  <span className="text-success">Good</span>
                </Col>
              </Row>
              <div className="d-grid gap-2 mt-3">
                <Button variant="outline-secondary">System Settings</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>User Created</strong>
                      <p className="mb-0 text-muted">John Smith added to family "Smith Family"</p>
                    </div>
                    <small className="text-muted">5 mins ago</small>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Affiliate Link Created</strong>
                      <p className="mb-0 text-muted">New link "Spring Deals" was created</p>
                    </div>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>System Backup</strong>
                      <p className="mb-0 text-muted">Daily backup completed successfully</p>
                    </div>
                    <small className="text-muted">6 hours ago</small>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Network Updated</strong>
                      <p className="mb-0 text-muted">Amazon Associates network settings updated</p>
                    </div>
                    <small className="text-muted">Yesterday</small>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Family Upgraded</strong>
                      <p className="mb-0 text-muted">"Johnson Family" upgraded to Premium plan</p>
                    </div>
                    <small className="text-muted">2 days ago</small>
                  </div>
                </li>
              </ul>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button variant="link" className="text-muted">View All Activity</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
// src/components/Admin/SubscriptionManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Spinner, 
  Alert,
  Badge,
  Card,
  Row,
  Col,
  Tabs,
  Tab
} from 'react-bootstrap';
import axios from 'axios';

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [subscriptions, setSubscriptions] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [currentTier, setCurrentTier] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscription tiers
      const tiersResponse = await axios.get('/api/admin/subscription/tiers');
      setTiers(tiersResponse.data.tiers);
      
      // Fetch active subscriptions
      const subscriptionsResponse = await axios.get('/api/admin/subscription/active');
      setSubscriptions(subscriptionsResponse.data.subscriptions);
      
      // Fetch recent payments
      const paymentsResponse = await axios.get('/api/admin/subscription/payments');
      setPayments(paymentsResponse.data.payments);
      
      setError(null);
    } catch (err) {
      setError('Error loading subscription data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateTier = () => {
    setCurrentTier({
      name: '',
      description: '',
      price_monthly: '',
      price_yearly: '',
      features: {},
      is_active: true,
      stripe_price_id_monthly: '',
      stripe_price_id_yearly: ''
    });
    setEditMode(false);
    setShowTierModal(true);
  };
  
  const handleEditTier = (tier) => {
    setCurrentTier(tier);
    setEditMode(true);
    setShowTierModal(true);
  };
  
  const handleTierSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editMode) {
        await axios.put(`/api/admin/subscription/tiers/${currentTier.id}`, currentTier);
      } else {
        await axios.post('/api/admin/subscription/tiers', currentTier);
      }
      
      // Refresh tiers
      const response = await axios.get('/api/admin/subscription/tiers');
      setTiers(response.data.tiers);
      
      setShowTierModal(false);
      setError(null);
    } catch (err) {
      setError(`Error ${editMode ? 'updating' : 'creating'} tier: ` + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !tiers.length) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading subscription data...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <h2 className="mb-4">Subscription Management</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="subscriptions" title="Active Subscriptions">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Active Subscriptions</h5>
              <Button variant="outline-secondary" onClick={fetchData}>
                Refresh
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Family</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th>Renews</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No active subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map(sub => (
                      <tr key={sub.id}>
                        <td>{sub.Family.family_name}</td>
                        <td>{sub.SubscriptionTier.name}</td>
                        <td>
                          <Badge bg={
                            sub.status === 'active' ? 'success' :
                            sub.status === 'trialing' ? 'info' :
                            sub.status === 'past_due' ? 'warning' : 'secondary'
                          }>
                            {sub.status}
                          </Badge>
                          {sub.cancel_at_period_end && (
                            <Badge bg="danger" className="ms-1">Canceling</Badge>
                          )}
                        </td>
                        <td>{new Date(sub.start_date).toLocaleDateString()}</td>
                        <td>{new Date(sub.current_period_end).toLocaleDateString()}</td>
                        <td>${sub.SubscriptionTier.price_monthly}/mo</td>
                        <td>
                          <Button 
                            variant="outline-primary"
                            size="sm"
                            href={`/admin/subscriptions/${sub.id}`}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="tiers" title="Subscription Tiers">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Subscription Tiers</h5>
              <Button variant="primary" onClick={handleCreateTier}>
                Add New Tier
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Monthly Price</th>
                    <th>Yearly Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No subscription tiers found.
                      </td>
                    </tr>
                  ) : (
                    tiers.map(tier => (
                      <tr key={tier.id}>
                        <td>{tier.name}</td>
                        <td>${tier.price_monthly}</td>
                        <td>${tier.price_yearly}</td>
                        <td>
                          <Badge bg={tier.is_active ? 'success' : 'secondary'}>
                            {tier.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditTier(tier)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteTier(tier.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="payments" title="Recent Payments">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Payments</h5>
              <Button variant="outline-secondary" onClick={fetchData}>
                Refresh
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Family</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Invoice ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    payments.map(payment => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.createdAt).toLocaleString()}</td>
                        <td>{payment.Subscription.Family.family_name}</td>
                        <td>{payment.currency} {payment.amount}</td>
                        <td>
                          <Badge bg={
                            payment.status === 'succeeded' ? 'success' :
                            payment.status === 'pending' ? 'warning' :
                            payment.status === 'failed' ? 'danger' : 'secondary'
                          }>
                            {payment.status}
                          </Badge>
                        </td>
                        <td>{payment.payment_method_type}</td>
                        <td>{payment.payment_provider_invoice_id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      {/* Subscription Tier Modal */}
      <Modal show={showTierModal} onHide={() => setShowTierModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Subscription Tier' : 'Create Subscription Tier'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTierSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tier Name*</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={currentTier?.name || ''}
                    onChange={(e) => setCurrentTier({...currentTier, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="tier-active"
                    label="Active"
                    checked={currentTier?.is_active || false}
                    onChange={(e) => setCurrentTier({...currentTier, is_active: e.target.checked})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentTier?.description || ''}
                onChange={(e) => setCurrentTier({...currentTier, description: e.target.value})}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Monthly Price ($)*</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={currentTier?.price_monthly || ''}
                    onChange={(e) => setCurrentTier({...currentTier, price_monthly: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Yearly Price ($)*</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={currentTier?.price_yearly || ''}
                    onChange={(e) => setCurrentTier({...currentTier, price_yearly: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stripe Monthly Price ID*</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={currentTier?.stripe_price_id_monthly || ''}
                    onChange={(e) => setCurrentTier({...currentTier, stripe_price_id_monthly: e.target.value})}
                  />
                  <Form.Text className="text-muted">
                    Example: price_1KmJd2E9KmJd2E9KmJd2E9Km
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stripe Yearly Price ID*</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={currentTier?.stripe_price_id_yearly || ''}
                    onChange={(e) => setCurrentTier({...currentTier, stripe_price_id_yearly: e.target.value})}
                  />
                  <Form.Text className="text-muted">
                    Example: price_1KmJd2E9KmJd2E9KmJd2E9Km
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <h5 className="mt-4">Features</h5>
            <div id="features-container">
              {currentTier && Object.entries(currentTier.features || {}).map(([key, value], index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Control
                      placeholder="Feature name"
                      value={key}
                      onChange={(e) => {
                        const newFeatures = {...currentTier.features};
                        const oldValue = newFeatures[key];
                        delete newFeatures[key];
                        newFeatures[e.target.value] = oldValue;
                        setCurrentTier({...currentTier, features: newFeatures});
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="Value"
                      value={value}
                      onChange={(e) => {
                        const newFeatures = {...currentTier.features};
                        newFeatures[key] = e.target.value;
                        setCurrentTier({...currentTier, features: newFeatures});
                      }}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button 
                      variant="outline-danger"
                      onClick={() => {
                        const newFeatures = {...currentTier.features};
                        delete newFeatures[key];
                        setCurrentTier({...currentTier, features: newFeatures});
                      }}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button 
                variant="outline-primary" 
                className="mt-2"
                onClick={() => {
                  const newFeatures = {...currentTier.features, [`Feature ${Object.keys(currentTier.features || {}).length + 1}`]: 'Value'};
                  setCurrentTier({...currentTier, features: newFeatures});
                }}
              >
                Add Feature
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTierModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editMode ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SubscriptionManagement;
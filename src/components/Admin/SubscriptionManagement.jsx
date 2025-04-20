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
  Tab,
  ListGroup
} from 'react-bootstrap';
import axios from 'axios';

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [subscriptions, setSubscriptions] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [showTestSubscriptionModal, setShowTestSubscriptionModal] = useState(false);
  const [currentTier, setCurrentTier] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [testSubscriptionData, setTestSubscriptionData] = useState({
    familyId: '',
    tierId: '',
    stripeCustomerId: 'cus_test_' + Math.random().toString(36).substring(2, 10),
    stripeSubscriptionId: 'sub_test_' + Math.random().toString(36).substring(2, 10),
    status: 'active'
  });
  
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
      try {
        const subscriptionsResponse = await axios.get('/api/admin/subscription/active');
        setSubscriptions(subscriptionsResponse.data.subscriptions);
      } catch (err) {
        console.log('No active subscriptions found');
        setSubscriptions([]);
      }
      
      // Fetch recent payments
      try {
        const paymentsResponse = await axios.get('/api/admin/subscription/payments');
        setPayments(paymentsResponse.data.payments);
      } catch (err) {
        console.log('No payment history found');
        setPayments([]);
      }
      
      // Fetch families for test subscription creation
      const familiesResponse = await axios.get('/api/admin/families');
    setFamilies(familiesResponse.data.families || []);
    
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
  
  const handleCreateTestSubscription = () => {
    // Initialize with default values
    if (families.length > 0) {
      testSubscriptionData.familyId = families[0].id;
    }
    if (tiers.length > 0) {
      testSubscriptionData.tierId = tiers[0].id;
    }
    
    setShowTestSubscriptionModal(true);
  };
  
  const handleTestSubscriptionSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Call API to create test subscription
      await axios.post('/api/admin/subscription/test', testSubscriptionData);
      
      // Refresh subscriptions
      const response = await axios.get('/api/admin/subscription/active');
      setSubscriptions(response.data.subscriptions);
      
      setShowTestSubscriptionModal(false);
      setError(null);
      
      // Show success message
      alert('Test subscription created successfully!');
    } catch (err) {
      setError('Error creating test subscription: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTier = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tier?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`/api/admin/subscription/tiers/${id}`);
      
      // Refresh tiers
      const response = await axios.get('/api/admin/subscription/tiers');
      setTiers(response.data.tiers);
      
      setError(null);
    } catch (err) {
      setError('Error deleting tier: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTriggerWebhook = async (subscriptionId, eventType) => {
    try {
      setLoading(true);
      
      await axios.post('/api/admin/subscription/trigger-webhook', {
        subscriptionId,
        eventType
      });
      
      setError(null);
      alert(`Webhook event ${eventType} triggered successfully`);
    } catch (err) {
      setError('Error triggering webhook: ' + err.message);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Subscription Management</h1>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
      
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
                            className="me-2"
                          >
                            Details
                          </Button>
                          <div className="btn-group">
                            <Button variant="outline-secondary" size="sm" id={`dropdown-${sub.id}`} className="dropdown-toggle" data-bs-toggle="dropdown">
                              Actions
                            </Button>
                            <ul className="dropdown-menu" aria-labelledby={`dropdown-${sub.id}`}>
                              <li><a className="dropdown-item" href="#" onClick={() => handleTriggerWebhook(sub.id, 'invoice.payment_succeeded')}>Trigger Payment Success</a></li>
                              <li><a className="dropdown-item" href="#" onClick={() => handleTriggerWebhook(sub.id, 'invoice.payment_failed')}>Trigger Payment Failed</a></li>
                              <li><a className="dropdown-item" href="#" onClick={() => handleTriggerWebhook(sub.id, 'customer.subscription.updated')}>Trigger Subscription Update</a></li>
                              <li><a className="dropdown-item" href="#" onClick={() => handleTriggerWebhook(sub.id, 'customer.subscription.deleted')}>Trigger Subscription Deleted</a></li>
                            </ul>
                          </div>
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
                    <th>Stripe Monthly Price ID</th>
                    <th>Stripe Yearly Price ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
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
                          <small>{tier.stripe_price_id_monthly || 'Not set'}</small>
                        </td>
                        <td>
                          <small>{tier.stripe_price_id_yearly || 'Not set'}</small>
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
        
        <Tab eventKey="test" title="Test Subscriptions">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Test Subscription Tools</h5>
              <Button variant="primary" onClick={handleCreateTestSubscription}>
                Create Test Subscription
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>What are test subscriptions?</h6>
                  <p>
                    Test subscriptions allow you to create subscription records in your database
                    for testing webhook handlers and subscription management features without
                    actually charging customers or interacting with Stripe.
                  </p>
                  
                  <h6 className="mt-4">Available webhook tests:</h6>
                  <ListGroup>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      Invoice Payment Succeeded
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => stripe && stripe.triggerWebhook('invoice.payment_succeeded')}
                        disabled={!window.stripe}
                      >
                        Test with Stripe CLI
                      </Button>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      Invoice Payment Failed
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => stripe && stripe.triggerWebhook('invoice.payment_failed')}
                        disabled={!window.stripe}
                      >
                        Test with Stripe CLI
                      </Button>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      Subscription Updated
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => stripe && stripe.triggerWebhook('customer.subscription.updated')}
                        disabled={!window.stripe}
                      >
                        Test with Stripe CLI
                      </Button>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      Subscription Deleted
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => stripe && stripe.triggerWebhook('customer.subscription.deleted')}
                        disabled={!window.stripe}
                      >
                        Test with Stripe CLI
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                
                <Col md={6}>
                  <h6>Recent webhook events</h6>
                  <div className="bg-light p-3 rounded" style={{minHeight: '200px', maxHeight: '300px', overflow: 'auto'}}>
                    <code>
                      <pre id="webhook-log">No webhook events logged yet</pre>
                    </code>
                  </div>
                  
                  <h6 className="mt-4">Stripe CLI commands</h6>
                  <div className="bg-light p-3 rounded">
                    <code>
                      # Listen for webhooks<br />
                      stripe listen --forward-to https://your-app-url.com/api/subscription/webhook<br /><br />
                      
                      # Trigger event<br />
                      stripe trigger invoice.payment_succeeded
                    </code>
                  </div>
                </Col>
              </Row>
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
      
      {/* Test Subscription Modal */}
      <Modal show={showTestSubscriptionModal} onHide={() => setShowTestSubscriptionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Test Subscription</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTestSubscriptionSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Family*</Form.Label>
              <Form.Select
                required
                value={testSubscriptionData.familyId}
                onChange={(e) => setTestSubscriptionData({...testSubscriptionData, familyId: e.target.value})}
              >
                <option value="">Select a family</option>
                {families.map(family => (
                  <option key={family.id} value={family.id}>{family.family_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Subscription Tier*</Form.Label>
              <Form.Select
                required
                value={testSubscriptionData.tierId}
                onChange={(e) => setTestSubscriptionData({...testSubscriptionData, tierId: e.target.value})}
              >
                <option value="">Select a tier</option>
                {tiers.map(tier => (
                  <option key={tier.id} value={tier.id}>{tier.name} (${tier.price_monthly}/month)</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Stripe Customer ID</Form.Label>
              <Form.Control
                type="text"
                value={testSubscriptionData.stripeCustomerId}
                onChange={(e) => setTestSubscriptionData({...testSubscriptionData, stripeCustomerId: e.target.value})}
                placeholder="cus_test_123456"
              />
              <Form.Text className="text-muted">
                For testing purposes only. Will be saved as payment_provider_customer_id.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Stripe Subscription ID</Form.Label>
              <Form.Control
                type="text"
                value={testSubscriptionData.stripeSubscriptionId}
                onChange={(e) => setTestSubscriptionData({...testSubscriptionData, stripeSubscriptionId: e.target.value})}
                placeholder="sub_test_123456"
              />
              <Form.Text className="text-muted">
                For testing purposes only. Will be saved as payment_provider_subscription_id.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={testSubscriptionData.status}
                onChange={(e) => setTestSubscriptionData({...testSubscriptionData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="past_due">Past Due</option>
                <option value="canceled">Canceled</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTestSubscriptionModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Test Subscription'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SubscriptionManagement;
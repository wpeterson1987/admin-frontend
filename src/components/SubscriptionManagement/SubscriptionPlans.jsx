// src/components/SubscriptionManagement/SubscriptionPlans.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Alert, Spinner, Container } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SubscriptionPlans = ({ familyId }) => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch available subscription tiers
        const tiersResponse = await axios.get('/api/subscription/tiers');
        setTiers(tiersResponse.data.tiers);
        
        // If a family ID is provided, check for existing subscription
        if (familyId) {
          try {
            const subscriptionResponse = await axios.get(`/api/subscription/family/${familyId}`);
            setCurrentSubscription(subscriptionResponse.data.subscription);
          } catch (subErr) {
            // No subscription found or error - this is fine
            console.log('No active subscription found');
          }
        }
      } catch (err) {
        setError('Error loading subscription plans: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [familyId]);
  
  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setShowPaymentForm(true);
  };
  
  const handleUpgrade = async (newTierId) => {
    try {
      setLoading(true);
      
      await axios.put(`/api/subscription/${currentSubscription.id}`, {
        newTierId
      });
      
      // Refresh subscription data
      const response = await axios.get(`/api/subscription/family/${familyId}`);
      setCurrentSubscription(response.data.subscription);
      
      setError(null);
    } catch (err) {
      setError('Error upgrading subscription: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }
    
    try {
      setLoading(true);
      
      await axios.delete(`/api/subscription/${currentSubscription.id}`, {
        data: { cancelImmediately: false }
      });
      
      // Refresh subscription data
      const response = await axios.get(`/api/subscription/family/${familyId}`);
      setCurrentSubscription(response.data.subscription);
      
      setError(null);
    } catch (err) {
      setError('Error canceling subscription: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading subscription options...</p>
      </div>
    );
  }
  
  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {currentSubscription ? (
        <Card className="mb-4">
          <Card.Header>
            <h4>Current Subscription</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>{currentSubscription.SubscriptionTier.name}</h5>
                <p>{currentSubscription.SubscriptionTier.description}</p>
                <p>
                  <strong>Status: </strong>
                  <Badge bg={currentSubscription.status === 'active' ? 'success' : 'warning'}>
                    {currentSubscription.status}
                  </Badge>
                </p>
                <p>
                  <strong>Renews: </strong>
                  {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                </p>
                {currentSubscription.cancel_at_period_end && (
                  <Alert variant="warning">
                    Your subscription will end on {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                  </Alert>
                )}
              </Col>
              <Col md={6} className="text-end">
  <p className="mb-4">
    <strong>Price: </strong>
    ${currentSubscription.SubscriptionTier.price_monthly}/month
  </p>
  {!currentSubscription.cancel_at_period_end && (
    <Button
      variant="outline-danger"
      onClick={handleCancel}
      disabled={loading}
    >
      Cancel Subscription
    </Button>
  )}
</Col>
            </Row>
            
            {tiers.some(tier => tier.id !== currentSubscription.subscription_tier_id && tier.price_monthly > currentSubscription.SubscriptionTier.price_monthly) && (
              <>
                <hr />
                <h5>Upgrade Options</h5>
                <Row className="mt-3">
                  {tiers
                    .filter(tier => tier.id !== currentSubscription.subscription_tier_id && tier.price_monthly > currentSubscription.SubscriptionTier.price_monthly)
                    .map(tier => (
                      <Col key={tier.id} md={4} className="mb-3">
                        <Card>
                          <Card.Header className="text-center">
                            <h5>{tier.name}</h5>
                          </Card.Header>
                          <Card.Body>
                            <h4 className="text-center">${tier.price_monthly}/month</h4>
                            <p>{tier.description}</p>
                            <div className="d-grid">
                              <Button 
                                variant="primary"
                                onClick={() => handleUpgrade(tier.id)}
                                disabled={loading}
                              >
                                Upgrade
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                </Row>
              </>
            )}
          </Card.Body>
        </Card>
      ) : (
        <>
          <h4 className="mb-4">Choose a Subscription Plan</h4>
          <Row>
            {tiers.map(tier => (
              <Col key={tier.id} md={4} className="mb-4">
                <Card className={selectedTier?.id === tier.id ? 'border-primary' : ''}>
                  <Card.Header className="text-center">
                    <h5>{tier.name}</h5>
                  </Card.Header>
                  <Card.Body>
                    <h4 className="text-center">${tier.price_monthly}/month</h4>
                    <p>{tier.description}</p>
                    <ul>
                      {tier.features && Object.entries(tier.features).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                      ))}
                    </ul>
                    <div className="d-grid">
                      <Button 
                        variant={selectedTier?.id === tier.id ? 'primary' : 'outline-primary'}
                        onClick={() => handleSelectTier(tier)}
                      >
                        {selectedTier?.id === tier.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          {showPaymentForm && selectedTier && (
            <Elements stripe={stripePromise}>
              <SubscriptionCheckoutForm 
                tier={selectedTier} 
                familyId={familyId}
                onSuccess={() => window.location.reload()}
                onCancel={() => setShowPaymentForm(false)}
              />
            </Elements>
          )}
        </>
      )}
    </Container>
  );
};

// Checkout Form Component
const SubscriptionCheckoutForm = ({ tier, familyId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [billingEmail, setBillingEmail] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create payment method
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          email: billingEmail,
        },
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Create subscription
      const response = await axios.post('/api/subscription', {
        familyId,
        subscriptionTierId: tier.id,
        paymentMethodId: result.paymentMethod.id,
        billingEmail
      });
      
      // Check if authentication is required
      if (response.data.client_secret) {
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          response.data.client_secret
        );
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (paymentIntent.status === 'succeeded') {
          onSuccess();
        }
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Payment failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mt-4">
      <Card.Header>
        <h5>Complete Subscription</h5>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="billingEmail" className="form-label">Billing Email</label>
            <input
              type="email"
              className="form-control"
              id="billingEmail"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Card Details</label>
            <div className="p-3 border rounded">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <div className="d-flex justify-content-end">
            <Button 
              variant="secondary" 
              onClick={onCancel} 
              className="me-2"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading || !stripe}
            >
              {loading ? 'Processing...' : `Subscribe - $${tier.price_monthly}/month`}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default SubscriptionPlans;
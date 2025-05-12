import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Badge, 
  Spinner,
  Alert,
  Modal,
  Form
} from 'react-bootstrap';
import { BsPencil, BsTrash, BsCheckCircle, BsXCircle } from 'react-icons/bs';
import axios from 'axios';

const AffiliateNetworksTable = () => {
  // State variables
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState({
    name: '',
    display_name: '',
    affiliate_id: '',
    url_pattern: '',
    base_commission_rate: '',
    is_active: true,
    config: {}
  });
  
  // Mock data for now - would be replaced with API call
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        setLoading(true);
        // This would be an actual API call in production
        // const response = await axios.get('/api/affiliate/networks');
        
        // Using mock data for development
        setTimeout(() => {
          // Using your existing mock data from NetworkList.jsx and enhancing it
          const mockNetworks = [
            {
              id: 1,
              name: 'amazon',
              display_name: 'Amazon Associates',
              affiliate_id: 'example-20',
              url_pattern: 'https://amazon.com/dp/{product_id}?tag={affiliate_id}',
              is_active: true,
              base_commission_rate: 3.5,
              webhook_endpoint: 'https://api.valortek.com/webhook/amazon',
              config: {
                requires_approval: true,
                payment_cycle: 'monthly',
                payment_threshold: 10
              }
            },
            {
              id: 2,
              name: 'walmart',
              display_name: 'Walmart Affiliate',
              affiliate_id: 'affiliate123',
              url_pattern: 'https://walmart.com/ip/{product_id}?wmlspartner={affiliate_id}',
              is_active: true,
              base_commission_rate: 4.0,
              webhook_endpoint: 'https://api.valortek.com/webhook/walmart',
              config: {
                requires_approval: false,
                payment_cycle: 'monthly',
                payment_threshold: 25
              }
            },
            {
              id: 3,
              name: 'target',
              display_name: 'Target Affiliate Program',
              affiliate_id: 'target123',
              url_pattern: 'https://target.com/p/-/A-{product_id}?afid={affiliate_id}',
              is_active: false,
              base_commission_rate: 3.0,
              webhook_endpoint: 'https://api.valortek.com/webhook/target',
              config: {
                requires_approval: true,
                payment_cycle: 'monthly',
                payment_threshold: 50
              }
            }
          ];
          
          setNetworks(mockNetworks);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Error fetching affiliate networks: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchNetworks();
  }, []);
  
  // Handle edit network
  const handleEditNetwork = (network) => {
    setCurrentNetwork(network);
    setEditMode(true);
    setShowModal(true);
  };
  
  // Handle new network
  const handleNewNetwork = () => {
    setCurrentNetwork({
      name: '',
      display_name: '',
      affiliate_id: '',
      url_pattern: '',
      base_commission_rate: '',
      is_active: true,
      config: {}
    });
    setEditMode(false);
    setShowModal(true);
  };
  
  // Handle toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    // In real app, this would be an API call
    // try {
    //   await axios.patch(`/api/affiliate/networks/${id}`, {
    //     is_active: !currentStatus
    //   });
    
    // Update local state
    setNetworks(networks.map(network => 
      network.id === id ? { ...network, is_active: !currentStatus } : network
    ));
    // } catch (err) {
    //   setError('Error updating network status: ' + err.message);
    // }
  };
  
  // Handle delete network
  const handleDeleteNetwork = async (id) => {
    if (!window.confirm('Are you sure you want to delete this affiliate network?')) {
      return;
    }
    
    // In real app, this would be an API call
    // try {
    //   await axios.delete(`/api/affiliate/networks/${id}`);
    
    // Update local state
    setNetworks(networks.filter(network => network.id !== id));
    // } catch (err) {
    //   setError('Error deleting network: ' + err.message);
    // }
  };
  
  // Handle form change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentNetwork({
      ...currentNetwork,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!currentNetwork.name || !currentNetwork.display_name || !currentNetwork.affiliate_id || !currentNetwork.url_pattern) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      if (editMode) {
        // Update existing network
        // In real app, this would be an API call
        // await axios.put(`/api/affiliate/networks/${currentNetwork.id}`, currentNetwork);
        
        // Update local state
        setNetworks(networks.map(network => 
          network.id === currentNetwork.id ? currentNetwork : network
        ));
      } else {
        // Create new network
        // In real app, this would be an API call
        // const response = await axios.post('/api/affiliate/networks', currentNetwork);
        
        // Mock response for development
        const newNetwork = {
          ...currentNetwork,
          id: networks.length + 1, // Mock ID
          config: currentNetwork.config || {}
        };
        
        // Update local state
        setNetworks([...networks, newNetwork]);
      }
      
      // Close modal
      setShowModal(false);
    } catch (err) {
      setError(`Error ${editMode ? 'updating' : 'creating'} network: ${err.message}`);
    }
  };
  
  // Render loading spinner
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  
  // Render error message
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  return (
    <>
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Affiliate Networks</h5>
            <Button variant="primary" onClick={handleNewNetwork}>
              Add Network
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Identifier</th>
                <th>Affiliate ID</th>
                <th>Commission Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {networks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No affiliate networks found. Add a network to get started.
                  </td>
                </tr>
              ) : (
                networks.map(network => (
                  <tr key={network.id}>
                    <td>{network.display_name}</td>
                    <td><code>{network.name}</code></td>
                    <td>{network.affiliate_id}</td>
                    <td>{network.base_commission_rate}%</td>
                    <td>
                      <Badge bg={network.is_active ? 'success' : 'secondary'}>
                        {network.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="link" 
                        className="p-0 me-2"
                        onClick={() => handleEditNetwork(network)}
                        title="Edit"
                      >
                        <BsPencil />
                      </Button>
                      <Button 
                        variant="link" 
                        className="p-0 me-2"
                        onClick={() => handleToggleActive(network.id, network.is_active)}
                        title={network.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {network.is_active ? <BsCheckCircle className="text-success" /> : <BsXCircle className="text-secondary" />}
                      </Button>
                      <Button 
                        variant="link" 
                        className="p-0 text-danger"
                        onClick={() => handleDeleteNetwork(network.id)}
                        title="Delete"
                      >
                        <BsTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* Network Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Affiliate Network' : 'Add Affiliate Network'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Display Name*</Form.Label>
              <Form.Control 
                type="text" 
                name="display_name" 
                value={currentNetwork.display_name}
                onChange={handleInputChange}
                placeholder="e.g. Amazon Associates"
                required
              />
              <Form.Text className="text-muted">
                The user-friendly name that will be displayed in the UI.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Network Identifier*</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={currentNetwork.name}
                onChange={handleInputChange}
                placeholder="e.g. amazon"
                required
                disabled={editMode} // Can't change the identifier once created
              />
              <Form.Text className="text-muted">
                A unique identifier for the network (lowercase, no spaces).
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Affiliate ID/Tag*</Form.Label>
              <Form.Control 
                type="text" 
                name="affiliate_id" 
                value={currentNetwork.affiliate_id}
                onChange={handleInputChange}
                placeholder="e.g. yourname-20"
                required
              />
              <Form.Text className="text-muted">
                Your unique affiliate ID or tag for this network.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>URL Pattern*</Form.Label>
              <Form.Control 
                type="text" 
                name="url_pattern" 
                value={currentNetwork.url_pattern}
                onChange={handleInputChange}
                placeholder="e.g. https://amazon.com/dp/{product_id}?tag={affiliate_id}"
                required
              />
              <Form.Text className="text-muted">
                Pattern for generating affiliate URLs. Use "{'{product_id}'}" and "{'{affiliate_id}'}" as placeholders.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Base Commission Rate (%)</Form.Label>
              <Form.Control 
                type="number" 
                name="base_commission_rate" 
                value={currentNetwork.base_commission_rate}
                onChange={handleInputChange}
                placeholder="e.g. 3.5"
                step="0.1"
                min="0"
                max="100"
              />
              <Form.Text className="text-muted">
                The default commission rate for this network as a percentage.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Webhook Endpoint</Form.Label>
              <Form.Control 
                type="text" 
                name="webhook_endpoint" 
                value={currentNetwork.webhook_endpoint || ''}
                onChange={handleInputChange}
                placeholder="e.g. https://api.valortek.com/webhook/amazon"
              />
              <Form.Text className="text-muted">
                Optional endpoint for receiving conversion notifications.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="switch"
                id="is_active"
                label="Active"
                name="is_active"
                checked={currentNetwork.is_active}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">
                Whether this network is currently active and available for use.
              </Form.Text>
            </Form.Group>
            
            <h5 className="mt-4">Advanced Configuration</h5>
            <hr />
            
            <Form.Group className="mb-3">
              <Form.Label>Payment Cycle</Form.Label>
              <Form.Select
                name="payment_cycle"
                value={currentNetwork.config?.payment_cycle || 'monthly'}
                onChange={(e) => setCurrentNetwork({
                  ...currentNetwork,
                  config: {
                    ...currentNetwork.config,
                    payment_cycle: e.target.value
                  }
                })}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Payment Threshold ($)</Form.Label>
              <Form.Control 
                type="number" 
                value={currentNetwork.config?.payment_threshold || ''}
                onChange={(e) => setCurrentNetwork({
                  ...currentNetwork,
                  config: {
                    ...currentNetwork.config,
                    payment_threshold: parseFloat(e.target.value)
                  }
                })}
                placeholder="e.g. 25"
                min="0"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                id="requires_approval"
                label="Requires Approval"
                checked={currentNetwork.config?.requires_approval || false}
                onChange={(e) => setCurrentNetwork({
                  ...currentNetwork,
                  config: {
                    ...currentNetwork.config,
                    requires_approval: e.target.checked
                  }
                })}
              />
              <Form.Text className="text-muted">
                Check if this network requires manual approval for affiliate applications.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Update Network' : 'Add Network'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AffiliateNetworksTable;
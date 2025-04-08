import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  Alert,
  Spinner,
  InputGroup
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AffiliateLinkForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  // State variables
  const [formData, setFormData] = useState({
    name: '',
    original_url: '',
    affiliate_url: '',
    network: '',
    category: '',
    commission_rate: '',
    is_active: true,
    app_source: ''
  });
  const [networks, setNetworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [autoGenerateUrl, setAutoGenerateUrl] = useState(true);
  
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be API calls
        // For now, using mock data
        
        // Mock networks
        const mockNetworks = [
          {
            id: 1,
            name: 'amazon',
            display_name: 'Amazon Associates'
          },
          {
            id: 2,
            name: 'walmart',
            display_name: 'Walmart Affiliate'
          },
          {
            id: 3,
            name: 'target',
            display_name: 'Target Affiliate Program'
          }
        ];
        
        // Mock categories
        const mockCategories = [
          'Electronics',
          'Kitchen',
          'Home',
          'Toys',
          'Fashion',
          'Beauty',
          'Books',
          'Sports',
          'School Supplies',
          'Other'
        ];
        
        setNetworks(mockNetworks);
        setCategories(mockCategories);
        
        // If in edit mode, fetch the affiliate link data
        if (isEditMode) {
          // This would be an API call in a real app
          // const response = await axios.get(`/api/affiliate/links/${id}`);
          
          // Mock data for edit mode
          if (id === '1') {
            // Simulate API response delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setFormData({
              name: 'Kitchen Mixer',
              original_url: 'https://amazon.com/product/12345',
              affiliate_url: 'https://amazon.com/product/12345?tag=example-20',
              network: 'amazon',
              category: 'Kitchen',
              commission_rate: '3.5',
              is_active: true,
              app_source: 'LaiChef'
            });
          } else {
            setError('Affiliate link not found');
          }
        }
      } catch (err) {
        setError('Error loading data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // If changing network or original_url and auto-generate is on, update affiliate_url
    if ((name === 'network' || name === 'original_url') && autoGenerateUrl) {
      handleGenerateAffiliateUrl(name === 'network' ? value : formData.network, name === 'original_url' ? value : formData.original_url);
    }
  };
  
  // Generate affiliate URL based on selected network and original URL
  const handleGenerateAffiliateUrl = async (network, url) => {
    if (!network || !url) return;
    
    // In a real app, this would call an API endpoint
    // Example API call:
    // try {
    //   const response = await axios.post('/api/affiliate/generate-url', {
    //     network,
    //     original_url: url
    //   });
    //   setFormData({
    //     ...formData,
    //     affiliate_url: response.data.affiliate_url
    //   });
    // } catch (err) {
    //   setError('Failed to generate affiliate URL: ' + err.message);
    // }
    
    // Mock URL generation for development
    let mockAffiliateUrl = '';
    
    if (network === 'amazon') {
      // Sample Amazon URL transformation
      if (url.includes('amazon.com')) {
        // Add or replace tag parameter
        const urlObj = new URL(url);
        urlObj.searchParams.set('tag', 'example-20');
        mockAffiliateUrl = urlObj.toString();
      } else {
        mockAffiliateUrl = `${url}${url.includes('?') ? '&' : '?'}tag=example-20`;
      }
    } else if (network === 'walmart') {
      // Sample Walmart URL transformation
      if (url.includes('walmart.com')) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('wmlspartner', 'affiliate123');
        mockAffiliateUrl = urlObj.toString();
      } else {
        mockAffiliateUrl = `${url}${url.includes('?') ? '&' : '?'}wmlspartner=affiliate123`;
      }
    } else if (network === 'target') {
      // Sample Target URL transformation
      if (url.includes('target.com')) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('afid', 'target123');
        mockAffiliateUrl = urlObj.toString();
      } else {
        mockAffiliateUrl = `${url}${url.includes('?') ? '&' : '?'}afid=target123`;
      }
    } else {
      mockAffiliateUrl = url; // Default: no transformation
    }
    
    setFormData({
      ...formData,
      affiliate_url: mockAffiliateUrl
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.original_url || !formData.affiliate_url || !formData.network) {
      setError('Please fill in all required fields');
      return;
    }
    
    setFormSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isEditMode) {
        // Update existing link (would be an API call in a real app)
        // await axios.put(`/api/affiliate/links/${id}`, formData);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        setSuccess('Affiliate link updated successfully');
      } else {
        // Create new link (would be an API call in a real app)
        // const response = await axios.post('/api/affiliate/links', formData);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        setSuccess('Affiliate link created successfully');
        
        // In a real app, might redirect to the new link's detail page
        // navigate(`/affiliate/links/edit/${response.data.id}`);
      }
      
      // In this mock version, redirect back to links list after a delay
      setTimeout(() => {
        navigate('/affiliate/links');
      }, 1500);
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} affiliate link: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEditMode ? 'Edit Affiliate Link' : 'Create Affiliate Link'}</h1>
        <Button as={Link} to="/affiliate/links" variant="secondary">
          Back to Links
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Link Name*</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Kitchen Mixer Deal"
                    required
                  />
                  <Form.Text className="text-muted">
                    A descriptive name for this affiliate link.
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Affiliate Network*</Form.Label>
                  <Form.Select 
                    name="network"
                    value={formData.network}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a network</option>
                    {networks.map(network => (
                      <option key={network.id} value={network.name}>
                        {network.display_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Original Product URL*</Form.Label>
              <Form.Control 
                type="url" 
                name="original_url" 
                value={formData.original_url}
                onChange={handleInputChange}
                placeholder="https://amazon.com/product/12345"
                required
              />
              <Form.Text className="text-muted">
                The original product URL without affiliate parameters.
              </Form.Text>
            </Form.Group>
            
            <Row className="mb-3">
              <Col>
                <Form.Check
                  type="checkbox"
                  id="autoGenerateUrl"
                  label="Auto-generate affiliate URL"
                  checked={autoGenerateUrl}
                  onChange={(e) => setAutoGenerateUrl(e.target.checked)}
                  className="mb-2"
                />
                
                <Form.Label>Affiliate URL*</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type="url" 
                    name="affiliate_url" 
                    value={formData.affiliate_url}
                    onChange={handleInputChange}
                    placeholder="https://amazon.com/product/12345?tag=example-20"
                    required
                    disabled={autoGenerateUrl}
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => handleGenerateAffiliateUrl(formData.network, formData.original_url)}
                    disabled={!formData.network || !formData.original_url}
                  >
                    Generate
                  </Button>
                </InputGroup>
                <Form.Text className="text-muted">
                  The URL with affiliate tracking parameters.
                </Form.Text>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Commission Rate (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="commission_rate" 
                    value={formData.commission_rate}
                    onChange={handleInputChange}
                    placeholder="e.g. 3.5"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>App Source</Form.Label>
                  <Form.Select 
                    name="app_source"
                    value={formData.app_source}
                    onChange={handleInputChange}
                  >
                    <option value="">None</option>
                    <option value="LaiTasks">LaiTasks</option>
                    <option value="LaiChef">LaiChef</option>
                    <option value="LaiTrips">LaiTrips</option>
                    <option value="LaiChore">LaiChore</option>
                    <option value="LaiBudget">LaiBudget</option>
                    <option value="LaiGifts">LaiGifts</option>
                    <option value="LaiShops">LaiShops</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="switch"
                id="is_active"
                label="Active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">
                Whether this affiliate link is currently active and trackable.
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                as={Link} 
                to="/affiliate/links"
                className="me-2"
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditMode ? 'Update Link' : 'Create Link'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AffiliateLinkForm;
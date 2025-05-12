import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Row, 
  Col, 
  Alert, 
  Spinner, 
  Table,
  Button,
  Badge
} from 'react-bootstrap';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Import affiliate marketing components - only what we need
import AffiliateNetworksTable from './AffiliateNetworksTable';

const AffiliateLinkStats = () => {
  const { id } = useParams();
  const [linkData, setLinkData] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeFrame, setTimeFrame] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, we'll use mock data
    const fetchLinkData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for the affiliate link
        const mockLinkData = {
          id: id,
          name: 'Kitchen Mixer Deluxe',
          original_url: 'https://amazon.com/product/12345',
          affiliate_url: 'https://amazon.com/product/12345?tag=example-20',
          short_code: 'mixer123',
          network: 'amazon',
          category: 'Kitchen',
          commission_rate: 3.5,
          is_active: true,
          createdAt: '2025-01-15T12:00:00Z',
          total_clicks: 487,
          total_conversions: 32,
          conversion_rate: 6.57,
          total_commission: 256.78
        };
        
        // Mock time series data for charts
        const mockTimeSeriesData = generateMockTimeSeriesData(timeFrame);
        
        setLinkData(mockLinkData);
        setStats(mockTimeSeriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching affiliate link data:', err);
        setError('Failed to load affiliate link statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLinkData();
  }, [id, timeFrame]);
  
  // Generate mock time series data based on the selected time frame
  const generateMockTimeSeriesData = (timeFrame) => {
    const dataPoints = timeFrame === 'week' ? 7 : 
                       timeFrame === 'month' ? 30 : 
                       timeFrame === 'year' ? 12 : 30;
    
    const mockData = [];
    const baseClicks = 10;
    const baseConversions = 1;
    
    for (let i = 0; i < dataPoints; i++) {
      const day = new Date();
      
      if (timeFrame === 'week' || timeFrame === 'month') {
        day.setDate(day.getDate() - (dataPoints - i - 1));
      } else if (timeFrame === 'year') {
        day.setMonth(day.getMonth() - (dataPoints - i - 1));
      }
      
      const clicks = baseClicks + Math.floor(Math.random() * 20);
      const conversions = baseConversions + Math.floor(Math.random() * 3);
      const commission = conversions * (15 + Math.random() * 10);
      
      mockData.push({
        date: timeFrame === 'year' ? 
          day.toLocaleString('default', { month: 'short' }) : 
          day.toLocaleDateString(),
        clicks: clicks,
        conversions: conversions,
        commission: commission.toFixed(2)
      });
    }
    
    return mockData;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Render loading spinner
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  // Render error message if any
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Affiliate Link Statistics</h1>
        <div>
          <Link to="/affiliate/links" className="btn btn-secondary me-2">
            Back to Links
          </Link>
          {linkData && (
            <Link to={`/affiliate/links/edit/${id}`} className="btn btn-primary">
              Edit Link
            </Link>
          )}
        </div>
      </div>
      
      {linkData && (
        <>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Link Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <dl className="row">
                    <dt className="col-sm-4">Name:</dt>
                    <dd className="col-sm-8">{linkData.name}</dd>
                    
                    <dt className="col-sm-4">Short Code:</dt>
                    <dd className="col-sm-8">
                      <code>{linkData.short_code}</code>
                    </dd>
                    
                    <dt className="col-sm-4">Network:</dt>
                    <dd className="col-sm-8">
                      <Badge bg={linkData.network === 'amazon' ? 'warning' : 'primary'}>
                        {linkData.network}
                      </Badge>
                    </dd>
                    
                    <dt className="col-sm-4">Category:</dt>
                    <dd className="col-sm-8">{linkData.category}</dd>
                  </dl>
                </Col>
                
                <Col md={6}>
                  <dl className="row">
                    <dt className="col-sm-4">Status:</dt>
                    <dd className="col-sm-8">
                      <Badge bg={linkData.is_active ? 'success' : 'secondary'}>
                        {linkData.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </dd>
                    
                    <dt className="col-sm-4">Commission Rate:</dt>
                    <dd className="col-sm-8">{linkData.commission_rate}%</dd>
                    
                    <dt className="col-sm-4">Created:</dt>
                    <dd className="col-sm-8">{formatDate(linkData.createdAt)}</dd>
                    
                    <dt className="col-sm-4">Original URL:</dt>
                    <dd className="col-sm-8">
                      <a href={linkData.original_url} target="_blank" rel="noreferrer" className="text-truncate d-block">
                        {linkData.original_url}
                      </a>
                    </dd>
                  </dl>
                </Col>
              </Row>
              
              <Row className="mt-3">
                <Col>
                  <h6>Affiliate URL:</h6>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      value={linkData.affiliate_url}
                      className="form-control form-control-sm me-2"
                      readOnly
                    />
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(linkData.affiliate_url)}
                    >
                      Copy
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Performance Summary</h5>
              <div className="btn-group">
                <Button 
                  variant={timeFrame === 'week' ? 'primary' : 'outline-primary'} 
                  onClick={() => setTimeFrame('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={timeFrame === 'month' ? 'primary' : 'outline-primary'} 
                  onClick={() => setTimeFrame('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={timeFrame === 'year' ? 'primary' : 'outline-primary'} 
                  onClick={() => setTimeFrame('year')}
                >
                  Year
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col sm={6} lg={3}>
                  <div className="text-center p-3 border rounded mb-3">
                    <h3>{linkData.total_clicks}</h3>
                    <p className="text-muted mb-0">Total Clicks</p>
                  </div>
                </Col>
                <Col sm={6} lg={3}>
                  <div className="text-center p-3 border rounded mb-3">
                    <h3>{linkData.total_conversions}</h3>
                    <p className="text-muted mb-0">Conversions</p>
                  </div>
                </Col>
                <Col sm={6} lg={3}>
                  <div className="text-center p-3 border rounded mb-3">
                    <h3>{linkData.conversion_rate}%</h3>
                    <p className="text-muted mb-0">Conversion Rate</p>
                  </div>
                </Col>
                <Col sm={6} lg={3}>
                  <div className="text-center p-3 border rounded mb-3">
                    <h3>{formatCurrency(linkData.total_commission)}</h3>
                    <p className="text-muted mb-0">Total Commission</p>
                  </div>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <h6>Clicks Over Time</h6>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="clicks" stroke="#8884d8" name="Clicks" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
                
                <Col md={6}>
                  <h6>Commission Over Time</h6>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="commission" fill="#82ca9d" name="Commission" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h5 className="mb-0">Click History</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clicks</th>
                    <th>Conversions</th>
                    <th>Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((day, index) => (
                    <tr key={index}>
                      <td>{day.date}</td>
                      <td>{day.clicks}</td>
                      <td>{day.conversions}</td>
                      <td>{formatCurrency(day.commission)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default AffiliateLinkStats;
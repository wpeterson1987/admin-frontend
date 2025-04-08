import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Row, 
  Col, 
  Tabs, 
  Tab, 
  Button, 
  Alert,
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Import our components
import AffiliateLinksTable from '../../components/AffiliateManagement/AffiliateLinksTable';
import AffiliateNetworksTable from '../../components/AffiliateManagement/AffiliateNetworksTable';
import StatisticsFilters from '../../components/AffiliateManagement/StatisticsFilters';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AffiliateMarketingDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('overview');
  const [statistics, setStatistics] = useState(null);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch statistics data
  //useEffect(() => {
  //  const fetchStatistics = async () => {
  //    try {
  //      setLoading(true);
  //      const response = await axios.get(`/api/affiliate/statistics?period=${period}`);
  //      if (response.data.success) {
  //        setStatistics(response.data.statistics);
  //      } else {
  //        setError('Failed to load statistics');
  //      }
  //    } catch (err) {
  //      setError('Error fetching affiliate statistics: ' + err.message);
  //    } finally {
  //      setLoading(false);
  //    }
  //  };

  //  fetchStatistics();

  useEffect(() => {
    // Instead, use mock data
    setTimeout(() => {
      const mockStatistics = {
        period: 'month',
        totalClicks: 1248,
        totalConversions: 67,
        totalCommission: 532.45,
        totalPurchaseAmount: 7890.32,
        conversionRate: 5.37,
        networkStats: {
          'amazon': {
            conversions: 42,
            commission: 321.75,
            purchaseAmount: 4580.20
          },
          'walmart': {
            conversions: 18,
            commission: 156.30,
            purchaseAmount: 2345.12
          },
          'target': {
            conversions: 7,
            commission: 54.40,
            purchaseAmount: 965.00
          }
        },
        categoryStats: {
          'Electronics': {
            conversions: 24,
            commission: 256.80,
            purchaseAmount: 3560.45
          },
          'Home': {
            conversions: 18,
            commission: 142.25,
            purchaseAmount: 2150.30
          },
          'Kitchen': {
            conversions: 15,
            commission: 98.40,
            purchaseAmount: 1489.57
          },
          'Other': {
            conversions: 10,
            commission: 35.00,
            purchaseAmount: 690.00
          }
        }
      };
      
      setStatistics(mockStatistics);
      setLoading(false);
    }, 800);
  }, [period]); // This dependency array is correct
    
  
  //}, [period]);

  
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Prepare data for network chart
  const prepareNetworkData = () => {
    if (!statistics || !statistics.networkStats) return [];
    
    return Object.entries(statistics.networkStats).map(([network, stats]) => ({
      name: network,
      conversions: stats.conversions,
      commission: stats.commission,
      value: stats.commission // for pie chart
    }));
  };
  
  // Prepare data for category chart
  const prepareCategoryData = () => {
    if (!statistics || !statistics.categoryStats) return [];
    
    return Object.entries(statistics.categoryStats).map(([category, stats]) => ({
      name: category,
      conversions: stats.conversions,
      commission: stats.commission,
      value: stats.commission // for pie chart
    }));
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
        <h1>Affiliate Marketing</h1>
        <div>
          <Link to="/" className="btn btn-secondary me-2">Dashboard</Link>
          <Button variant="primary" as={Link} to="/affiliate/links/new">Create New Link</Button>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>{statistics?.totalClicks || 0}</h3>
              <p className="mb-0">Total Clicks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>{statistics?.totalConversions || 0}</h3>
              <p className="mb-0">Conversions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>{formatCurrency(statistics?.totalCommission || 0)}</h3>
              <p className="mb-0">Commission</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>{statistics?.conversionRate?.toFixed(2) || 0}%</h3>
              <p className="mb-0">Conversion Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Time Period Filter */}
      <StatisticsFilters period={period} setPeriod={setPeriod} />
      
      {/* Tabs for different sections */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="overview" title="Overview">
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>Commission by Network</Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareNetworkData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                      >
                        {prepareNetworkData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>Commission by Category</Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prepareCategoryData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="commission" fill="#8884d8" name="Commission" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="links" title="Affiliate Links">
          <AffiliateLinksTable />
        </Tab>
        
        <Tab eventKey="networks" title="Networks">
          <AffiliateNetworksTable />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AffiliateMarketingDashboard;
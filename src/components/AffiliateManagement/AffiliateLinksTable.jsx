import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Badge, 
  Form, 
  InputGroup,
  Pagination,
  Spinner,
  Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BsSearch, BsPencil, BsToggleOn, BsToggleOff, BsBarChart } from 'react-icons/bs';

const AffiliateLinksTable = () => {
  // State variables
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Mock data for now - would be replaced with API call
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        // This would be an actual API call in production
        // const response = await axios.get('/api/affiliate/links');
        
        // Using mock data for development
        setTimeout(() => {
          const mockLinks = [
            {
              id: 1,
              name: 'Kitchen Mixer',
              original_url: 'https://amazon.com/product/12345',
              short_code: 'abcd123',
              network: 'amazon',
              category: 'Kitchen',
              commission_rate: 3.5,
              is_active: true,
              createdAt: '2025-03-15T12:00:00Z',
              clicks: 156,
              conversions: 12,
              commission_earned: 85.42
            },
            {
              id: 2,
              name: 'Gaming Laptop',
              original_url: 'https://amazon.com/product/67890',
              short_code: 'efgh456',
              network: 'amazon',
              category: 'Electronics',
              commission_rate: 4.0,
              is_active: true,
              createdAt: '2025-03-10T15:30:00Z',
              clicks: 324,
              conversions: 8,
              commission_earned: 240.00
            },
            {
              id: 3,
              name: 'Children\'s Backpack',
              original_url: 'https://walmart.com/product/54321',
              short_code: 'ijkl789',
              network: 'walmart',
              category: 'School Supplies',
              commission_rate: 5.0,
              is_active: false,
              createdAt: '2025-02-28T09:15:00Z',
              clicks: 89,
              conversions: 4,
              commission_earned: 32.75
            }
          ];
          
          setLinks(mockLinks);
          setTotalPages(1); // In real app, this would come from the API
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Error fetching affiliate links: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchLinks();
  }, [currentPage, sortField, sortDirection]);
  
  // Handle toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    // In real app, this would be an API call
    // try {
    //   await axios.patch(`/api/affiliate/links/${id}`, {
    //     is_active: !currentStatus
    //   });
    
    // Update local state
    setLinks(links.map(link => 
      link.id === id ? { ...link, is_active: !currentStatus } : link
    ));
    // } catch (err) {
    //   setError('Error updating link status: ' + err.message);
    // }
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filtered links based on search
  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    link.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.network.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Affiliate Links</h5>
          <div className="d-flex">
            <InputGroup className="me-2" style={{ width: '300px' }}>
              <InputGroup.Text><BsSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Search by name, code, or network"
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
            <Button 
              variant="primary" 
              as={Link} 
              to="/affiliate/links/new"
            >
              Create Link
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover>
          <thead>
            <tr>
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Short Code</th>
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('network')}
              >
                Network {sortField === 'network' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Category</th>
              <th>Clicks</th>
              <th>Conversions</th>
              <th>Earned</th>
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('createdAt')}
              >
                Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No affiliate links found matching your search.
                </td>
              </tr>
            ) : (
              filteredLinks.map(link => (
                <tr key={link.id}>
                  <td>{link.name}</td>
                  <td>
                    <code>{link.short_code}</code>
                  </td>
                  <td>
                    <Badge bg={link.network === 'amazon' ? 'warning' : 'primary'}>
                      {link.network}
                    </Badge>
                  </td>
                  <td>{link.category || '-'}</td>
                  <td>{link.clicks}</td>
                  <td>{link.conversions}</td>
                  <td>{formatCurrency(link.commission_earned)}</td>
                  <td>{formatDate(link.createdAt)}</td>
                  <td>
                    <Badge bg={link.is_active ? 'success' : 'secondary'}>
                      {link.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="link" 
                      className="p-0 me-2"
                      as={Link}
                      to={`/affiliate/links/edit/${link.id}`}
                      title="Edit"
                    >
                      <BsPencil />
                    </Button>
                    <Button 
                      variant="link" 
                      className="p-0 me-2"
                      onClick={() => handleToggleActive(link.id, link.is_active)}
                      title={link.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {link.is_active ? <BsToggleOn className="text-success" /> : <BsToggleOff />}
                    </Button>
                    <Button 
                      variant="link" 
                      className="p-0"
                      as={Link}
                      to={`/affiliate/links/stats/${link.id}`}
                      title="Statistics"
                    >
                      <BsBarChart />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
      {totalPages > 1 && (
        <Card.Footer>
          <Pagination className="justify-content-center mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        </Card.Footer>
      )}
    </Card>
  );
};

export default AffiliateLinksTable;
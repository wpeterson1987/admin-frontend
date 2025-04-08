// src/components/SystemSettings/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    siteName: 'Valortek Admin',
    siteUrl: 'https://admin.valortek.com',
    emailServer: 'smtp.example.com',
    emailPort: '587',
    emailUsername: 'notifications@valortek.com',
    emailPassword: '••••••••••••',
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: '30',
    lastBackupDate: '2025-04-07T01:30:00Z'
  });

  // Simulate loading settings
  useEffect(() => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Handle settings form changes
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle settings form submission
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setSuccess('Settings saved successfully');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
  };

  // Handle manual backup
  const handleManualBackup = () => {
    setBackupLoading(true);
    setSuccess('');
    setError('');
    
    // Mock API call
    setTimeout(() => {
      setSuccess('Backup completed successfully');
      setBackupLoading(false);
      
      // Update last backup date
      setSettings({
        ...settings,
        lastBackupDate: new Date().toISOString()
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 2000);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !settings) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>System Settings</h1>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
      
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="general" title="General">
          <Card>
            <Card.Header>General Settings</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSettingsSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Site Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleSettingChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Site URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="siteUrl"
                        value={settings.siteUrl}
                        onChange={handleSettingChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="email" title="Email Configuration">
          <Card>
            <Card.Header>Email Settings</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSettingsSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SMTP Server</Form.Label>
                      <Form.Control
                        type="text"
                        name="emailServer"
                        value={settings.emailServer}
                        onChange={handleSettingChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SMTP Port</Form.Label>
                      <Form.Control
                        type="text"
                        name="emailPort"
                        value={settings.emailPort}
                        onChange={handleSettingChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="emailUsername"
                        value={settings.emailUsername}
                        onChange={handleSettingChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="emailPassword"
                        value={settings.emailPassword}
                        onChange={handleSettingChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    className="me-2"
                  >
                    Test Connection
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="backup" title="Backup & Restore">
          <Card>
            <Card.Header>Backup Settings</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSettingsSubmit}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="autoBackup"
                    label="Enable Automatic Backups"
                    name="autoBackup"
                    checked={settings.autoBackup}
                    onChange={handleSettingChange}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Backup Frequency</Form.Label>
                      <Form.Select
                        name="backupFrequency"
                        value={settings.backupFrequency}
                        onChange={handleSettingChange}
                        disabled={!settings.autoBackup}
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Retention Period (days)</Form.Label>
                      <Form.Control
                        type="number"
                        name="backupRetention"
                        value={settings.backupRetention}
                        onChange={handleSettingChange}
                        disabled={!settings.autoBackup}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <p className="mb-0"><strong>Last Backup:</strong> {formatDate(settings.lastBackupDate)}</p>
                  </div>
                  <div>
                    <Button 
                      variant="success" 
                      className="me-2"
                      onClick={handleManualBackup}
                      disabled={backupLoading}
                    >
                      {backupLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Creating Backup...
                        </>
                      ) : (
                        'Create Manual Backup'
                      )}
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header>Backup History</Card.Header>
            <Card.Body>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Size</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formatDate('2025-04-07T01:30:00Z')}</td>
                    <td>24.3 MB</td>
                    <td>Automatic</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2">Download</Button>
                      <Button variant="outline-success" size="sm">Restore</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>{formatDate('2025-04-06T01:30:00Z')}</td>
                    <td>24.1 MB</td>
                    <td>Automatic</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2">Download</Button>
                      <Button variant="outline-success" size="sm">Restore</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>{formatDate('2025-04-05T14:15:00Z')}</td>
                    <td>23.8 MB</td>
                    <td>Manual</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2">Download</Button>
                      <Button variant="outline-success" size="sm">Restore</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SystemSettings;
// src/components/SystemSettings/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = 'https://tasks.valortek.com';
axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [backups, setBackups] = useState([]);
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
    lastBackupDate: new Date().toISOString()
  });

  // Fetch settings and backup history
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch backup settings
        const settingsResponse = await axios.get('/api/backup/settings');
        if (settingsResponse.data.success) {
          setSettings(prev => ({
            ...prev,
            ...settingsResponse.data.settings
          }));
        }
        
        // Fetch backup history
        const historyResponse = await axios.get('/api/backup/history');
        if (historyResponse.data.success) {
          setBackups(historyResponse.data.backups);
        }
      } catch (err) {
        setError(`Error loading settings: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      console.log('Submitting settings:', {
        autoBackup: settings.autoBackup,
        backupFrequency: settings.backupFrequency,
        backupRetention: settings.backupRetention
      });
      
      // Update backup settings
      const response = await axios.put('/api/backup/settings', {
        autoBackup: settings.autoBackup,
        backupFrequency: settings.backupFrequency,
        backupRetention: settings.backupRetention
      });
      
      console.log('API response:', response);
      
      if (response.data.success) {
        setSuccess('Settings saved successfully');
      } else {
        setError(`Failed to save settings: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Full error object:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
        setError(`Error: ${err.response.data.message || err.response.statusText || err.message}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        setError('Error: No response received from server. Network issue or server unreachable.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle manual backup
  const handleManualBackup = async () => {
    setBackupLoading(true);
    setSuccess('');
    setError('');
    
    try {
      console.log('Creating manual backup...');
      
      const response = await axios.post('/api/backup/create');
      
      console.log('API response:', response);
      
      if (response.data.success) {
        setSuccess('Backup completed successfully');
        
        // Update last backup date
        setSettings({
          ...settings,
          lastBackupDate: new Date().toISOString()
        });
        
        // Refresh backup history
        try {
          const historyResponse = await axios.get('/api/backup/history');
          if (historyResponse.data.success) {
            setBackups(historyResponse.data.backups);
          }
        } catch (histErr) {
          console.error('Error refreshing history:', histErr);
        }
      } else {
        setError(`Failed to create backup: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Full error object:', err);
      
      if (err.response) {
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);
        setError(`Error: ${err.response.data.message || err.response.statusText || err.message}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('Error: No response received from server. Network issue or server unreachable.');
      } else {
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setBackupLoading(false);
    }
  };

  // Handle backup download
  const handleDownload = (filename) => {
    window.open(`/api/backup/download/${filename}`, '_blank');
  };

  // Handle backup restore
  const handleRestore = async (filename) => {
    if (!window.confirm('Are you sure you want to restore from this backup? This will overwrite current data.')) {
      return;
    }
    
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const response = await axios.post(`/api/backup/restore/${filename}`);
      
      if (response.data.success) {
        setSuccess('Backup restored successfully. The page will refresh in a few seconds.');
        
        // Refresh the page after a delay
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setError('Failed to restore backup');
      }
    } catch (err) {
      setError(`Error restoring backup: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
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
        {/* General and Email tabs remain the same */}
        
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
                    <p className="mb-0">
                      <strong>Last Backup:</strong> {settings.lastBackupDate ? formatDate(settings.lastBackupDate) : 'Never'}
                    </p>
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
              {backups.length === 0 ? (
                <p className="text-center">No backups found</p>
              ) : (
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
                    {backups.map((backup) => (
                      <tr key={backup.id}>
                        <td>{formatDate(backup.created_at)}</td>
                        <td>{backup.size} MB</td>
                        <td>{backup.type}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleDownload(backup.filename)}
                          >
                            Download
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleRestore(backup.filename)}
                          >
                            Restore
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SystemSettings;
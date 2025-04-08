import React from 'react';
import { ButtonGroup, Button, Card } from 'react-bootstrap';

const StatisticsFilters = ({ period, setPeriod }) => {
  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ];
  
  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex align-items-center">
          <span className="me-3 fw-bold">Time Period:</span>
          <ButtonGroup>
            {periods.map((p) => (
              <Button
                key={p.value}
                variant={period === p.value ? 'primary' : 'outline-primary'}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatisticsFilters;
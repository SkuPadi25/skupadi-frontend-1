import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EnrollmentTrendChart = () => {
  const data = [
    { month: 'Jan', students: 1250, newEnrollments: 45 },
    { month: 'Feb', students: 1285, newEnrollments: 35 },
    { month: 'Mar', students: 1310, newEnrollments: 25 },
    { month: 'Apr', students: 1340, newEnrollments: 30 },
    { month: 'May', students: 1365, newEnrollments: 25 },
    { month: 'Jun', students: 1390, newEnrollments: 25 },
    { month: 'Jul', students: 1420, newEnrollments: 30 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{`${label} 2025`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Enrollment Trends</h3>
          <p className="text-sm text-muted-foreground">Total students and new enrollments</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Total Students</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">New Enrollments</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-80" aria-label="Enrollment Trend Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="students" 
              stroke="var(--color-success)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              name="Total Students"
            />
            <Line 
              type="monotone" 
              dataKey="newEnrollments" 
              stroke="var(--color-warning)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              name="New Enrollments"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnrollmentTrendChart;
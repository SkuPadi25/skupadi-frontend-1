import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const PayByClassChart = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [chartData, setChartData] = useState([]);
  
  // Complete Nigerian Education System Data
  const generateComprehensiveData = () => {
    return [
      // Creche Level
      { 
        class: 'Creche', 
        level: 'creche',
        invoiced: 125000, 
        paid: 110000, 
        pending: 15000 
      },
      
      // Nursery Levels (1-3)
      { 
        class: 'Nursery 1', 
        level: 'nursery',
        invoiced: 180000, 
        paid: 165000, 
        pending: 15000 
      },
      { 
        class: 'Nursery 2', 
        level: 'nursery',
        invoiced: 195000, 
        paid: 175000, 
        pending: 20000 
      },
      { 
        class: 'Nursery 3', 
        level: 'nursery',
        invoiced: 210000, 
        paid: 190000, 
        pending: 20000 
      },
      
      // Primary Levels (1-6)
      { 
        class: 'Primary 1', 
        level: 'primary',
        invoiced: 245000, 
        paid: 220000, 
        pending: 25000 
      },
      { 
        class: 'Primary 2', 
        level: 'primary',
        invoiced: 250000, 
        paid: 235000, 
        pending: 15000 
      },
      { 
        class: 'Primary 3', 
        level: 'primary',
        invoiced: 255000, 
        paid: 240000, 
        pending: 15000 
      },
      { 
        class: 'Primary 4', 
        level: 'primary',
        invoiced: 260000, 
        paid: 245000, 
        pending: 15000 
      },
      { 
        class: 'Primary 5', 
        level: 'primary',
        invoiced: 265000, 
        paid: 250000, 
        pending: 15000 
      },
      { 
        class: 'Primary 6', 
        level: 'primary',
        invoiced: 270000, 
        paid: 255000, 
        pending: 15000 
      },
      
      // Junior Secondary School (JSS 1-3)
      { 
        class: 'JSS 1', 
        level: 'junior_secondary',
        invoiced: 285000, 
        paid: 245000, 
        pending: 40000 
      },
      { 
        class: 'JSS 2', 
        level: 'junior_secondary',
        invoiced: 320000, 
        paid: 298000, 
        pending: 22000 
      },
      { 
        class: 'JSS 3', 
        level: 'junior_secondary',
        invoiced: 310000, 
        paid: 285000, 
        pending: 25000 
      },
      
      // Senior Secondary School (SSS 1-3) - Updated naming
      { 
        class: 'SSS 1', 
        level: 'senior_secondary',
        invoiced: 365000, 
        paid: 330000, 
        pending: 35000 
      },
      { 
        class: 'SSS 2', 
        level: 'senior_secondary',
        invoiced: 380000, 
        paid: 345000, 
        pending: 35000 
      },
      { 
        class: 'SSS 3', 
        level: 'senior_secondary',
        invoiced: 395000, 
        paid: 365000, 
        pending: 30000 
      }
    ];
  };

  const rawData = generateComprehensiveData();

  useEffect(() => {
    // Filter data based on selected education level
    let filteredData = rawData;
    
    if (selectedLevel !== 'all') {
      filteredData = rawData?.filter(item => item?.level === selectedLevel);
    }
    
    setChartData(filteredData);
  }, [selectedLevel]);

  const getFilteredData = () => {
    if (selectedFilter === 'all') return chartData;
    return chartData?.map(item => ({
      ...item,
      [selectedFilter === 'invoiced' ? 'paid' : selectedFilter === 'paid' ? 'invoiced' : 'invoiced']: 0,
      [selectedFilter === 'invoiced' ? 'pending' : selectedFilter === 'paid' ? 'pending' : 'paid']: 0
    }));
  };

  const filterOptions = [
    { value: 'all', label: 'All Categories', color: 'var(--color-primary)' },
    { value: 'invoiced', label: 'Invoiced', color: 'var(--color-info)' },
    { value: 'paid', label: 'Paid', color: 'var(--color-success)' },
    { value: 'pending', label: 'Pending', color: 'var(--color-warning)' }
  ];

  const levelOptions = [
    { value: 'all', label: 'All Levels'},
    { value: 'creche', label: 'Creche'},
    { value: 'nursery', label: 'Nursery (1-3)'},
    { value: 'primary', label: 'Primary (1-6)'},
    { value: 'junior_secondary', label: 'JSS (1-3)'},
    { value: 'senior_secondary', label: 'SSS (1-3)'}
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{`${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ₦${entry?.value?.toLocaleString()}`}
            </p>
          ))}
          {payload?.length > 0 && payload?.[0]?.payload?.invoiced > 0 && (
            <div className="mt-1 pt-1 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Collection Rate: {((payload?.[0]?.payload?.paid / payload?.[0]?.payload?.invoiced) * 100)?.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Pending Rate: {((payload?.[0]?.payload?.pending / payload?.[0]?.payload?.invoiced) * 100)?.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                Level: {payload?.[0]?.payload?.level?.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    const totalInvoiced = chartData?.reduce((sum, item) => sum + item?.invoiced, 0);
    const totalPaid = chartData?.reduce((sum, item) => sum + item?.paid, 0);
    const totalPending = chartData?.reduce((sum, item) => sum + item?.pending, 0);
    const collectionRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;
    
    return { totalInvoiced, totalPaid, totalPending, collectionRate };
  }, [chartData]);

  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6 card-shadow h-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pay by Class</h3>
            <p className="text-sm text-muted-foreground">
              Fee collection across Nigerian education system • {chartData?.length} classes
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Invoiced</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Paid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Pending</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-semibold text-foreground">₦{(summaryStats?.totalInvoiced / 1000)?.toFixed(0)}k</div>
            <div className="text-xs text-muted-foreground">Total Invoiced</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-success">₦{(summaryStats?.totalPaid / 1000)?.toFixed(0)}k</div>
            <div className="text-xs text-muted-foreground">Total Paid</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-warning">₦{(summaryStats?.totalPending / 1000)?.toFixed(0)}k</div>
            <div className="text-xs text-muted-foreground">Total Pending</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-primary">{summaryStats?.collectionRate?.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Collection Rate</div>
          </div>
        </div>
        
        {/* Education Level Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Education Level</label>
          <div className="flex flex-wrap gap-2">
            {levelOptions?.map((level) => (
              <button
                key={level?.value}
                onClick={() => setSelectedLevel(level?.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                  selectedLevel === level?.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <span>{level?.icon}</span>
                <span>{level?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Payment Status</label>
          <div className="flex flex-wrap gap-2">
            {filterOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setSelectedFilter(option?.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedFilter === option?.value
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full h-64 sm:h-80 lg:h-96" aria-label="Pay by Class Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={getFilteredData()} 
            margin={{ 
              top: 20, 
              right: window.innerWidth < 640 ? 10 : 30, 
              left: window.innerWidth < 640 ? 10 : 20, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="class" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
              angle={chartData?.length > 8 ? -45 : 0}
              textAnchor={chartData?.length > 8 ? 'end' : 'middle'}
              height={chartData?.length > 8 ? 80 : 30}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
              tickFormatter={(value) => `₦${value / 1000}k`}
              width={window.innerWidth < 640 ? 50 : 70}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {(selectedFilter === 'all' || selectedFilter === 'invoiced') && (
              <Bar 
                dataKey="invoiced" 
                fill="var(--color-primary)" 
                radius={[0, 0, 4, 4]}
                name="Invoiced Amount"
                opacity={selectedFilter === 'invoiced' ? 1 : 0.8}
              />
            )}
            
            {(selectedFilter === 'all' || selectedFilter === 'paid') && (
              <Bar 
                dataKey="paid" 
                fill="var(--color-success)" 
                radius={selectedFilter === 'all' ? [0, 0, 0, 0] : [0, 0, 4, 4]}
                name="Paid Amount"
                opacity={selectedFilter === 'paid' ? 1 : 0.9}
              />
            )}
            
            {(selectedFilter === 'all' || selectedFilter === 'pending') && (
              <Bar 
                dataKey="pending" 
                fill="var(--color-warning)" 
                radius={selectedFilter === 'all' ? [4, 4, 0, 0] : [0, 0, 4, 4]}
                name="Pending Amount"
                opacity={selectedFilter === 'pending' ? 1 : 0.8}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Active Filters Display */}
      {(selectedLevel !== 'all' || selectedFilter !== 'all') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing: <span className="font-medium text-foreground">
                {levelOptions?.find(l => l?.value === selectedLevel)?.label || 'All Levels'}
              </span> • <span className="font-medium text-foreground">
                {filterOptions?.find(f => f?.value === selectedFilter)?.label || 'All Categories'}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedLevel('all');
                setSelectedFilter('all');
              }}
              className="text-sm text-primary hover:text-primary/80 underline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayByClassChart;
import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StudentReportsTab = ({ globalFilters, onGlobalFilterChange }) => {
  const [reportType, setReportType] = useState('enrollment');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for enrollment trends
  const enrollmentData = [
    { month: 'Jan', enrolled: 120, graduated: 15 },
    { month: 'Feb', enrolled: 135, graduated: 8 },
    { month: 'Mar', enrolled: 142, graduated: 12 },
    { month: 'Apr', enrolled: 158, graduated: 20 },
    { month: 'May', enrolled: 165, graduated: 18 },
    { month: 'Jun', enrolled: 172, graduated: 25 }
  ];

  // Mock data for demographics
  const demographicsData = [
    { name: 'Grade 1-3', value: 280, color: '#3B82F6' },
    { name: 'Grade 4-6', value: 320, color: '#10B981' },
    { name: 'Grade 7-9', value: 380, color: '#F59E0B' },
    { name: 'Grade 10-12', value: 420, color: '#EF4444' }
  ];

  // Mock data for performance summary
  const performanceData = [
    { subject: 'Mathematics', average: 78, students: 156 },
    { subject: 'English', average: 82, students: 156 },
    { subject: 'Science', average: 75, students: 156 },
    { subject: 'Social Studies', average: 80, students: 156 },
    { subject: 'Arts', average: 85, students: 156 }
  ];

  const reportTypeOptions = [
    { value: 'enrollment', label: 'Enrollment Trends' },
    { value: 'demographics', label: 'Student Demographics' },
    { value: 'performance', label: 'Academic Performance' },
    { value: 'attendance', label: 'Attendance Overview' }
  ];

  const classOptions = [
    { value: '', label: 'All Classes' },
    { value: 'grade1', label: 'Grade 1' },
    { value: 'grade2', label: 'Grade 2' },
    { value: 'grade3', label: 'Grade 3' },
    { value: 'grade4', label: 'Grade 4' },
    { value: 'grade5', label: 'Grade 5' }
  ];

  const handleExportReport = () => {
    alert(`Exporting ${reportType} report...`);
  };

  const renderChart = () => {
    switch (reportType) {
      case 'enrollment':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Enrollment Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="#3B82F6" name="New Enrollments" />
                <Bar dataKey="graduated" fill="#10B981" name="Graduations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'demographics':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Student Demographics by Grade</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'performance':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Academic Performance Summary</h3>
            <div className="space-y-4">
              {performanceData.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{subject.subject}</h4>
                    <p className="text-sm text-muted-foreground">{subject.students} students</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">{subject.average}%</div>
                    <div className="text-sm text-muted-foreground">Average</div>
                  </div>
                  <div className="ml-4 w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${subject.average}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-6 rounded-lg border border-border text-center">
            <Icon name="BarChart3" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Select a Report Type</h3>
            <p className="text-muted-foreground">Choose a report type from the dropdown to view data visualization</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Report Type"
            options={reportTypeOptions}
            value={reportType}
            onChange={setReportType}
          />
          <Select
            label="Class Filter"
            options={classOptions}
            value={globalFilters?.class || ''}
            onChange={(value) => onGlobalFilterChange?.('class', value)}
          />
          <div className="md:col-span-2">
            <Input
              label="Search Students"
              placeholder="Search by name, ID, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">1,420</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+5.2% from last month</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Enrollments</p>
              <p className="text-2xl font-bold text-foreground">42</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="UserPlus" size={24} className="text-success" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+12.3% this month</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Performance</p>
              <p className="text-2xl font-bold text-foreground">78.5%</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-warning" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+2.1% improvement</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <p className="text-2xl font-bold text-foreground">94.2%</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={24} className="text-accent" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+1.8% this month</span>
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      {renderChart()}

      {/* Export Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleExportReport}>
          <Icon name="Download" size={16} className="mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" onClick={handleExportReport}>
          <Icon name="FileText" size={16} className="mr-2" />
          Export Excel
        </Button>
      </div>
    </div>
  );
};

export default StudentReportsTab;
import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AttendanceReportsTab = ({ globalFilters, onGlobalFilterChange }) => {
  const [reportType, setReportType] = useState('daily');
  const [selectedClass, setSelectedClass] = useState('');

  // Mock daily attendance data
  const dailyAttendanceData = [
    { date: 'Jan 1', present: 1280, absent: 140, late: 35, total: 1420 },
    { date: 'Jan 2', present: 1305, absent: 115, late: 28, total: 1420 },
    { date: 'Jan 3', present: 1320, absent: 100, late: 22, total: 1420 },
    { date: 'Jan 4', present: 1295, absent: 125, late: 30, total: 1420 },
    { date: 'Jan 5', present: 1340, absent: 80, late: 18, total: 1420 },
    { date: 'Jan 6', present: 1315, absent: 105, late: 25, total: 1420 },
    { date: 'Jan 7', present: 1350, absent: 70, late: 15, total: 1420 }
  ];

  // Mock class-wise attendance data
  const classAttendanceData = [
    { class: 'Grade 1', present: 92.5, absent: 7.5, students: 120 },
    { class: 'Grade 2', present: 89.2, absent: 10.8, students: 115 },
    { class: 'Grade 3', present: 94.1, absent: 5.9, students: 135 },
    { class: 'Grade 4', present: 87.8, absent: 12.2, students: 128 },
    { class: 'Grade 5', present: 91.3, absent: 8.7, students: 142 },
    { class: 'Grade 6', present: 93.6, absent: 6.4, students: 156 }
  ];

  // Mock student attendance details
  const studentAttendanceData = [
    { 
      id: 'STU-001', 
      name: 'Emma Johnson', 
      class: 'Grade 10', 
      present: 18, 
      absent: 2, 
      late: 1, 
      rate: 90,
      lastAbsent: '2025-01-10'
    },
    { 
      id: 'STU-002', 
      name: 'Michael Chen', 
      class: 'Grade 11', 
      present: 19, 
      absent: 1, 
      late: 0, 
      rate: 95,
      lastAbsent: '2025-01-05'
    },
    { 
      id: 'STU-003', 
      name: 'Sarah Williams', 
      class: 'Grade 9', 
      present: 16, 
      absent: 4, 
      late: 2, 
      rate: 80,
      lastAbsent: '2025-01-12'
    },
    { 
      id: 'STU-004', 
      name: 'David Rodriguez', 
      class: 'Grade 12', 
      present: 20, 
      absent: 0, 
      late: 1, 
      rate: 100,
      lastAbsent: 'Never'
    }
  ];

  const reportTypeOptions = [
    { value: 'daily', label: 'Daily Attendance' },
    { value: 'class', label: 'Class-wise Report' },
    { value: 'student', label: 'Student Details' },
    { value: 'trends', label: 'Attendance Trends' }
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
    alert(`Exporting ${reportType} attendance report...`);
  };

  const getAttendanceRate = (present, total) => {
    return ((present / total) * 100).toFixed(1);
  };

  const renderChart = () => {
    switch (reportType) {
      case 'daily':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Daily Attendance Overview</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#10B981" name="Present" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                <Bar dataKey="late" fill="#F59E0B" name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'class':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Class-wise Attendance Rates</h3>
            <div className="space-y-4">
              {classAttendanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.class}</h4>
                    <p className="text-sm text-muted-foreground">{item.students} students</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-success">{item.present}%</div>
                      <div className="text-sm text-muted-foreground">Present</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-destructive">{item.absent}%</div>
                      <div className="text-sm text-muted-foreground">Absent</div>
                    </div>
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full" 
                        style={{ width: `${item.present}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'student':
        return (
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Student Attendance Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Student</th>
                    <th className="text-center px-6 py-3 text-sm font-medium text-foreground">Present</th>
                    <th className="text-center px-6 py-3 text-sm font-medium text-foreground">Absent</th>
                    <th className="text-center px-6 py-3 text-sm font-medium text-foreground">Late</th>
                    <th className="text-center px-6 py-3 text-sm font-medium text-foreground">Rate</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Last Absent</th>
                    <th className="text-center px-6 py-3 text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {studentAttendanceData.map((student, index) => (
                    <tr key={index} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.class} • {student.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
                          {student.present}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
                          {student.absent}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning">
                          {student.late}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`font-semibold ${student.rate >= 90 ? 'text-success' : student.rate >= 75 ? 'text-warning' : 'text-destructive'}`}>
                            {student.rate}%
                          </span>
                          <div className="w-12 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${student.rate >= 90 ? 'bg-success' : student.rate >= 75 ? 'bg-warning' : 'bg-destructive'}`}
                              style={{ width: `${student.rate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{student.lastAbsent}</td>
                      <td className="px-6 py-4 text-center">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-6 rounded-lg border border-border text-center">
            <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Select Report Type</h3>
            <p className="text-muted-foreground">Choose a report type to view attendance data visualization</p>
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
            value={selectedClass}
            onChange={setSelectedClass}
          />
          <Select
            label="Date Range"
            options={[
              { value: '7days', label: 'Last 7 days' },
              { value: '30days', label: 'Last 30 days' },
              { value: 'term', label: 'Current Term' },
              { value: 'custom', label: 'Custom Range' }
            ]}
            value={globalFilters?.dateRange || '30days'}
            onChange={(value) => onGlobalFilterChange?.('dateRange', value)}
          />
          <Input
            label="Search Students"
            placeholder="Search by name or ID..."
            icon="Search"
          />
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Attendance</p>
              <p className="text-2xl font-bold text-foreground">92.8%</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+2.1% vs last month</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Students Present</p>
              <p className="text-2xl font-bold text-foreground">1,318</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">out of 1,420 students</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Absent Today</p>
              <p className="text-2xl font-bold text-foreground">102</p>
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <Icon name="UserX" size={24} className="text-destructive" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-destructive">7.2% of total students</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Late Arrivals</p>
              <p className="text-2xl font-bold text-foreground">28</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">2.0% late rate</span>
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      {renderChart()}

      {/* Attendance Alerts */}
      <div className="bg-white rounded-lg border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Attendance Alerts</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-destructive" />
              <div>
                <h4 className="font-medium text-foreground">Low Attendance Alert</h4>
                <p className="text-sm text-muted-foreground">3 students with attendance below 75%</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={20} className="text-warning" />
              <div>
                <h4 className="font-medium text-foreground">Frequent Late Arrivals</h4>
                <p className="text-sm text-muted-foreground">5 students consistently arriving late</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center space-x-3">
              <Icon name="Award" size={20} className="text-success" />
              <div>
                <h4 className="font-medium text-foreground">Perfect Attendance</h4>
                <p className="text-sm text-muted-foreground">12 students with 100% attendance this month</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </div>

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

export default AttendanceReportsTab;
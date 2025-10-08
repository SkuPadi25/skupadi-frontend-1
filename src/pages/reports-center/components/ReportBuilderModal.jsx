import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ReportBuilderModal = ({ onClose }) => {
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [filters, setFilters] = useState({});
  const [visualization, setVisualization] = useState('table');
  const [schedule, setSchedule] = useState('');

  const reportTypeOptions = [
    { value: 'financial', label: 'Financial Report' },
    { value: 'payment', label: 'Payment Report' }
  ];

  const availableFields = {
    financial: [
      { value: 'revenue', label: 'Revenue' },
      { value: 'expenses', label: 'Expenses' },
      { value: 'profit', label: 'Profit' },
      { value: 'outstanding_fees', label: 'Outstanding Fees' },
      { value: 'collection_rate', label: 'Collection Rate' }
    ],
    payment: [
      { value: 'transaction_id', label: 'Transaction ID' },
      { value: 'amount', label: 'Amount' },
      { value: 'payment_method', label: 'Payment Method' },
      { value: 'status', label: 'Status' },
      { value: 'date', label: 'Payment Date' }
    ]
  };

  const visualizationOptions = [
    { value: 'table', label: 'Table' },
    { value: 'chart', label: 'Chart' },
    { value: 'graph', label: 'Graph' },
    { value: 'summary', label: 'Summary Cards' }
  ];

  const scheduleOptions = [
    { value: '', label: 'One-time Report' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handleFieldChange = (fieldValue, checked) => {
    if (checked) {
      setSelectedFields([...selectedFields, fieldValue]);
    } else {
      setSelectedFields(selectedFields?.filter(field => field !== fieldValue));
    }
  };

  const handleCreateReport = () => {
    const reportConfig = {
      name: reportName,
      type: reportType,
      fields: selectedFields,
      filters,
      visualization,
      schedule
    };
    
    console.log('Creating custom financial report:', reportConfig);
    alert('Custom financial report created successfully!');
    onClose();
  };

  const currentFields = reportType ? availableFields?.[reportType] || [] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Custom Report Builder</h2>
            <p className="text-sm text-muted-foreground">Create a custom report with drag-and-drop field selection</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Report Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Report Name"
                placeholder="Enter report name..."
                value={reportName}
                onChange={(e) => setReportName(e?.target?.value)}
                required
              />
              <Select
                label="Report Type"
                options={reportTypeOptions}
                value={reportType}
                onChange={setReportType}
                required
              />
            </div>

            {/* Field Selection */}
            {reportType && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Select Fields</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentFields?.map((field) => (
                      <div key={field?.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={field?.value}
                          checked={selectedFields?.includes(field?.value)}
                          onChange={(checked) => handleFieldChange(field?.value, checked)}
                        />
                        <label 
                          htmlFor={field?.value}
                          className="text-sm text-foreground cursor-pointer"
                        >
                          {field?.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Visualization Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Visualization Type"
                options={visualizationOptions}
                value={visualization}
                onChange={setVisualization}
              />
              <Select
                label="Schedule"
                options={scheduleOptions}
                value={schedule}
                onChange={setSchedule}
              />
            </div>

            {/* Advanced Filters */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Advanced Filters</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Date Range"
                    options={[
                      { value: '', label: 'All Time' },
                      { value: '7days', label: 'Last 7 days' },
                      { value: '30days', label: 'Last 30 days' },
                      { value: 'term', label: 'Current Term' }
                    ]}
                    value=""
                    onChange={() => {}}
                  />
                  <Select
                    label="Class Filter"
                    options={[
                      { value: '', label: 'All Classes' },
                      { value: 'grade1', label: 'Grade 1' },
                      { value: 'grade2', label: 'Grade 2' },
                      { value: 'grade3', label: 'Grade 3' }
                    ]}
                    value=""
                    onChange={() => {}}
                  />
                  <Select
                    label="Status Filter"
                    options={[
                      { value: '', label: 'All Status' },
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'pending', label: 'Pending' }
                    ]}
                    value=""
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Report Preview</h3>
              <div className="bg-muted/30 p-6 rounded-lg border-2 border-dashed border-border">
                <div className="text-center">
                  <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-3" />
                  <h4 className="font-medium text-foreground mb-2">
                    {reportName || 'Untitled Report'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedFields?.length} fields selected • {visualization} visualization
                    {schedule && ` • ${schedule} schedule`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateReport}
            disabled={!reportName || !reportType || selectedFields?.length === 0}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Create Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilderModal;
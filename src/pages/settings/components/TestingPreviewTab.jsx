import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const TestingPreviewTab = () => {
  const [selectedReminderType, setSelectedReminderType] = useState('pre-due');
  const [selectedChannel, setSelectedChannel] = useState('email');
  const [testStudent, setTestStudent] = useState({
    parentName: 'Mrs. Sarah Johnson',
    studentName: 'Michael Johnson',
    studentClass: 'JSS 2A',
    invoiceNumber: 'INV-2025-001234',
    amountDue: '₦125,000',
    dueDate: '2025-01-15',
    daysOverdue: 5,
    term: 'Second',
    session: '2024/2025'
  });

  const [testSettings, setTestSettings] = useState({
    schoolName: 'Greenfield International School',
    schoolPhone: '+234 801 234 5678',
    schoolEmail: 'finance@greenfield.edu.ng',
    callerName: 'Mrs. Grace Adebayo'
  });

  const [sendingTest, setSendingTest] = useState(false);

  const reminderTypes = [
    {
      id: 'pre-due',
      title: 'Pre-Due Reminder',
      description: 'Friendly reminder before due date',
      icon: 'Clock',
      color: 'blue'
    },
    {
      id: 'due-date',
      title: 'Due Date Reminder', 
      description: 'Reminder on the due date',
      icon: 'AlertCircle',
      color: 'orange'
    },
    {
      id: 'first-overdue',
      title: 'First Overdue Notice',
      description: 'First overdue follow-up',
      icon: 'AlertTriangle',
      color: 'red'
    }
  ];

  const channels = [
    {
      id: 'email',
      title: 'Email',
      icon: 'Mail',
      color: 'blue'
    },
    {
      id: 'sms',
      title: 'SMS',
      icon: 'MessageSquare',
      color: 'green'
    },
    {
      id: 'phone',
      title: 'Phone Script',
      icon: 'Phone',
      color: 'purple'
    }
  ];

  // Sample templates with variables
  const sampleTemplates = {
    'pre-due': {
      email: {
        subject: 'Payment Reminder - Due Soon',
        content: `Dear {parent_name},

This is a friendly reminder that your child {student_name}'s school fees for {term} term {session} academic session are due on {due_date}.

Invoice Details:
- Invoice Number: {invoice_number}
- Amount Due: {amount_due}
- Due Date: {due_date}

You can make payment through our online portal or visit the school's finance office.

Thank you for your continued partnership.

Best regards,
{school_name}
Finance Department`
      },
      sms: {
        content: `Hi {parent_name}, {student_name}'s fees ({amount_due}) for {term} term are due on {due_date}. Pay online or visit school. Invoice: {invoice_number}. Thanks - {school_name}`
      },
      phone: {
        script: `Hello {parent_name}, this is {caller_name} from {school_name}. I'm calling to remind you that {student_name}'s school fees for {term} term are due on {due_date}. The amount due is {amount_due}. You can pay through our online portal or visit our finance office. Do you have any questions about this payment?`
      }
    },
    'due-date': {
      email: {
        subject: 'Payment Due Today - Action Required',
        content: `Dear {parent_name},

This is to remind you that your child {student_name}'s school fees are due TODAY ({due_date}).

Payment Details:
- Invoice Number: {invoice_number}
- Amount Due: {amount_due}
- Student: {student_name} - {student_class}
- Term: {term} Term, {session} Session

Please make payment as soon as possible to avoid any late fees.

Best regards,
{school_name}
Finance Department`
      },
      sms: {
        content: `URGENT: {parent_name}, {student_name}'s fees ({amount_due}) are DUE TODAY. Please pay immediately online or at school. Invoice: {invoice_number} - {school_name}`
      },
      phone: {
        script: `Hello {parent_name}, this is {caller_name} from {school_name}. I'm calling because {student_name}'s school fees of {amount_due} are due today. We need to receive payment today to avoid late fees. Can you make the payment today?`
      }
    },
    'first-overdue': {
      email: {
        subject: 'OVERDUE NOTICE - Immediate Payment Required',
        content: `Dear {parent_name},

This is an OVERDUE NOTICE for your child {student_name}'s unpaid school fees.

OVERDUE DETAILS:
- Invoice Number: {invoice_number}
- Amount Overdue: {amount_due}
- Original Due Date: {due_date}
- Days Overdue: {days_overdue}
- Student: {student_name} - {student_class}

IMMEDIATE ACTION REQUIRED. Please contact our finance department immediately.

{school_name}
Finance Department
Phone: {school_phone}
Email: {school_email}`
      },
      sms: {
        content: `OVERDUE NOTICE: {parent_name}, {student_name}'s fees ({amount_due}) are {days_overdue} days overdue. Pay IMMEDIATELY to avoid restrictions. Invoice: {invoice_number} - {school_name}`
      },
      phone: {
        script: `Hello {parent_name}, this is {caller_name} from {school_name} finance department. This is an urgent call regarding {student_name}'s overdue school fees. The payment of {amount_due} is now {days_overdue} days overdue. We need immediate payment to avoid service restrictions.`
      }
    }
  };

  const replaceVariables = (template) => {
    if (!template) return '';
    
    const variables = {
      '{parent_name}': testStudent?.parentName,
      '{student_name}': testStudent?.studentName,
      '{student_class}': testStudent?.studentClass,
      '{school_name}': testSettings?.schoolName,
      '{school_phone}': testSettings?.schoolPhone,
      '{school_email}': testSettings?.schoolEmail,
      '{invoice_number}': testStudent?.invoiceNumber,
      '{amount_due}': testStudent?.amountDue,
      '{due_date}': testStudent?.dueDate,
      '{days_overdue}': testStudent?.daysOverdue?.toString(),
      '{term}': testStudent?.term,
      '{session}': testStudent?.session,
      '{caller_name}': testSettings?.callerName
    };

    let result = template;
    Object.keys(variables)?.forEach(key => {
      result = result?.replace(new RegExp(key, 'g'), variables?.[key]);
    });

    return result;
  };

  const getCurrentTemplate = () => {
    return sampleTemplates?.[selectedReminderType]?.[selectedChannel] || {};
  };

  const handleSendTestReminder = async () => {
    setSendingTest(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Test reminder sent:', {
        type: selectedReminderType,
        channel: selectedChannel,
        student: testStudent,
        template: getCurrentTemplate()
      });
      
      alert(`Test ${selectedChannel} reminder sent successfully to ${testStudent?.parentName}!`);
    } catch (error) {
      console.error('Test send failed:', error);
      alert('Failed to send test reminder. Please try again.');
    } finally {
      setSendingTest(false);
    }
  };

  const currentTemplate = getCurrentTemplate();
  const processedTemplate = {
    subject: replaceVariables(currentTemplate?.subject),
    content: replaceVariables(currentTemplate?.content),
    script: replaceVariables(currentTemplate?.script)
  };

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Play" size={16} className="text-info" />
          <h4 className="text-sm font-medium text-foreground">Testing & Preview</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Test your reminder configurations and preview how messages will look to parents. You can send actual test messages to verify everything works correctly.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Reminder Type Selection */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-base font-semibold text-foreground mb-4">Select Reminder Type</h3>
            <div className="space-y-2">
              {reminderTypes?.map((type) => (
                <button
                  key={type?.id}
                  onClick={() => setSelectedReminderType(type?.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                    selectedReminderType === type?.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedReminderType === type?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : `bg-${type?.color}-100 text-${type?.color}-600`
                    }`}>
                      <Icon name={type?.icon} size={12} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{type?.title}</div>
                      <div className="text-xs text-muted-foreground">{type?.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Channel Selection */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-base font-semibold text-foreground mb-4">Communication Channel</h3>
            <div className="space-y-2">
              {channels?.map((channel) => (
                <button
                  key={channel?.id}
                  onClick={() => setSelectedChannel(channel?.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                    selectedChannel === channel?.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedChannel === channel?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : `bg-${channel?.color}-100 text-${channel?.color}-600`
                    }`}>
                      <Icon name={channel?.icon} size={12} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{channel?.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Student Data */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-base font-semibold text-foreground mb-4">Test Student Data</h3>
            <div className="space-y-3">
              <Input
                label="Parent Name"
                value={testStudent?.parentName}
                onChange={(e) => setTestStudent({...testStudent, parentName: e?.target?.value})}
                size="sm"
              />
              <Input
                label="Student Name"
                value={testStudent?.studentName}
                onChange={(e) => setTestStudent({...testStudent, studentName: e?.target?.value})}
                size="sm"
              />
              <Input
                label="Student Class"
                value={testStudent?.studentClass}
                onChange={(e) => setTestStudent({...testStudent, studentClass: e?.target?.value})}
                size="sm"
              />
              <Input
                label="Amount Due"
                value={testStudent?.amountDue}
                onChange={(e) => setTestStudent({...testStudent, amountDue: e?.target?.value})}
                size="sm"
              />
              <Input
                label="Due Date"
                type="date"
                value={testStudent?.dueDate}
                onChange={(e) => setTestStudent({...testStudent, dueDate: e?.target?.value})}
                size="sm"
              />
              {selectedReminderType === 'first-overdue' && (
                <Input
                  label="Days Overdue"
                  type="number"
                  value={testStudent?.daysOverdue}
                  onChange={(e) => setTestStudent({...testStudent, daysOverdue: parseInt(e?.target?.value) || 0})}
                  size="sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Preview */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Message Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {reminderTypes?.find(t => t?.id === selectedReminderType)?.title} - {channels?.find(c => c?.id === selectedChannel)?.title}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Icon name="Copy" size={14} className="mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSendTestReminder}
                  loading={sendingTest}
                >
                  <Icon name="Send" size={14} className="mr-2" />
                  Send Test
                </Button>
              </div>
            </div>

            {/* Email Preview */}
            {selectedChannel === 'email' && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium text-foreground mb-2">Subject:</div>
                  <div className="text-sm text-foreground font-medium">{processedTemplate?.subject}</div>
                </div>
                <div className="p-4 bg-white border border-border rounded-lg">
                  <div className="text-sm font-medium text-foreground mb-2">Email Body:</div>
                  <div className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {processedTemplate?.content}
                  </div>
                </div>
              </div>
            )}

            {/* SMS Preview */}
            {selectedChannel === 'sms' && (
              <div className="max-w-sm mx-auto">
                <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-muted-foreground">SMS Message</div>
                    <div className="text-xs text-muted-foreground">
                      {processedTemplate?.content?.length || 0}/160
                    </div>
                  </div>
                  <div className="bg-blue-500 text-white p-3 rounded-lg text-sm leading-relaxed">
                    {processedTemplate?.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    From: {testSettings?.schoolName}
                  </div>
                </div>
              </div>
            )}

            {/* Phone Script Preview */}
            {selectedChannel === 'phone' && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Phone" size={16} className="text-purple-600" />
                    <div className="text-sm font-medium text-foreground">Phone Call Script</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Script for staff members making payment reminder calls
                  </div>
                </div>
                <div className="p-4 bg-white border border-border rounded-lg">
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-mono">
                    {processedTemplate?.script}
                  </div>
                </div>
                <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                  <div className="text-xs text-info font-medium mb-1">Script Guidelines:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Speak clearly and maintain a professional tone</li>
                    <li>• Allow parent to respond and ask questions</li>
                    <li>• Be prepared to provide payment options</li>
                    <li>• Document the outcome of the call</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Test Results */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="TestTube" size={16} className="text-success" />
              <h3 className="text-base font-semibold text-foreground">Test Results & Statistics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-foreground">Tests Sent</span>
                </div>
                <div className="text-2xl font-bold text-success">12</div>
                <div className="text-xs text-muted-foreground">This week</div>
              </div>

              <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Eye" size={16} className="text-info" />
                  <span className="text-sm font-medium text-foreground">Delivery Rate</span>
                </div>
                <div className="text-2xl font-bold text-info">95%</div>
                <div className="text-xs text-muted-foreground">Average success rate</div>
              </div>

              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">Avg. Delivery</span>
                </div>
                <div className="text-2xl font-bold text-warning">2.3s</div>
                <div className="text-xs text-muted-foreground">Response time</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <Icon name="Info" size={12} className="inline mr-1" />
                Test messages are sent to the configured test recipients only and don't affect actual parent communications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingPreviewTab;
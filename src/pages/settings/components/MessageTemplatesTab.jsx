import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const MessageTemplatesTab = () => {
  const [activeCategory, setActiveCategory] = useState('pre-due');
  const [activeChannel, setActiveChannel] = useState('email');
  const [templates, setTemplates] = useState({
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

Please make payment as soon as possible to avoid any late fees. You can pay online through our portal or visit the school's finance office.

For any payment issues or questions, please contact our finance department immediately.

Thank you for your prompt attention.

Best regards,
{school_name}
Finance Department`
      },
      sms: {
        content: `URGENT: {parent_name}, {student_name}'s fees ({amount_due}) are DUE TODAY. Please pay immediately online or at school to avoid late fees. Invoice: {invoice_number} - {school_name}`
      },
      phone: {
        script: `Hello {parent_name}, this is {caller_name} from {school_name}. I'm calling because {student_name}'s school fees of {amount_due} are due today. We need to receive payment today to avoid late fees. Can you make the payment today? You can pay online or come to our office. Invoice number is {invoice_number}.`
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
- Term: {term} Term, {session} Session

IMMEDIATE ACTION REQUIRED:
Your payment is now {days_overdue} days overdue. Please make payment immediately to avoid:
- Additional late fees
- Restriction of school services
- Academic disruption for your child

Payment can be made:
- Online through our school portal
- At the school finance office
- Via bank transfer (details provided separately)

If you are experiencing financial difficulties, please contact our finance department immediately to discuss payment arrangements.

This is your FIRST OVERDUE NOTICE. Further action may be taken if payment is not received promptly.

Urgent attention required.

{school_name}
Finance Department
Phone: {school_phone}
Email: {school_email}`
      },
      sms: {
        content: `OVERDUE NOTICE: {parent_name}, {student_name}'s fees ({amount_due}) are {days_overdue} days overdue. Pay IMMEDIATELY to avoid restrictions. Contact school urgently. Invoice: {invoice_number} - {school_name}`
      },
      phone: {
        script: `Hello {parent_name}, this is {caller_name} from {school_name} finance department. This is an urgent call regarding {student_name}'s overdue school fees. The payment of {amount_due} is now {days_overdue} days overdue. We need immediate payment to avoid service restrictions and late fees. When can you make this payment? We can arrange payment plans if needed. This is your first overdue notice, so prompt action is required.`
      }
    }
  });

  const categories = [
    {
      id: 'pre-due',
      title: 'Pre-Due Reminder',
      description: 'Friendly reminder sent before the invoice is due',
      icon: 'Clock',
      color: 'blue'
    },
    {
      id: 'due-date', 
      title: 'Due Date Reminder',
      description: 'Reminder sent on the day the invoice is due',
      icon: 'AlertCircle',
      color: 'orange'
    },
    {
      id: 'first-overdue',
      title: 'First Overdue Notice',
      description: 'First follow-up for overdue invoices',
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
      title: 'Phone',
      icon: 'Phone',
      color: 'purple'
    }
  ];

  const availableVariables = [
    { name: '{parent_name}', description: 'Parent/Guardian name' },
    { name: '{student_name}', description: 'Student full name' },
    { name: '{student_class}', description: 'Student class/grade' },
    { name: '{school_name}', description: 'School name' },
    { name: '{school_phone}', description: 'School phone number' },
    { name: '{school_email}', description: 'School email address' },
    { name: '{invoice_number}', description: 'Invoice reference number' },
    { name: '{amount_due}', description: 'Outstanding amount' },
    { name: '{due_date}', description: 'Payment due date' },
    { name: '{days_overdue}', description: 'Number of days overdue' },
    { name: '{term}', description: 'Academic term (First/Second/Third)' },
    { name: '{session}', description: 'Academic session (e.g., 2024/2025)' },
    { name: '{caller_name}', description: 'Name of person making the call' }
  ];

  const handleTemplateUpdate = (category, channel, field, value) => {
    setTemplates(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [channel]: {
          ...prev?.[category]?.[channel],
          [field]: value
        }
      }
    }));
  };

  const handleSaveTemplates = async () => {
    try {
      console.log('Saving message templates:', templates);
      
      // In a real app, save to backend/database
      // const { error } = await supabase
      //   .from('message_templates')
      //   .upsert({
      //     user_id: auth.user.id,
      //     templates: templates,
      //     updated_at: new Date().toISOString()
      //   });

      alert('Message templates saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save templates. Please try again.');
    }
  };

  const insertVariable = (variable) => {
    const currentTemplate = templates?.[activeCategory]?.[activeChannel];
    const field = activeChannel === 'email' ? 'content' : activeChannel === 'sms' ? 'content' : 'script';
    const currentContent = currentTemplate?.[field] || '';
    
    // Insert at cursor position (simplified - in production, you'd track cursor position)
    const newContent = currentContent + variable;
    handleTemplateUpdate(activeCategory, activeChannel, field, newContent);
  };

  const resetToDefault = () => {
    // Reset current template to default (you'd have default templates stored)
    if (confirm('Are you sure you want to reset this template to default? This action cannot be undone.')) {
      // Implement reset logic here
      alert('Template reset to default');
    }
  };

  const getCurrentTemplate = () => {
    return templates?.[activeCategory]?.[activeChannel] || {};
  };

  const currentTemplate = getCurrentTemplate();

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-info" />
          <h4 className="text-sm font-medium text-foreground">Message Templates</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Customize message templates for each reminder type and communication channel. Use variables to personalize messages automatically.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selector */}
        <div className="lg:col-span-1">
          <h3 className="text-base font-semibold text-foreground mb-4">Reminder Types</h3>
          <div className="space-y-2">
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => setActiveCategory(category?.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                  activeCategory === category?.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeCategory === category?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : `bg-${category?.color}-100 text-${category?.color}-600`
                  }`}>
                    <Icon name={category?.icon} size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{category?.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{category?.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Channel Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <h3 className="text-base font-semibold text-foreground">Communication Channel:</h3>
            <div className="flex space-x-2">
              {channels?.map((channel) => (
                <button
                  key={channel?.id}
                  onClick={() => setActiveChannel(channel?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    activeChannel === channel?.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary/50'
                  }`}
                >
                  <Icon name={channel?.icon} size={16} />
                  <span className="text-sm font-medium">{channel?.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Template Editor */}
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-foreground">
                    {categories?.find(c => c?.id === activeCategory)?.title} - {channels?.find(c => c?.id === activeChannel)?.title}
                  </h4>
                  <Button variant="outline" size="sm" onClick={resetToDefault}>
                    <Icon name="RotateCcw" size={14} className="mr-2" />
                    Reset to Default
                  </Button>
                </div>

                {/* Email Template */}
                {activeChannel === 'email' && (
                  <div className="space-y-4">
                    <Input
                      label="Subject Line"
                      value={currentTemplate?.subject || ''}
                      onChange={(e) => handleTemplateUpdate(activeCategory, activeChannel, 'subject', e?.target?.value)}
                      placeholder="Email subject..."
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Content
                      </label>
                      <textarea
                        value={currentTemplate?.content || ''}
                        onChange={(e) => handleTemplateUpdate(activeCategory, activeChannel, 'content', e?.target?.value)}
                        rows={12}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-ring"
                        placeholder="Email content..."
                      />
                    </div>
                  </div>
                )}

                {/* SMS Template */}
                {activeChannel === 'sms' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-foreground">
                        SMS Content
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {(currentTemplate?.content || '')?.length}/160 characters
                      </span>
                    </div>
                    <textarea
                      value={currentTemplate?.content || ''}
                      onChange={(e) => handleTemplateUpdate(activeCategory, activeChannel, 'content', e?.target?.value)}
                      rows={4}
                      maxLength={160}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-ring"
                      placeholder="SMS content (160 characters max)..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep SMS messages concise and under 160 characters for single message delivery.
                    </p>
                  </div>
                )}

                {/* Phone Template */}
                {activeChannel === 'phone' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Call Script
                    </label>
                    <textarea
                      value={currentTemplate?.script || ''}
                      onChange={(e) => handleTemplateUpdate(activeCategory, activeChannel, 'script', e?.target?.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-ring"
                      placeholder="Phone call script..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide a clear script for staff members making payment reminder calls.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end mt-6">
                  <Button onClick={handleSaveTemplates}>
                    <Icon name="Save" size={16} className="mr-2" />
                    Save Template
                  </Button>
                </div>
              </div>
            </div>

            {/* Variables Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-card rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold text-foreground mb-4">Available Variables</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Click on any variable to insert it into your template. These will be automatically replaced with actual values when messages are sent.
                </p>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableVariables?.map((variable, index) => (
                    <div
                      key={index}
                      className="p-2 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => insertVariable(variable?.name)}
                    >
                      <div className="text-sm font-mono font-medium text-primary">{variable?.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{variable?.description}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <h5 className="text-xs font-medium text-foreground mb-2">Preview Note</h5>
                  <p className="text-xs text-muted-foreground">
                    Variables will show actual student and invoice data in the Testing & Preview section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Save All Templates Button */}
      <div className="flex items-center justify-center pt-6 border-t border-border">
        <Button size="lg" onClick={handleSaveTemplates} className="px-8">
          <Icon name="Save" size={16} className="mr-2" />
          Save All Message Templates
        </Button>
      </div>
    </div>
  );
};

export default MessageTemplatesTab;
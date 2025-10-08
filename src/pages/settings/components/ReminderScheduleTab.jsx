import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const ReminderScheduleTab = () => {
  const [reminderSettings, setReminderSettings] = useState({
    // Pre-Due Reminder Settings
    preDueEnabled: true,
    preDueDaysBefore: 7,
    preDueTime: '09:00',
    preDueEmailEnabled: true,
    preDueSmsEnabled: false,
    preDuePhoneEnabled: false,
    preDueFrequency: 'once', // once, daily, every-other-day

    // Due Date Reminder Settings  
    dueDateEnabled: true,
    dueDateTime: '10:00',
    dueDateEmailEnabled: true,
    dueDateSmsEnabled: true,
    dueDatePhoneEnabled: false,
    dueDateFrequency: 'once',

    // First Overdue Notice Settings
    overdueEnabled: true,
    overdueDaysAfter: 3,
    overdueTime: '11:00',
    overdueEmailEnabled: true,
    overdueSmsEnabled: true,
    overduePhoneEnabled: true,
    overdueFrequency: 'once',

    // Global Settings
    timezone: 'Africa/Lagos',
    respectQuietHours: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    skipWeekends: true,
    skipHolidays: true
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: reminderSettings
  });

  const frequencyOptions = [
    { value: 'once', label: 'Send Once Only' },
    { value: 'daily', label: 'Send Daily Until Paid' },
    { value: 'every-other-day', label: 'Send Every Other Day' },
    { value: 'weekly', label: 'Send Weekly' }
  ];

  const timezoneOptions = [
    { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'Africa/Cairo', label: 'Egypt Time' },
    { value: 'Africa/Johannesburg', label: 'South Africa Time' }
  ];

  const handleSettingChange = (key, value) => {
    setReminderSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setValue(key, value);
  };

  const handleSaveSettings = async (data) => {
    try {
      console.log('Saving reminder settings:', data);
      
      // In a real app, save to backend/database
      // const { error } = await supabase
      //   .from('reminder_settings')
      //   .upsert({
      //     user_id: auth.user.id,
      //     settings: data,
      //     updated_at: new Date().toISOString()
      //   });

      alert('Reminder schedule settings saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSaveSettings)} className="space-y-8">
      {/* Overview Section */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-info" />
          <h4 className="text-sm font-medium text-foreground">Reminder Schedule Overview</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Configure when and how payment reminders are sent to parents and guardians. The system supports three types of reminders:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span><strong>Pre-Due Reminder:</strong> Friendly reminder sent before the invoice is due</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span><strong>Due Date Reminder:</strong> Reminder sent on the day the invoice is due</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span><strong>First Overdue Notice:</strong> First follow-up for overdue invoices</span>
          </li>
        </ul>
      </div>

      {/* Pre-Due Reminder Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pre-Due Reminder</h3>
              <p className="text-sm text-muted-foreground">Friendly reminder sent before the invoice is due</p>
            </div>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={reminderSettings?.preDueEnabled}
              onChange={(e) => handleSettingChange('preDueEnabled', e?.target?.checked)}
              className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-sm font-medium text-foreground">
              {reminderSettings?.preDueEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        <div className={`space-y-6 ${!reminderSettings?.preDueEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Timing Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Days Before Due Date"
              type="number"
              min="1"
              max="30"
              value={reminderSettings?.preDueDaysBefore}
              onChange={(e) => handleSettingChange('preDueDaysBefore', parseInt(e?.target?.value) || 7)}
              placeholder="7"
            />
            <Input
              label="Send Time"
              type="time"
              value={reminderSettings?.preDueTime}
              onChange={(e) => handleSettingChange('preDueTime', e?.target?.value)}
            />
            <Select
              label="Frequency"
              options={frequencyOptions}
              value={reminderSettings?.preDueFrequency}
              onChange={(value) => handleSettingChange('preDueFrequency', value)}
              placeholder="Select frequency"
            />
          </div>

          {/* Communication Channels */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Communication Channels</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-blue-600" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.preDueEmailEnabled}
                  onChange={(e) => handleSettingChange('preDueEmailEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="MessageSquare" size={16} className="text-green-600" />
                  <span className="text-sm font-medium">SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.preDueSmsEnabled}
                  onChange={(e) => handleSettingChange('preDueSmsEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-purple-600" />
                  <span className="text-sm font-medium">Phone Call</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.preDuePhoneEnabled}
                  onChange={(e) => handleSettingChange('preDuePhoneEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Due Date Reminder Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Due Date Reminder</h3>
              <p className="text-sm text-muted-foreground">Reminder sent on the day the invoice is due</p>
            </div>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={reminderSettings?.dueDateEnabled}
              onChange={(e) => handleSettingChange('dueDateEnabled', e?.target?.checked)}
              className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-sm font-medium text-foreground">
              {reminderSettings?.dueDateEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        <div className={`space-y-6 ${!reminderSettings?.dueDateEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Timing Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Send Time"
              type="time"
              value={reminderSettings?.dueDateTime}
              onChange={(e) => handleSettingChange('dueDateTime', e?.target?.value)}
            />
            <Select
              label="Frequency"
              options={frequencyOptions}
              value={reminderSettings?.dueDateFrequency}
              onChange={(value) => handleSettingChange('dueDateFrequency', value)}
              placeholder="Select frequency"
            />
          </div>

          {/* Communication Channels */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Communication Channels</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-blue-600" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.dueDateEmailEnabled}
                  onChange={(e) => handleSettingChange('dueDateEmailEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="MessageSquare" size={16} className="text-green-600" />
                  <span className="text-sm font-medium">SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.dueDateSmsEnabled}
                  onChange={(e) => handleSettingChange('dueDateSmsEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-purple-600" />
                  <span className="text-sm font-medium">Phone Call</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.dueDatePhoneEnabled}
                  onChange={(e) => handleSettingChange('dueDatePhoneEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Overdue Notice Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">First Overdue Notice</h3>
              <p className="text-sm text-muted-foreground">First follow-up for overdue invoices</p>
            </div>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={reminderSettings?.overdueEnabled}
              onChange={(e) => handleSettingChange('overdueEnabled', e?.target?.checked)}
              className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-sm font-medium text-foreground">
              {reminderSettings?.overdueEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        <div className={`space-y-6 ${!reminderSettings?.overdueEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Timing Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Days After Due Date"
              type="number"
              min="1"
              max="30"
              value={reminderSettings?.overdueDaysAfter}
              onChange={(e) => handleSettingChange('overdueDaysAfter', parseInt(e?.target?.value) || 3)}
              placeholder="3"
            />
            <Input
              label="Send Time"
              type="time"
              value={reminderSettings?.overdueTime}
              onChange={(e) => handleSettingChange('overdueTime', e?.target?.value)}
            />
            <Select
              label="Frequency"
              options={frequencyOptions}
              value={reminderSettings?.overdueFrequency}
              onChange={(value) => handleSettingChange('overdueFrequency', value)}
              placeholder="Select frequency"
            />
          </div>

          {/* Communication Channels */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Communication Channels</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-blue-600" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.overdueEmailEnabled}
                  onChange={(e) => handleSettingChange('overdueEmailEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="MessageSquare" size={16} className="text-green-600" />
                  <span className="text-sm font-medium">SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.overdueSmsEnabled}
                  onChange={(e) => handleSettingChange('overdueSmsEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-purple-600" />
                  <span className="text-sm font-medium">Phone Call</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderSettings?.overduePhoneEnabled}
                  onChange={(e) => handleSettingChange('overduePhoneEnabled', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Global Settings</h3>
            <p className="text-sm text-muted-foreground">System-wide reminder configuration</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Timezone and Quiet Hours */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={reminderSettings?.timezone}
              onChange={(value) => handleSettingChange('timezone', value)}
              placeholder="Select timezone"
            />
            <Input
              label="Quiet Hours Start"
              type="time"
              value={reminderSettings?.quietHoursStart}
              onChange={(e) => handleSettingChange('quietHoursStart', e?.target?.value)}
            />
            <Input
              label="Quiet Hours End"
              type="time"
              value={reminderSettings?.quietHoursEnd}
              onChange={(e) => handleSettingChange('quietHoursEnd', e?.target?.value)}
            />
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-foreground">Respect Quiet Hours</h4>
                <p className="text-xs text-muted-foreground">Skip reminders during quiet hours</p>
              </div>
              <input
                type="checkbox"
                checked={reminderSettings?.respectQuietHours}
                onChange={(e) => handleSettingChange('respectQuietHours', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-foreground">Skip Weekends</h4>
                <p className="text-xs text-muted-foreground">Don't send reminders on weekends</p>
              </div>
              <input
                type="checkbox"
                checked={reminderSettings?.skipWeekends}
                onChange={(e) => handleSettingChange('skipWeekends', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-foreground">Skip Holidays</h4>
                <p className="text-xs text-muted-foreground">Don't send reminders on holidays</p>
              </div>
              <input
                type="checkbox"
                checked={reminderSettings?.skipHolidays}
                onChange={(e) => handleSettingChange('skipHolidays', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end">
        <Button 
          type="submit" 
          variant="default" 
          size="lg"
          className="px-8"
        >
          <Icon name="Save" size={16} className="mr-2" />
          Save Reminder Schedule
        </Button>
      </div>
    </form>
  );
};

export default ReminderScheduleTab;
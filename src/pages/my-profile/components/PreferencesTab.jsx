import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PreferencesTab = ({ user }) => {
  const [preferences, setPreferences] = useState({
    // Appearance
    theme: user?.preferences?.theme || 'system',
    language: user?.preferences?.language || 'en',
    dateFormat: user?.preferences?.dateFormat || 'dd/mm/yyyy',
    timeFormat: '12',
    currency: user?.preferences?.currency || 'NGN',

    // Dashboard
    dashboardLayout: 'default',
    defaultPage: 'dashboard',
    showQuickActions: true,
    showRecentActivity: true,
    compactMode: false,

    // Notifications
    emailNotifications: user?.preferences?.notifications?.email || true,
    pushNotifications: user?.preferences?.notifications?.push || true,
    smsNotifications: user?.preferences?.notifications?.sms || false,
    notificationSound: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '07:00',

    // Privacy
    showProfileToOthers: true,
    allowDataCollection: true,
    showOnlineStatus: true,

    // Advanced
    autoSave: true,
    confirmDeletion: true,
    keyboardShortcuts: true,
    debugMode: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      console?.log('Saving preferences:', preferences);
      
      // In a real app, save to backend/Supabase here
      // const { error } = await supabase
      //   .from('user_preferences')
      //   .upsert({
      //     user_id: user.id,
      //     preferences: preferences,
      //     updated_at: new Date().toISOString()
      //   });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Preferences saved successfully!');
    } catch (error) {
      console?.error('Save failed:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    const confirmed = window?.confirm('Are you sure you want to reset all preferences to default values?');
    if (confirmed) {
      setPreferences({
        theme: 'system',
        language: 'en',
        dateFormat: 'dd/mm/yyyy',
        timeFormat: '12',
        currency: 'NGN',
        dashboardLayout: 'default',
        defaultPage: 'dashboard',
        showQuickActions: true,
        showRecentActivity: true,
        compactMode: false,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notificationSound: true,
        quietHours: false,
        quietStart: '22:00',
        quietEnd: '07:00',
        showProfileToOthers: true,
        allowDataCollection: true,
        showOnlineStatus: true,
        autoSave: true,
        confirmDeletion: true,
        keyboardShortcuts: true,
        debugMode: false
      });
    }
  };

  // Options arrays
  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ha', label: 'Hausa' },
    { value: 'ig', label: 'Igbo' },
    { value: 'yo', label: 'Yoruba' },
    { value: 'fr', label: 'French' }
  ];

  const dateFormatOptions = [
    { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
    { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' }
  ];

  const timeFormatOptions = [
    { value: '12', label: '12 Hour (AM/PM)' },
    { value: '24', label: '24 Hour' }
  ];

  const currencyOptions = [
    { value: 'NGN', label: 'Nigerian Naira (₦)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' }
  ];

  const dashboardLayoutOptions = [
    { value: 'default', label: 'Default Layout' },
    { value: 'compact', label: 'Compact Layout' },
    { value: 'wide', label: 'Wide Layout' }
  ];

  const defaultPageOptions = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'students-management', label: 'Students Management' },
    { value: 'invoices-management', label: 'Invoices Management' },
    { value: 'payments-management', label: 'Payments Management' }
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Customize your dashboard and application experience
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={resetToDefaults}
          >
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSavePreferences}
            loading={isSaving}
          >
            <Icon name="Save" size={16} className="mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Palette" size={20} className="mr-2" />
          Appearance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Theme"
            options={themeOptions}
            value={preferences?.theme}
            onChange={(value) => handlePreferenceChange('theme', value)}
            description="Choose your preferred color theme"
          />
          
          <Select
            label="Language"
            options={languageOptions}
            value={preferences?.language}
            onChange={(value) => handlePreferenceChange('language', value)}
            description="Select your preferred language"
          />
          
          <Select
            label="Date Format"
            options={dateFormatOptions}
            value={preferences?.dateFormat}
            onChange={(value) => handlePreferenceChange('dateFormat', value)}
            description="Choose how dates are displayed"
          />
          
          <Select
            label="Time Format"
            options={timeFormatOptions}
            value={preferences?.timeFormat}
            onChange={(value) => handlePreferenceChange('timeFormat', value)}
            description="Choose 12 or 24 hour time format"
          />
          
          <Select
            label="Currency"
            options={currencyOptions}
            value={preferences?.currency}
            onChange={(value) => handlePreferenceChange('currency', value)}
            description="Primary currency for transactions"
          />
        </div>
      </div>

      {/* Dashboard Settings */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Layout" size={20} className="mr-2" />
          Dashboard
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Dashboard Layout"
              options={dashboardLayoutOptions}
              value={preferences?.dashboardLayout}
              onChange={(value) => handlePreferenceChange('dashboardLayout', value)}
              description="Choose your dashboard layout style"
            />
            
            <Select
              label="Default Page"
              options={defaultPageOptions}
              value={preferences?.defaultPage}
              onChange={(value) => handlePreferenceChange('defaultPage', value)}
              description="Page to show when you first login"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Show Quick Actions</label>
                <p className="text-xs text-muted-foreground">Display quick action buttons on dashboard</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.showQuickActions}
                onChange={(e) => handlePreferenceChange('showQuickActions', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Show Recent Activity</label>
                <p className="text-xs text-muted-foreground">Display recent activity section</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.showRecentActivity}
                onChange={(e) => handlePreferenceChange('showRecentActivity', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Compact Mode</label>
                <p className="text-xs text-muted-foreground">Use smaller spacing and elements</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.compactMode}
                onChange={(e) => handlePreferenceChange('compactMode', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Bell" size={20} className="mr-2" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Email Notifications</label>
                <p className="text-xs text-muted-foreground">Receive notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.emailNotifications}
                onChange={(e) => handlePreferenceChange('emailNotifications', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Push Notifications</label>
                <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.pushNotifications}
                onChange={(e) => handlePreferenceChange('pushNotifications', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">SMS Notifications</label>
                <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.smsNotifications}
                onChange={(e) => handlePreferenceChange('smsNotifications', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Notification Sound</label>
                <p className="text-xs text-muted-foreground">Play sound for notifications</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.notificationSound}
                onChange={(e) => handlePreferenceChange('notificationSound', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
          
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-medium text-foreground">Quiet Hours</label>
                <p className="text-xs text-muted-foreground">Disable notifications during specified hours</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.quietHours}
                onChange={(e) => handlePreferenceChange('quietHours', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            
            {preferences?.quietHours && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={preferences?.quietStart}
                  onChange={(e) => handlePreferenceChange('quietStart', e?.target?.value)}
                />
                <Input
                  label="End Time"
                  type="time"
                  value={preferences?.quietEnd}
                  onChange={(e) => handlePreferenceChange('quietEnd', e?.target?.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Privacy
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Show Profile to Others</label>
              <p className="text-xs text-muted-foreground">Allow other users to see your profile</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.showProfileToOthers}
              onChange={(e) => handlePreferenceChange('showProfileToOthers', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Allow Data Collection</label>
              <p className="text-xs text-muted-foreground">Help improve the service with usage analytics</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.allowDataCollection}
              onChange={(e) => handlePreferenceChange('allowDataCollection', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Show Online Status</label>
              <p className="text-xs text-muted-foreground">Let others see when you're online</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.showOnlineStatus}
              onChange={(e) => handlePreferenceChange('showOnlineStatus', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          Advanced
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Auto Save</label>
              <p className="text-xs text-muted-foreground">Automatically save changes without confirmation</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.autoSave}
              onChange={(e) => handlePreferenceChange('autoSave', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Confirm Deletion</label>
              <p className="text-xs text-muted-foreground">Show confirmation dialog before deleting items</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.confirmDeletion}
              onChange={(e) => handlePreferenceChange('confirmDeletion', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Keyboard Shortcuts</label>
              <p className="text-xs text-muted-foreground">Enable keyboard shortcuts for quick actions</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.keyboardShortcuts}
              onChange={(e) => handlePreferenceChange('keyboardShortcuts', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">Debug Mode</label>
              <p className="text-xs text-muted-foreground">Enable debug information for troubleshooting</p>
            </div>
            <input
              type="checkbox"
              checked={preferences?.debugMode}
              onChange={(e) => handlePreferenceChange('debugMode', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Download" size={20} className="mr-2" />
          Data Export
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Export your data and preferences</p>
            <p className="text-xs text-muted-foreground">
              Download a copy of your profile data and settings
            </p>
          </div>
          <Button variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
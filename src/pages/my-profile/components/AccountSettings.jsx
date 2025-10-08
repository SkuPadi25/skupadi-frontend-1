import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AccountSettings = ({ user }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const watchedPassword = watch('newPassword');
  const watchedConfirmPassword = watch('confirmPassword');

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, feedback: '' };
    
    let score = 0;
    const feedback = [];

    if (password?.length >= 8) score += 1;
    else feedback?.push('At least 8 characters');

    if (/[A-Z]/?.test(password)) score += 1;
    else feedback?.push('One uppercase letter');

    if (/[a-z]/?.test(password)) score += 1;
    else feedback?.push('One lowercase letter');

    if (/\d/?.test(password)) score += 1;
    else feedback?.push('One number');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/?.test(password)) score += 1;
    else feedback?.push('One special character');

    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      score,
      level: strengthLevels?.[score] || 'Very Weak',
      color: colors?.[score] || 'bg-red-500',
      feedback: feedback?.join(', ') || 'Password meets all requirements'
    };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  const onPasswordSubmit = async (data) => {
    if (data?.newPassword !== data?.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      console?.log('Changing password...');
      
      // In a real app, call your auth service here
      // const { error } = await supabase.auth.updateUser({
      //   password: data.newPassword
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      reset();
      setIsChangingPassword(false);
      alert('Password changed successfully!');
    } catch (error) {
      console?.error('Password change failed:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30, // minutes
    deviceTracking: true
  });

  const handleSecuritySettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // In a real app, save to backend immediately
    console?.log('Updated security setting:', setting, value);
  };

  const handleAccountDeactivation = () => {
    const confirmed = window?.confirm(
      'Are you sure you want to deactivate your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      console?.log('Account deactivation requested');
      alert('Account deactivation request has been submitted. Please check your email for further instructions.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account security, authentication, and privacy settings
        </p>
      </div>

      {/* Password Management */}
      <div className="bg-muted/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Password & Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Keep your account secure with a strong password
            </p>
          </div>
          
          {!isChangingPassword && (
            <Button
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
            >
              <Icon name="Key" size={16} className="mr-2" />
              Change Password
            </Button>
          )}
        </div>

        {isChangingPassword && (
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Current Password */}
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  {...register('currentPassword', { required: 'Current password is required' })}
                  error={errors?.currentPassword?.message}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showCurrentPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <Input
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  required
                  {...register('newPassword', { 
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long'
                    }
                  })}
                  error={errors?.newPassword?.message}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showNewPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Password Strength</span>
                    <span className={`text-sm font-medium ${
                      passwordStrength?.score >= 4 ? 'text-green-600' : 
                      passwordStrength?.score >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength?.level}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength?.color}`}
                      style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength?.score < 5 && (
                    <p className="text-xs text-muted-foreground">
                      Missing: {passwordStrength?.feedback}
                    </p>
                  )}
                </div>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (value) => value === watchedPassword || 'Passwords do not match'
                  })}
                  error={errors?.confirmPassword?.message}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button type="submit" disabled={passwordStrength?.score < 4}>
                <Icon name="Save" size={16} className="mr-2" />
                Update Password
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => {
                  setIsChangingPassword(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {!isChangingPassword && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">
                Password last changed: Never
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Consider changing your password regularly for better security
            </p>
          </div>
        )}
      </div>

      {/* Security Settings */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Smartphone" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Two-Factor Authentication</h4>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${securitySettings?.twoFactorAuth ? 'text-success' : 'text-muted-foreground'}`}>
                {securitySettings?.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSecuritySettingChange('twoFactorAuth', !securitySettings?.twoFactorAuth)}
              >
                {securitySettings?.twoFactorAuth ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>

          {/* Login Notifications */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                <Icon name="Bell" size={20} className="text-info" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Login Notifications</h4>
                <p className="text-xs text-muted-foreground">
                  Get notified when someone logs into your account
                </p>
              </div>
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={securitySettings?.loginNotifications}
                onChange={(e) => handleSecuritySettingChange('loginNotifications', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </label>
          </div>

          {/* Session Timeout */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-warning" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Session Timeout</h4>
                <p className="text-xs text-muted-foreground">
                  Automatically log out after inactivity
                </p>
              </div>
            </div>
            <select
              value={securitySettings?.sessionTimeout}
              onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e?.target?.value))}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>

          {/* Device Tracking */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Icon name="Monitor" size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Device Tracking</h4>
                <p className="text-xs text-muted-foreground">
                  Track devices that have accessed your account
                </p>
              </div>
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={securitySettings?.deviceTracking}
                onChange={(e) => handleSecuritySettingChange('deviceTracking', e?.target?.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Active Sessions</h3>
        
        <div className="space-y-3">
          {/* Current Session */}
          <div className="flex items-center justify-between p-4 bg-card border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Monitor" size={20} className="text-success" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Current Session</h4>
                <p className="text-xs text-muted-foreground">
                  Chrome on Windows • Lagos, Nigeria • Active now
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
              Current
            </span>
          </div>

          {/* Other Sessions */}
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Icon name="Smartphone" size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Mobile App</h4>
                <p className="text-xs text-muted-foreground">
                  iPhone Safari • Lagos, Nigeria • 2 hours ago
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Icon name="X" size={14} className="mr-1" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <h3 className="text-base font-semibold text-destructive mb-4">Danger Zone</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Deactivate Account</h4>
              <p className="text-xs text-muted-foreground">
                Temporarily disable your account. You can reactivate it later.
              </p>
            </div>
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleAccountDeactivation}
            >
              <Icon name="UserX" size={14} className="mr-2" />
              Deactivate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { SCHOOL_STAFF_ROLE_OPTIONS } from '../../../utils/roleDisplay';

const CreateUserForm = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      confirmPassword: '',
      status: 'Active',
      requirePasswordChange: true,
      mfaEnabled: false
    }
  });

  const watchedRole = watch('role');
  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

  const roleOptions = SCHOOL_STAFF_ROLE_OPTIONS;

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  // Password strength validation
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password?.length >= 8,
      uppercase: /[A-Z]/?.test(password),
      lowercase: /[a-z]/?.test(password),
      number: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    Object?.values(checks)?.forEach(check => check && score++);
    
    if (score < 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score < 5) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  // Generate random password
  const generatePassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset?.charAt(Math?.floor(Math?.random() * charset?.length));
    }
    setValue('password', password);
    setValue('confirmPassword', password);
  };

  // Check if role requires MFA and auto-enable
  React.useEffect(() => {
    const selectedRole = roleOptions?.find(role => role?.value === watchedRole);
    if (selectedRole?.requiresMFA) {
      setMfaEnabled(true);
      setValue('mfaEnabled', true);
    }
  }, [watchedRole, setValue]);

  const onSubmit = async (data) => {
    // Validate password confirmation
    if (data?.password !== data?.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate password strength
    if (passwordStrength?.score < 3) {
      alert('Password is too weak. Please choose a stronger password.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to create user
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In real implementation:
      // const { data: authData, error: authError } = await supabase.auth.signUp({
      //   email: data.email,
      //   password: data.password,
      //   options: {
      //     data: {
      //       full_name: data.fullName,
      //       phone: data.phone,
      //       role: data.role,
      //       status: data.status,
      //       mfa_enabled: data.mfaEnabled,
      //       require_password_change: data.requirePasswordChange
      //     }
      //   }
      // });

      console?.log('User creation data:', data);
      alert('User created successfully! An invitation email has been sent.');
      reset();
      onBack?.();
    } catch (error) {
      console?.error('User creation failed:', error);
      alert('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roleOptions?.find(role => role?.value === watchedRole);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} className="text-foreground" />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Invite Staff User</h3>
            <p className="text-sm text-muted-foreground">
              Add the owner or a designated admin for this school
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-base font-medium text-foreground mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                {...register('fullName', { 
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                error={errors?.fullName?.message}
                placeholder="Enter full name"
              />
              
              <Input
                label="Email Address"
                type="email"
                required
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors?.email?.message}
                placeholder="user@school.edu"
              />
              
              <Input
                label="Phone Number"
                type="tel"
                {...register('phone')}
                error={errors?.phone?.message}
                placeholder="+234 801 234 5678"
              />
              
              <Select
                label="Status"
                required
                options={statusOptions}
                value={watch('status')}
                onChange={(value) => setValue('status', value)}
                error={errors?.status?.message}
              />
            </div>
          </div>

          {/* Role Assignment */}
          <div>
            <h4 className="text-base font-medium text-foreground mb-4">Role & Permissions</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assign Role *
                </label>
                <div className="space-y-3">
                  {roleOptions?.map((role) => (
                    <div 
                      key={role?.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        watchedRole === role?.value 
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setValue('role', role?.value)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          {...register('role', { required: 'Please select a role' })}
                          value={role?.value}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="text-sm font-medium text-foreground">{role?.label}</h5>
                            {role?.requiresMFA && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                Requires MFA
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors?.role && (
                  <p className="text-sm text-destructive mt-1">{errors?.role?.message}</p>
                )}
              </div>

              {/* MFA Setting */}
              {selectedRole && (
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="mfa-enabled"
                    checked={mfaEnabled}
                    onChange={setMfaEnabled}
                    disabled={selectedRole?.requiresMFA}
                  />
                  <div className="flex-1">
                    <label htmlFor="mfa-enabled" className="text-sm font-medium text-foreground cursor-pointer">
                      Enable Multi-Factor Authentication (MFA)
                    </label>
                    {selectedRole?.requiresMFA && (
                      <p className="text-xs text-muted-foreground mt-1">
                        MFA is required for this role and cannot be disabled
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Setup */}
          <div>
            <h4 className="text-base font-medium text-foreground mb-4">Password Setup</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' }
                    })}
                    error={errors?.password?.message}
                    placeholder="Enter password"
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                      </button>
                    }
                  />
                  
                  {/* Password Strength Indicator */}
                  {watchedPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Password Strength</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength?.label === 'Strong' ? 'text-green-600' :
                          passwordStrength?.label === 'Good' ? 'text-blue-600' :
                          passwordStrength?.label === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {passwordStrength?.label}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-200 ${passwordStrength?.color}`}
                          style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === watchedPassword || 'Passwords do not match'
                  })}
                  error={errors?.confirmPassword?.message}
                  placeholder="Confirm password"
                />
              </div>

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePassword}
                >
                  <Icon name="RefreshCw" size={14} className="mr-2" />
                  Generate Password
                </Button>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="require-password-change"
                    {...register('requirePasswordChange')}
                  />
                  <label htmlFor="require-password-change" className="text-sm text-muted-foreground cursor-pointer">
                    Require password change on first login
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!watchedRole || passwordStrength?.score < 3}
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Invite User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;

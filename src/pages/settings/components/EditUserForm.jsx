import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';


const EditUserForm = ({ user, onBack }) => {
  const [loading, setLoading] = useState(false);
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
      status: 'Active',
      mfaEnabled: false
    }
  });

  const watchedRole = watch('role');

  const roleOptions = [
    { 
      value: 'Super Admin', 
      label: 'Super Admin', 
      description: 'Full system access with all permissions',
      requiresMFA: true 
    },
    { 
      value: 'Finance Manager', 
      label: 'Finance Manager', 
      description: 'Manage invoices, payments, and reports. Cannot delete system data.',
      requiresMFA: true 
    },
    { 
      value: 'Bursar', 
      label: 'Bursar', 
      description: 'Record payments and issue receipts. Limited system access.',
      requiresMFA: false 
    }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setValue('fullName', user?.fullName || '');
      setValue('email', user?.email || '');
      setValue('phone', user?.phone || '');
      setValue('role', user?.role || '');
      setValue('status', user?.status || 'Active');
      setMfaEnabled(user?.mfaEnabled || false);
      setValue('mfaEnabled', user?.mfaEnabled || false);
    }
  }, [user, setValue]);

  // Check if role requires MFA and auto-enable
  useEffect(() => {
    const selectedRole = roleOptions?.find(role => role?.value === watchedRole);
    if (selectedRole?.requiresMFA) {
      setMfaEnabled(true);
      setValue('mfaEnabled', true);
    }
  }, [watchedRole, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call to update user
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real implementation:
      // const { error } = await supabase
      //   .from('users')
      //   .update({
      //     full_name: data.fullName,
      //     phone: data.phone,
      //     role: data.role,
      //     status: data.status,
      //     mfa_enabled: data.mfaEnabled,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', user.id);

      console?.log('User update data:', { ...data, userId: user?.id });
      alert('User updated successfully!');
      onBack?.();
    } catch (error) {
      console?.error('User update failed:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!confirm('Are you sure you want to transfer Super Admin ownership to this user? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to transfer ownership
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Ownership transferred successfully. You will be logged out to complete the transfer.');
      // In real app, this would log out the current user
      onBack?.();
    } catch (error) {
      console?.error('Ownership transfer failed:', error);
      alert('Failed to transfer ownership. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roleOptions?.find(role => role?.value === watchedRole);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Icon name="User" size={32} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No User Selected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please select a user from the user management table to edit.
          </p>
          <Button onClick={onBack}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Edit User</h3>
              <p className="text-sm text-muted-foreground">
                Modify user information and permissions
              </p>
            </div>
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
                disabled
                value={user?.email}
                className="bg-muted"
                description="Email cannot be changed after account creation"
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

          {/* Account Information */}
          <div>
            <h4 className="text-base font-medium text-foreground mb-4">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Login
                </label>
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  {user?.lastLogin ? new Date(user?.lastLogin)?.toLocaleString() : 'Never'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Created
                </label>
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  {user?.createdAt ? new Date(user?.createdAt)?.toLocaleDateString() : 'Unknown'}
                </div>
              </div>
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
                    {selectedRole?.requiresMFA ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        MFA is required for this role and cannot be disabled
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        Add an extra layer of security to this account
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Ownership Transfer (only for Super Admin role) */}
              {watchedRole === 'Super Admin' && user?.role !== 'Super Admin' && (
                <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-orange-800 mb-2">
                        Super Admin Role Assignment
                      </h5>
                      <p className="text-sm text-orange-700 mb-3">
                        Assigning the Super Admin role will transfer full ownership of the school account to this user. 
                        This action requires special confirmation.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleTransferOwnership}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        <Icon name="Crown" size={14} className="mr-2" />
                        Transfer Ownership
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
              disabled={!watchedRole}
            >
              <Icon name="Save" size={16} className="mr-2" />
              Update User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
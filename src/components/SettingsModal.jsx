import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm, useWatch } from 'react-hook-form';
import Icon from './AppIcon';
import Image from './AppImage';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

const SettingsModal = ({ isOpen, onClose, onSave }) => {
  const [currentTab, setCurrentTab] = useState('school-config');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBVN, setUploadingBVN] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewBVN, setPreviewBVN] = useState(null);

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm({
    defaultValues: {
      // School Information
      schoolLogo: null,
      schoolName: '',
      schoolEmail: '',
      schoolPhone: '',
      streetName: '',
      city: '',
      localGovernment: '',
      state: '',

      // Bank Preferences
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      accountType: '',
      paymentFrequency: '',
      isDefaultPayoutAccount: false,

      // User Management
      fullName: '',
      ownerEmail: '',
      ownerPhone: '',
      dateOfBirth: '',
      houseNumber: '',
      ownerStreetName: '',
      ownerCity: '',
      ownerLocalGovernment: '',
      ownerState: '',
      bvnNumber: '',
      ninNumber: '',
      bvnDocument: null,

      // User Roles
      userRole: 'admin',
      permissions: []
    }
  });

  const watchedValues = useWatch({ control });

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event?.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  // Options for dropdowns
  const accountTypeOptions = [
    { value: 'savings', label: 'Savings' },
    { value: 'current', label: 'Current' },
    { value: 'corporate', label: 'Corporate' }
  ];

  const paymentFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'on-demand', label: 'On-demand' }
  ];

  const userRoleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const permissionOptions = [
    { value: 'students_view', label: 'View Students' },
    { value: 'students_edit', label: 'Edit Students' },
    { value: 'invoices_view', label: 'View Invoices' },
    { value: 'invoices_edit', label: 'Edit Invoices' },
    { value: 'payments_view', label: 'View Payments' },
    { value: 'payments_edit', label: 'Edit Payments' },
    { value: 'reports_view', label: 'View Reports' },
    { value: 'settings_edit', label: 'Edit Settings' }
  ];

  const nigerianStates = [
    { value: 'abia', label: 'Abia' },
    { value: 'adamawa', label: 'Adamawa' },
    { value: 'akwa-ibom', label: 'Akwa Ibom' },
    { value: 'anambra', label: 'Anambra' },
    { value: 'bauchi', label: 'Bauchi' },
    { value: 'bayelsa', label: 'Bayelsa' },
    { value: 'benue', label: 'Benue' },
    { value: 'borno', label: 'Borno' },
    { value: 'cross-river', label: 'Cross River' },
    { value: 'delta', label: 'Delta' },
    { value: 'ebonyi', label: 'Ebonyi' },
    { value: 'edo', label: 'Edo' },
    { value: 'ekiti', label: 'Ekiti' },
    { value: 'enugu', label: 'Enugu' },
    { value: 'fct', label: 'FCT - Abuja' },
    { value: 'gombe', label: 'Gombe' },
    { value: 'imo', label: 'Imo' },
    { value: 'jigawa', label: 'Jigawa' },
    { value: 'kaduna', label: 'Kaduna' },
    { value: 'kano', label: 'Kano' },
    { value: 'katsina', label: 'Katsina' },
    { value: 'kebbi', label: 'Kebbi' },
    { value: 'kogi', label: 'Kogi' },
    { value: 'kwara', label: 'Kwara' },
    { value: 'lagos', label: 'Lagos' },
    { value: 'nasarawa', label: 'Nasarawa' },
    { value: 'niger', label: 'Niger' },
    { value: 'ogun', label: 'Ogun' },
    { value: 'ondo', label: 'Ondo' },
    { value: 'osun', label: 'Osun' },
    { value: 'oyo', label: 'Oyo' },
    { value: 'plateau', label: 'Plateau' },
    { value: 'rivers', label: 'Rivers' },
    { value: 'sokoto', label: 'Sokoto' },
    { value: 'taraba', label: 'Taraba' },
    { value: 'yobe', label: 'Yobe' },
    { value: 'zamfara', label: 'Zamfara' }
  ];

  // File upload handlers
  const handleLogoUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes?.includes(file?.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file?.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingLogo(true);
    try {
      // Create preview URL
      const previewUrl = URL?.createObjectURL(file);
      setPreviewLogo(previewUrl);
      setValue('schoolLogo', file);
      
    } catch (error) {
      console?.error('Logo upload failed:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoRemove = () => {
    setPreviewLogo(null);
    setValue('schoolLogo', null);
    if (previewLogo) {
      URL?.revokeObjectURL(previewLogo);
    }
  };

  const handleBVNUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes?.includes(file?.type)) {
      alert('Please upload a valid file (JPEG, PNG, WebP, PDF)');
      return;
    }

    // Validate file size (10MB for documents)
    if (file?.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingBVN(true);
    try {
      if (file?.type?.startsWith('image/')) {
        const previewUrl = URL?.createObjectURL(file);
        setPreviewBVN(previewUrl);
      } else {
        setPreviewBVN('pdf');
      }
      setValue('bvnDocument', file);
      
    } catch (error) {
      console?.error('BVN upload failed:', error);
      alert('Failed to upload BVN document. Please try again.');
    } finally {
      setUploadingBVN(false);
    }
  };

  const handleBVNRemove = () => {
    setPreviewBVN(null);
    setValue('bvnDocument', null);
    if (previewBVN && previewBVN !== 'pdf') {
      URL?.revokeObjectURL(previewBVN);
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      console?.log('Settings data:', data);
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave(data);
      }
      
      alert('Settings saved successfully!');
      onClose();
    } catch (error) {
      console?.error('Save failed:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  // Helper functions to check if data exists for each tab
  const hasSchoolData = () => {
    return watchedValues?.schoolName || watchedValues?.schoolEmail || watchedValues?.schoolPhone;
  };

  const hasUserData = () => {
    return watchedValues?.fullName || watchedValues?.ownerEmail || watchedValues?.userRole;
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-card rounded-lg border border-border shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto mx-4 transform transition-all"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Settings" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Settings</h2>
              <p className="text-sm text-muted-foreground">
                Manage your system configuration and user settings
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setCurrentTab('school-config')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'school-config' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="School" size={16} />
                <span>School Configuration</span>
                {hasSchoolData() && (
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                    ●
                  </span>
                )}
              </div>
            </button>
            
            <button
              onClick={() => setCurrentTab('user-management')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'user-management' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} />
                <span>User Management</span>
                {hasUserData() && (
                  <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs">
                    ●
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            {/* Tab 1: School Configuration */}
            {currentTab === 'school-config' && (
              <div className="space-y-6">
                {/* School Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    School Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    {previewLogo ? (
                      <div className="relative">
                        <Image 
                          src={previewLogo}
                          alt="School Logo Preview"
                          className="w-20 h-20 rounded-lg object-cover border border-border"
                        />
                        <button
                          type="button"
                          onClick={handleLogoRemove}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                        <Icon name="Image" size={24} className="text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        loading={uploadingLogo}
                        onClick={() => document?.getElementById('logo-upload')?.click()}
                      >
                        <Icon name="Upload" size={14} className="mr-2" />
                        Upload Logo
                      </Button>
                      
                      {previewLogo && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleLogoRemove}
                        >
                          <Icon name="Trash2" size={14} className="mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>

                {/* School Information Fields */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-4">School Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="School Name"
                      required
                      {...register('schoolName', { required: 'School name is required' })}
                      error={errors?.schoolName?.message}
                      placeholder="Enter your school name"
                    />
                    <Input
                      label="School Email"
                      type="email"
                      required
                      {...register('schoolEmail', { 
                        required: 'School email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      error={errors?.schoolEmail?.message}
                      placeholder="school@example.com"
                    />
                    <Input
                      label="School Phone Number"
                      type="tel"
                      required
                      {...register('schoolPhone', { required: 'School phone is required' })}
                      error={errors?.schoolPhone?.message}
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                </div>

                {/* School Address */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-4">School Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Street Name"
                      required
                      {...register('streetName', { required: 'Street name is required' })}
                      error={errors?.streetName?.message}
                      placeholder="Enter street address"
                    />
                    <Input
                      label="City"
                      required
                      {...register('city', { required: 'City is required' })}
                      error={errors?.city?.message}
                      placeholder="Enter city"
                    />
                    <Input
                      label="Local Government Area"
                      required
                      {...register('localGovernment', { required: 'Local government is required' })}
                      error={errors?.localGovernment?.message}
                      placeholder="Enter LGA"
                    />
                    <Select
                      label="State"
                      required
                      options={nigerianStates}
                      value={watchedValues?.state}
                      onChange={(value) => setValue('state', value)}
                      error={errors?.state?.message}
                      placeholder="Select state"
                    />
                  </div>
                </div>

                {/* Bank Preferences */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-4">Payment Account Setup</h3>
                  <div className="bg-muted/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Info" size={16} className="text-info" />
                      <h4 className="text-sm font-medium text-foreground">Payment Information</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure where your school fee payments will be securely transferred.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Bank Name"
                      {...register('bankName')}
                      error={errors?.bankName?.message}
                      placeholder="e.g. First Bank of Nigeria"
                    />
                    <Input
                      label="Account Number"
                      {...register('accountNumber')}
                      error={errors?.accountNumber?.message}
                      placeholder="Enter 10-digit account number"
                    />
                    <Input
                      label="Account Holder Name"
                      {...register('accountHolderName')}
                      error={errors?.accountHolderName?.message}
                      placeholder="Enter account holder's name"
                    />
                    <Select
                      label="Account Type"
                      options={accountTypeOptions}
                      value={watchedValues?.accountType}
                      onChange={(value) => setValue('accountType', value)}
                      error={errors?.accountType?.message}
                      placeholder="Select account type"
                    />
                    <Select
                      label="Payment Frequency"
                      options={paymentFrequencyOptions}
                      value={watchedValues?.paymentFrequency}
                      onChange={(value) => setValue('paymentFrequency', value)}
                      error={errors?.paymentFrequency?.message}
                      placeholder="Select payment frequency"
                    />
                  </div>

                  {/* Default Payout Account Toggle */}
                  <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg mt-4">
                    <input
                      type="checkbox"
                      id="default-payout"
                      {...register('isDefaultPayoutAccount')}
                      className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <label 
                      htmlFor="default-payout"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Make This the Default Payout Account
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: User Management */}
            {currentTab === 'user-management' && (
              <div className="space-y-6">
                {/* User Information */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-4">User Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      required
                      {...register('fullName', { required: 'Full name is required' })}
                      error={errors?.fullName?.message}
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      required
                      {...register('ownerEmail', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      error={errors?.ownerEmail?.message}
                      placeholder="personal@example.com"
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      required
                      {...register('ownerPhone', { required: 'Phone number is required' })}
                      error={errors?.ownerPhone?.message}
                      placeholder="+234 801 234 5678"
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      {...register('dateOfBirth')}
                      error={errors?.dateOfBirth?.message}
                    />
                  </div>
                </div>

                {/* Residential Address */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-4">Residential Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="House Number/Street Name"
                      {...register('houseNumber')}
                      error={errors?.houseNumber?.message}
                      placeholder="Enter house number and street"
                    />
                    <Input
                      label="City"
                      {...register('ownerCity')}
                      error={errors?.ownerCity?.message}
                      placeholder="Enter city"
                    />
                    <Input
                      label="Local Government Area"
                      {...register('ownerLocalGovernment')}
                      error={errors?.ownerLocalGovernment?.message}
                      placeholder="Enter LGA"
                    />
                    <Select
                      label="State"
                      options={nigerianStates}
                      value={watchedValues?.ownerState}
                      onChange={(value) => setValue('ownerState', value)}
                      error={errors?.ownerState?.message}
                      placeholder="Select state"
                    />
                  </div>
                </div>

                {/* Role and Permissions */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-4">Role & Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Select
                      label="User Role"
                      options={userRoleOptions}
                      value={watchedValues?.userRole}
                      onChange={(value) => setValue('userRole', value)}
                      error={errors?.userRole?.message}
                    />
                    <Select
                      label="Permissions"
                      multiple
                      options={permissionOptions}
                      value={watchedValues?.permissions || []}
                      onChange={(value) => setValue('permissions', value)}
                      error={errors?.permissions?.message}
                      placeholder="Select permissions"
                    />
                  </div>
                </div>

                {/* Identification Documents */}
                <div>
                  <h3 className="text-base font-medium text-foreground mb-4">Identification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="BVN"
                      {...register('bvnNumber')}
                      error={errors?.bvnNumber?.message}
                      description="Bank Verification Number"
                      placeholder="Enter your BVN"
                    />
                    <Input
                      label="NIN"
                      {...register('ninNumber')}
                      error={errors?.ninNumber?.message}
                      description="National Identity Number"
                      placeholder="Enter your NIN"
                    />
                  </div>

                  {/* BVN Document Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Upload BVN Document (Optional)
                    </label>
                    
                    {previewBVN && (
                      <div className="mb-4 p-4 border border-border rounded-lg">
                        {previewBVN === 'pdf' ? (
                          <div className="flex items-center space-x-3">
                            <Icon name="FileText" size={24} className="text-red-500" />
                            <span className="text-sm text-foreground">PDF Document Uploaded</span>
                          </div>
                        ) : (
                          <Image 
                            src={previewBVN}
                            alt="BVN Document Preview"
                            className="max-w-xs max-h-48 rounded-lg object-contain border border-border"
                          />
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        loading={uploadingBVN}
                        onClick={() => document?.getElementById('bvn-upload')?.click()}
                      >
                        <Icon name="Upload" size={14} className="mr-2" />
                        Upload Document
                      </Button>
                      
                      {previewBVN && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleBVNRemove}
                        >
                          <Icon name="Trash2" size={14} className="mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <input
                      id="bvn-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                      onChange={handleBVNUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {currentTab === 'school-config' && 'Configure your school details and payment settings'}
                  {currentTab === 'user-management' && 'Manage user information and permissions'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="px-8"
                >
                  <Icon name="Save" size={16} className="mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;
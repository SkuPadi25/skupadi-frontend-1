import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import PageHeader from '../../components/ui/PageHeader';
import UserManagementTable from './components/UserManagementTable';
import RolesPermissionsManager from './components/RolesPermissionsManager';
import ActivityLogsViewer from './components/ActivityLogsViewer';
import CreateUserForm from './components/CreateUserForm';
import EditUserForm from './components/EditUserForm';
import ReceiptConfigurationModal from './components/ReceiptConfigurationModal';
import InvoiceConfigurationModal from './components/InvoiceConfigurationModal';
import ReminderScheduleTab from './components/ReminderScheduleTab';
import MessageTemplatesTab from './components/MessageTemplatesTab';
import TestingPreviewTab from './components/TestingPreviewTab';
import AcademicConfigurationTab from './components/AcademicConfigurationTab';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [currentTab, setCurrentTab] = useState('school-info');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBVN, setUploadingBVN] = useState(false);
  const [uploadingNIN, setUploadingNIN] = useState(false);
  const [uploadingLetterhead, setUploadingLetterhead] = useState(false);
  const [uploadingWatermark, setUploadingWatermark] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewBVN, setPreviewBVN] = useState(null);
  const [previewNIN, setPreviewNIN] = useState(null);
  const [previewLetterhead, setPreviewLetterhead] = useState(null);
  const [previewWatermark, setPreviewWatermark] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Add URL parameter handling
  const [searchParams, setSearchParams] = useSearchParams();

  // Add notification form state
  const [notificationSettings, setNotificationSettings] = useState({
    // Email Notifications
    emailEnabled: true,
    paymentReminders: true,
    paymentConfirmations: true,
    overdueNotices: true,
    weeklyReports: false,
    monthlyReports: true,
    systemAlerts: true,
    securityNotifications: true,
    
    // SMS Notifications  
    smsEnabled: false,
    smsPaymentReminders: false,
    smsPaymentConfirmations: false,
    smsOverdueNotices: false,
    smsSecurityAlerts: true,
    
    // Push Notifications
    pushEnabled: true,
    pushPaymentReminders: true,
    pushPaymentConfirmations: false,
    pushSystemAlerts: true,
    pushSecurityAlerts: true,
    
    // System Notifications
    inAppNotifications: true,
    notificationSound: true,
    desktopNotifications: false,
    
    // Communication Preferences
    parentCommunication: true,
    staffCommunication: true,
    adminAlerts: true,
    
    // Timing Settings
    reminderDays: 7,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    timezone: 'Africa/Lagos'
  });

  // Add academic configuration state
  const [academicConfig, setAcademicConfig] = useState({
    // Sub-Class Configuration
    subClassEnabled: false,
    namingConvention: 'alphabetic', // 'alphabetic', 'numeric', 'descriptive', 'custom'
    
    // Grade Configurations
    gradeConfigurations: {
      // Example structure that will be populated from existing classes
      'jss_1': {
        gradeName: 'JSS 1',
        hasSubClasses: false,
        subClasses: []
      },
      'jss_2': {
        gradeName: 'JSS 2', 
        hasSubClasses: false,
        subClasses: []
      }
      // ... other grades
    },
    
    // Assignment Rules
    autoAssignmentEnabled: false,
    maxStudentsPerSubClass: 25,
    redistributionEnabled: true
  });

  // Handle URL parameters on component mount and when searchParams change
  useEffect(() => {
    const section = searchParams?.get('section');
    if (section) {
      setActiveMenu(section);
      if (section === 'school-config') {
        setCurrentTab('school-info');
      } else if (section === 'academic-config') {
        setCurrentTab('sub-class-config');
      } else if (section === 'notifications') {
        setCurrentTab('email-settings');
      } else if (section === 'reminder-module') {
        setCurrentTab('reminder-schedule');
      }
    } else {
      // Default to empty string to show the main menu
      setActiveMenu('');
    }
  }, [searchParams]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock user data
  const currentUser = {
    name: 'Sarah Mitchell',
    role: 'School Administrator'
  };

  // Settings menu items
  const settingsMenuItems = [
    {
      id: 'school-config',
      title: 'School Configuration',
      description: 'Configure your school information, personal details, and payment preferences',
      icon: 'School',
      hasSubmenu: true
    },
    {
      id: 'academic-config',
      title: 'Academic Configuration',
      description: 'Configure class structures, sub-class organization, and student assignment rules',
      icon: 'GraduationCap',
      hasSubmenu: true
    },
    {
      id: 'invoice-settings',
      title: 'Invoice Settings',
      description: 'Configure invoice appearance, layout, and information displayed on school invoices',
      icon: 'FileText',
      hasSubmenu: false
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage user accounts, roles, permissions, and access control for your school system',
      icon: 'Users',
      hasSubmenu: true
    },
    {
      id: 'reminder-module',
      title: 'Reminder Module',
      description: 'Configure automated reminders and message templates for payments and invoices',
      icon: 'Bell',
      hasSubmenu: true
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Manage passwords, two-factor authentication, and privacy settings',
      icon: 'Shield',
      hasSubmenu: false
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure email, SMS, and push notification preferences',
      icon: 'Bell',
      hasSubmenu: true
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect with third-party services and manage API keys',
      icon: 'Plug',
      hasSubmenu: false
    },
    {
      id: 'backup',
      title: 'Backup & Export',
      description: 'Manage data backups and export school records',
      icon: 'Download',
      hasSubmenu: false
    }
  ];

  // Form management for School Configuration
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

      // School Branding Assets
      letterheadTemplate: null,
      watermarkImage: null,
      brandingEnabled: true,
      receiptColorScheme: 'blue',
      receiptTemplate: 'standard',

      // Enhanced Receipt Configuration
      receiptElements: {
        studentName: true,
        studentId: true,
        studentClass: true,
        parentInfo: false,
        schoolName: true,
        schoolAddress: true,
        schoolEmail: true,
        schoolPhone: true,
        invoiceNumber: true,
        issueDate: true,
        dueDate: true,
        sessionTerm: true,
        paymentBreakdown: true,
        qrCode: true,
        watermark: false,
        skupadiBranding: true
      },

      // Enhanced Invoice Configuration
      invoiceElements: {
        studentName: true,
        studentId: true,
        studentClass: true,
        parentInfo: true,
        schoolName: true,
        schoolAddress: true,
        schoolEmail: true,
        schoolPhone: true,
        invoiceNumber: true,
        issueDate: true,
        dueDate: true,
        sessionTerm: true,
        paymentBreakdown: true,
        qrCode: false,
        watermark: false,
        skupadiBranding: true,
        paymentInstructions: true,
        installmentOptions: false
      },

      // Owner Information  
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
      ninDocument: null,

      // Bank Preferences
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      accountType: '',
      paymentFrequency: '',
      isDefaultPayoutAccount: false
    }
  });

  const watchedValues = useWatch({ control });

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

  // Add receipt color scheme options
  const receiptColorSchemeOptions = [
    { value: 'blue', label: 'Professional Blue' },
    { value: 'green', label: 'Academic Green' },
    { value: 'purple', label: 'Royal Purple' },
    { value: 'red', label: 'Elegant Red' },
    { value: 'gray', label: 'Classic Gray' },
    { value: 'custom', label: 'Custom Colors' }
  ];

  const receiptTemplateOptions = [
    { value: 'standard', label: 'Standard Template' },
    { value: 'modern', label: 'Modern Template' },
    { value: 'classic', label: 'Classic Template' },
    { value: 'minimalist', label: 'Minimalist Template' }
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
      
      // In a real app, you would upload to Supabase storage here
      // const { data, error } = await supabase.storage
      //   .from('school-assets')
      //   .upload(`logos/${auth.user.id}/${file.name}`, file);
      
    } catch (error) {
      console?.error('Logo upload failed:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLetterheadUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes?.includes(file?.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (10MB for letterhead)
    if (file?.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingLetterhead(true);
    try {
      // Create preview URL
      const previewUrl = URL?.createObjectURL(file);
      setPreviewLetterhead(previewUrl);
      setValue('letterheadTemplate', file);
      
      // In a real app, you would upload to Supabase storage here
      // const { data, error } = await supabase.storage
      //   .from('school-branding')
      //   .upload(`letterheads/${auth.user.id}/${file.name}`, file);
      
    } catch (error) {
      console?.error('Letterhead upload failed:', error);
      alert('Failed to upload letterhead. Please try again.');
    } finally {
      setUploadingLetterhead(false);
    }
  };

  const handleWatermarkUpload = async (event) => {
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

    setUploadingWatermark(true);
    try {
      // Create preview URL
      const previewUrl = URL?.createObjectURL(file);
      setPreviewWatermark(previewUrl);
      setValue('watermarkImage', file);
      
      // In a real app, you would upload to Supabase storage here
      // const { data, error } = await supabase.storage
      //   .from('school-branding')
      //   .upload(`watermarks/${auth.user.id}/${file.name}`, file);
      
    } catch (error) {
      console?.error('Watermark upload failed:', error);
      alert('Failed to upload watermark. Please try again.');
    } finally {
      setUploadingWatermark(false);
    }
  };

  const handleLogoRemove = () => {
    setPreviewLogo(null);
    setValue('schoolLogo', null);
    // Clean up object URL to prevent memory leaks
    if (previewLogo) {
      URL?.revokeObjectURL(previewLogo);
    }
  };

  const handleLetterheadRemove = () => {
    setPreviewLetterhead(null);
    setValue('letterheadTemplate', null);
    if (previewLetterhead) {
      URL?.revokeObjectURL(previewLetterhead);
    }
  };

  const handleWatermarkRemove = () => {
    setPreviewWatermark(null);
    setValue('watermarkImage', null);
    if (previewWatermark) {
      URL?.revokeObjectURL(previewWatermark);
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
      // Create preview URL for images
      if (file?.type?.startsWith('image/')) {
        const previewUrl = URL?.createObjectURL(file);
        setPreviewBVN(previewUrl);
      } else {
        setPreviewBVN('pdf');
      }
      setValue('bvnDocument', file);
      
      // In a real app, you would upload to Supabase storage here
      // const { data, error } = await supabase.storage
      //   .from('user-documents')
      //   .upload(`bvn/${auth.user.id}/${file.name}`, file);
      
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
    // Clean up object URL
    if (previewBVN && previewBVN !== 'pdf') {
      URL?.revokeObjectURL(previewBVN);
    }
  };

  const handleNINUpload = async (event) => {
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

    setUploadingNIN(true);
    try {
      // Create preview URL for images
      if (file?.type?.startsWith('image/')) {
        const previewUrl = URL?.createObjectURL(file);
        setPreviewNIN(previewUrl);
      } else {
        setPreviewNIN('pdf');
      }
      setValue('ninDocument', file);
      
      // In a real app, you would upload to Supabase storage here
      // const { data, error } = await supabase.storage
      //   .from('user-documents')
      //   .upload(`nin/${auth.user.id}/${file.name}`, file);
      
    } catch (error) {
      console?.error('NIN upload failed:', error);
      alert('Failed to upload NIN document. Please try again.');
    } finally {
      setUploadingNIN(false);
    }
  };

  const handleNINRemove = () => {
    setPreviewNIN(null);
    setValue('ninDocument', null);
    // Clean up object URL
    if (previewNIN && previewNIN !== 'pdf') {
      URL?.revokeObjectURL(previewNIN);
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      console?.log('Form data:', data);
      
      // In a real app, you would save to Supabase here
      // const { error } = await supabase
      //   .from('school_onboarding')
      //   .insert({
      //     user_id: auth.user.id,
      //     school_info: {
      //       name: data.schoolName,
      //       email: data.schoolEmail,
      //       phone: data.schoolPhone,
      //       logo_url: logoUploadResult?.data?.path,
      //       address: {
      //         street: data.streetName,
      //         city: data.city,
      //         lga: data.localGovernment,
      //         state: data.state
      //       }
      //     },
      //     owner_info: {
      //       full_name: data.fullName,
      //       email: data.ownerEmail,
      //       phone: data.ownerPhone,
      //       dob: data.dateOfBirth,
      //       address: {
      //         house_number: data.houseNumber,
      //         street: data.ownerStreetName,
      //         city: data.ownerCity,
      //         lga: data.ownerLocalGovernment,
      //         state: data.ownerState
      //       },
      //       identification: {
      //         bvn: data.bvnNumber,
      //         nin: data.ninNumber,
      //         bvn_document_url: bvnUploadResult?.data?.path,
      //         nin_document_url: ninUploadResult?.data?.path
      //       }
      //     },
      //     bank_preferences: {
      //       bank_name: data.bankName,
      //       account_number: data.accountNumber,
      //       account_holder: data.accountHolderName,
      //       account_type: data.accountType,
      //       payment_frequency: data.paymentFrequency,
      //       is_default: data.isDefaultPayoutAccount
      //     }
      //   });

      alert('School onboarding information saved successfully!');
    } catch (error) {
      console?.error('Save failed:', error);
      alert('Failed to save information. Please try again.');
    }
  };

  // Helper functions to check if data exists for each tab
  const hasSchoolData = () => {
    return watchedValues?.schoolName || watchedValues?.schoolEmail || watchedValues?.schoolPhone;
  };

  const hasPersonalData = () => {
    return watchedValues?.fullName || watchedValues?.ownerEmail || watchedValues?.bvnNumber;
  };

  const hasBankData = () => {
    return watchedValues?.bankName || watchedValues?.accountNumber;
  };

  // Update the settings menu click handler to navigate to invoice-settings page
  const handleMenuClick = (itemId) => {
    setActiveMenu(itemId);
    if (itemId === 'school-config') {
      setCurrentTab('school-info');
      setSearchParams({ section: itemId });
    } else if (itemId === 'academic-config') {
      setCurrentTab('sub-class-config');
      setSearchParams({ section: itemId });
    } else if (itemId === 'invoice-settings') {
      // Navigate to dedicated invoice settings page
      window.location.href = '/invoice-settings';
    } else if (itemId === 'user-management') {
      setCurrentTab('user-list');
      setSearchParams({ section: itemId });
    } else if (itemId === 'notifications') {
      setCurrentTab('email-settings');
      setSearchParams({ section: itemId });
    } else if (itemId === 'reminder-module') {
      setCurrentTab('reminder-schedule');
      setSearchParams({ section: itemId });
    } else if (itemId === '') {
      setSearchParams({});
    } else {
      setSearchParams({ section: itemId });
    }
  };

  // Update the back button handler
  const handleBackToMenu = () => {
    setActiveMenu('');
    setSearchParams({});
  };

  // Add receipt configuration modal state
  const [showReceiptConfigModal, setShowReceiptConfigModal] = useState(false);
  const [showInvoiceConfigModal, setShowInvoiceConfigModal] = useState(false);
  
  // Add receipt configuration handlers
  const handleOpenReceiptConfig = () => {
    setShowReceiptConfigModal(true);
  };

  const handleOpenInvoiceConfig = () => {
    setShowInvoiceConfigModal(true);
  };

  const handleSaveReceiptConfig = (config) => {
    // Update the form values with the new configuration
    setValue('receiptElements', config?.receiptElements);
    setValue('receiptColorScheme', config?.receiptColorScheme);
    setValue('receiptTemplate', config?.receiptTemplate);
    
    // In a real app, you would save this to your backend/database
    console.log('Receipt configuration saved:', config);
    alert('Receipt configuration saved successfully!');
  };

  const handleSaveInvoiceConfig = (config) => {
    // Update the form values with the new configuration
    setValue('invoiceElements', config?.invoiceElements);
    setValue('invoiceColorScheme', config?.invoiceColorScheme);
    setValue('invoiceTemplate', config?.invoiceTemplate);
    
    // In a real app, you would save this to your backend/database
    console.log('Invoice configuration saved:', config);
    alert('Invoice configuration saved successfully!');
  };

  // Add academic configuration save handler
  const handleSaveAcademicConfig = async () => {
    try {
      console?.log('Saving academic configuration:', academicConfig);
      
      // In a real app, you would save to backend here following the existing API pattern
      // This would use the existing SchoolClass model structure from schema.prisma
      
      alert('Academic configuration saved successfully!');
    } catch (error) {
      console?.error('Save failed:', error);
      alert('Failed to save academic configuration. Please try again.');
    }
  };

  // Render Settings Menu
  const renderSettingsMenu = () => (
    <div className="space-y-4">
      {settingsMenuItems?.map((item) => (
        <div
          key={item?.id}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            activeMenu === item?.id
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
          }`}
          onClick={() => handleMenuClick(item?.id)}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              activeMenu === item?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name={item?.icon} size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-semibold text-foreground">{item?.title}</h3>
                {item?.hasSubmenu && (
                  <Icon 
                    name={activeMenu === item?.id ? 'ChevronDown' : 'ChevronRight'} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item?.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render School Configuration Submenu
  const renderSchoolConfigSubmenu = () => (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} className="text-foreground" />
          </button>
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="School" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">School Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Configure your school information, personal details, and payment preferences
            </p>
          </div>
        </div>
        <Button 
          variant="default" 
          onClick={() => setCurrentTab('create-user')}
          className="flex items-center space-x-2"
        >
          <Icon name="UserPlus" size={16} />
          <span>Add User</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setCurrentTab('school-info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'school-info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="School" size={16} />
              <span>School Information</span>
              {hasSchoolData() && (
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                  ●
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('school-branding')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'school-branding' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Palette" size={16} />
              <span>Receipt Branding</span>
              {(previewLetterhead || previewWatermark) && (
                <span className="bg-info text-info-foreground px-2 py-1 rounded-full text-xs">
                  ●
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('personal-info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'personal-info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="User" size={16} />
              <span>Owner's Information</span>
              {hasPersonalData() && (
                <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs">
                  ●
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('bank-preferences')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'bank-preferences' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="CreditCard" size={16} />
              <span>Settlement Account</span>
              {hasBankData() && (
                <span className="bg-info text-info-foreground px-2 py-1 rounded-full text-xs">
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
          {/* Tab 1: School Information */}
          {currentTab === 'school-info' && (
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
                      Upload School Logo
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
            </div>
          )}

          {/* Tab 2: School Branding - Enhanced */}
          {currentTab === 'school-branding' && (
            <div className="space-y-6">
              {/* Branding Info Banner */}
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Palette" size={16} className="text-info" />
                  <h4 className="text-sm font-medium text-foreground">Enhanced Receipt Branding System</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create professional, branded receipts with your school logo, custom letterheads, watermarks, 
                  QR codes for verification, and comprehensive student/invoice details. Configure exactly what 
                  appears on every receipt to match your school's requirements.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Receipt Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure what information appears on your receipts
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleOpenReceiptConfig}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Settings" size={16} />
                  <span>Configure Receipt Elements</span>
                </Button>
              </div>

              {/* Note about Invoice Settings */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} className="text-primary" />
                  <h4 className="text-sm font-medium text-foreground">Invoice Configuration</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Invoice settings are now available as a dedicated full page for comprehensive invoice configuration and management.
                </p>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      window.location.href = '/invoice-settings';
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="FileText" size={16} />
                    <span>Open Invoice Settings</span>
                  </Button>
                </div>
              </div>

              {/* Branding Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Palette" size={20} className="text-primary" />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Enable School Branding</h3>
                    <p className="text-sm text-muted-foreground">Apply custom branding to all receipts and documents</p>
                  </div>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={watchedValues?.brandingEnabled}
                    onChange={(e) => setValue('brandingEnabled', e?.target?.checked)}
                    className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {watchedValues?.brandingEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              {/* Enhanced Branding Assets */}
              <div className={`space-y-6 ${!watchedValues?.brandingEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* School Logo Upload */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    School Logo (for Receipt Header)
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    This logo will appear prominently in the header of all receipts. Recommended size: 100x100px, transparent background preferred.
                  </p>
                  
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
                        Upload School Logo
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

                {/* Letterhead Template Upload */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Letterhead Template (Optional)
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Upload a custom letterhead that will appear at the top of receipts. This can include school 
                    name, motto, and contact information. Recommended size: 800x200px
                  </p>
                  
                  {previewLetterhead && (
                    <div className="mb-4 p-4 border border-border rounded-lg">
                      <Image 
                        src={previewLetterhead}
                        alt="Letterhead Preview"
                        className="max-w-full max-h-32 rounded-lg object-contain border border-border"
                      />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      loading={uploadingLetterhead}
                      onClick={() => document?.getElementById('letterhead-upload')?.click()}
                    >
                      <Icon name="Upload" size={14} className="mr-2" />
                      Upload Letterhead
                    </Button>
                    
                    {previewLetterhead && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleLetterheadRemove}
                      >
                        <Icon name="Trash2" size={14} className="mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="letterhead-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleLetterheadUpload}
                    className="hidden"
                  />
                </div>

                {/* Watermark Upload */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Watermark Image (Security Feature)
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Upload a watermark that will appear in the center-middle of receipts as a subtle background. 
                    This helps prevent forgery and adds professionalism. Recommended: Transparent PNG, 200x200px
                  </p>
                  
                  {previewWatermark && (
                    <div className="mb-4 p-4 border border-border rounded-lg">
                      <Image 
                        src={previewWatermark}
                        alt="Watermark Preview"
                        className="w-24 h-24 rounded-lg object-contain border border-border"
                      />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      loading={uploadingWatermark}
                      onClick={() => document?.getElementById('watermark-upload')?.click()}
                    >
                      <Icon name="Upload" size={14} className="mr-2" />
                      Upload Watermark
                    </Button>
                    
                    {previewWatermark && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleWatermarkRemove}
                      >
                        <Icon name="Trash2" size={14} className="mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="watermark-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleWatermarkUpload}
                    className="hidden"
                  />
                </div>

                {/* Receipt Styling Options */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-base font-medium text-foreground mb-4">Receipt Appearance & Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Color Scheme"
                      options={receiptColorSchemeOptions}
                      value={watchedValues?.receiptColorScheme}
                      onChange={(value) => setValue('receiptColorScheme', value)}
                      placeholder="Select color scheme"
                    />
                    <Select
                      label="Receipt Template"
                      options={receiptTemplateOptions}
                      value={watchedValues?.receiptTemplate}
                      onChange={(value) => setValue('receiptTemplate', value)}
                      placeholder="Select template"
                    />
                  </div>
                </div>

                {/* Enhanced Features Overview */}
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span>Enhanced Receipt Features</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Complete student information (Name, ID, Class)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Comprehensive school details</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Invoice details (Number, Issue Date, Due Date)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Academic term information</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Detailed payment breakdown table</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>QR code for verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Professional financial summary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Skupadi signature & branding</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Preview Section */}
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon name="Eye" size={16} className="text-primary" />
                    <h3 className="text-base font-medium text-foreground">Enhanced Receipt Preview</h3>
                  </div>
                  
                  {/* Comprehensive Receipt Preview */}
                  <div className="bg-white rounded-lg border border-border p-6 max-w-md mx-auto shadow-lg">
                    {/* Letterhead Preview */}
                    {previewLetterhead && (
                      <div className="mb-4 text-center">
                        <Image 
                          src={previewLetterhead}
                          alt="Letterhead Preview"
                          className="w-full h-16 object-contain opacity-90"
                        />
                      </div>
                    )}
                    
                    {/* School Header with Logo */}
                    <div className="text-center mb-4 relative">
                      {previewWatermark && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                          <Image 
                            src={previewWatermark}
                            alt="Watermark Preview"
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                      )}
                      
                      <div className="relative z-10">
                        {previewLogo && (
                          <div className="mb-2">
                            <Image 
                              src={previewLogo}
                              alt="Logo Preview"
                              className="w-12 h-12 object-contain mx-auto rounded border"
                            />
                          </div>
                        )}
                        
                        <h3 className="text-lg font-bold text-gray-800">
                          {watchedValues?.schoolName || 'Your School Name'}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {watchedValues?.streetName ? `${watchedValues?.streetName}, ${watchedValues?.city}` : 'School Address'}
                        </p>
                        <p className="text-xs text-gray-600">
                          Phone: {watchedValues?.schoolPhone || 'Phone'} | Email: {watchedValues?.schoolEmail || 'Email'}
                        </p>
                        <h4 className="text-sm font-bold text-primary mt-2">PAYMENT RECEIPT</h4>
                      </div>
                    </div>
                    
                    {/* Enhanced Sample Content */}
                    <div className="space-y-3 text-xs relative z-10">
                      {/* Student Information */}
                      <div className="bg-gray-50 p-2 rounded">
                        <h5 className="font-semibold text-gray-700 mb-1">Student Information</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Name:</span>
                            <span>John Doe</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Student ID:</span>
                            <span>STD-2024-001</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Class:</span>
                            <span>JSS 2A</span>
                          </div>
                        </div>
                      </div>

                      {/* Invoice Information */}
                      <div className="bg-gray-50 p-2 rounded">
                        <h5 className="font-semibold text-gray-700 mb-1">Invoice Details</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Invoice #:</span>
                            <span>INV-2024-001</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Term:</span>
                            <span>First Term</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Session:</span>
                            <span>2024/2025</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Breakdown */}
                      <div className="bg-gray-50 p-2 rounded">
                        <h5 className="font-semibold text-gray-700 mb-1">Payment Breakdown</h5>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left">Item</th>
                              <th className="text-right">Qty</th>
                              <th className="text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Tuition Fee</td>
                              <td className="text-right">1</td>
                              <td className="text-right">₦30,000</td>
                            </tr>
                            <tr>
                              <td>Development Levy</td>
                              <td className="text-right">1</td>
                              <td className="text-right">₦15,000</td>
                            </tr>
                            <tr>
                              <td>Administrative Fee</td>
                              <td className="text-right">1</td>
                              <td className="text-right">₦5,000</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Financial Summary */}
                      <div className="bg-primary/10 p-2 rounded">
                        <div className="flex justify-between font-semibold">
                          <span>Total Paid:</span>
                          <span>₦50,000</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Outstanding:</span>
                          <span>₦0.00</span>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="flex justify-between items-center border-t pt-2">
                        <div>
                          <p className="text-xs text-gray-500">QR Code Verification</p>
                          <p className="text-xs text-primary">Scan to verify</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Icon name="QrCode" size={16} className="text-gray-500" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-200 text-center text-xs text-gray-500 relative z-10">
                      <p className="font-semibold text-gray-700">Thank you for your payment!</p>
                      <p>Issued by: Skupadi System</p>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <Icon name="GraduationCap" size={10} className="text-primary" />
                        <span className="text-primary font-medium">Powered by Skupadi</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    This comprehensive preview shows how your enhanced receipts will appear with all configured 
                    branding, student information, invoice details, payment breakdowns, and QR code verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Personal Information */}
          {currentTab === 'personal-info' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-base font-medium text-foreground mb-4">Basic Information</h3>
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
                    required
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                    error={errors?.dateOfBirth?.message}
                  />
                </div>
              </div>

              {/* Local Address */}
              <div>
                <h3 className="text-base font-medium text-foreground mb-4">Residential Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="House Number/Street Name"
                    required
                    {...register('houseNumber', { required: 'House number/street is required' })}
                    error={errors?.houseNumber?.message}
                    placeholder="Enter house number and street"
                  />
                  <Input
                    label="City"
                    required
                    {...register('ownerCity', { required: 'City is required' })}
                    error={errors?.ownerCity?.message}
                    placeholder="Enter city"
                  />
                  <Input
                    label="Local Government Area"
                    required
                    {...register('ownerLocalGovernment', { required: 'Local government is required' })}
                    error={errors?.ownerLocalGovernment?.message}
                    placeholder="Enter LGA"
                  />
                  <Select
                    label="State"
                    required
                    options={nigerianStates}
                    value={watchedValues?.ownerState}
                    onChange={(value) => setValue('ownerState', value)}
                    error={errors?.ownerState?.message}
                    placeholder="Select state"
                  />
                </div>
              </div>

              {/* Means of Identification */}
              <div>
                <h3 className="text-base font-medium text-foreground mb-4">Means of Identification</h3>
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

                {/* BVN Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Upload BVN Document
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
                      Upload BVN Document
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

                {/* NIN Upload */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Upload NIN Document
                  </label>
                  
                  {previewNIN && (
                    <div className="mb-4 p-4 border border-border rounded-lg">
                      {previewNIN === 'pdf' ? (
                        <div className="flex items-center space-x-3">
                          <Icon name="FileText" size={24} className="text-red-500" />
                          <span className="text-sm text-foreground">PDF Document Uploaded</span>
                        </div>
                      ) : (
                        <Image 
                          src={previewNIN}
                          alt="NIN Document Preview"
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
                      loading={uploadingNIN}
                      onClick={() => document?.getElementById('nin-upload')?.click()}
                    >
                      <Icon name="Upload" size={14} className="mr-2" />
                      Upload NIN Document
                    </Button>
                    
                    {previewNIN && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleNINRemove}
                      >
                        <Icon name="Trash2" size={14} className="mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="nin-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                    onChange={handleNINUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Bank Preferences */}
          {currentTab === 'bank-preferences' && (
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} className="text-info" />
                  <h4 className="text-sm font-medium text-foreground">Payment Account Setup</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure where your school fee payments will be securely transferred. This information is encrypted and stored safely.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground mb-4">Bank Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Bank Name"
                    required
                    {...register('bankName', { required: 'Bank name is required' })}
                    error={errors?.bankName?.message}
                    placeholder="e.g. First Bank of Nigeria"
                  />
                  <Input
                    label="Account Number"
                    required
                    {...register('accountNumber', { required: 'Account number is required' })}
                    error={errors?.accountNumber?.message}
                    placeholder="Enter 10-digit account number"
                  />
                  <Input
                    label="Account Holder Name"
                    required
                    {...register('accountHolderName', { required: 'Account holder name is required' })}
                    error={errors?.accountHolderName?.message}
                    placeholder="Enter account holder's name"
                  />
                  <Select
                    label="Account Type"
                    required
                    options={accountTypeOptions}
                    value={watchedValues?.accountType}
                    onChange={(value) => setValue('accountType', value)}
                    error={errors?.accountType?.message}
                    placeholder="Select account type"
                  />
                  <Select
                    label="Payment Frequency"
                    required
                    options={paymentFrequencyOptions}
                    value={watchedValues?.paymentFrequency}
                    onChange={(value) => setValue('paymentFrequency', value)}
                    error={errors?.paymentFrequency?.message}
                    placeholder="Select payment frequency"
                  />
                </div>
              </div>

              {/* Default Payout Account Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
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
          )}
        </div>

        {/* Footer - Updated to handle the new tab */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {currentTab === 'school-info' && 'Configure your school details and contact information'}
                {currentTab === 'school-branding' && 'Customize receipt branding and appearance'}
                {currentTab === 'personal-info' && 'Complete your owner and identification details'}
                {currentTab === 'bank-preferences' && 'Set up your preferred settlement account'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Tab Navigation Buttons */}
              {currentTab !== 'school-info' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (currentTab === 'school-branding') setCurrentTab('school-info');
                    if (currentTab === 'personal-info') setCurrentTab('school-branding');
                    if (currentTab === 'bank-preferences') setCurrentTab('personal-info');
                  }}
                >
                  <Icon name="ChevronLeft" size={16} className="mr-2" />
                  Previous
                </Button>
              )}
              
              {currentTab !== 'bank-preferences' ? (
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    if (currentTab === 'school-info') setCurrentTab('school-branding');
                    if (currentTab === 'school-branding') setCurrentTab('personal-info');
                    if (currentTab === 'personal-info') setCurrentTab('bank-preferences');
                  }}
                >
                  Next
                  <Icon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="px-8"
                >
                  <Icon name="Save" size={16} className="mr-2" />
                  Save All Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  // Add User Management Submenu render function
  const renderUserManagementSubmenu = () => (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} className="text-foreground" />
          </button>
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Users" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">User Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage user accounts, roles, permissions, and access control for your school system
            </p>
          </div>
        </div>
        <Button 
          variant="default" 
          onClick={() => setCurrentTab('create-user')}
          className="flex items-center space-x-2"
        >
          <Icon name="UserPlus" size={16} />
          <span>Add User</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setCurrentTab('user-list')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'user-list' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>Users</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('roles-permissions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'roles-permissions' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span>Roles & Permissions</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('activity-logs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'activity-logs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} />
              <span>Activity Logs</span>
            </div>
          </button>

          {currentTab === 'create-user' && (
            <button
              onClick={() => setCurrentTab('create-user')}
              className="py-4 px-1 border-b-2 border-primary text-primary font-medium text-sm"
            >
              <div className="flex items-center space-x-2">
                <Icon name="UserPlus" size={16} />
                <span>Create User</span>
              </div>
            </button>
          )}

          {currentTab === 'edit-user' && (
            <button
              onClick={() => setCurrentTab('edit-user')}
              className="py-4 px-1 border-b-2 border-primary text-primary font-medium text-sm"
            >
              <div className="flex items-center space-x-2">
                <Icon name="UserCog" size={16} />
                <span>Edit User</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentTab === 'user-list' && <UserManagementTable onEditUser={(user) => {
          setSelectedUser(user);
          setCurrentTab('edit-user');
        }} />}
        {currentTab === 'roles-permissions' && <RolesPermissionsManager />}
        {currentTab === 'activity-logs' && <ActivityLogsViewer />}
        {currentTab === 'create-user' && <CreateUserForm onBack={() => setCurrentTab('user-list')} />}
        {currentTab === 'edit-user' && <EditUserForm user={selectedUser} onBack={() => setCurrentTab('user-list')} />}
      </div>
    </div>
  );

  // Add Academic Configuration Submenu render function
  const renderAcademicConfigSubmenu = () => (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} className="text-foreground" />
          </button>
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="GraduationCap" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Academic Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Configure class structures, sub-class organization, and student assignment rules
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              // Preview sub-class structure
              alert('Sub-class structure preview coming soon!');
            }}
            className="flex items-center space-x-2"
          >
            <Icon name="Eye" size={16} />
            <span>Preview Structure</span>
          </Button>
          <Button 
            variant="default"
            onClick={() => handleSaveAcademicConfig()}
            className="flex items-center space-x-2"
          >
            <Icon name="Save" size={16} />
            <span>Save Configuration</span>
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setCurrentTab('sub-class-config')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'sub-class-config' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Grid3X3" size={16} />
              <span>Sub-Class Configuration</span>
              {academicConfig?.subClassEnabled && (
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                  ●
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('assignment-rules')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'assignment-rules' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="UserCheck" size={16} />
              <span>Assignment Rules</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('migration-tools')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'migration-tools' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="RefreshCw" size={16} />
              <span>Migration Tools</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentTab === 'sub-class-config' && (
          <AcademicConfigurationTab
            academicConfig={academicConfig}
            setAcademicConfig={setAcademicConfig}
            onSave={handleSaveAcademicConfig}
          />
        )}
        
        {currentTab === 'assignment-rules' && (
          <div className="space-y-6">
            {/* Student Assignment Rules */}
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-info" />
                <h4 className="text-sm font-medium text-foreground">Student Assignment Rules</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure how students are automatically assigned to sub-classes and manage capacity rules.
              </p>
            </div>

            {/* Auto Assignment Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="UserCheck" size={20} className="text-primary" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">Automatic Assignment</h3>
                  <p className="text-sm text-muted-foreground">Automatically assign new students to available sub-classes</p>
                </div>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={academicConfig?.autoAssignmentEnabled}
                  onChange={(e) => setAcademicConfig({
                    ...academicConfig,
                    autoAssignmentEnabled: e?.target?.checked
                  })}
                  className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <span className="text-sm font-medium text-foreground">
                  {academicConfig?.autoAssignmentEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* Capacity Management */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Capacity Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Max Students Per Sub-Class"
                  type="number"
                  min="10"
                  max="50"
                  value={academicConfig?.maxStudentsPerSubClass}
                  onChange={(e) => setAcademicConfig({
                    ...academicConfig,
                    maxStudentsPerSubClass: parseInt(e?.target?.value) || 25
                  })}
                  placeholder="25"
                  description="Maximum number of students allowed in each sub-class"
                />
                
                <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                  <input
                    type="checkbox"
                    id="redistribution"
                    checked={academicConfig?.redistributionEnabled}
                    onChange={(e) => setAcademicConfig({
                      ...academicConfig,
                      redistributionEnabled: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <label htmlFor="redistribution" className="text-sm font-medium text-foreground cursor-pointer">
                    Enable Automatic Redistribution
                  </label>
                </div>
              </div>
            </div>

            {/* Assignment Preview */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Current Assignment Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Students:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Sub-Classes:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Sub-Class Size:</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'migration-tools' && (
          <div className="space-y-6">
            {/* Migration Tools */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <h4 className="text-sm font-medium text-foreground">Migration & Data Tools</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Tools to help migrate existing students to sub-class structure and manage data transitions.
              </p>
            </div>

            {/* Backup Current Structure */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Data Safety</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Export current class structure
                    alert('Backup functionality coming soon!');
                  }}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Download" size={16} />
                  <span>Backup Current Structure</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Import class structure
                    alert('Import functionality coming soon!');
                  }}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Upload" size={16} />
                  <span>Import Configuration</span>
                </Button>
              </div>
            </div>

            {/* Migration Options */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Migration Options</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    // Migrate existing students
                    alert('Student migration wizard coming soon!');
                  }}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="Users" size={20} />
                    <div className="text-left">
                      <div className="font-medium">Migrate Existing Students</div>
                      <div className="text-sm text-muted-foreground">Assign current students to new sub-classes</div>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={16} />
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={() => {
                    // Update payment structures
                    alert('Payment structure migration coming soon!');
                  }}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="CreditCard" size={20} />
                    <div className="text-left">
                      <div className="font-medium">Update Payment Structures</div>
                      <div className="text-sm text-muted-foreground">Adapt fee structures for sub-classes</div>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Add Reminder Module Submenu render function
  const renderReminderModuleSubmenu = () => (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} className="text-foreground" />
          </button>
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bell" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Reminder Module</h2>
            <p className="text-sm text-muted-foreground">
              Configure automated reminders and message templates for payments and invoices
            </p>
          </div>
        </div>
        <Button 
          variant="default" 
          onClick={() => setCurrentTab('testing-preview')}
          className="flex items-center space-x-2"
        >
          <Icon name="Play" size={16} />
          <span>Testing & Preview</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setCurrentTab('reminder-schedule')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'reminder-schedule' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} />
              <span>Reminder Schedule</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('message-templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'message-templates' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="MessageCircle" size={16} />
              <span>Message Templates</span>
            </div>
          </button>

          {currentTab === 'testing-preview' && (
            <button
              onClick={() => setCurrentTab('testing-preview')}
              className="py-4 px-1 border-b-2 border-primary text-primary font-medium text-sm"
            >
              <div className="flex items-center space-x-2">
                <Icon name="Play" size={16} />
                <span>Testing & Preview</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentTab === 'reminder-schedule' && <ReminderScheduleTab />}
        {currentTab === 'message-templates' && <MessageTemplatesTab />}
        {currentTab === 'testing-preview' && <TestingPreviewTab />}
      </div>
    </div>
  );

  // Add Notifications Submenu render function
  const renderNotificationsSubmenu = () => (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} className="text-foreground" />
          </button>
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bell" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground">
              Configure email, SMS, and push notification preferences for your school system
            </p>
          </div>
        </div>
        <Button 
          variant="default" 
          onClick={() => handleSaveNotificationSettings()}
          className="flex items-center space-x-2"
        >
          <Icon name="Save" size={16} />
          <span>Save Settings</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setCurrentTab('email-settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'email-settings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Mail" size={16} />
              <span>Email Notifications</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('sms-settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'sms-settings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="MessageSquare" size={16} />
              <span>SMS Notifications</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('push-settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'push-settings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Smartphone" size={16} />
              <span>Push & System</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('advanced-settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              currentTab === 'advanced-settings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Settings" size={16} />
              <span>Advanced</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Email Notifications Tab */}
        {currentTab === 'email-settings' && (
          <div className="space-y-6">
            {/* Master Email Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={20} className="text-primary" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Enable or disable all email notifications</p>
                </div>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notificationSettings?.emailEnabled}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    emailEnabled: e?.target?.checked
                  })}
                  className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <span className="text-sm font-medium text-foreground">
                  {notificationSettings?.emailEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* Payment Related Notifications */}
            <div className={`space-y-4 ${!notificationSettings?.emailEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="text-base font-semibold text-foreground mb-4">Payment Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Payment Reminders</h4>
                    <p className="text-xs text-muted-foreground">Send reminder emails before payment due dates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.paymentReminders}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      paymentReminders: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Payment Confirmations</h4>
                    <p className="text-xs text-muted-foreground">Send confirmation emails after successful payments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.paymentConfirmations}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      paymentConfirmations: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Overdue Notices</h4>
                    <p className="text-xs text-muted-foreground">Send notices for overdue payments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.overdueNotices}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      overdueNotices: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>

            {/* System & Report Notifications */}
            <div className={`space-y-4 ${!notificationSettings?.emailEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="text-base font-semibold text-foreground mb-4">System & Reports</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Weekly Reports</h4>
                    <p className="text-xs text-muted-foreground">Receive weekly summary reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.weeklyReports}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Monthly Reports</h4>
                    <p className="text-xs text-muted-foreground">Receive monthly summary reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.monthlyReports}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      monthlyReports: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">System Alerts</h4>
                    <p className="text-xs text-muted-foreground">Important system updates and maintenance notices</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.systemAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      systemAlerts: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Security Notifications</h4>
                    <p className="text-xs text-muted-foreground">Login attempts and security-related alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.securityNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      securityNotifications: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SMS Notifications Tab */}
        {currentTab === 'sms-settings' && (
          <div className="space-y-6">
            {/* SMS Info Banner */}
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-info" />
                <h4 className="text-sm font-medium text-foreground">SMS Notifications</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                SMS notifications may incur additional charges. Please check with your service provider for rates.
              </p>
            </div>

            {/* Master SMS Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="MessageSquare" size={20} className="text-primary" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">SMS Notifications</h3>
                  <p className="text-sm text-muted-foreground">Enable or disable all SMS notifications</p>
                </div>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notificationSettings?.smsEnabled}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    smsEnabled: e?.target?.checked
                  })}
                  className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <span className="text-sm font-medium text-foreground">
                  {notificationSettings?.smsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* SMS Settings */}
            <div className={`space-y-4 ${!notificationSettings?.smsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="text-base font-semibold text-foreground mb-4">SMS Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Payment Reminders</h4>
                    <p className="text-xs text-muted-foreground">Send SMS reminders for upcoming payments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.smsPaymentReminders}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      smsPaymentReminders: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Payment Confirmations</h4>
                    <p className="text-xs text-muted-foreground">Send SMS confirmations for successful payments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.smsPaymentConfirmations}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      smsPaymentConfirmations: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Overdue Notices</h4>
                    <p className="text-xs text-muted-foreground">Send SMS notices for overdue payments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.smsOverdueNotices}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      smsOverdueNotices: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Security Alerts</h4>
                    <p className="text-xs text-muted-foreground">Critical security notifications via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.smsSecurityAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      smsSecurityAlerts: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Push & System Notifications Tab */}
        {currentTab === 'push-settings' && (
          <div className="space-y-6">
            {/* Push Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Smartphone" size={20} className="text-primary" />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                  </div>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={notificationSettings?.pushEnabled}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      pushEnabled: e?.target?.checked
                    })}
                    className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {notificationSettings?.pushEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              <div className={`space-y-4 ${!notificationSettings?.pushEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Payment Reminders</h4>
                      <p className="text-xs text-muted-foreground">Push notifications for payment reminders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings?.pushPaymentReminders}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        pushPaymentReminders: e?.target?.checked
                      })}
                      className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Payment Confirmations</h4>
                      <p className="text-xs text-muted-foreground">Push notifications for payment confirmations</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings?.pushPaymentConfirmations}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        pushPaymentConfirmations: e?.target?.checked
                      })}
                      className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">System Alerts</h4>
                      <p className="text-xs text-muted-foreground">Important system notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings?.pushSystemAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        pushSystemAlerts: e?.target?.checked
                      })}
                      className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Security Alerts</h4>
                      <p className="text-xs text-muted-foreground">Security-related push notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings?.pushSecurityAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        pushSecurityAlerts: e?.target?.checked
                      })}
                      className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* In-App Notifications */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground mb-4">In-App Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">In-App Notifications</h4>
                    <p className="text-xs text-muted-foreground">Show notifications within the application</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.inAppNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      inAppNotifications: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Notification Sound</h4>
                    <p className="text-xs text-muted-foreground">Play sound for new notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.notificationSound}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      notificationSound: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Desktop Notifications</h4>
                    <p className="text-xs text-muted-foreground">Show desktop notifications when app is minimized</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.desktopNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      desktopNotifications: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Tab */}
        {currentTab === 'advanced-settings' && (
          <div className="space-y-6">
            {/* Communication Preferences */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground mb-4">Communication Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Parent Communication</h4>
                    <p className="text-xs text-muted-foreground">Notifications related to parent communications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.parentCommunication}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      parentCommunication: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Staff Communication</h4>
                    <p className="text-xs text-muted-foreground">Internal staff notifications and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.staffCommunication}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      staffCommunication: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Administrative Alerts</h4>
                    <p className="text-xs text-muted-foreground">Important administrative notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings?.adminAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      adminAlerts: e?.target?.checked
                    })}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>

            {/* Timing Settings */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground mb-4">Timing & Schedule</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Payment Reminder (Days Before)"
                  type="number"
                  min="1"
                  max="30"
                  value={notificationSettings?.reminderDays}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    reminderDays: parseInt(e?.target?.value) || 7
                  })}
                  placeholder="7"
                />
                <Select
                  label="Timezone"
                  options={[
                    { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
                    { value: 'UTC', label: 'UTC' },
                    { value: 'Africa/Cairo', label: 'Egypt Time' },
                    { value: 'Africa/Johannesburg', label: 'South Africa Time' }
                  ]}
                  value={notificationSettings?.timezone}
                  onChange={(value) => setNotificationSettings({
                    ...notificationSettings,
                    timezone: value
                  })}
                  placeholder="Select timezone"
                />
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground mb-4">Quiet Hours</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set hours when you don't want to receive non-critical notifications
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Quiet Hours Start"
                  type="time"
                  value={notificationSettings?.quietHoursStart}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    quietHoursStart: e?.target?.value
                  })}
                />
                <Input
                  label="Quiet Hours End"
                  type="time"
                  value={notificationSettings?.quietHoursEnd}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    quietHoursEnd: e?.target?.value
                  })}
                />
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">
                  During quiet hours, only critical security alerts and urgent notifications will be sent.
                  Regular payment reminders and reports will be queued until quiet hours end.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Add notification settings save handler
  const handleSaveNotificationSettings = async () => {
    try {
      console?.log('Saving notification settings:', notificationSettings);
      
      // In a real app, you would save to Supabase here
      // const { error } = await supabase
      //   .from('user_notification_preferences')
      //   .upsert({
      //     user_id: auth.user.id,
      //     preferences: notificationSettings,
      //     updated_at: new Date().toISOString()
      //   });

      alert('Notification preferences saved successfully!');
    } catch (error) {
      console?.error('Save failed:', error);
      alert('Failed to save notification preferences. Please try again.');
    }
  };

  // Render other settings placeholders
  const renderOtherSettings = () => (
    <div className="bg-card rounded-lg border border-border p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Settings" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {settingsMenuItems?.find(item => item?.id === activeMenu)?.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {settingsMenuItems?.find(item => item?.id === activeMenu)?.description}
        </p>
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            This section is coming soon. We're working hard to bring you more configuration options.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Breadcrumb 
              customItems={[
                ...(activeMenu === 'school-config' ? [
                  { label: 'Settings', href: '/settings' },
                  { label: 'School Configuration' }
                ] : activeMenu === 'academic-config' ? [
                  { label: 'Settings', href: '/settings' },
                  { label: 'Academic Configuration' }
                ] : activeMenu === 'invoice-settings' ? [
                  { label: 'Settings', href: '/settings' },
                  { label: 'Invoice Settings' }
                ] : activeMenu === 'user-management' ? [
                  { label: 'Settings', href: '/settings' },
                  { label: 'User Management' }
                ] : activeMenu === 'notifications' ? [
                  { label: 'Settings', href: '/settings' },
                  { label: 'Notification Preferences' }
                ] : activeMenu === 'reminder-module' ? [
                  { label: 'Settings', href: '/settings' },
                  { label: 'Reminder Module' }
                ] : activeMenu !== '' ? [
                  { label: 'Settings', href: '/settings' },
                  { label: settingsMenuItems?.find(item => item?.id === activeMenu)?.title }
                ] : [])
              ]} 
            />
            
            <PageHeader 
              title={
                activeMenu === 'school-config' ? 'School Configuration' :
                activeMenu === 'academic-config' ? 'Academic Configuration' :
                activeMenu === 'invoice-settings' ? 'Invoice Settings' :
                activeMenu === 'user-management' ? 'User Management' :
                activeMenu === 'reminder-module' ? 'Reminder Module' :
                activeMenu === 'notifications' ? 'Notification Preferences' :
                activeMenu !== '' ? settingsMenuItems?.find(item => item?.id === activeMenu)?.title :
                'Settings'
              }
              subtitle={
                activeMenu === 'school-config' ? 'Configure your school information, personal details, and enhanced receipt branding system' :
                activeMenu === 'academic-config' ? 'Configure class structures, sub-class organization, and student assignment rules' :
                activeMenu === 'invoice-settings' ? 'Configure invoice appearance, layout, and information displayed on school invoices' :
                activeMenu === 'user-management' ? 'Manage user accounts, roles, permissions, and access control for your school system' :
                activeMenu === 'reminder-module' ? 'Configure automated reminders and message templates for payments and invoices' :
                activeMenu === 'notifications' ? 'Configure email, SMS, and push notification preferences for your school system' :
                activeMenu !== '' ? settingsMenuItems?.find(item => item?.id === activeMenu)?.description :
                'Manage your application preferences, school configuration, and system settings'
              }
              icon={
                activeMenu === 'school-config' ? 'School' :
                activeMenu === 'academic-config' ? 'GraduationCap' :
                activeMenu === 'invoice-settings' ? 'FileText' :
                activeMenu === 'user-management' ? 'Users' :
                activeMenu === 'reminder-module' ? 'Bell' :
                activeMenu === 'notifications' ? 'Bell' :
                activeMenu !== '' ? settingsMenuItems?.find(item => item?.id === activeMenu)?.icon :
                'Settings'
              }
              actions={null}
            />

            {/* Main Content */}
            {activeMenu === '' && renderSettingsMenu()}
            {activeMenu === 'school-config' && renderSchoolConfigSubmenu()}
            {activeMenu === 'academic-config' && renderAcademicConfigSubmenu()}
            {activeMenu === 'user-management' && renderUserManagementSubmenu()}
            {activeMenu === 'reminder-module' && renderReminderModuleSubmenu()}
            {activeMenu === 'notifications' && renderNotificationsSubmenu()}
            {activeMenu !== '' && activeMenu !== 'school-config' && activeMenu !== 'academic-config' && activeMenu !== 'user-management' && activeMenu !== 'reminder-module' && activeMenu !== 'notifications' && renderOtherSettings()}
          </div>
        </main>
      </div>

      {/* Receipt Configuration Modal */}
      <ReceiptConfigurationModal
        isOpen={showReceiptConfigModal}
        onClose={() => setShowReceiptConfigModal(false)}
        onSave={handleSaveReceiptConfig}
        currentConfig={{
          receiptElements: watchedValues?.receiptElements,
          receiptColorScheme: watchedValues?.receiptColorScheme,
          receiptTemplate: watchedValues?.receiptTemplate,
          ...watchedValues
        }}
      />

      {/* Invoice Configuration Modal */}
      <InvoiceConfigurationModal
        isOpen={showInvoiceConfigModal}
        onClose={() => setShowInvoiceConfigModal(false)}
        onSave={handleSaveInvoiceConfig}
        currentConfig={{
          invoiceElements: watchedValues?.invoiceElements,
          invoiceColorScheme: watchedValues?.invoiceColorScheme,
          invoiceTemplate: watchedValues?.invoiceTemplate,
          ...watchedValues
        }}
      />
    </div>
  );
};

export default Settings;
import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import PageHeader from '../../components/ui/PageHeader';

const InvoiceSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('invoice-layout');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingLetterhead, setUploadingLetterhead] = useState(false);
  const [uploadingWatermark, setUploadingWatermark] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewLetterhead, setPreviewLetterhead] = useState(null);
  const [previewWatermark, setPreviewWatermark] = useState(null);
  
  const navigate = useNavigate();

  // Mock user data
  const currentUser = {
    name: 'Sarah Mitchell',
    role: 'School Administrator'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Form management for Invoice Configuration
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm({
    defaultValues: {
      // Invoice Layout Configuration
      invoiceTemplate: 'modern',
      invoiceColorScheme: 'blue',
      logoPosition: 'top-left',
      headerLayout: 'standard',
      footerLayout: 'centered',
      
      // Invoice Information Elements
      invoiceElements: {
        // Student Information
        studentName: true,
        studentId: true,
        studentClass: true,
        parentInfo: true,
        studentPhoto: false,
        
        // School Information
        schoolName: true,
        schoolAddress: true,
        schoolEmail: true,
        schoolPhone: true,
        schoolLogo: true,
        
        // Invoice Details
        invoiceNumber: true,
        issueDate: true,
        dueDate: true,
        sessionTerm: true,
        academicYear: true,
        
        // Payment Information
        paymentBreakdown: true,
        totalAmount: true,
        amountDue: true,
        paymentInstructions: true,
        installmentOptions: false,
        lateFees: false,
        
        // Additional Features
        qrCode: false,
        watermark: false,
        skupadiBranding: true,
        customFooterText: false
      },
      
      // Payment Instructions
      paymentInstructions: {
        bankTransfer: true,
        onlinePayment: true,
        cashPayment: true,
        customInstructions: ''
      },
      
      // Branding Assets
      schoolLogo: null,
      letterheadTemplate: null,
      watermarkImage: null,
      customFooterText: 'Thank you for choosing our school. For inquiries, contact the bursar office.',
      
      // Advanced Settings
      invoicePrefix: 'INV',
      invoiceNumberLength: 6,
      invoiceValidityDays: 30,
      autoGenerateInvoiceNumber: true,
      includeParentCopy: true,
      emailInvoiceToParents: true
    }
  });

  const watchedValues = useWatch({ control });

  // Template options
  const invoiceTemplateOptions = [
    { value: 'modern', label: 'Modern Template' },
    { value: 'classic', label: 'Classic Template' },
    { value: 'professional', label: 'Professional Template' },
    { value: 'minimalist', label: 'Minimalist Template' }
  ];

  const invoiceColorSchemeOptions = [
    { value: 'blue', label: 'Professional Blue' },
    { value: 'green', label: 'Academic Green' },
    { value: 'purple', label: 'Royal Purple' },
    { value: 'red', label: 'Elegant Red' },
    { value: 'gray', label: 'Classic Gray' },
    { value: 'navy', label: 'Navy Blue' }
  ];

  const logoPositionOptions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' }
  ];

  const headerLayoutOptions = [
    { value: 'standard', label: 'Standard Layout' },
    { value: 'compact', label: 'Compact Layout' },
    { value: 'detailed', label: 'Detailed Layout' }
  ];

  const footerLayoutOptions = [
    { value: 'centered', label: 'Centered' },
    { value: 'left-aligned', label: 'Left Aligned' },
    { value: 'split', label: 'Split Layout' }
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

  const handleLetterheadUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes?.includes(file?.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    if (file?.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingLetterhead(true);
    try {
      const previewUrl = URL?.createObjectURL(file);
      setPreviewLetterhead(previewUrl);
      setValue('letterheadTemplate', file);
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

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes?.includes(file?.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    if (file?.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingWatermark(true);
    try {
      const previewUrl = URL?.createObjectURL(file);
      setPreviewWatermark(previewUrl);
      setValue('watermarkImage', file);
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

  // Form submission
  const onSubmit = async (data) => {
    try {
      console?.log('Invoice configuration data:', data);
      
      // In a real app, you would save to your backend here
      // Example API call:
      // const response = await fetch('/api/invoice-settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      alert('Invoice settings saved successfully!');
      navigate('/settings');
    } catch (error) {
      console?.error('Save failed:', error);
      alert('Failed to save invoice settings. Please try again.');
    }
  };

  const handlePreviewInvoice = () => {
    // Logic to generate and show invoice preview
    alert('Invoice preview functionality will open a modal with live preview');
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset all invoice settings to default? This action cannot be undone.')) {
      // Reset form to default values
      setValue('invoiceTemplate', 'modern');
      setValue('invoiceColorScheme', 'blue');
      setValue('logoPosition', 'top-left');
      setValue('headerLayout', 'standard');
      setValue('footerLayout', 'centered');
      
      // Reset invoice elements to default
      const defaultElements = {
        studentName: true,
        studentId: true,
        studentClass: true,
        parentInfo: true,
        studentPhoto: false,
        schoolName: true,
        schoolAddress: true,
        schoolEmail: true,
        schoolPhone: true,
        schoolLogo: true,
        invoiceNumber: true,
        issueDate: true,
        dueDate: true,
        sessionTerm: true,
        academicYear: true,
        paymentBreakdown: true,
        totalAmount: true,
        amountDue: true,
        paymentInstructions: true,
        installmentOptions: false,
        lateFees: false,
        qrCode: false,
        watermark: false,
        skupadiBranding: true,
        customFooterText: false
      };
      setValue('invoiceElements', defaultElements);
      
      alert('Invoice settings have been reset to default values.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Breadcrumb 
              customItems={[
                { label: 'Settings', href: '/settings' },
                { label: 'Invoice Settings' }
              ]} 
            />
            
            <PageHeader 
              title="Invoice Settings"
              subtitle="Configure what information appears on your invoices"
              icon="FileText"
              actions={
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline"
                    onClick={handlePreviewInvoice}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="Eye" size={16} />
                    <span>Preview Invoice</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleResetToDefault}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="RotateCcw" size={16} />
                    <span>Reset to Default</span>
                  </Button>
                </div>
              }
            />

            {/* Main Content */}
            <div className="bg-card rounded-lg border border-border">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Icon name="ArrowLeft" size={16} className="text-foreground" />
                  </button>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Invoice Configuration</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure invoice appearance, layout, and information displayed on school invoices
                    </p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setCurrentTab('invoice-layout')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      currentTab === 'invoice-layout' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="Layout" size={16} />
                      <span>Invoice Layout</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentTab('invoice-elements')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      currentTab === 'invoice-elements' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckSquare" size={16} />
                      <span>Invoice Elements</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentTab('payment-info')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      currentTab === 'payment-info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="CreditCard" size={16} />
                      <span>Payment Information</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentTab('branding-assets')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      currentTab === 'branding-assets' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="Palette" size={16} />
                      <span>Branding & Assets</span>
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
                      <span>Advanced Settings</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6">
                  {/* Tab 1: Invoice Layout */}
                  {currentTab === 'invoice-layout' && (
                    <div className="space-y-6">
                      {/* Layout Info Banner */}
                      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="Layout" size={16} className="text-info" />
                          <h4 className="text-sm font-medium text-foreground">Invoice Layout Configuration</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Choose templates, color schemes, and layout options that reflect your school's professional image.
                        </p>
                      </div>

                      {/* Template and Color Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                          label="Invoice Template"
                          options={invoiceTemplateOptions}
                          value={watchedValues?.invoiceTemplate}
                          onChange={(value) => setValue('invoiceTemplate', value)}
                          placeholder="Select template"
                          description="Choose the overall design and layout style for your invoices"
                        />
                        
                        <Select
                          label="Color Scheme"
                          options={invoiceColorSchemeOptions}
                          value={watchedValues?.invoiceColorScheme}
                          onChange={(value) => setValue('invoiceColorScheme', value)}
                          placeholder="Select color scheme"
                          description="Primary color theme for invoice headers and accents"
                        />

                        <Select
                          label="Logo Position"
                          options={logoPositionOptions}
                          value={watchedValues?.logoPosition}
                          onChange={(value) => setValue('logoPosition', value)}
                          placeholder="Select logo position"
                          description="Where your school logo should appear on the invoice"
                        />

                        <Select
                          label="Header Layout"
                          options={headerLayoutOptions}
                          value={watchedValues?.headerLayout}
                          onChange={(value) => setValue('headerLayout', value)}
                          placeholder="Select header layout"
                          description="How invoice header information is arranged"
                        />
                      </div>

                      {/* Footer Layout */}
                      <div>
                        <Select
                          label="Footer Layout"
                          options={footerLayoutOptions}
                          value={watchedValues?.footerLayout}
                          onChange={(value) => setValue('footerLayout', value)}
                          placeholder="Select footer layout"
                          description="How footer information and branding is positioned"
                        />
                      </div>

                      {/* Layout Preview */}
                      <div className="bg-muted/30 rounded-lg p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Icon name="Eye" size={16} className="text-primary" />
                          <h3 className="text-base font-medium text-foreground">Layout Preview</h3>
                        </div>
                        
                        <div className="bg-white rounded-lg border border-border p-6 max-w-2xl shadow-sm">
                          <div className={`text-center mb-4 ${watchedValues?.logoPosition === 'top-center' ? 'text-center' : watchedValues?.logoPosition === 'top-right' ? 'text-right' : 'text-left'}`}>
                            <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
                            <h3 className="text-lg font-bold text-gray-800">Your School Name</h3>
                            <p className="text-xs text-gray-600">School Address & Contact Info</p>
                          </div>
                          
                          <div className={`p-4 rounded mb-4 ${
                            watchedValues?.invoiceColorScheme === 'blue' ? 'bg-blue-50' :
                            watchedValues?.invoiceColorScheme === 'green' ? 'bg-green-50' :
                            watchedValues?.invoiceColorScheme === 'purple' ? 'bg-purple-50' :
                            watchedValues?.invoiceColorScheme === 'red' ? 'bg-red-50' :
                            watchedValues?.invoiceColorScheme === 'gray'? 'bg-gray-50' : 'bg-blue-900 bg-opacity-10'
                          }`}>
                            <h4 className={`text-sm font-bold mb-2 ${
                              watchedValues?.invoiceColorScheme === 'blue' ? 'text-blue-700' :
                              watchedValues?.invoiceColorScheme === 'green' ? 'text-green-700' :
                              watchedValues?.invoiceColorScheme === 'purple' ? 'text-purple-700' :
                              watchedValues?.invoiceColorScheme === 'red' ? 'text-red-700' :
                              watchedValues?.invoiceColorScheme === 'gray'? 'text-gray-700' : 'text-blue-900'
                            }`}>SCHOOL FEE INVOICE</h4>
                            <div className="text-xs text-gray-600">Invoice #: INV-2024-001 | Due Date: 2024-03-15</div>
                          </div>
                          
                          <div className="space-y-3 text-xs">
                            <div className="bg-gray-50 p-3 rounded">
                              <div className="font-semibold mb-1">Student Information</div>
                              <div>John Doe | JSS 2A | STD-2024-001</div>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded">
                              <div className="font-semibold mb-1">Fee Breakdown</div>
                              <div>Tuition Fee: ₦50,000 | Development Levy: ₦25,000</div>
                              <div className="font-bold mt-1">Total: ₦75,000</div>
                            </div>
                          </div>
                          
                          <div className={`mt-4 pt-3 border-t text-xs ${
                            watchedValues?.footerLayout === 'centered' ? 'text-center' :
                            watchedValues?.footerLayout === 'left-aligned'? 'text-left' : 'flex justify-between'
                          }`}>
                            <div>Thank you for your prompt payment</div>
                            {watchedValues?.footerLayout === 'split' && (
                              <div>Powered by Skupadi</div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          Preview updates automatically as you change layout settings above.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Invoice Elements */}
                  {currentTab === 'invoice-elements' && (
                    <div className="space-y-6">
                      {/* Elements Info Banner */}
                      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="CheckSquare" size={16} className="text-info" />
                          <h4 className="text-sm font-medium text-foreground">Invoice Information Elements</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Select which information fields should appear on your invoices. Toggle elements on/off based on your school's requirements.
                        </p>
                      </div>

                      {/* Student Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Student Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Checkbox
                            label="Student Name"
                            checked={watchedValues?.invoiceElements?.studentName}
                            onChange={(checked) => setValue('invoiceElements.studentName', checked)}
                            description="Full name of the student"
                          />
                          <Checkbox
                            label="Student ID"
                            checked={watchedValues?.invoiceElements?.studentId}
                            onChange={(checked) => setValue('invoiceElements.studentId', checked)}
                            description="Unique student identification number"
                          />
                          <Checkbox
                            label="Student Class"
                            checked={watchedValues?.invoiceElements?.studentClass}
                            onChange={(checked) => setValue('invoiceElements.studentClass', checked)}
                            description="Current class/grade of the student"
                          />
                          <Checkbox
                            label="Parent Information"
                            checked={watchedValues?.invoiceElements?.parentInfo}
                            onChange={(checked) => setValue('invoiceElements.parentInfo', checked)}
                            description="Parent/guardian contact details"
                          />
                          <Checkbox
                            label="Student Photo"
                            checked={watchedValues?.invoiceElements?.studentPhoto}
                            onChange={(checked) => setValue('invoiceElements.studentPhoto', checked)}
                            description="Student's passport photograph"
                          />
                        </div>
                      </div>

                      {/* School Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">School Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Checkbox
                            label="School Name"
                            checked={watchedValues?.invoiceElements?.schoolName}
                            onChange={(checked) => setValue('invoiceElements.schoolName', checked)}
                            description="Official name of the school"
                          />
                          <Checkbox
                            label="School Address"
                            checked={watchedValues?.invoiceElements?.schoolAddress}
                            onChange={(checked) => setValue('invoiceElements.schoolAddress', checked)}
                            description="Complete school address"
                          />
                          <Checkbox
                            label="School Email"
                            checked={watchedValues?.invoiceElements?.schoolEmail}
                            onChange={(checked) => setValue('invoiceElements.schoolEmail', checked)}
                            description="School's official email address"
                          />
                          <Checkbox
                            label="School Phone"
                            checked={watchedValues?.invoiceElements?.schoolPhone}
                            onChange={(checked) => setValue('invoiceElements.schoolPhone', checked)}
                            description="School's contact phone number"
                          />
                          <Checkbox
                            label="School Logo"
                            checked={watchedValues?.invoiceElements?.schoolLogo}
                            onChange={(checked) => setValue('invoiceElements.schoolLogo', checked)}
                            description="School logo/emblem"
                          />
                        </div>
                      </div>

                      {/* Invoice Details Section */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Invoice Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Checkbox
                            label="Invoice Number"
                            checked={watchedValues?.invoiceElements?.invoiceNumber}
                            onChange={(checked) => setValue('invoiceElements.invoiceNumber', checked)}
                            description="Unique invoice reference number"
                          />
                          <Checkbox
                            label="Issue Date"
                            checked={watchedValues?.invoiceElements?.issueDate}
                            onChange={(checked) => setValue('invoiceElements.issueDate', checked)}
                            description="Date when invoice was generated"
                          />
                          <Checkbox
                            label="Due Date"
                            checked={watchedValues?.invoiceElements?.dueDate}
                            onChange={(checked) => setValue('invoiceElements.dueDate', checked)}
                            description="Payment due date"
                          />
                          <Checkbox
                            label="Session & Term"
                            checked={watchedValues?.invoiceElements?.sessionTerm}
                            onChange={(checked) => setValue('invoiceElements.sessionTerm', checked)}
                            description="Academic session and term"
                          />
                          <Checkbox
                            label="Academic Year"
                            checked={watchedValues?.invoiceElements?.academicYear}
                            onChange={(checked) => setValue('invoiceElements.academicYear', checked)}
                            description="Current academic year"
                          />
                        </div>
                      </div>

                      {/* Payment Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Payment Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Checkbox
                            label="Payment Breakdown"
                            checked={watchedValues?.invoiceElements?.paymentBreakdown}
                            onChange={(checked) => setValue('invoiceElements.paymentBreakdown', checked)}
                            description="Detailed fee breakdown table"
                          />
                          <Checkbox
                            label="Total Amount"
                            checked={watchedValues?.invoiceElements?.totalAmount}
                            onChange={(checked) => setValue('invoiceElements.totalAmount', checked)}
                            description="Total amount to be paid"
                          />
                          <Checkbox
                            label="Amount Due"
                            checked={watchedValues?.invoiceElements?.amountDue}
                            onChange={(checked) => setValue('invoiceElements.amountDue', checked)}
                            description="Outstanding amount due"
                          />
                          <Checkbox
                            label="Payment Instructions"
                            checked={watchedValues?.invoiceElements?.paymentInstructions}
                            onChange={(checked) => setValue('invoiceElements.paymentInstructions', checked)}
                            description="How to make payments"
                          />
                          <Checkbox
                            label="Installment Options"
                            checked={watchedValues?.invoiceElements?.installmentOptions}
                            onChange={(checked) => setValue('invoiceElements.installmentOptions', checked)}
                            description="Available installment plans"
                          />
                          <Checkbox
                            label="Late Fees"
                            checked={watchedValues?.invoiceElements?.lateFees}
                            onChange={(checked) => setValue('invoiceElements.lateFees', checked)}
                            description="Late payment charges"
                          />
                        </div>
                      </div>

                      {/* Additional Features Section */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Additional Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Checkbox
                            label="QR Code"
                            checked={watchedValues?.invoiceElements?.qrCode}
                            onChange={(checked) => setValue('invoiceElements.qrCode', checked)}
                            description="QR code for verification and quick access"
                          />
                          <Checkbox
                            label="Watermark"
                            checked={watchedValues?.invoiceElements?.watermark}
                            onChange={(checked) => setValue('invoiceElements.watermark', checked)}
                            description="Security watermark background"
                          />
                          <Checkbox
                            label="Skupadi Branding"
                            checked={watchedValues?.invoiceElements?.skupadiBranding}
                            onChange={(checked) => setValue('invoiceElements.skupadiBranding', checked)}
                            description="Powered by Skupadi footer"
                          />
                          <Checkbox
                            label="Custom Footer Text"
                            checked={watchedValues?.invoiceElements?.customFooterText}
                            onChange={(checked) => setValue('invoiceElements.customFooterText', checked)}
                            description="Custom message in footer"
                          />
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
                          <Icon name="CheckCircle" size={16} className="text-success" />
                          <span>Selected Invoice Elements</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {Object.entries(watchedValues?.invoiceElements || {})?.filter(([_, value]) => value)?.map(([key, _]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Icon name="Check" size={14} className="text-success" />
                              <span>{key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Payment Information */}
                  {currentTab === 'payment-info' && (
                    <div className="space-y-6">
                      {/* Payment Info Banner */}
                      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="CreditCard" size={16} className="text-info" />
                          <h4 className="text-sm font-medium text-foreground">Payment Information Setup</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Configure payment instructions and methods that will appear on invoices to guide parents on how to make payments.
                        </p>
                      </div>

                      {/* Payment Methods */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Accepted Payment Methods</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Checkbox
                            label="Bank Transfer"
                            checked={watchedValues?.paymentInstructions?.bankTransfer}
                            onChange={(checked) => setValue('paymentInstructions.bankTransfer', checked)}
                            description="Direct bank transfer/deposit"
                          />
                          <Checkbox
                            label="Online Payment"
                            checked={watchedValues?.paymentInstructions?.onlinePayment}
                            onChange={(checked) => setValue('paymentInstructions.onlinePayment', checked)}
                            description="Online payment platforms"
                          />
                          <Checkbox
                            label="Cash Payment"
                            checked={watchedValues?.paymentInstructions?.cashPayment}
                            onChange={(checked) => setValue('paymentInstructions.cashPayment', checked)}
                            description="Cash payment at school"
                          />
                        </div>
                      </div>

                      {/* Custom Payment Instructions */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Custom Payment Instructions</h3>
                        <textarea
                          {...register('paymentInstructions.customInstructions')}
                          className="w-full min-h-[120px] p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          placeholder="Add any specific payment instructions, bank details, or important notes that should appear on invoices..."
                        />
                        <p className="text-xs text-muted-foreground">
                          This text will appear in the payment instructions section of all invoices. Include bank account details, payment deadlines, or any special instructions.
                        </p>
                      </div>

                      {/* Payment Instructions Preview */}
                      <div className="bg-muted/30 rounded-lg p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Icon name="Eye" size={16} className="text-primary" />
                          <h3 className="text-base font-medium text-foreground">Payment Instructions Preview</h3>
                        </div>
                        
                        <div className="bg-white rounded-lg border border-border p-6 space-y-4">
                          <h4 className="text-sm font-bold text-gray-800">PAYMENT INSTRUCTIONS</h4>
                          
                          {watchedValues?.paymentInstructions?.bankTransfer && (
                            <div className="border-l-4 border-blue-500 pl-4">
                              <h5 className="text-sm font-semibold text-gray-700">Bank Transfer</h5>
                              <p className="text-xs text-gray-600">Transfer directly to school account</p>
                            </div>
                          )}
                          
                          {watchedValues?.paymentInstructions?.onlinePayment && (
                            <div className="border-l-4 border-green-500 pl-4">
                              <h5 className="text-sm font-semibold text-gray-700">Online Payment</h5>
                              <p className="text-xs text-gray-600">Pay securely through our online portal</p>
                            </div>
                          )}
                          
                          {watchedValues?.paymentInstructions?.cashPayment && (
                            <div className="border-l-4 border-orange-500 pl-4">
                              <h5 className="text-sm font-semibold text-gray-700">Cash Payment</h5>
                              <p className="text-xs text-gray-600">Pay cash at the school bursar office</p>
                            </div>
                          )}
                          
                          {watchedValues?.paymentInstructions?.customInstructions && (
                            <div className="bg-gray-50 p-3 rounded">
                              <h5 className="text-sm font-semibold text-gray-700 mb-1">Additional Instructions</h5>
                              <p className="text-xs text-gray-600 whitespace-pre-line">
                                {watchedValues?.paymentInstructions?.customInstructions || 'Your custom payment instructions will appear here...'}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          This preview shows how payment instructions will appear on your invoices.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Branding & Assets */}
                  {currentTab === 'branding-assets' && (
                    <div className="space-y-6">
                      {/* Branding Info Banner */}
                      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="Palette" size={16} className="text-info" />
                          <h4 className="text-sm font-medium text-foreground">Invoice Branding Assets</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Upload your school's visual assets to create professional, branded invoices that reflect your school's identity.
                        </p>
                      </div>

                      {/* School Logo Upload */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <label className="block text-sm font-medium text-foreground mb-3">
                          School Logo (for Invoice Header)
                        </label>
                        <p className="text-xs text-muted-foreground mb-3">
                          Upload your school logo that will appear on invoice headers. Recommended size: 150x150px, transparent background preferred.
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

                      {/* Letterhead Template Upload */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Letterhead Template (Optional)
                        </label>
                        <p className="text-xs text-muted-foreground mb-3">
                          Upload a custom letterhead that will appear at the top of invoices. This can include school name, motto, and contact information. Recommended size: 800x200px.
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
                          Upload a watermark that will appear as a subtle background on invoices. This helps prevent forgery and adds professionalism. Recommended: Transparent PNG, 200x200px.
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

                      {/* Custom Footer Text */}
                      {watchedValues?.invoiceElements?.customFooterText && (
                        <div className="space-y-4">
                          <h3 className="text-base font-semibold text-foreground">Custom Footer Message</h3>
                          <textarea
                            {...register('customFooterText')}
                            className="w-full min-h-[80px] p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            placeholder="Enter a custom message for invoice footer..."
                          />
                          <p className="text-xs text-muted-foreground">
                            This message will appear at the bottom of all invoices. Keep it professional and concise.
                          </p>
                        </div>
                      )}

                      {/* Branding Preview */}
                      <div className="bg-muted/30 rounded-lg p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Icon name="Eye" size={16} className="text-primary" />
                          <h3 className="text-base font-medium text-foreground">Branding Preview</h3>
                        </div>
                        
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
                              
                              <h3 className="text-lg font-bold text-gray-800">Your School Name</h3>
                              <p className="text-xs text-gray-600">School Address & Contact</p>
                              <h4 className="text-sm font-bold text-primary mt-2">SCHOOL FEE INVOICE</h4>
                            </div>
                          </div>
                          
                          {/* Sample Content */}
                          <div className="space-y-3 text-xs relative z-10">
                            <div className="bg-gray-50 p-2 rounded">
                              <div className="font-semibold">Student: John Doe | Class: JSS 2A</div>
                              <div>Invoice: INV-2024-001 | Due: 2024-03-15</div>
                            </div>
                            
                            <div className="bg-gray-50 p-2 rounded">
                              <div className="font-semibold">Total Amount: ₦75,000</div>
                            </div>
                          </div>
                          
                          {/* Footer */}
                          <div className="mt-4 pt-3 border-t border-gray-200 text-center text-xs text-gray-500 relative z-10">
                            {watchedValues?.customFooterText && (
                              <p className="mb-2">{watchedValues?.customFooterText}</p>
                            )}
                            {watchedValues?.invoiceElements?.skupadiBranding && (
                              <div className="flex items-center justify-center space-x-1">
                                <Icon name="GraduationCap" size={10} className="text-primary" />
                                <span className="text-primary font-medium">Powered by Skupadi</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          Preview shows how your branding assets will appear on invoices.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 5: Advanced Settings */}
                  {currentTab === 'advanced-settings' && (
                    <div className="space-y-6">
                      {/* Advanced Settings Info Banner */}
                      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="Settings" size={16} className="text-warning" />
                          <h4 className="text-sm font-medium text-foreground">Advanced Invoice Settings</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Configure advanced invoice settings including numbering, validity periods, and automation preferences. Use with caution.
                        </p>
                      </div>

                      {/* Invoice Numbering */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Invoice Numbering</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Invoice Prefix"
                            {...register('invoicePrefix')}
                            placeholder="INV"
                            description="Prefix for all invoice numbers (e.g., INV-2024-001)"
                          />
                          <Input
                            label="Number Length"
                            type="number"
                            min="3"
                            max="10"
                            {...register('invoiceNumberLength')}
                            placeholder="6"
                            description="Total digits in invoice number sequence"
                          />
                        </div>
                        <Checkbox
                          label="Auto-generate Invoice Numbers"
                          checked={watchedValues?.autoGenerateInvoiceNumber}
                          onChange={(checked) => setValue('autoGenerateInvoiceNumber', checked)}
                          description="Automatically assign sequential invoice numbers"
                        />
                      </div>

                      {/* Invoice Validity */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Invoice Validity</h3>
                        <Input
                          label="Validity Period (Days)"
                          type="number"
                          min="1"
                          max="365"
                          {...register('invoiceValidityDays')}
                          placeholder="30"
                          description="Number of days invoice remains valid for payment"
                        />
                      </div>

                      {/* Communication Settings */}
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-foreground">Communication Settings</h3>
                        <div className="space-y-3">
                          <Checkbox
                            label="Include Parent Copy"
                            checked={watchedValues?.includeParentCopy}
                            onChange={(checked) => setValue('includeParentCopy', checked)}
                            description="Include a copy specifically marked for parents/guardians"
                          />
                          <Checkbox
                            label="Email Invoice to Parents"
                            checked={watchedValues?.emailInvoiceToParents}
                            onChange={(checked) => setValue('emailInvoiceToParents', checked)}
                            description="Automatically email invoices to registered parent email addresses"
                          />
                        </div>
                      </div>

                      {/* System Integration */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-foreground mb-3">System Integration Status</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Student Management:</span>
                            <span className="text-green-600 flex items-center space-x-1">
                              <Icon name="CheckCircle" size={14} />
                              <span>Connected</span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment Processing:</span>
                            <span className="text-green-600 flex items-center space-x-1">
                              <Icon name="CheckCircle" size={14} />
                              <span>Active</span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Email Service:</span>
                            <span className="text-green-600 flex items-center space-x-1">
                              <Icon name="CheckCircle" size={14} />
                              <span>Configured</span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Receipt Generation:</span>
                            <span className="text-green-600 flex items-center space-x-1">
                              <Icon name="CheckCircle" size={14} />
                              <span>Ready</span>
                            </span>
                          </div>
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
                        {currentTab === 'invoice-layout' && 'Configure your invoice template, colors, and layout preferences'}
                        {currentTab === 'invoice-elements' && 'Select which information elements to include on invoices'}
                        {currentTab === 'payment-info' && 'Set up payment instructions and accepted payment methods'}
                        {currentTab === 'branding-assets' && 'Upload your school branding assets for professional invoices'}
                        {currentTab === 'advanced-settings' && 'Configure advanced invoice settings and system integration'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/settings')}
                      >
                        <Icon name="ArrowLeft" size={16} className="mr-2" />
                        Back to Settings
                      </Button>
                      
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        className="px-8"
                      >
                        <Icon name="Save" size={16} className="mr-2" />
                        Save Invoice Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoiceSettings;
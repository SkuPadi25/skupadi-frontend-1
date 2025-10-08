import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ReceiptConfigurationModal = ({ isOpen, onClose, onSave, currentConfig = {} }) => {
  const [activeTab, setActiveTab] = useState('elements');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      // Receipt Elements Configuration
      showStudentName: currentConfig?.receiptElements?.studentName ?? true,
      showStudentId: currentConfig?.receiptElements?.studentId ?? true,
      showStudentClass: currentConfig?.receiptElements?.studentClass ?? true,
      showParentInfo: currentConfig?.receiptElements?.parentInfo ?? false,
      showSchoolName: currentConfig?.receiptElements?.schoolName ?? true,
      showSchoolAddress: currentConfig?.receiptElements?.schoolAddress ?? true,
      showSchoolEmail: currentConfig?.receiptElements?.schoolEmail ?? true,
      showSchoolPhone: currentConfig?.receiptElements?.schoolPhone ?? true,
      showInvoiceNumber: currentConfig?.receiptElements?.invoiceNumber ?? true,
      showIssueDate: currentConfig?.receiptElements?.issueDate ?? true,
      showDueDate: currentConfig?.receiptElements?.dueDate ?? true,
      showSessionTerm: currentConfig?.receiptElements?.sessionTerm ?? true,
      showPaymentBreakdown: currentConfig?.receiptElements?.paymentBreakdown ?? true,
      showQrCode: currentConfig?.receiptElements?.qrCode ?? true,
      showWatermark: currentConfig?.receiptElements?.watermark ?? false,
      showEduFinanceBranding: currentConfig?.receiptElements?.eduFinanceBranding ?? true,

      // Layout & Styling
      receiptColorScheme: currentConfig?.receiptColorScheme || 'blue',
      receiptTemplate: currentConfig?.receiptTemplate || 'standard',
      logoPosition: currentConfig?.logoPosition || 'top-center',
      watermarkPosition: currentConfig?.watermarkPosition || 'center-middle',
      footerStyle: currentConfig?.footerStyle || 'standard',

      // Content Settings
      receiptTitle: currentConfig?.receiptTitle || 'PAYMENT RECEIPT',
      footerMessage: currentConfig?.footerMessage || 'Thank you for your payment!',
      issuerName: currentConfig?.issuerName || 'EduFinance System',
      
      // QR Code Settings
      qrCodeSize: currentConfig?.qrCodeSize || 'medium',
      qrCodePosition: currentConfig?.qrCodePosition || 'bottom-right',
      includeReceiptId: currentConfig?.includeReceiptId ?? true,
      includePaymentReference: currentConfig?.includePaymentReference ?? true,
      includeVerificationUrl: currentConfig?.includeVerificationUrl ?? false,

      // Advanced Options
      showItemQuantity: currentConfig?.showItemQuantity ?? true,
      showUnitPrices: currentConfig?.showUnitPrices ?? true,
      showSubtotal: currentConfig?.showSubtotal ?? true,
      showDiscounts: currentConfig?.showDiscounts ?? true,
      showTaxes: currentConfig?.showTaxes ?? false,
      currencyFormat: currentConfig?.currencyFormat || 'NGN',
      dateFormat: currentConfig?.dateFormat || 'DD/MM/YYYY',
      
      // Signature Settings
      includeDigitalSignature: currentConfig?.includeDigitalSignature ?? true,
      signatureText: currentConfig?.signatureText || 'Digitally signed by EduFinance',
      showPoweredBy: currentConfig?.showPoweredBy ?? true
    }
  });

  const watchedValues = watch();

  // Update form when config changes
  useEffect(() => {
    if (currentConfig && Object.keys(currentConfig)?.length > 0) {
      reset({
        // Receipt Elements Configuration
        showStudentName: currentConfig?.receiptElements?.studentName ?? true,
        showStudentId: currentConfig?.receiptElements?.studentId ?? true,
        showStudentClass: currentConfig?.receiptElements?.studentClass ?? true,
        showParentInfo: currentConfig?.receiptElements?.parentInfo ?? false,
        showSchoolName: currentConfig?.receiptElements?.schoolName ?? true,
        showSchoolAddress: currentConfig?.receiptElements?.schoolAddress ?? true,
        showSchoolEmail: currentConfig?.receiptElements?.schoolEmail ?? true,
        showSchoolPhone: currentConfig?.receiptElements?.schoolPhone ?? true,
        showInvoiceNumber: currentConfig?.receiptElements?.invoiceNumber ?? true,
        showIssueDate: currentConfig?.receiptElements?.issueDate ?? true,
        showDueDate: currentConfig?.receiptElements?.dueDate ?? true,
        showSessionTerm: currentConfig?.receiptElements?.sessionTerm ?? true,
        showPaymentBreakdown: currentConfig?.receiptElements?.paymentBreakdown ?? true,
        showQrCode: currentConfig?.receiptElements?.qrCode ?? true,
        showWatermark: currentConfig?.receiptElements?.watermark ?? false,
        showEduFinanceBranding: currentConfig?.receiptElements?.eduFinanceBranding ?? true,

        // Layout & Styling
        receiptColorScheme: currentConfig?.receiptColorScheme || 'blue',
        receiptTemplate: currentConfig?.receiptTemplate || 'standard',
        logoPosition: currentConfig?.logoPosition || 'top-center',
        watermarkPosition: currentConfig?.watermarkPosition || 'center-middle',
        footerStyle: currentConfig?.footerStyle || 'standard',

        // Content Settings
        receiptTitle: currentConfig?.receiptTitle || 'PAYMENT RECEIPT',
        footerMessage: currentConfig?.footerMessage || 'Thank you for your payment!',
        issuerName: currentConfig?.issuerName || 'EduFinance System',
        
        // QR Code Settings
        qrCodeSize: currentConfig?.qrCodeSize || 'medium',
        qrCodePosition: currentConfig?.qrCodePosition || 'bottom-right',
        includeReceiptId: currentConfig?.includeReceiptId ?? true,
        includePaymentReference: currentConfig?.includePaymentReference ?? true,
        includeVerificationUrl: currentConfig?.includeVerificationUrl ?? false,

        // Advanced Options
        showItemQuantity: currentConfig?.showItemQuantity ?? true,
        showUnitPrices: currentConfig?.showUnitPrices ?? true,
        showSubtotal: currentConfig?.showSubtotal ?? true,
        showDiscounts: currentConfig?.showDiscounts ?? true,
        showTaxes: currentConfig?.showTaxes ?? false,
        currencyFormat: currentConfig?.currencyFormat || 'NGN',
        dateFormat: currentConfig?.dateFormat || 'DD/MM/YYYY',
        
        // Signature Settings
        includeDigitalSignature: currentConfig?.includeDigitalSignature ?? true,
        signatureText: currentConfig?.signatureText || 'Digitally signed by EduFinance',
        showPoweredBy: currentConfig?.showPoweredBy ?? true
      });
    }
  }, [currentConfig, reset]);

  // Options for dropdowns
  const colorSchemeOptions = [
    { value: 'blue', label: 'Professional Blue' },
    { value: 'green', label: 'Academic Green' },
    { value: 'purple', label: 'Royal Purple' },
    { value: 'red', label: 'Elegant Red' },
    { value: 'gray', label: 'Classic Gray' },
    { value: 'custom', label: 'Custom Colors' }
  ];

  const templateOptions = [
    { value: 'standard', label: 'Standard Template' },
    { value: 'modern', label: 'Modern Template' },
    { value: 'classic', label: 'Classic Template' },
    { value: 'minimalist', label: 'Minimalist Template' },
    { value: 'detailed', label: 'Detailed Template' }
  ];

  const logoPositionOptions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'header-left', label: 'Header Left' },
    { value: 'header-right', label: 'Header Right' }
  ];

  const watermarkPositionOptions = [
    { value: 'center-middle', label: 'Center Middle' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'behind-content', label: 'Behind Content' }
  ];

  const qrCodeSizeOptions = [
    { value: 'small', label: 'Small (80x80px)' },
    { value: 'medium', label: 'Medium (120x120px)' },
    { value: 'large', label: 'Large (150x150px)' }
  ];

  const qrCodePositionOptions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'sidebar', label: 'Sidebar' }
  ];

  const currencyFormatOptions = [
    { value: 'NGN', label: 'Nigerian Naira (₦)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' }
  ];

  const footerStyleOptions = [
    { value: 'standard', label: 'Standard Footer' },
    { value: 'minimal', label: 'Minimal Footer' },
    { value: 'detailed', label: 'Detailed Footer' },
    { value: 'branded', label: 'Branded Footer' }
  ];

  const onSubmit = (data) => {
    const receiptConfig = {
      receiptElements: {
        studentName: data?.showStudentName,
        studentId: data?.showStudentId,
        studentClass: data?.showStudentClass,
        parentInfo: data?.showParentInfo,
        schoolName: data?.showSchoolName,
        schoolAddress: data?.showSchoolAddress,
        schoolEmail: data?.showSchoolEmail,
        schoolPhone: data?.showSchoolPhone,
        invoiceNumber: data?.showInvoiceNumber,
        issueDate: data?.showIssueDate,
        dueDate: data?.showDueDate,
        sessionTerm: data?.showSessionTerm,
        paymentBreakdown: data?.showPaymentBreakdown,
        qrCode: data?.showQrCode,
        watermark: data?.showWatermark,
        eduFinanceBranding: data?.showEduFinanceBranding
      },
      receiptColorScheme: data?.receiptColorScheme,
      receiptTemplate: data?.receiptTemplate,
      logoPosition: data?.logoPosition,
      watermarkPosition: data?.watermarkPosition,
      footerStyle: data?.footerStyle,
      receiptTitle: data?.receiptTitle,
      footerMessage: data?.footerMessage,
      issuerName: data?.issuerName,
      qrCodeSize: data?.qrCodeSize,
      qrCodePosition: data?.qrCodePosition,
      includeReceiptId: data?.includeReceiptId,
      includePaymentReference: data?.includePaymentReference,
      includeVerificationUrl: data?.includeVerificationUrl,
      showItemQuantity: data?.showItemQuantity,
      showUnitPrices: data?.showUnitPrices,
      showSubtotal: data?.showSubtotal,
      showDiscounts: data?.showDiscounts,
      showTaxes: data?.showTaxes,
      currencyFormat: data?.currencyFormat,
      dateFormat: data?.dateFormat,
      includeDigitalSignature: data?.includeDigitalSignature,
      signatureText: data?.signatureText,
      showPoweredBy: data?.showPoweredBy
    };

    onSave(receiptConfig);
    onClose();
  };

  const handlePreset = (preset) => {
    const presets = {
      minimal: {
        showStudentName: true,
        showInvoiceNumber: true,
        showPaymentBreakdown: true,
        showQrCode: false,
        showParentInfo: false,
        showSchoolAddress: false,
        receiptTemplate: 'minimalist',
        footerStyle: 'minimal'
      },
      standard: {
        showStudentName: true,
        showStudentId: true,
        showStudentClass: true,
        showInvoiceNumber: true,
        showPaymentBreakdown: true,
        showQrCode: true,
        showParentInfo: false,
        receiptTemplate: 'standard',
        footerStyle: 'standard'
      },
      detailed: {
        showStudentName: true,
        showStudentId: true,
        showStudentClass: true,
        showParentInfo: true,
        showSchoolAddress: true,
        showSchoolEmail: true,
        showSchoolPhone: true,
        showInvoiceNumber: true,
        showIssueDate: true,
        showDueDate: true,
        showSessionTerm: true,
        showPaymentBreakdown: true,
        showQrCode: true,
        showWatermark: true,
        receiptTemplate: 'detailed',
        footerStyle: 'detailed'
      }
    };

    const selectedPreset = presets?.[preset];
    Object.keys(selectedPreset)?.forEach(key => {
      setValue(key, selectedPreset?.[key]);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Settings" size={20} className="text-primary" />
              <span>Receipt Configuration</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Customize what appears on your school's payment receipts
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">Quick Presets:</span>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset('minimal')}
              >
                Minimal
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset('standard')}
              >
                Standard
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset('detailed')}
              >
                Detailed
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border">
          <nav className="flex space-x-6 px-6">
            <button
              onClick={() => setActiveTab('elements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'elements' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="List" size={16} />
                <span>Elements</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('layout')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'layout' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="Layout" size={16} />
                <span>Layout & Style</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('qr-code')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'qr-code' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="QrCode" size={16} />
                <span>QR Code</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('advanced')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'advanced' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="Sliders" size={16} />
                <span>Advanced</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Elements Tab */}
            {activeTab === 'elements' && (
              <div className="space-y-6">
                {/* Student Information Elements */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="User" size={16} className="text-primary" />
                    <span>Student Information</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Checkbox
                      id="showStudentName"
                      label="Student Name"
                      checked={watchedValues?.showStudentName}
                      onChange={(checked) => setValue('showStudentName', checked)}
                    />
                    <Checkbox
                      id="showStudentId"
                      label="Student ID"
                      checked={watchedValues?.showStudentId}
                      onChange={(checked) => setValue('showStudentId', checked)}
                    />
                    <Checkbox
                      id="showStudentClass"
                      label="Student Class"
                      checked={watchedValues?.showStudentClass}
                      onChange={(checked) => setValue('showStudentClass', checked)}
                    />
                    <Checkbox
                      id="showParentInfo"
                      label="Parent/Guardian Info"
                      checked={watchedValues?.showParentInfo}
                      onChange={(checked) => setValue('showParentInfo', checked)}
                    />
                  </div>
                </div>

                {/* School Information Elements */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="School" size={16} className="text-primary" />
                    <span>School Information</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Checkbox
                      id="showSchoolName"
                      label="School Name"
                      checked={watchedValues?.showSchoolName}
                      onChange={(checked) => setValue('showSchoolName', checked)}
                    />
                    <Checkbox
                      id="showSchoolAddress"
                      label="School Address"
                      checked={watchedValues?.showSchoolAddress}
                      onChange={(checked) => setValue('showSchoolAddress', checked)}
                    />
                    <Checkbox
                      id="showSchoolEmail"
                      label="School Email"
                      checked={watchedValues?.showSchoolEmail}
                      onChange={(checked) => setValue('showSchoolEmail', checked)}
                    />
                    <Checkbox
                      id="showSchoolPhone"
                      label="School Phone"
                      checked={watchedValues?.showSchoolPhone}
                      onChange={(checked) => setValue('showSchoolPhone', checked)}
                    />
                  </div>
                </div>

                {/* Invoice & Academic Elements */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="FileText" size={16} className="text-primary" />
                    <span>Invoice & Academic Information</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Checkbox
                      id="showInvoiceNumber"
                      label="Invoice Number"
                      checked={watchedValues?.showInvoiceNumber}
                      onChange={(checked) => setValue('showInvoiceNumber', checked)}
                    />
                    <Checkbox
                      id="showIssueDate"
                      label="Issue Date"
                      checked={watchedValues?.showIssueDate}
                      onChange={(checked) => setValue('showIssueDate', checked)}
                    />
                    <Checkbox
                      id="showDueDate"
                      label="Due Date"
                      checked={watchedValues?.showDueDate}
                      onChange={(checked) => setValue('showDueDate', checked)}
                    />
                    <Checkbox
                      id="showSessionTerm"
                      label="Session & Term"
                      checked={watchedValues?.showSessionTerm}
                      onChange={(checked) => setValue('showSessionTerm', checked)}
                    />
                  </div>
                </div>

                {/* Payment & Other Elements */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="CreditCard" size={16} className="text-primary" />
                    <span>Payment & Visual Elements</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Checkbox
                      id="showPaymentBreakdown"
                      label="Payment Breakdown"
                      checked={watchedValues?.showPaymentBreakdown}
                      onChange={(checked) => setValue('showPaymentBreakdown', checked)}
                    />
                    <Checkbox
                      id="showQrCode"
                      label="QR Code"
                      checked={watchedValues?.showQrCode}
                      onChange={(checked) => setValue('showQrCode', checked)}
                    />
                    <Checkbox
                      id="showWatermark"
                      label="Watermark"
                      checked={watchedValues?.showWatermark}
                      onChange={(checked) => setValue('showWatermark', checked)}
                    />
                    <Checkbox
                      id="showEduFinanceBranding"
                      label="EduFinance Branding"
                      checked={watchedValues?.showEduFinanceBranding}
                      onChange={(checked) => setValue('showEduFinanceBranding', checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Layout & Style Tab */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Receipt Template"
                    options={templateOptions}
                    value={watchedValues?.receiptTemplate}
                    onChange={(value) => setValue('receiptTemplate', value)}
                    placeholder="Select template"
                  />
                  <Select
                    label="Color Scheme"
                    options={colorSchemeOptions}
                    value={watchedValues?.receiptColorScheme}
                    onChange={(value) => setValue('receiptColorScheme', value)}
                    placeholder="Select color scheme"
                  />
                  <Select
                    label="Logo Position"
                    options={logoPositionOptions}
                    value={watchedValues?.logoPosition}
                    onChange={(value) => setValue('logoPosition', value)}
                    placeholder="Select logo position"
                  />
                  <Select
                    label="Watermark Position"
                    options={watermarkPositionOptions}
                    value={watchedValues?.watermarkPosition}
                    onChange={(value) => setValue('watermarkPosition', value)}
                    placeholder="Select watermark position"
                  />
                  <Select
                    label="Footer Style"
                    options={footerStyleOptions}
                    value={watchedValues?.footerStyle}
                    onChange={(value) => setValue('footerStyle', value)}
                    placeholder="Select footer style"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Receipt Title"
                    {...register('receiptTitle')}
                    placeholder="PAYMENT RECEIPT"
                  />
                  <Input
                    label="Footer Message"
                    {...register('footerMessage')}
                    placeholder="Thank you for your payment!"
                  />
                  <Input
                    label="Issuer Name"
                    {...register('issuerName')}
                    placeholder="EduFinance System"
                  />
                </div>
              </div>
            )}

            {/* QR Code Tab */}
            {activeTab === 'qr-code' && (
              <div className="space-y-6">
                <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Info" size={16} className="text-info" />
                    <h4 className="text-sm font-medium text-foreground">QR Code Configuration</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    QR codes enable easy receipt verification and provide additional security. Configure what information is included and how the QR code appears.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="QR Code Size"
                    options={qrCodeSizeOptions}
                    value={watchedValues?.qrCodeSize}
                    onChange={(value) => setValue('qrCodeSize', value)}
                    placeholder="Select QR code size"
                  />
                  <Select
                    label="QR Code Position"
                    options={qrCodePositionOptions}
                    value={watchedValues?.qrCodePosition}
                    onChange={(value) => setValue('qrCodePosition', value)}
                    placeholder="Select QR code position"
                  />
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4">QR Code Content</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                      id="includeReceiptId"
                      label="Receipt ID"
                      checked={watchedValues?.includeReceiptId}
                      onChange={(checked) => setValue('includeReceiptId', checked)}
                      description="Include receipt ID for verification"
                    />
                    <Checkbox
                      id="includePaymentReference"
                      label="Payment Reference"
                      checked={watchedValues?.includePaymentReference}
                      onChange={(checked) => setValue('includePaymentReference', checked)}
                      description="Include payment reference number"
                    />
                    <Checkbox
                      id="includeVerificationUrl"
                      label="Verification URL"
                      checked={watchedValues?.includeVerificationUrl}
                      onChange={(checked) => setValue('includeVerificationUrl', checked)}
                      description="Include link to online verification"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                {/* Payment Display Options */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="Calculator" size={16} className="text-primary" />
                    <span>Payment Display Options</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Checkbox
                      id="showItemQuantity"
                      label="Item Quantities"
                      checked={watchedValues?.showItemQuantity}
                      onChange={(checked) => setValue('showItemQuantity', checked)}
                    />
                    <Checkbox
                      id="showUnitPrices"
                      label="Unit Prices"
                      checked={watchedValues?.showUnitPrices}
                      onChange={(checked) => setValue('showUnitPrices', checked)}
                    />
                    <Checkbox
                      id="showSubtotal"
                      label="Subtotal"
                      checked={watchedValues?.showSubtotal}
                      onChange={(checked) => setValue('showSubtotal', checked)}
                    />
                    <Checkbox
                      id="showDiscounts"
                      label="Discounts"
                      checked={watchedValues?.showDiscounts}
                      onChange={(checked) => setValue('showDiscounts', checked)}
                    />
                    <Checkbox
                      id="showTaxes"
                      label="Taxes"
                      checked={watchedValues?.showTaxes}
                      onChange={(checked) => setValue('showTaxes', checked)}
                    />
                  </div>
                </div>

                {/* Format Settings */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="Settings" size={16} className="text-primary" />
                    <span>Format Settings</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Currency Format"
                      options={currencyFormatOptions}
                      value={watchedValues?.currencyFormat}
                      onChange={(value) => setValue('currencyFormat', value)}
                      placeholder="Select currency"
                    />
                    <Select
                      label="Date Format"
                      options={dateFormatOptions}
                      value={watchedValues?.dateFormat}
                      onChange={(value) => setValue('dateFormat', value)}
                      placeholder="Select date format"
                    />
                  </div>
                </div>

                {/* Signature Settings */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="PenTool" size={16} className="text-primary" />
                    <span>Signature & Branding</span>
                  </h3>
                  <div className="space-y-4">
                    <Checkbox
                      id="includeDigitalSignature"
                      label="Include Digital Signature"
                      checked={watchedValues?.includeDigitalSignature}
                      onChange={(checked) => setValue('includeDigitalSignature', checked)}
                      description="Add digital signature for authenticity"
                    />
                    {watchedValues?.includeDigitalSignature && (
                      <Input
                        label="Signature Text"
                        {...register('signatureText')}
                        placeholder="Digitally signed by EduFinance"
                      />
                    )}
                    <Checkbox
                      id="showPoweredBy"
                      label="Show 'Powered by EduFinance'"
                      checked={watchedValues?.showPoweredBy}
                      onChange={(checked) => setValue('showPoweredBy', checked)}
                      description="Display EduFinance attribution"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border p-6 bg-muted/30">
            {/* Astroidegita Technologies Branding Footer */}
            <div className="flex items-center justify-center mb-6 py-4 border-t border-border bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-3">
                  <img 
                    src="/assets/images/ChatGPT_Image_Jun_19_2025_03_06_50_PM_prev_ui_1-1758892592480.png" 
                    alt="Astroidegita Technologies" 
                    className="h-8 w-8 object-contain"
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#081C48' }}>
                      ©2025 Astroidegita Technologies LTD (RC 8354011).
                    </p>
                    <p className="text-xs" style={{ color: '#081C48' }}>
                      If you have any questions or complaints about this transaction, please contact our support team at{' '}
                      <span className="font-bold">support@skupadi.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Configure receipt elements to match your school's requirements
              </div>
              <div className="flex items-center space-x-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiptConfigurationModal;
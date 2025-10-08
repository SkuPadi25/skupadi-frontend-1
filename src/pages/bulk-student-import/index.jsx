import React, { useState } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import FileUploadZone from './components/FileUploadZone';
import ProcessingStatus from './components/ProcessingStatus';
import ValidationResults from './components/ValidationResults';
import PreviewTable from './components/PreviewTable';
import ImportSuccess from './components/ImportSuccess';
import PaymentStructureModal from '../../components/PaymentStructureModal';

const BulkStudentImport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('reading');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [validationResults, setValidationResults] = useState(null);
  const [validRecords, setValidRecords] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [currentStep, setCurrentStep] = useState('upload'); // upload, processing, validation, preview, success
  const [showPaymentStructureModal, setShowPaymentStructureModal] = useState(false);

  // Mock user data
  const user = {
    name: "Sarah Johnson",
    role: "Administrator"
  };

  // Mock validation function
  const validateCSVData = (data) => {
    const errors = [];
    const warnings = [];
    const validRecords = [];
    
    data?.forEach((row, index) => {
      const rowNumber = index + 2; // Account for header row
      let isValid = true;
      
      // Required field validation
      if (!row?.firstName || row?.firstName?.trim() === '') {
        errors?.push({
          row: rowNumber,
          field: 'First Name',
          message: 'First Name is required',
          value: row?.firstName
        });
        isValid = false;
      }
      
      if (!row?.lastName || row?.lastName?.trim() === '') {
        errors?.push({
          row: rowNumber,
          field: 'Last Name',
          message: 'Last Name is required',
          value: row?.lastName
        });
        isValid = false;
      }
      
      if (!row?.gender || !['Male', 'Female']?.includes(row?.gender)) {
        errors?.push({
          row: rowNumber,
          field: 'Gender',
          message: 'Gender must be Male or Female',
          value: row?.gender
        });
        isValid = false;
      }
      
      if (!row?.class || row?.class?.trim() === '') {
        errors?.push({
          row: rowNumber,
          field: 'Class',
          message: 'Class is required',
          value: row?.class
        });
        isValid = false;
      }
      
      if (!row?.dateOfBirth) {
        errors?.push({
          row: rowNumber,
          field: 'Date of Birth',
          message: 'Date of Birth is required',
          value: row?.dateOfBirth
        });
        isValid = false;
      } else {
        const birthDate = new Date(row.dateOfBirth);
        const today = new Date();
        const age = today?.getFullYear() - birthDate?.getFullYear();
        
        if (age < 3 || age > 25) {
          warnings?.push({
            row: rowNumber,
            field: 'Date of Birth',
            message: 'Age seems unusual for a student',
            value: row?.dateOfBirth
          });
        }
      }
      
      if (!row?.parentName || row?.parentName?.trim() === '') {
        errors?.push({
          row: rowNumber,
          field: 'Parent Name',
          message: 'Parent Name is required',
          value: row?.parentName
        });
        isValid = false;
      }
      
      if (!row?.parentPhone || row?.parentPhone?.trim() === '') {
        errors?.push({
          row: rowNumber,
          field: 'Parent Phone',
          message: 'Parent Phone is required',
          value: row?.parentPhone
        });
        isValid = false;
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(row?.parentPhone)) {
        errors?.push({
          row: rowNumber,
          field: 'Parent Phone',
          message: 'Invalid phone number format',
          value: row?.parentPhone
        });
        isValid = false;
      }
      
      if (isValid) {
        validRecords?.push({
          firstName: row?.firstName?.trim(),
          lastName: row?.lastName?.trim(),
          gender: row?.gender,
          class: row?.class?.trim(),
          dateOfBirth: row?.dateOfBirth,
          parentName: row?.parentName?.trim(),
          parentPhone: row?.parentPhone?.trim()
        });
      }
    });
    
    return {
      totalRecords: data?.length,
      validRecords: validRecords?.length,
      errorRecords: data?.length - validRecords?.length,
      warningRecords: warnings?.length,
      errors,
      warnings,
      validData: validRecords
    };
  };

  // Mock CSV parsing function
  const parseCSV = (file) => {
    return new Promise((resolve) => {
      // Simulate CSV parsing with mock data
      setTimeout(() => {
        const mockData = [
          {
            firstName: "John",
            lastName: "Smith",
            gender: "Male",
            class: "Grade 5",
            dateOfBirth: "2014-03-15",
            parentName: "Robert Smith",
            parentPhone: "+1-555-0123"
          },
          {
            firstName: "Emma",
            lastName: "Johnson",
            gender: "Female",
            class: "Grade 4",
            dateOfBirth: "2015-07-22",
            parentName: "Lisa Johnson",
            parentPhone: "+1-555-0124"
          },
          {
            firstName: "Michael",
            lastName: "Brown",
            gender: "Male",
            class: "Grade 6",
            dateOfBirth: "2013-11-08",
            parentName: "David Brown",
            parentPhone: "+1-555-0125"
          },
          {
            firstName: "Sophia",
            lastName: "Davis",
            gender: "Female",
            class: "Grade 3",
            dateOfBirth: "2016-01-30",
            parentName: "Jennifer Davis",
            parentPhone: "+1-555-0126"
          },
          {
            firstName: "",
            lastName: "Wilson",
            gender: "Male",
            class: "Grade 5",
            dateOfBirth: "2014-05-12",
            parentName: "Mark Wilson",
            parentPhone: "invalid-phone"
          }
        ];
        resolve(mockData);
      }, 1000);
    });
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setValidationResults(null);
    setValidRecords([]);
    setShowPreview(false);
    setImportResults(null);
    setCurrentStep('upload');
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setCurrentStep('processing');
    setProcessingStep('reading');
    setProcessingProgress(0);
    
    try {
      // Step 1: Reading file
      setProcessingProgress(25);
      const csvData = await parseCSV(selectedFile);
      
      // Step 2: Validating data
      setProcessingStep('validating');
      setProcessingProgress(50);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const results = validateCSVData(csvData);
      
      // Step 3: Processing records
      setProcessingStep('processing');
      setProcessingProgress(75);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Complete
      setProcessingStep('complete');
      setProcessingProgress(100);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setValidationResults(results);
      setValidRecords(results?.validData);
      setCurrentStep('validation');
      
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadErrors = () => {
    // Mock error report download
    const errorData = validationResults?.errors?.map(error => ({
      Row: error?.row,
      Field: error?.field,
      Error: error?.message,
      Value: error?.value || 'Empty'
    }));
    
    console.log('Downloading error report:', errorData);
    alert('Error report would be downloaded as CSV file');
  };

  const handleImportValid = () => {
    if (validRecords?.length > 0) {
      setShowPreview(true);
      setCurrentStep('preview');
    }
  };

  const handleConfirmImport = async () => {
    setIsProcessing(true);
    
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = {
      successCount: validRecords?.length,
      totalProcessed: validRecords?.length,
      importTime: '2.3 seconds',
      duplicatesSkipped: 0
    };
    
    setImportResults(results);
    setCurrentStep('success');
    setIsProcessing(false);
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setValidationResults(null);
    setValidRecords([]);
    setShowPreview(false);
    setImportResults(null);
    setCurrentStep('upload');
    setIsProcessing(false);
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setCurrentStep('validation');
  };

  const handlePaymentStructureSave = (structureData) => {
    console.log('Payment structure configuration saved:', structureData);
    alert('Payment structure configuration has been saved successfully!');
    setShowPaymentStructureModal(false);
    
    // Here you would typically:
    // 1. Save to your backend/database
    // 2. Update your global state/context
    // 3. Refresh any dependent components
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={user} />
        
        <main className="p-6">
          <Breadcrumb customItems={[]} />
          
          <PageHeader
            title="Bulk Student Import"
            subtitle="Import multiple students from CSV file with validation and error handling"
            icon="Upload"
            actions={
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentStructureModal(true)}
                  iconName="Settings"
                  iconPosition="left"
                >
                  Payment Structure
                </Button>
                {currentStep === 'upload' && selectedFile && !isProcessing && (
                  <Button
                    variant="default"
                    onClick={handleProcessFile}
                    iconName="Play"
                    iconPosition="left"
                  >
                    Process File
                  </Button>
                )}
              </div>
            }
          />

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Upload Step */}
            {currentStep === 'upload' && (
              <FileUploadZone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                isProcessing={isProcessing}
              />
            )}

            {/* Processing Step */}
            {currentStep === 'processing' && (
              <ProcessingStatus
                isProcessing={isProcessing}
                progress={processingProgress}
                currentStep={processingStep}
                totalRecords={selectedFile ? Math.floor(selectedFile?.size / 100) : 0}
              />
            )}

            {/* Validation Results Step */}
            {currentStep === 'validation' && validationResults && (
              <ValidationResults
                results={validationResults}
                onDownloadErrors={handleDownloadErrors}
                onImportValid={handleImportValid}
                onStartOver={handleStartOver}
              />
            )}

            {/* Preview Step */}
            {currentStep === 'preview' && showPreview && (
              <PreviewTable
                validRecords={validRecords}
                onConfirmImport={handleConfirmImport}
                onCancel={handleCancelPreview}
              />
            )}

            {/* Success Step */}
            {currentStep === 'success' && importResults && (
              <ImportSuccess
                importResults={importResults}
                onStartOver={handleStartOver}
              />
            )}

            {/* Processing Overlay */}
            {isProcessing && currentStep === 'preview' && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-card rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Importing Students</h3>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we import {validRecords?.length} students...
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {/* Payment Structure Modal */}
      <PaymentStructureModal
        isOpen={showPaymentStructureModal}
        onClose={() => setShowPaymentStructureModal(false)}
        onSave={handlePaymentStructureSave}
      />
    </div>
  );
};

export default BulkStudentImport;
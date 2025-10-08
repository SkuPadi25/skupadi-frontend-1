import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import StudentPhotoUpload from './components/StudentPhotoUpload';
import StudentBasicInfo from './components/StudentBasicInfo';
import ParentGuardianInfo from './components/ParentGuardianInfo';
import AdditionalInfo from './components/AdditionalInfo';
import BillableItemsSection from './components/BillableItemsSection';
import FormActions from './components/FormActions';

const AddEditStudent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentId = searchParams?.get('id');
  const isEdit = Boolean(studentId);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const mockUser = {
    name: "Sarah Johnson",
    role: "Administrator",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
  };

  // Mock existing student data for edit mode
  const mockStudentData = {
    id: "STU001",
    firstName: "John",
    lastName: "Smith",
    gender: "male",
    dateOfBirth: "2010-05-15",
    class: "5",
    studentId: "STU001",
    address: "123 Main Street, Springfield, IL 62701",
    parentName: "Robert Smith",
    relationship: "father",
    parentPhone: "+1-555-0123",
    parentEmail: "robert.smith@email.com",
    emergencyContactName: "Mary Smith",
    emergencyContactPhone: "+1-555-0124",
    occupation: "Software Engineer",
    bloodGroup: "a+",
    transportMode: "school_bus",
    medicalConditions: "None",
    previousSchool: "Springfield Elementary",
    admissionDate: "2023-08-15",
    rollNumber: "05-001",
    hasSpecialNeeds: false,
    photoConsent: true,
    scholarshipEligible: false,
    notes: "Excellent student with good academic performance",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    billableItems: [
      {
        id: 'tuition',
        name: 'Tuition Fee',
        description: 'Monthly tuition fee',
        amount: 15000,
        isActive: true,
        isMandatory: true
      },
      {
        id: 'sports',
        name: 'Sports Fee',
        description: 'Sports and physical education activities',
        amount: 2500,
        isActive: true,
        isMandatory: false
      },
      {
        id: 'transportation',
        name: 'Transportation',
        description: 'School bus service',
        amount: 6000,
        isActive: true,
        isMandatory: false
      }
    ]
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    class: '',
    studentId: '',
    address: '',
    parentName: '',
    relationship: '',
    parentPhone: '',
    parentEmail: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    occupation: '',
    bloodGroup: '',
    transportMode: '',
    medicalConditions: '',
    previousSchool: '',
    admissionDate: new Date()?.toISOString()?.split('T')?.[0],
    rollNumber: '',
    hasSpecialNeeds: false,
    photoConsent: false,
    scholarshipEligible: false,
    notes: '',
    photo: null,
    billableItems: []
  });

  const [errors, setErrors] = useState({});

  // Load student data for edit mode
  useEffect(() => {
    if (isEdit && studentId) {
      // Simulate API call
      setFormData(mockStudentData);
    }
  }, [isEdit, studentId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePhotoChange = (photo) => {
    setFormData(prev => ({
      ...prev,
      photo
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = [
      'firstName',
      'lastName',
      'gender',
      'dateOfBirth',
      'class',
      'parentName',
      'relationship',
      'parentPhone',
      'admissionDate'
    ];

    requiredFields?.forEach(field => {
      if (!formData?.[field] || formData?.[field]?.toString()?.trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData?.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData?.parentPhone && !/^[\+]?[1-9][\d]{0,15}$/?.test(formData?.parentPhone?.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.parentPhone = 'Please enter a valid phone number';
    }

    if (formData?.emergencyContactPhone && !/^[\+]?[1-9][\d]{0,15}$/?.test(formData?.emergencyContactPhone?.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.emergencyContactPhone = 'Please enter a valid phone number';
    }

    // Date validation
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const admissionDate = new Date(formData.admissionDate);

    if (birthDate >= today) {
      newErrors.dateOfBirth = 'Date of birth must be in the past';
    }

    if (admissionDate > today) {
      newErrors.admissionDate = 'Admission date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving student:', formData);
      
      // Navigate back to students management
      navigate('/students-management', {
        state: {
          message: isEdit 
            ? `Student ${formData?.firstName} ${formData?.lastName} updated successfully!`
            : `Student ${formData?.firstName} ${formData?.lastName} added successfully!`,
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error saving student:', error);
      setErrors({ submit: 'Failed to save student. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndAddAnother = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving student:', formData);
      
      // Reset form for new student
      setFormData({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        class: '',
        studentId: '',
        address: '',
        parentName: '',
        relationship: '',
        parentPhone: '',
        parentEmail: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        occupation: '',
        bloodGroup: '',
        transportMode: '',
        medicalConditions: '',
        previousSchool: '',
        admissionDate: new Date()?.toISOString()?.split('T')?.[0],
        rollNumber: '',
        hasSpecialNeeds: false,
        photoConsent: false,
        scholarshipEligible: false,
        notes: '',
        photo: null,
        billableItems: []
      });
      
      setErrors({});
      
      // Show success message (you could use a toast notification here)
      alert(`Student ${formData?.firstName} ${formData?.lastName} added successfully! You can now add another student.`);
      
    } catch (error) {
      console.error('Error saving student:', error);
      setErrors({ submit: 'Failed to save student. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/students-management');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={mockUser} />
        
        <main className="p-6">
          <Breadcrumb customItems={[]} />
          
          <PageHeader
            title={isEdit ? 'Edit Student' : 'Add New Student'}
            subtitle={isEdit 
              ? `Update information for ${formData?.firstName} ${formData?.lastName}` 
              : 'Enter student details to create a new record'
            }
            icon="UserPlus"
            actions={[]}
          />

          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-6 card-shadow">
              {errors?.submit && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-sm text-error">{errors?.submit}</p>
                </div>
              )}

              <form onSubmit={(e) => e?.preventDefault()} className="space-y-8">
                {/* Photo Upload */}
                <StudentPhotoUpload
                  photo={formData?.photo}
                  onPhotoChange={handlePhotoChange}
                  error={errors?.photo}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Student Information */}
                  <div className="bg-muted/30 rounded-lg p-6">
                    <StudentBasicInfo
                      formData={formData}
                      errors={errors}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Right Column - Parent/Guardian Information */}
                  <div className="bg-muted/30 rounded-lg p-6">
                    <ParentGuardianInfo
                      formData={formData}
                      errors={errors}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Additional Information - Full Width */}
                <div className="bg-muted/30 rounded-lg p-6">
                  <AdditionalInfo
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Billable Items Section - Full Width */}
                <div className="bg-muted/30 rounded-lg p-6">
                  <BillableItemsSection
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Form Actions */}
                <FormActions
                  onSave={handleSave}
                  onSaveAndAddAnother={handleSaveAndAddAnother}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                  isEdit={isEdit}
                />
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddEditStudent;
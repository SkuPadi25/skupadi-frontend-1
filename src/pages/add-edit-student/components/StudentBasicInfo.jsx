import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StudentBasicInfo = ({ formData, errors, onChange }) => {
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const classOptions = [
    { value: 'nursery', label: 'Nursery' },
    { value: 'lkg', label: 'LKG' },
    { value: 'ukg', label: 'UKG' },
    { value: '1', label: 'Class 1' },
    { value: '2', label: 'Class 2' },
    { value: '3', label: 'Class 3' },
    { value: '4', label: 'Class 4' },
    { value: '5', label: 'Class 5' },
    { value: '6', label: 'Class 6' },
    { value: '7', label: 'Class 7' },
    { value: '8', label: 'Class 8' },
    { value: '9', label: 'Class 9' },
    { value: '10', label: 'Class 10' },
    { value: '11', label: 'Class 11' },
    { value: '12', label: 'Class 12' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
        Student Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          error={errors.lastName}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Gender"
          placeholder="Select gender"
          options={genderOptions}
          value={formData.gender}
          onChange={(value) => handleInputChange('gender', value)}
          error={errors.gender}
          required
        />

        <Input
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          error={errors.dateOfBirth}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Class"
          placeholder="Select class"
          options={classOptions}
          value={formData.class}
          onChange={(value) => handleInputChange('class', value)}
          error={errors.class}
          required
        />

        <Input
          label="Student ID"
          type="text"
          placeholder="Auto-generated or enter custom ID"
          value={formData.studentId}
          onChange={(e) => handleInputChange('studentId', e.target.value)}
          error={errors.studentId}
          description="Leave blank for auto-generation"
        />
      </div>

      <Input
        label="Address"
        type="text"
        placeholder="Enter complete address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        error={errors.address}
      />
    </div>
  );
};

export default StudentBasicInfo;
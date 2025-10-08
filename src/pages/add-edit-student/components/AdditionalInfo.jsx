import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdditionalInfo = ({ formData, errors, onChange }) => {
  const bloodGroupOptions = [
    { value: 'a+', label: 'A+' },
    { value: 'a-', label: 'A-' },
    { value: 'b+', label: 'B+' },
    { value: 'b-', label: 'B-' },
    { value: 'ab+', label: 'AB+' },
    { value: 'ab-', label: 'AB-' },
    { value: 'o+', label: 'O+' },
    { value: 'o-', label: 'O-' }
  ];

  const transportOptions = [
    { value: 'school_bus', label: 'School Bus' },
    { value: 'private_transport', label: 'Private Transport' },
    { value: 'walking', label: 'Walking' },
    { value: 'bicycle', label: 'Bicycle' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleCheckboxChange = (field, checked) => {
    onChange(field, checked);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
        <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
        Additional Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Blood Group"
          placeholder="Select blood group"
          options={bloodGroupOptions}
          value={formData.bloodGroup}
          onChange={(value) => handleInputChange('bloodGroup', value)}
          error={errors.bloodGroup}
        />

        <Select
          label="Transport Mode"
          placeholder="Select transport mode"
          options={transportOptions}
          value={formData.transportMode}
          onChange={(value) => handleInputChange('transportMode', value)}
          error={errors.transportMode}
        />
      </div>

      <Input
        label="Medical Conditions"
        type="text"
        placeholder="Enter any medical conditions or allergies"
        value={formData.medicalConditions}
        onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
        error={errors.medicalConditions}
        description="Please specify any allergies, medications, or health conditions"
      />

      <Input
        label="Previous School"
        type="text"
        placeholder="Enter previous school name (if applicable)"
        value={formData.previousSchool}
        onChange={(e) => handleInputChange('previousSchool', e.target.value)}
        error={errors.previousSchool}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Admission Date"
          type="date"
          value={formData.admissionDate}
          onChange={(e) => handleInputChange('admissionDate', e.target.value)}
          error={errors.admissionDate}
          required
        />

        <Input
          label="Roll Number"
          type="text"
          placeholder="Enter roll number"
          value={formData.rollNumber}
          onChange={(e) => handleInputChange('rollNumber', e.target.value)}
          error={errors.rollNumber}
        />
      </div>

      <div className="space-y-3 pt-2">
        <Checkbox
          label="Student has special needs"
          checked={formData.hasSpecialNeeds}
          onChange={(e) => handleCheckboxChange('hasSpecialNeeds', e.target.checked)}
        />

        <Checkbox
          label="Parent consent for photography"
          checked={formData.photoConsent}
          onChange={(e) => handleCheckboxChange('photoConsent', e.target.checked)}
        />

        <Checkbox
          label="Student is eligible for scholarship"
          checked={formData.scholarshipEligible}
          onChange={(e) => handleCheckboxChange('scholarshipEligible', e.target.checked)}
        />
      </div>

      <Input
        label="Notes"
        type="text"
        placeholder="Any additional notes or comments"
        value={formData.notes}
        onChange={(e) => handleInputChange('notes', e.target.value)}
        error={errors.notes}
        description="Optional field for any additional information"
      />
    </div>
  );
};

export default AdditionalInfo;
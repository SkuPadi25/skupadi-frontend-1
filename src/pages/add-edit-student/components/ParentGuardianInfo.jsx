import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ParentGuardianInfo = ({ formData, errors, onChange }) => {
  const relationshipOptions = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'guardian', label: 'Guardian' },
    { value: 'grandfather', label: 'Grandfather' },
    { value: 'grandmother', label: 'Grandmother' },
    { value: 'uncle', label: 'Uncle' },
    { value: 'aunt', label: 'Aunt' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
        <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
        Parent/Guardian Information
      </h3>
      <hr className='m-0 p-0' />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Parent/Guardian Name"
          type="text"
          placeholder="Enter parent/guardian name"
          value={formData.parentName}
          onChange={(e) => handleInputChange('parentName', e.target.value)}
          error={errors.parentName}
          required
        />

        <Select
          label="Relationship"
          placeholder="Select relationship"
          options={relationshipOptions}
          value={formData.relationship}
          onChange={(value) => handleInputChange('relationship', value)}
          error={errors.relationship}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Parent Phone"
          type="tel"
          placeholder="Enter phone number"
          value={formData.parentPhone}
          onChange={(e) => handleInputChange('parentPhone', e.target.value)}
          error={errors.parentPhone}
          required
        />

        <Input
          label="Parent Email"
          type="email"
          placeholder="Enter email address"
          value={formData.parentEmail}
          onChange={(e) => handleInputChange('parentEmail', e.target.value)}
          error={errors.parentEmail}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Occupation"
        type="text"
        placeholder="Enter parent/guardian occupation"
        value={formData.occupation}
        onChange={(e) => handleInputChange('occupation', e.target.value)}
        error={errors.occupation}
      />

      <Input
        label="Home Address"
        type="text"
        placeholder="Enter complete address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        error={errors.address}
      />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Emergency Contact Name"
          type="text"
          placeholder="Enter emergency contact name"
          value={formData.emergencyContactName}
          onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
          error={errors.emergencyContactName}
        />

        <Input
          label="Emergency Contact Phone"
          type="tel"
          placeholder="Enter emergency contact phone"
          value={formData.emergencyContactPhone}
          onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
          error={errors.emergencyContactPhone}
        />
      </div>
      
    </div>
  );
};

export default ParentGuardianInfo;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PersonalInfo = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm({
    defaultValues: {
      firstName: user?.name?.split(' ')?.[0] || '',
      lastName: user?.name?.split(' ')?.[1] || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: '',
      gender: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postalCode: ''
      },
      emergency: {
        contactName: '',
        contactPhone: '',
        relationship: ''
      }
    }
  });

  const watchedValues = watch();

  // Nigerian states for dropdown
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

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'child', label: 'Child' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' }
  ];

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      console?.log('Saving personal info:', data);
      
      // In a real app, save to backend/Supabase here
      // const { error } = await supabase
      //   .from('user_profiles')
      //   .update({
      //     first_name: data.firstName,
      //     last_name: data.lastName,
      //     phone: data.phone,
      //     date_of_birth: data.dateOfBirth,
      //     gender: data.gender,
      //     address: data.address,
      //     emergency_contact: data.emergency,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('user_id', user.id);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsEditing(false);
      alert('Personal information updated successfully!');
    } catch (error) {
      console?.error('Save failed:', error);
      alert('Failed to update personal information. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground">
            Manage your personal details and contact information
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                loading={isSaving}
                disabled={!isDirty}
              >
                <Icon name="Save" size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              disabled={!isEditing}
              {...register('firstName', { required: 'First name is required' })}
              error={errors?.firstName?.message}
              placeholder="Enter your first name"
            />
            
            <Input
              label="Last Name"
              required
              disabled={!isEditing}
              {...register('lastName', { required: 'Last name is required' })}
              error={errors?.lastName?.message}
              placeholder="Enter your last name"
            />
            
            <Input
              label="Email Address"
              type="email"
              required
              disabled // Email should typically not be editable directly
              {...register('email')}
              error={errors?.email?.message}
              description="Contact support to change your email address"
            />
            
            <Input
              label="Phone Number"
              type="tel"
              required
              disabled={!isEditing}
              {...register('phone', { required: 'Phone number is required' })}
              error={errors?.phone?.message}
              placeholder="+234 901 234 5678"
            />
            
            <Input
              label="Date of Birth"
              type="date"
              disabled={!isEditing}
              {...register('dateOfBirth')}
              error={errors?.dateOfBirth?.message}
            />
            
            <Select
              label="Gender"
              disabled={!isEditing}
              options={genderOptions}
              value={watchedValues?.gender}
              onChange={(value) => register('gender')?.onChange({ target: { value } })}
              placeholder="Select gender"
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Address Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                disabled={!isEditing}
                {...register('address.street')}
                error={errors?.address?.street?.message}
                placeholder="Enter your street address"
              />
            </div>
            
            <Input
              label="City"
              disabled={!isEditing}
              {...register('address.city')}
              error={errors?.address?.city?.message}
              placeholder="Enter your city"
            />
            
            <Select
              label="State"
              disabled={!isEditing}
              options={nigerianStates}
              value={watchedValues?.address?.state}
              onChange={(value) => register('address.state')?.onChange({ target: { value } })}
              placeholder="Select state"
            />
            
            <Input
              label="Country"
              disabled
              {...register('address.country')}
              error={errors?.address?.country?.message}
            />
            
            <Input
              label="Postal Code"
              disabled={!isEditing}
              {...register('address.postalCode')}
              error={errors?.address?.postalCode?.message}
              placeholder="Enter postal code"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              disabled={!isEditing}
              {...register('emergency.contactName')}
              error={errors?.emergency?.contactName?.message}
              placeholder="Enter emergency contact name"
            />
            
            <Input
              label="Contact Phone"
              type="tel"
              disabled={!isEditing}
              {...register('emergency.contactPhone')}
              error={errors?.emergency?.contactPhone?.message}
              placeholder="+234 901 234 5678"
            />
            
            <Select
              label="Relationship"
              disabled={!isEditing}
              options={relationshipOptions}
              value={watchedValues?.emergency?.relationship}
              onChange={(value) => register('emergency.relationship')?.onChange({ target: { value } })}
              placeholder="Select relationship"
            />
          </div>
        </div>

        {/* Profile Completion Status */}
        {!isEditing && (
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-info" />
              <h4 className="text-sm font-medium text-foreground">Profile Completion</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion Status</span>
                <span className="font-medium text-foreground">85% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-info h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Complete your profile to get personalized recommendations and better support.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfo;
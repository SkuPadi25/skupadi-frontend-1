import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ 
  formData, 
  errors, 
  isLoading, 
  onInputChange, 
  onSubmit, 
  passwordStrength,
  onTermsClick 
}) => {
  const isFormValid = !Object.keys(errors)?.length && 
                     formData?.fullName && 
                     formData?.email && 
                     formData?.phone && 
                     formData?.password && 
                     formData?.confirmPassword && 
                     formData?.agreeToTerms;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Submit Error */}
      {errors?.submit && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{errors?.submit}</p>
        </div>
      )}
      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={formData?.fullName}
        onChange={(e) => onInputChange('fullName', e?.target?.value)}
        error={errors?.fullName}
        required
        className={formData?.fullName && !errors?.fullName ? 'border-success' : ''}
      />
      {/* Email */}
      <div className="relative">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={(e) => onInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          className={formData?.email && !errors?.email ? 'border-success' : ''}
        />
        {formData?.email && !errors?.email && (
          <div className="absolute right-3 top-8">
            <Icon name="CheckCircle" size={16} className="text-success" />
          </div>
        )}
      </div>
      {/* Phone Number */}
      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        value={formData?.phone}
        onChange={(e) => onInputChange('phone', e?.target?.value?.replace(/\D/g, ''))}
        error={errors?.phone}
        required
        className={formData?.phone && !errors?.phone ? 'border-success' : ''}
      />
      {/* Password */}
      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={(e) => onInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
          description="Minimum 8 characters with letters and numbers"
        />
        
        {/* Password Strength Meter */}
        {formData?.password && passwordStrength && (
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-colors duration-200 ${
                    index < passwordStrength?.strength 
                      ? passwordStrength?.color 
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            {passwordStrength?.text && (
              <p className={`text-xs font-medium ${
                passwordStrength?.strength === 1 ? "text-red-600" :
                passwordStrength?.strength === 2 ? "text-yellow-600" :
                passwordStrength?.strength === 3 ? "text-blue-600": "text-green-600"
              }`}>
                Password strength: {passwordStrength?.text}
              </p>
            )}
          </div>
        )}
      </div>
      {/* Confirm Password */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
        {formData?.confirmPassword && !errors?.confirmPassword && formData?.password === formData?.confirmPassword && (
          <div className="absolute right-3 top-8">
            <Icon name="CheckCircle" size={16} className="text-success" />
          </div>
        )}
      </div>
      {/* Terms of Service Agreement */}
      <div className="space-y-2">
        <Checkbox
          checked={formData?.agreeToTerms}
          onChange={(e) => onInputChange('agreeToTerms', e?.target?.checked)}
          label={
            <span className="text-sm">
              I agree to the{' '}
              <button
                type="button"
                onClick={onTermsClick}
                className="text-primary hover:underline"
              >
                Terms of Service
              </button>
              {' '}and Privacy Policy
            </span>
          }
          error={errors?.agreeToTerms}
          required
        />
        {errors?.agreeToTerms && (
          <p className="text-sm text-destructive">{errors?.agreeToTerms}</p>
        )}
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={!isFormValid || isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
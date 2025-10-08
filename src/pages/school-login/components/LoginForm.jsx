import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ 
  formData, 
  errors, 
  isLoading, 
  showPassword, 
  showCaptcha,
  onInputChange, 
  onSubmit, 
  onTogglePassword,
  onForgotPassword 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email or Phone */}
      <Input
        label="Email or Phone Number"
        type="text"
        placeholder="Enter your email address or phone number"
        value={formData?.emailOrPhone}
        onChange={(e) => onInputChange('emailOrPhone', e?.target?.value)}
        error={errors?.emailOrPhone}
        required
      />
      {/* Password */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={formData?.password}
          onChange={(e) => onInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
        </button>
      </div>
      {/* Forgot Password */}
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:underline"
        >
          Forgot Password?
        </button>
      </div>
      {/* CAPTCHA Placeholder */}
      {showCaptcha && (
        <div className="p-4 border border-border rounded-md bg-muted/20">
          <p className="text-sm text-muted-foreground mb-2">Security Verification Required</p>
          <div className="h-16 bg-muted rounded flex items-center justify-center">
            <p className="text-sm text-muted-foreground">CAPTCHA verification would appear here</p>
          </div>
        </div>
      )}
      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
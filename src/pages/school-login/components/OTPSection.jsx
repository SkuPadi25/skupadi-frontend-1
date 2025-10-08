import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OTPSection = ({ 
  emailOrPhone, 
  onInputChange, 
  onSendOTP, 
  error, 
  isLoading 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Smartphone" size={24} className="text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Login with OTP</h3>
        <p className="text-sm text-muted-foreground">
          We'll send you a verification code via SMS
        </p>
      </div>
      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        value={emailOrPhone}
        onChange={(e) => onInputChange(e?.target?.value)}
        error={error}
        required
        description="Include country code (e.g., +234)"
      />
      <Button
        type="button"
        onClick={onSendOTP}
        fullWidth
        size="lg"
        disabled={isLoading || !emailOrPhone?.trim()}
        loading={isLoading}
        iconName="MessageSquare"
        variant="secondary"
      >
        {isLoading ? 'Sending OTP...' : 'Send OTP'}
      </Button>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code sent to your phone. Code expires in 5 minutes.
        </p>
      </div>
    </div>
  );
};

export default OTPSection;
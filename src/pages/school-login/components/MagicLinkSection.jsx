import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MagicLinkSection = ({ 
  emailOrPhone, 
  onInputChange, 
  onSendMagicLink, 
  error, 
  isLoading 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Mail" size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Login with Magic Link</h3>
        <p className="text-sm text-muted-foreground">
          We'll send you a secure link to sign in instantly
        </p>
      </div>
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        value={emailOrPhone}
        onChange={(e) => onInputChange(e?.target?.value)}
        error={error}
        required
      />
      <Button
        type="button"
        onClick={onSendMagicLink}
        fullWidth
        size="lg"
        disabled={isLoading || !emailOrPhone?.trim()}
        loading={isLoading}
        iconName="Send"
      >
        {isLoading ? 'Sending Magic Link...' : 'Send Magic Link'}
      </Button>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Click the link in your email to sign in securely. The link will expire in 15 minutes.
        </p>
      </div>
    </div>
  );
};

export default MagicLinkSection;
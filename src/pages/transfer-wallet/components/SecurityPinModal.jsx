import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SecurityPinModal = ({ isOpen, onClose, onVerified }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const handlePinChange = (value) => {
    const numericValue = value?.replace(/\D/g, '');
    if (numericValue?.length <= 4) {
      setPin(numericValue);
      if (error) setError('');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (pin?.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setIsVerifying(true);

    // Mock PIN verification
    setTimeout(() => {
      if (pin === '1234') { // Mock correct PIN
        onVerified?.();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          setError(`Too many failed attempts. Please try again later.`);
          setTimeout(() => {
            onClose?.();
          }, 2000);
        } else {
          setError(`Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`);
        }
        setPin('');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleClose = () => {
    setPin('');
    setError('');
    setAttempts(0);
    onClose?.();
  };

  const handleBiometricAuth = () => {
    // Mock biometric authentication
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerified?.();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Security Verification</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
            disabled={isVerifying}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Security Icon */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} />
            </div>
            <p className="text-muted-foreground text-sm">
              Please verify your identity to complete the transfer
            </p>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Enter your 4-digit PIN
              </label>
              <Input
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) => handlePinChange(e?.target?.value)}
                error={error}
                maxLength={4}
                className="text-center text-xl tracking-widest"
                disabled={isVerifying || attempts >= maxAttempts}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={pin?.length !== 4 || isVerifying || attempts >= maxAttempts}
            >
              {isVerifying ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Verify PIN
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Biometric Authentication */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleBiometricAuth}
            disabled={isVerifying || attempts >= maxAttempts}
          >
            <Icon name="Fingerprint" size={16} className="mr-2" />
            Use Biometric Authentication
          </Button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Having trouble? Contact support for assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPinModal;
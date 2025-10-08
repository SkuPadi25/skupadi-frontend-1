import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LogOutModal = ({ isOpen, onClose, onConfirm }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event?.key === 'Escape' && isOpen && !isLoggingOut) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoggingOut]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget && !isLoggingOut) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    
    try {
      // Show loading state briefly for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      onConfirm();
    } catch (error) {
      console.error('Logout error:', error);
      onConfirm(); // Still proceed with logout for security
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-card rounded-lg border border-border shadow-2xl w-full max-w-md mx-4 transform transition-all"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
              <AppImage 
                src="/assets/images/SkuPadi_Logo-removebg-preview_1_1_-1758106629489.png"
                alt="Skupadi Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Skupadi</h2>
              <p className="text-xs text-muted-foreground">Secure Logout</p>
            </div>
          </div>
          
          {!isLoggingOut && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-muted transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!isLoggingOut ? (
            <>
              {/* Logout Confirmation */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="LogOut" size={28} color="#ef4444" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Are you sure you want to log out?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This will end your current session and clear all temporary data. 
                  Any unsaved changes will be lost. You'll need to sign in again to access your account.
                </p>
              </div>

              {/* Warning Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={16} color="#f59e0b" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Security Notice
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Make sure you've saved all important work before logging out.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Logging Out State */
            (<div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin">
                  <Icon name="Loader2" size={28} color="#3b82f6" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Logging out...
              </h3>
              <p className="text-muted-foreground text-sm">
                Clearing session data and securing your account
              </p>
            </div>)
          )}
        </div>

        {/* Modal Actions */}
        {!isLoggingOut && (
          <div className="flex space-x-3 p-6 pt-0">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1"
              disabled={isLoggingOut}
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Log Out
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default LogOutModal;
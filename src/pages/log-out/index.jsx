import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LogOutModal from './components/LogOutModal';

const LogOut = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Show modal when component mounts
  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    // Navigate back to dashboard when modal is closed
    navigate('/dashboard');
  };

  const handleLogOutConfirm = () => {
    // Close modal and trigger logout process
    setShowModal(false);
    handleLogOut();
  };

  const handleLogOut = async () => {
    try {
      // Clear session data, authentication tokens, and cached user information
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cookies if needed (example implementation)
      document.cookie?.split(";")?.forEach((c) => {
        const eqPos = c?.indexOf("=");
        const name = eqPos > -1 ? c?.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });

      // Simulate logout API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to school login with success message
      navigate('/school-login', { 
        state: { 
          message: 'You have been successfully logged out. Your session has ended securely.',
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, still redirect for security
      navigate('/school-login', { 
        state: { 
          message: 'Logged out successfully',
          type: 'success'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/images/SkuPadi_Logo-removebg-preview_1_1_-1758106629489.png" 
              alt="Skupadi Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Skupadi</h1>
          <p className="text-muted-foreground mt-2">
            Secure session termination
          </p>
        </div>

        {/* Fallback content if modal is not shown */}
        {!showModal && (
          <div className="bg-card rounded-lg border border-border p-6 card-shadow text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="LogOut" size={24} color="#ef4444" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Ready to Log Out?
            </h2>
            <p className="text-muted-foreground mb-6">
              This will end your current session and clear all cached data.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogOut}
                className="flex-1"
              >
                Log Out
              </Button>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your data is protected with enterprise-grade security
          </p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogOutModal
        isOpen={showModal}
        onClose={handleModalClose}
        onConfirm={handleLogOutConfirm}
      />
    </div>
  );
};

export default LogOut;
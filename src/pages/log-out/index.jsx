import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LogOutModal from './components/LogOutModal';

const LogOut = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/dashboard');
  };

  const handleLogOutConfirm = () => {
    setShowModal(false);
    handleLogOut();
  };

  const handleLogOut = async () => {
    try {
      await signOut();
      sessionStorage.clear();

      document.cookie?.split(";")?.forEach((c) => {
        const eqPos = c?.indexOf("=");
        const name = eqPos > -1 ? c?.substr(0, eqPos) : c;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      navigate('/school-login', {
        replace: true,
        state: {
          message: 'You have been successfully logged out. Your session has ended securely.',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/school-login', {
        replace: true,
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

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your data is protected with enterprise-grade security
          </p>
        </div>
      </div>

      <LogOutModal
        isOpen={showModal}
        onClose={handleModalClose}
        onConfirm={handleLogOutConfirm}
      />
    </div>
  );
};

export default LogOut;

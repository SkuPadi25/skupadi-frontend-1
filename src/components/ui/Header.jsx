import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import SettingsModal from '../SettingsModal';
import NotificationCenter from '../NotificationCenter';
import { useSchool } from '../../contexts/SchoolContext';

const Header = ({ onMenuToggle, user }) => {
  const navigate = useNavigate();
  const { currentSchool } = useSchool();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const profileDropdownRef = useRef(null);

  const currentDate = new Date()?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef?.current && !profileDropdownRef?.current?.contains(event?.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showProfileDropdown]);

  const handleLogOut = () => {
    setShowProfileDropdown(false);
    navigate('/log-out');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleNotificationClick = () => {
    setShowNotificationCenter(!showNotificationCenter);
  };

  const handleSettingsNavigate = () => {
    setShowProfileDropdown(false);
    navigate('/settings');
  };

  const handleSettingsClose = () => {
    setShowSettingsModal(false);
  };

  const handleSettingsSave = (settingsData) => {
    console.log('Settings saved:', settingsData);
    // Handle settings save logic here
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'AU';
    return name
      ?.split(' ')
      ?.map(word => word?.[0])
      ?.join('')
      ?.toUpperCase()
      ?.slice(0, 2);
  };

  // Mock notification count - in real app, get from context/service
  const notificationCount = 3;

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left Section - Mobile Menu Toggle & School Info */}
          <div className="flex lg:flex-col items-start space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="lg:hidden"
              aria-label="Toggle Menu"
            >
              <Icon name="Menu" size={20} />
            </Button>
            
            {/* Current School Info - Desktop Only */}
            {currentSchool && (
              <div className="hidden lg:flex items-center">
                <div>
                  <div className="text-lg font-medium text-foreground">
                    {currentSchool?.name}
                  </div>
                </div>
              </div>
            )}
            
            {/* Current Date */}
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">{currentDate}</p>
            </div>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNotificationClick}
                className="relative hover:bg-muted"
                aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
              >
                <Icon name="Bell" size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Search - Desktop Only */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex hover:bg-muted"
              aria-label="Search"
            >
              <Icon name="Search" size={20} />
            </Button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={handleProfileClick}
                className={`flex items-center space-x-3 pl-4 pr-2 py-2 border-l border-border hover:bg-muted rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  showProfileDropdown ? 'bg-muted shadow-sm' : ''
                }`}
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {user?.email || 'admin@skupadi.com'}
                  </p>
                </div>
                
                {/* User Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center ring-2 ring-background">
                    <span className="text-white text-xs font-semibold">
                      {getUserInitials(user?.name)}
                    </span>
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-background rounded-full"></div>
                </div>
                
                <Icon 
                  name={showProfileDropdown ? "ChevronUp" : "ChevronDown"} 
                  size={14} 
                  className="text-muted-foreground transition-transform duration-200" 
                />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {getUserInitials(user?.name)}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-background rounded-full"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {user?.name || 'Admin User'}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || 'admin@skupadi.com'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {user?.role || 'Administrator'}
                          </span>
                          <span className="inline-flex items-center space-x-1 text-xs text-success">
                            <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                            <span>Online</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Profile Management Section */}
                    <div className="px-2">
                      <p className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Profile
                      </p>
                      
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate('/my-profile');
                        }}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full text-left text-sm hover:bg-muted rounded-md transition-colors group"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon name="User" size={16} className="text-primary" />
                        </div>
                        <div>
                          <span className="text-foreground font-medium">My Profile</span>
                          <p className="text-xs text-muted-foreground">View and edit your profile</p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          console.log('Navigate to account settings');
                        }}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full text-left text-sm hover:bg-muted rounded-md transition-colors group"
                      >
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                          <Icon name="Settings" size={16} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <span className="text-foreground font-medium">Account Settings</span>
                          <p className="text-xs text-muted-foreground">Manage preferences & security</p>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-border my-2"></div>

                    {/* System Management Section */}
                    <div className="px-2">
                      <p className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        System
                      </p>

                      <button
                        onClick={handleSettingsNavigate}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full text-left text-sm hover:bg-muted rounded-md transition-colors group"
                      >
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                          <Icon name="Cog" size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="text-foreground font-medium">System Settings</span>
                          <p className="text-xs text-muted-foreground">School configuration & users</p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          console.log('Navigate to preferences');
                        }}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full text-left text-sm hover:bg-muted rounded-md transition-colors group"
                      >
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                          <Icon name="Palette" size={16} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <span className="text-foreground font-medium">Appearance</span>
                          <p className="text-xs text-muted-foreground">Theme & display preferences</p>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-border my-2"></div>

                    {/* Support Section */}
                    <div className="px-2">
                      <p className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Support
                      </p>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          console.log('Navigate to help');
                        }}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full text-left text-sm hover:bg-muted rounded-md transition-colors group"
                      >
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                          <Icon name="HelpCircle" size={16} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="text-foreground font-medium">Help & Support</span>
                          <p className="text-xs text-muted-foreground">Documentation & contact</p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          console.log('Navigate to feedback');
                        }}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full text-left text-sm hover:bg-muted rounded-md transition-colors group"
                      >
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors">
                          <Icon name="MessageCircle" size={16} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <span className="text-foreground font-medium">Send Feedback</span>
                          <p className="text-xs text-muted-foreground">Help us improve Skupadi</p>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-border my-2"></div>

                    {/* Logout Section */}
                    <div className="px-2">
                      <button
                        onClick={handleLogOut}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full text-left text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors group"
                      >
                        <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                          <Icon name="LogOut" size={16} className="text-destructive" />
                        </div>
                        <div>
                          <span className="text-destructive font-medium">Sign Out</span>
                          <p className="text-xs text-destructive/70">Logout from your account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal}
        onClose={handleSettingsClose}
        onSave={handleSettingsSave}
      />
    </>
  );
};

export default Header;
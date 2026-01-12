import React, { useState, useEffect } from 'react';


import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';


import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import PageHeader from '../../components/ui/PageHeader';

import PersonalInfo from './components/PersonalInfo';
import AccountSettings from './components/AccountSettings';
import PreferencesTab from './components/PreferencesTab';

const MyProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('personal-info');
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock current user data - in real app get from auth context/service
  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser
  ? {
      name: `${storedUser.firstName} ${storedUser.lastName}`,
      role: storedUser.role,
      avatar: storedUser.avatar ?? "/default-avatar.png"
    }
  : null;

  // Profile picture upload handler
  const handlePictureUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes?.includes(file?.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file?.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingPicture(true);
    try {
      // Create preview URL
      const previewUrl = URL?.createObjectURL(file);
      setProfilePicture(previewUrl);
      
      // In a real app, upload to Supabase storage here
      // const { data, error } = await supabase.storage
      //   .from('profile-pictures')
      //   .upload(`${currentUser.id}/${file.name}`, file);
      
    } catch (error) {
      console?.error('Profile picture upload failed:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploadingPicture(false);
    }
  };

  const handlePictureRemove = () => {
    setProfilePicture(null);
    // Clean up object URL to prevent memory leaks
    if (profilePicture) {
      URL?.revokeObjectURL(profilePicture);
    }
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

  // Tab configuration
  const profileTabs = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Manage your personal details and contact information',
      icon: 'User'
    },
    {
      id: 'account-settings',
      title: 'Account Settings',
      description: 'Security settings, password management, and authentication',
      icon: 'Settings'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your dashboard and notification preferences',
      icon: 'Palette'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Breadcrumb 
              customItems={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'My Profile' }
              ]} 
            />
            
            <PageHeader 
              title="My Profile"
              subtitle="View and manage your personal information, account settings, and preferences"
              icon="User"
              actions={null}
            />

            {/* Profile Header Section */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Profile Picture Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {profilePicture || currentUser?.profilePicture ? (
                      <div className="relative">
                        <Image 
                          src={profilePicture || currentUser?.profilePicture}
                          alt="Profile Picture"
                          className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
                        />
                        <button
                          type="button"
                          onClick={handlePictureRemove}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors shadow-lg"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center border-4 border-primary/10">
                        <span className="text-white text-xl font-bold">
                          {getUserInitials(currentUser?.name)}
                        </span>
                      </div>
                    )}
                    
                    {/* Upload Button Overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                         onClick={() => document?.getElementById('profile-picture-upload')?.click()}>
                      <Icon name="Camera" size={20} className="text-white" />
                    </div>
                  </div>
                  
                  {/* Upload/Change Picture Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      loading={uploadingPicture}
                      onClick={() => document?.getElementById('profile-picture-upload')?.click()}
                    >
                      <Icon name="Upload" size={14} className="mr-2" />
                      {profilePicture || currentUser?.profilePicture ? 'Change' : 'Upload'}
                    </Button>
                    
                    {(profilePicture || currentUser?.profilePicture) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handlePictureRemove}
                      >
                        <Icon name="Trash2" size={14} className="mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handlePictureUpload}
                    className="hidden"
                  />
                </div>

                {/* Basic User Information */}
                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {currentUser?.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <Icon name="Shield" size={12} className="mr-1" />
                      {currentUser?.role}
                    </span>
                    
                    <span className="inline-flex items-center space-x-1 text-success">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Online</span>
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" size={14} />
                      <span>{currentUser?.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={14} />
                      <span>{currentUser?.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="Building" size={14} />
                      <span>{currentUser?.school?.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={14} />
                      <span>{currentUser?.school?.location}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="font-semibold text-foreground">Member Since</div>
                    <div className="text-muted-foreground">
                      {new Date(currentUser?.joinDate)?.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="font-semibold text-foreground">Last Login</div>
                    <div className="text-muted-foreground">
                      {new Date(currentUser?.lastLogin)?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Profile Content */}
            <div className="bg-card rounded-lg border border-border">
              {/* Tab Navigation */}
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6">
                  {profileTabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setCurrentTab(tab?.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        currentTab === tab?.id 
                          ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.title}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {currentTab === 'personal-info' && (
                  <PersonalInfo user={currentUser} />
                )}
                
                {currentTab === 'account-settings' && (
                  <AccountSettings user={currentUser} />
                )}
                
                {currentTab === 'preferences' && (
                  <PreferencesTab user={currentUser} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyProfile;
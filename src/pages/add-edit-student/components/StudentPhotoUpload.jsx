import React from 'react';
import Icon from '../../../components/AppIcon';

const StudentPhotoUpload = ({ photo, onPhotoChange, error }) => {
  // Get student initials for generic avatar
  const getStudentInitials = (name) => {
    if (!name) return 'ST';
    return name
      ?.split(' ')
      ?.map(word => word?.[0])
      ?.join('')
      ?.toUpperCase()
      ?.slice(0, 2) || 'ST';
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        Student Avatar
      </label>
      
      <div className="flex items-start space-x-4">
        {/* Generic Avatar Display */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary/80 border-2 border-border flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {getStudentInitials('Student')}
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-1">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/30">
            <Icon name="User" size={24} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-foreground mb-1">
              Generic Student Avatar
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Student identification uses initials-based avatars for consistency and privacy
            </p>
            
            <div className="bg-info/10 border border-info/20 rounded-lg p-3">
              <p className="text-xs text-info">
                <Icon name="Info" size={12} className="inline mr-1" />
                Photo uploads are disabled. The system uses secure, generic avatars for all students.
              </p>
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-error mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPhotoUpload;
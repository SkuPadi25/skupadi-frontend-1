import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import { useSchool } from '../../contexts/SchoolContext';

const SchoolSelector = ({ isCompact = false }) => {
  const { currentSchool, schools, switchSchool } = useSchool();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSchoolSelect = (schoolId) => {
    switchSchool(schoolId);
    setIsOpen(false);
  };

  const getSchoolTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'primary school': return 'text-blue-400';
      case 'secondary school': return 'text-green-400';
      case 'complete school': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getSchoolTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'primary school': return 'BookOpen';
      case 'secondary school': return 'GraduationCap';
      case 'complete school': return 'Building2';
      default: return 'School';
    }
  };

  if (!currentSchool) {
    return (
      <div className="p-3 bg-white/5 rounded-lg border border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
            <Icon name="School" size={20} color="gray" />
          </div>
          <div className="text-sm text-gray-400">No school selected</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors 
          border border-gray-600 group text-left
          ${isOpen ? 'bg-white/10 shadow-lg' : ''}
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            {/* <Icon 
              name={getSchoolTypeIcon(currentSchool?.type)} 
              size={20} 
              color="white" 
            /> */}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
              {currentSchool?.name}
            </div>
            {!isCompact && (
              <div className="text-xs text-gray-300 truncate">
                {currentSchool?.type} • {currentSchool?.location}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {schools?.length > 1 && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                {schools?.length} schools
              </span>
            )}
            <Icon 
              name={isOpen ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              color="white" 
              className="opacity-50 group-hover:opacity-100 transition-opacity" 
            />
          </div>
        </div>
        
        {/* Configuration Status */}
        {!isCompact && (
          <div className="mt-2 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${currentSchool?.isConfigured ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs text-gray-300">
              {currentSchool?.isConfigured ? 'Fully Configured' : 'Setup Required'}
            </span>
          </div>
        )}
      </button>

      {/* School Selection Dropdown */}
      {isOpen && schools?.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="p-3 border-b border-gray-600 bg-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Select School</span>
              <span className="text-xs text-gray-400">{schools?.length} available</span>
            </div>
          </div>

          {/* School List */}
          <div className="py-2">
            {schools?.map((school) => (
              <button
                key={school?.id}
                onClick={() => handleSchoolSelect(school?.id)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors
                  ${currentSchool?.id === school?.id ? 'bg-primary/10 border-r-2 border-primary' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Icon 
                      name={getSchoolTypeIcon(school?.type)} 
                      size={16} 
                      color={currentSchool?.id === school?.id ? '#EAEBEF' : 'gray'} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      currentSchool?.id === school?.id ? 'text-primary' : 'text-white'
                    }`}>
                      {school?.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      <span className={getSchoolTypeColor(school?.type)}>
                        {school?.type}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{school?.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {currentSchool?.id === school?.id && (
                      <Icon name="Check" size={16} color="#EAEBEF" />
                    )}
                    <div className={`w-2 h-2 rounded-full ${
                      school?.isConfigured ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-3 border-t border-gray-600 bg-gray-700/50">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to school management or settings
                console.log('Manage schools clicked');
              }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm text-primary transition-colors"
            >
              <Icon name="Settings" size={16} />
              <span>Manage Schools</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSelector;
import React, { createContext, useContext, useState, useEffect } from 'react';

const SchoolContext = createContext();

// Mock school data - in a real app, this would come from your database
const MOCK_SCHOOLS = [
  {
    id: 'school_1',
    name: 'Bright Future Academy',
    abbreviation: 'BFA',
    type: 'Complete School',
    location: 'Lagos, Nigeria',
    isConfigured: true,
    logo: '/assets/images/school-logos/bright-future.png',
    primaryColor: '#081C48',
    theme: 'default'
  },
  {
    id: 'school_2',
    name: 'Excellence International School',
    abbreviation: 'EIS',
    type: 'Secondary School',
    location: 'Abuja, Nigeria',
    isConfigured: true,
    logo: '/assets/images/school-logos/excellence.png',
    primaryColor: '#1B4B3A',
    theme: 'green'
  },
  {
    id: 'school_3',
    name: 'Royal Crown College',
    abbreviation: 'RCC',
    type: 'Complete School',
    location: 'Port Harcourt, Nigeria',
    isConfigured: false,
    logo: '/assets/images/school-logos/royal-crown.png',
    primaryColor: '#8B1538',
    theme: 'red'
  },
  {
    id: 'school_4',
    name: 'Saint Mary\'s Primary School',
    abbreviation: 'SMPS',
    type: 'Primary School',
    location: 'Kano, Nigeria',
    isConfigured: true,
    logo: '/assets/images/school-logos/saint-marys.png',
    primaryColor: '#2563EB',
    theme: 'blue'
  },
  {
    id: 'school_5',
    name: 'Golden Gate Academy',
    abbreviation: 'GGA',
    type: 'Complete School',
    location: 'Ibadan, Nigeria',
    isConfigured: true,
    logo: '/assets/images/school-logos/golden-gate.png',
    primaryColor: '#F59E0B',
    theme: 'amber'
  }
];

export const SchoolProvider = ({ children }) => {
  const [currentSchool, setCurrentSchool] = useState(null);
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with first school or from localStorage
  useEffect(() => {
    const savedSchoolId = localStorage.getItem('selectedSchoolId');
    const defaultSchool = savedSchoolId 
      ? schools?.find(school => school?.id === savedSchoolId) || schools?.[0]
      : schools?.[0];
    
    setCurrentSchool(defaultSchool);
    setIsLoading(false);
  }, [schools]);

  // Save selected school to localStorage
  useEffect(() => {
    if (currentSchool?.id) {
      localStorage.setItem('selectedSchoolId', currentSchool?.id);
    }
  }, [currentSchool]);

  const switchSchool = (schoolId) => {
    const school = schools?.find(s => s?.id === schoolId);
    if (school) {
      setCurrentSchool(school);
      // In a real app, you might want to refresh data here
      console.log('Switched to school:', school?.name);
    }
  };

  const updateSchoolInfo = (schoolId, updates) => {
    setSchools(prevSchools => 
      prevSchools?.map(school => 
        school?.id === schoolId 
          ? { ...school, ...updates }
          : school
      )
    );
    
    // Update current school if it's the one being updated
    if (currentSchool?.id === schoolId) {
      setCurrentSchool(prev => ({ ...prev, ...updates }));
    }
  };

  const addNewSchool = (schoolData) => {
    const newSchool = {
      id: `school_${Date.now()}`,
      isConfigured: false,
      ...schoolData
    };
    setSchools(prev => [...prev, newSchool]);
    return newSchool;
  };

  const removeSchool = (schoolId) => {
    setSchools(prev => prev?.filter(school => school?.id !== schoolId));
    
    // If current school is being removed, switch to first available
    if (currentSchool?.id === schoolId) {
      const remainingSchools = schools?.filter(school => school?.id !== schoolId);
      setCurrentSchool(remainingSchools?.[0] || null);
    }
  };

  const value = {
    currentSchool,
    schools,
    isLoading,
    switchSchool,
    updateSchoolInfo,
    addNewSchool,
    removeSchool
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

export default SchoolContext;
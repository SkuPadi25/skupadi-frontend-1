// Student-Class Mapping Service
// Provides utilities for mapping students to their classes and retrieving class-specific information

// Enhanced mock student data with comprehensive class mappings
const mockStudents = [
  // Creche Students
  { id: 'STU001', name: 'Baby Adebayo', classId: 'creche', className: 'Creche', studentNumber: 'STU001' },
  { id: 'STU002', name: 'Little Chioma', classId: 'creche', className: 'Creche', studentNumber: 'STU002' },
  
  // Nursery Students (1-3)
  { id: 'STU003', name: 'Jennifer Lee', classId: 'nursery_1', className: 'Nursery 1', studentNumber: 'STU003' },
  { id: 'STU004', name: 'Kofi Asante', classId: 'nursery_2', className: 'Nursery 2', studentNumber: 'STU004' },
  { id: 'STU005', name: 'Fatima Hassan', classId: 'nursery_3', className: 'Nursery 3', studentNumber: 'STU005' },
  
  // Primary Students (1-6)
  { id: 'STU006', name: 'Emma Johnson', classId: 'primary_1', className: 'Primary 1', studentNumber: 'STU006' },
  { id: 'STU007', name: 'David Rodriguez', classId: 'primary_1', className: 'Primary 1', studentNumber: 'STU007' },
  { id: 'STU008', name: 'Sarah Williams', classId: 'primary_2', className: 'Primary 2', studentNumber: 'STU008' },
  { id: 'STU009', name: 'Maria Garcia', classId: 'primary_2', className: 'Primary 2', studentNumber: 'STU009' },
  { id: 'STU010', name: 'Robert Brown', classId: 'primary_3', className: 'Primary 3', studentNumber: 'STU010' },
  { id: 'STU011', name: 'Aisha Musa', classId: 'primary_4', className: 'Primary 4', studentNumber: 'STU011' },
  { id: 'STU012', name: 'Chidi Okwu', classId: 'primary_5', className: 'Primary 5', studentNumber: 'STU012' },
  { id: 'STU013', name: 'Grace Ojo', classId: 'primary_6', className: 'Primary 6', studentNumber: 'STU013' },
  
  // Junior Secondary School Students (JSS 1-3)
  { id: 'STU014', name: 'Michael Chen', classId: 'jss_1', className: 'JSS 1', studentNumber: 'STU014' },
  { id: 'STU015', name: 'James Wilson', classId: 'jss_1', className: 'JSS 1', studentNumber: 'STU015' },
  { id: 'STU016', name: 'Christopher Taylor', classId: 'jss_2', className: 'JSS 2', studentNumber: 'STU016' },
  { id: 'STU017', name: 'Blessing Adamu', classId: 'jss_3', className: 'JSS 3', studentNumber: 'STU017' },
  
  // Senior Secondary School Students (SSS 1-3) - Updated naming
  { id: 'STU018', name: 'Ashley Davis', classId: 'sss_1', className: 'SSS 1', studentNumber: 'STU018' },
  { id: 'STU019', name: 'Daniel Okafor', classId: 'sss_2', className: 'SSS 2', studentNumber: 'STU019' },
  { id: 'STU020', name: 'Precious Nnamdi', classId: 'sss_3', className: 'SSS 3', studentNumber: 'STU020' }
];

// Complete Nigerian Education System Class Mapping
const classMapping = {
  // Creche Level
  creche: { id: 'creche', name: 'Creche', level: 'creche' },
  
  // Nursery Levels (1-3)
  nursery_1: { id: 'nursery_1', name: 'Nursery 1', level: 'nursery' },
  nursery_2: { id: 'nursery_2', name: 'Nursery 2', level: 'nursery' },
  nursery_3: { id: 'nursery_3', name: 'Nursery 3', level: 'nursery' },
  
  // Primary Levels (1-6)
  primary_1: { id: 'primary_1', name: 'Primary 1', level: 'primary' },
  primary_2: { id: 'primary_2', name: 'Primary 2', level: 'primary' },
  primary_3: { id: 'primary_3', name: 'Primary 3', level: 'primary' },
  primary_4: { id: 'primary_4', name: 'Primary 4', level: 'primary' },
  primary_5: { id: 'primary_5', name: 'Primary 5', level: 'primary' },
  primary_6: { id: 'primary_6', name: 'Primary 6', level: 'primary' },
  
  // Junior Secondary School (JSS 1-3)
  jss_1: { id: 'jss_1', name: 'JSS 1', level: 'junior_secondary' },
  jss_2: { id: 'jss_2', name: 'JSS 2', level: 'junior_secondary' },
  jss_3: { id: 'jss_3', name: 'JSS 3', level: 'junior_secondary' },
  
  // Senior Secondary School (SSS 1-3) - Updated naming from SS to SSS
  sss_1: { id: 'sss_1', name: 'SSS 1', level: 'senior_secondary' },
  sss_2: { id: 'sss_2', name: 'SSS 2', level: 'senior_secondary' },
  sss_3: { id: 'sss_3', name: 'SSS 3', level: 'senior_secondary' }
};

export const studentClassService = {
  // Get student by ID
  async getStudentById(studentId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockStudents?.find(student => student?.id === studentId) || null;
  },

  // Get multiple students by IDs
  async getStudentsByIds(studentIds) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStudents?.filter(student => studentIds?.includes(student?.id)) || [];
  },

  // Get all students
  async getAllStudents() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStudents;
  },

  // Get students by class ID
  async getStudentsByClass(classId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStudents?.filter(student => student?.classId === classId) || [];
  },

  // Get class information for a student
  async getStudentClass(studentId) {
    const student = await this.getStudentById(studentId);
    if (!student) return null;
    
    return {
      classId: student?.classId,
      className: student?.className,
      classInfo: classMapping?.[student?.classId] || null
    };
  },

  // Get class information by class ID
  getClassInfo(classId) {
    return classMapping?.[classId] || null;
  },

  // Get all available classes
  getAllClasses() {
    return Object.values(classMapping);
  },

  // Get classes by level
  getClassesByLevel(level) {
    return Object.values(classMapping)?.filter(cls => cls?.level === level);
  },

  // Get unique classes from selected students
  async getUniqueClassesFromStudents(studentIds) {
    if (!studentIds?.length) return [];
    
    const students = await this.getStudentsByIds(studentIds);
    const uniqueClassIds = [...new Set(students.map(student => student?.classId))];
    
    return uniqueClassIds?.map(classId => ({
      classId,
      className: classMapping?.[classId]?.name || classId,
      classInfo: classMapping?.[classId] || null,
      studentsCount: students?.filter(student => student?.classId === classId)?.length
    }));
  },

  // Check if students are from the same class
  async areStudentsFromSameClass(studentIds) {
    if (!studentIds?.length) return false;
    
    const students = await this.getStudentsByIds(studentIds);
    const classIds = students?.map(student => student?.classId);
    const uniqueClasses = [...new Set(classIds)];
    
    return uniqueClasses?.length === 1;
  },

  // Group students by class
  async groupStudentsByClass(studentIds) {
    if (!studentIds?.length) return {};
    
    const students = await this.getStudentsByIds(studentIds);
    const groupedStudents = {};
    
    students?.forEach(student => {
      const classId = student?.classId;
      if (!groupedStudents?.[classId]) {
        groupedStudents[classId] = {
          classInfo: classMapping?.[classId] || null,
          students: []
        };
      }
      groupedStudents?.[classId]?.students?.push(student);
    });
    
    return groupedStudents;
  },

  // Convert student data to select options
  studentsToSelectOptions(students) {
    return students?.map(student => ({
      value: student?.id,
      label: student?.name,
      class: student?.className,
      classId: student?.classId,
      id: student?.id,
      studentNumber: student?.studentNumber
    })) || [];
  },

  // Search students with filters
  async searchStudents(searchTerm = '', classFilter = null, limit = 50) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filtered = mockStudents;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm?.toLowerCase();
      filtered = filtered?.filter(student =>
        student?.name?.toLowerCase()?.includes(term) ||
        student?.studentNumber?.toLowerCase()?.includes(term) ||
        student?.className?.toLowerCase()?.includes(term)
      );
    }
    
    // Apply class filter
    if (classFilter) {
      filtered = filtered?.filter(student => student?.classId === classFilter);
    }
    
    // Apply limit
    return filtered?.slice(0, limit);
  },

  // Enhanced method to get education level statistics
  getEducationLevelStats() {
    const stats = {
      creche: { count: 0, students: [] },
      nursery: { count: 0, students: [] },
      primary: { count: 0, students: [] },
      junior_secondary: { count: 0, students: [] },
      senior_secondary: { count: 0, students: [] }
    };

    mockStudents?.forEach(student => {
      const classInfo = classMapping?.[student?.classId];
      if (classInfo) {
        const level = classInfo?.level;
        if (stats?.[level]) {
          stats[level].count++;
          stats?.[level]?.students?.push(student);
        }
      }
    });

    return stats;
  },

  // Get complete education system overview
  getEducationSystemOverview() {
    const levels = {
      creche: {
        name: 'Creche',
        classes: Object?.values(classMapping)?.filter(cls => cls?.level === 'creche'),
        totalStudents: mockStudents?.filter(s => classMapping?.[s?.classId]?.level === 'creche')?.length
      },
      nursery: {
        name: 'Nursery (1-3)',
        classes: Object?.values(classMapping)?.filter(cls => cls?.level === 'nursery'),
        totalStudents: mockStudents?.filter(s => classMapping?.[s?.classId]?.level === 'nursery')?.length
      },
      primary: {
        name: 'Primary (1-6)',
        classes: Object?.values(classMapping)?.filter(cls => cls?.level === 'primary'),
        totalStudents: mockStudents?.filter(s => classMapping?.[s?.classId]?.level === 'primary')?.length
      },
      junior_secondary: {
        name: 'Junior Secondary (JSS 1-3)',
        classes: Object?.values(classMapping)?.filter(cls => cls?.level === 'junior_secondary'),
        totalStudents: mockStudents?.filter(s => classMapping?.[s?.classId]?.level === 'junior_secondary')?.length
      },
      senior_secondary: {
        name: 'Senior Secondary (SSS 1-3)',
        classes: Object?.values(classMapping)?.filter(cls => cls?.level === 'senior_secondary'),
        totalStudents: mockStudents?.filter(s => classMapping?.[s?.classId]?.level === 'senior_secondary')?.length
      }
    };

    return levels;
  },

  // Get all classes organized by education level
  getClassesByEducationSystem() {
    return {
      creche: this.getClassesByLevel('creche'),
      nursery: this.getClassesByLevel('nursery'),
      primary: this.getClassesByLevel('primary'),
      junior_secondary: this.getClassesByLevel('junior_secondary'),
      senior_secondary: this.getClassesByLevel('senior_secondary')
    };
  }
};

export default studentClassService;
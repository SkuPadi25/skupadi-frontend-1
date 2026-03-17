import api from './api';

let classesCache = [];
let studentsCache = [];

const normalizeClass = (schoolClass) => ({
  id: schoolClass?.id,
  name: schoolClass?.name,
  level: schoolClass?.level || 'other'
});

const normalizeStudent = (student) => ({
  id: student?.id,
  name: `${student?.firstName || ''} ${student?.lastName || ''}`?.trim(),
  classId: student?.classId,
  className: student?.class?.name || '',
  studentNumber: student?.studentNumber
});

const refreshClassCacheFromStudents = (students) => {
  const uniqueClasses = new Map();

  students?.forEach((student) => {
    if (student?.class?.id) {
      uniqueClasses.set(student?.class?.id, normalizeClass(student?.class));
    }
  });

  if (uniqueClasses.size > 0) {
    classesCache = Array.from(uniqueClasses.values());
  }
};

export const studentClassService = {
  async loadClasses() {
    const { data } = await api.get('/school-classes');
    classesCache = (data?.classes || [])?.map(normalizeClass);
    return classesCache;
  },

  async getStudentById(studentId) {
    if (!studentId) return null;

    if (studentsCache.length === 0) {
      await this.getAllStudents();
    }

    return studentsCache?.find(student => student?.id === studentId) || null;
  },

  async getStudentsByIds(studentIds) {
    if (!studentIds?.length) return [];

    const students = await this.getAllStudents();
    return students?.filter(student => studentIds?.includes(student?.id));
  },

  async getAllStudents() {
    const { data } = await api.get('/students');
    const students = (data?.students || [])?.map(normalizeStudent);
    studentsCache = students;
    refreshClassCacheFromStudents(data?.students || []);
    return students;
  },

  async getStudentsByClass(classId) {
    if (!classId) return [];

    const { data } = await api.get('/students', {
      params: { classId }
    });

    const students = (data?.students || [])?.map(normalizeStudent);
    const classInfo = data?.students?.[0]?.class;

    if (classInfo?.id) {
      const existing = classesCache?.some(item => item?.id === classInfo?.id);
      if (!existing) {
        classesCache = [...classesCache, normalizeClass(classInfo)];
      }
    }

    return students;
  },

  async getStudentClass(studentId) {
    const student = await this.getStudentById(studentId);
    if (!student) return null;

    return {
      classId: student?.classId,
      className: student?.className,
      classInfo: this.getClassInfo(student?.classId)
    };
  },

  getClassInfo(classId) {
    return classesCache?.find(cls => cls?.id === classId) || null;
  },

  getAllClasses() {
    return classesCache;
  },

  getClassesByLevel(level) {
    return classesCache?.filter(cls => cls?.level === level);
  },

  async getUniqueClassesFromStudents(studentIds) {
    if (!studentIds?.length) return [];

    const students = await this.getStudentsByIds(studentIds);
    const grouped = new Map();

    students?.forEach(student => {
      const existing = grouped?.get(student?.classId) || {
        classId: student?.classId,
        className: student?.className,
        classInfo: this.getClassInfo(student?.classId),
        studentsCount: 0
      };

      existing.studentsCount += 1;
      grouped?.set(student?.classId, existing);
    });

    return Array.from(grouped.values());
  },

  async areStudentsFromSameClass(studentIds) {
    const uniqueClasses = await this.getUniqueClassesFromStudents(studentIds);
    return uniqueClasses?.length === 1;
  },

  async groupStudentsByClass(studentIds) {
    if (!studentIds?.length) return {};

    const students = await this.getStudentsByIds(studentIds);
    const groupedStudents = {};

    students?.forEach(student => {
      const classId = student?.classId;
      if (!groupedStudents?.[classId]) {
        groupedStudents[classId] = {
          classInfo: this.getClassInfo(classId),
          students: []
        };
      }
      groupedStudents?.[classId]?.students?.push(student);
    });

    return groupedStudents;
  },

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

  async searchStudents(searchTerm = '', classFilter = null, limit = 50) {
    const { data } = await api.get('/students', {
      params: {
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(classFilter ? { classId: classFilter } : {})
      }
    });

    const students = (data?.students || [])?.map(normalizeStudent);
    return students?.slice(0, limit);
  },

  getEducationLevelStats() {
    return classesCache?.reduce((stats, schoolClass) => {
      const level = schoolClass?.level || 'other';
      if (!stats?.[level]) {
        stats[level] = { count: 0, students: [] };
      }

      const classStudents = studentsCache?.filter(student => student?.classId === schoolClass?.id);
      stats[level].count += classStudents?.length;
      stats[level].students.push(...classStudents);
      return stats;
    }, {});
  },

  getEducationSystemOverview() {
    return classesCache?.reduce((levels, schoolClass) => {
      const level = schoolClass?.level || 'other';
      if (!levels?.[level]) {
        levels[level] = {
          name: level,
          classes: [],
          totalStudents: 0
        };
      }

      levels[level].classes.push(schoolClass);
      levels[level].totalStudents += studentsCache?.filter(student => student?.classId === schoolClass?.id)?.length || 0;
      return levels;
    }, {});
  },

  getClassesByEducationSystem() {
    return classesCache?.reduce((acc, schoolClass) => {
      const level = schoolClass?.level || 'other';
      if (!acc?.[level]) {
        acc[level] = [];
      }
      acc[level].push(schoolClass);
      return acc;
    }, {});
  }
};

export default studentClassService;

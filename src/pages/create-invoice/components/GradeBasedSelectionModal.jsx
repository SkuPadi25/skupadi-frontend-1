import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { studentClassService } from '../../../services/studentClassService';

const GradeBasedSelectionModal = ({ 
  isOpen, 
  onClose, 
  onApplyToGrade,
  onStudentExceptionToggle,
  studentExceptions = {},
  allStudents = [],
  isLoadingStudents = false
}) => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [gradeStudents, setGradeStudents] = useState([]);
  const [isLoadingGradeStudents, setIsLoadingGradeStudents] = useState(false);

  // Get available grades/classes
  const availableGrades = studentClassService?.getAllClasses()?.map(cls => ({
    value: cls?.id,
    label: cls?.name,
    level: cls?.level
  })) || [];

  // Group grades by level for better organization
  const groupedGrades = availableGrades?.reduce((acc, grade) => {
    const level = grade?.level || 'Other';
    if (!acc?.[level]) {
      acc[level] = [];
    }
    acc?.[level]?.push(grade);
    return acc;
  }, {});

  // Format options for grouped select
  const formatSelectOptions = () => {
    const options = [
      { value: '', label: 'Choose a grade...', disabled: true }
    ];
    
    if (Object.keys(groupedGrades)?.length > 0) {
      Object.entries(groupedGrades)?.forEach(([level, grades]) => {
        options?.push({
          label: level?.replace('_', ' ')?.toUpperCase() || 'OTHER',
          options: grades
        });
      });
    }
    
    return options;
  };

  // Load students for selected grade
  const handleGradeSelection = async (gradeId) => {
    setSelectedGrade(gradeId);
    if (!gradeId) {
      setGradeStudents([]);
      return;
    }

    setIsLoadingGradeStudents(true);
    try {
      const students = await studentClassService?.getStudentsByClass(gradeId);
      setGradeStudents(students || []);
    } catch (error) {
      console.error('Error loading students for grade:', error);
      setGradeStudents([]);
    } finally {
      setIsLoadingGradeStudents(false);
    }
  };

  const handleApplyToGrade = () => {
    if (!selectedGrade || !gradeStudents?.length) return;

    const gradeInfo = studentClassService?.getClassInfo(selectedGrade);
    onApplyToGrade?.(selectedGrade, gradeInfo, gradeStudents);
    onClose?.();
  };

  const getExceptionCount = () => {
    return Object.keys(studentExceptions)?.filter(studentId => 
      gradeStudents?.some(student => student?.id === studentId) && studentExceptions?.[studentId]
    )?.length || 0;
  };

  const handleClose = () => {
    setSelectedGrade('');
    setGradeStudents([]);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border border-gray-200 max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Grade-Based Invoice Creation
              </h3>
              <p className="text-sm text-gray-600">
                Apply common fees to all students in a grade, with individual exceptions
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="shrink-0 ml-4"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Grade Selection Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  Select Grade/Class
                </label>
                <div className="w-full">
                  <Select
                    options={formatSelectOptions()}
                    value={selectedGrade}
                    onChange={handleGradeSelection}
                    placeholder="Choose a grade..."
                    groupOptions={true}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Selected Grade Info */}
              {selectedGrade && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Users" size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {studentClassService?.getClassInfo(selectedGrade)?.name} Selected
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Common fees will be applied to all students in this grade
                  </p>
                </div>
              )}
            </div>

            {/* Students in Selected Grade */}
            {selectedGrade && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    Students in {studentClassService?.getClassInfo(selectedGrade)?.name}
                  </h4>
                  {getExceptionCount() > 0 && (
                    <div className="flex items-center gap-1">
                      <Icon name="AlertTriangle" size={14} className="text-amber-600" />
                      <span className="text-xs text-amber-700 font-medium">
                        {getExceptionCount()} exception{getExceptionCount() > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Students List */}
                {isLoadingGradeStudents ? (
                  <div className="flex items-center justify-center py-12">
                    <Icon name="Loader" size={24} className="animate-spin text-gray-400 mr-3" />
                    <span className="text-gray-600">Loading students...</span>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                    {gradeStudents?.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Icon name="Users" size={32} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium">No students found in this grade</p>
                        <p className="text-xs mt-1">Please select a different grade or add students to this class.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {gradeStudents?.map((student) => (
                          <div key={student?.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                  <Icon name="User" size={16} className="text-gray-400 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <span className="font-medium text-gray-900 block truncate">
                                      {student?.name}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      ID: {student?.studentNumber}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                {studentExceptions?.[student?.id] && (
                                  <div className="flex items-center gap-1">
                                    <Icon name="AlertTriangle" size={12} className="text-amber-600" />
                                    <span className="text-xs text-amber-700 font-medium">Exception</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={studentExceptions?.[student?.id] || false}
                                    onChange={(checked) => onStudentExceptionToggle?.(student?.id, checked)}
                                  />
                                  <span className="text-xs text-gray-600">Exception</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Summary Info */}
                {gradeStudents?.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span>Total students: <strong>{gradeStudents?.length}</strong></span>
                        <span>
                          Will receive common fees: <strong>{gradeStudents?.length - getExceptionCount()}</strong>
                        </span>
                      </div>
                      {getExceptionCount() > 0 && (
                        <div className="text-xs text-amber-700 font-medium">
                          {getExceptionCount()} student{getExceptionCount() > 1 ? 's' : ''} marked as exception{getExceptionCount() > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedGrade ? (
                <>Common fees will be applied to {gradeStudents?.length - getExceptionCount()} students</>
              ) : (
                'Select a grade to continue'
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleApplyToGrade}
                disabled={!selectedGrade || !gradeStudents?.length || isLoadingGradeStudents}
                className="min-w-[140px]"
              >
                <Icon name="Users" size={16} className="mr-2" />
                Apply to Grade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeBasedSelectionModal;
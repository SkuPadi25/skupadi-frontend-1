import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { studentClassService } from '../../../services/studentClassService';
import GradeBasedSelectionModal from './GradeBasedSelectionModal';

const StudentSelection = ({ 
  selectedStudents, 
  onStudentChange, 
  isBulkMode, 
  onToggleBulkMode,
  selectedClasses = [],
  autoPopulatedFeesCount = 0,
  onGradeModeChange = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allStudents, setAllStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [isGradeMode, setIsGradeMode] = useState(false);
  const [studentExceptions, setStudentExceptions] = useState({});
  const [currentGradeInfo, setCurrentGradeInfo] = useState(null);

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const students = await studentClassService?.getAllStudents();
      setAllStudents(students);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Convert students to select options
  const studentOptions = studentClassService?.studentsToSelectOptions(allStudents);

  const filteredStudents = studentOptions?.filter(student =>
    student?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    student?.class?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    student?.studentNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // Handle grade-based selection
  const handleGradeSelection = (gradeId, gradeInfo, gradeStudents) => {
    const updatedExceptions = { ...studentExceptions };
    const studentsWithoutExceptions = gradeStudents
      ?.filter(student => !updatedExceptions?.[student?.id])
      ?.map(student => student?.id);
    
    onStudentChange(studentsWithoutExceptions);
    setIsGradeMode(true);
    setCurrentGradeInfo(gradeInfo);
    onGradeModeChange?.(true, gradeInfo, updatedExceptions);
  };

  // Handle student exception toggle
  const handleStudentExceptionToggle = (studentId, isException) => {
    const updatedExceptions = { ...studentExceptions };
    
    if (isException) {
      updatedExceptions[studentId] = true;
      // Remove from selected students if they're currently selected
      const updatedSelection = selectedStudents?.filter(id => id !== studentId);
      onStudentChange(updatedSelection);
    } else {
      delete updatedExceptions?.[studentId];
      // Add to selected students if they were an exception
      if (!selectedStudents?.includes(studentId)) {
        onStudentChange([...selectedStudents, studentId]);
      }
    }
    
    setStudentExceptions(updatedExceptions);
    onGradeModeChange?.(isGradeMode, currentGradeInfo, updatedExceptions);
  };

  // Reset grade mode when switching modes
  const handleToggleBulkMode = () => {
    onToggleBulkMode();
    if (isGradeMode) {
      setIsGradeMode(false);
      setCurrentGradeInfo(null);
      setStudentExceptions({});
      onGradeModeChange?.(false, null, {});
    }
  };

  const handleStudentToggle = (studentId) => {
    const updatedSelection = selectedStudents?.includes(studentId)
      ? selectedStudents?.filter(id => id !== studentId)
      : [...selectedStudents, studentId];
    onStudentChange(updatedSelection);
  };

  const handleSelectAll = () => {
    const allStudentIds = filteredStudents?.map(student => student?.id);
    const allSelected = allStudentIds?.every(id => selectedStudents?.includes(id));
    
    if (allSelected) {
      onStudentChange(selectedStudents?.filter(id => !allStudentIds?.includes(id)));
    } else {
      const newSelection = [...new Set([...selectedStudents, ...allStudentIds])];
      onStudentChange(newSelection);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Student Selection</h3>
          {selectedStudents?.length > 0 && autoPopulatedFeesCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {autoPopulatedFeesCount} fee{autoPopulatedFeesCount > 1 ? 's' : ''} will be auto-added based on selected students
            </p>
          )}
          {isGradeMode && currentGradeInfo && (
            <p className="text-sm text-info mt-1">
              Grade-based mode: {currentGradeInfo?.name} ({selectedStudents?.length} students selected)
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isBulkMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGradeModal(true)}
              iconName="GraduationCap"
              iconPosition="left"
            >
              Select by Grade
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleBulkMode}
            iconName={isBulkMode ? "User" : "Users"}
            iconPosition="left"
          >
            {isBulkMode ? 'Single Student' : 'Multiple Students'}
          </Button>
        </div>
      </div>

      {/* Grade Mode Summary */}
      {isGradeMode && currentGradeInfo && (
        <div className="mb-4 p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="GraduationCap" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Grade-Based Selection Active</span>
              </div>
              <p className="text-sm text-foreground">
                <strong>{currentGradeInfo?.name}</strong> - {selectedStudents?.length} students will receive common fees
              </p>
              {Object.keys(studentExceptions)?.length > 0 && (
                <p className="text-xs text-warning mt-1">
                  {Object.keys(studentExceptions)?.length} student{Object.keys(studentExceptions)?.length > 1 ? 's' : ''} marked as exception{Object.keys(studentExceptions)?.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsGradeMode(false);
                setCurrentGradeInfo(null);
                setStudentExceptions({});
                onStudentChange([]);
                onGradeModeChange?.(false, null, {});
              }}
              iconName="X"
              iconPosition="left"
            >
              Clear Grade
            </Button>
          </div>
        </div>
      )}

      {/* Class Summary */}
      {selectedClasses?.length > 0 && (
        <div className="mb-4 p-3 bg-info/10 rounded-lg border border-info/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={16} className="text-info" />
            <span className="text-sm font-medium text-info">Selected Classes Summary</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedClasses?.map(classData => (
              <div key={classData?.classId} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{classData?.className}</span>
                <span className="text-muted-foreground">
                  {classData?.studentsCount} student{classData?.studentsCount > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoadingStudents ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Loading students...</span>
        </div>
      ) : !isBulkMode ? (
        <Select
          label="Select Student"
          placeholder="Choose a student..."
          options={studentOptions}
          value={selectedStudents?.[0] || ''}
          onChange={(value) => onStudentChange(value ? [value] : [])}
          searchable
          required
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search students by name, class, or student number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              iconName="CheckSquare"
              iconPosition="left"
              disabled={filteredStudents?.length === 0}
            >
              {filteredStudents?.every(student => selectedStudents?.includes(student?.id)) ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
            {filteredStudents?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Icon name="Users" size={24} className="mx-auto mb-2 opacity-50" />
                <p>No students found</p>
                {searchTerm && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredStudents?.map((student) => (
                  <div key={student?.id} className="p-3 hover:bg-muted transition-colors">
                    <Checkbox
                      label={
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="font-medium text-foreground">{student?.label}</span>
                            <span className="text-sm text-muted-foreground ml-2">({student?.class})</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{student?.studentNumber}</span>
                        </div>
                      }
                      checked={selectedStudents?.includes(student?.id)}
                      onChange={() => handleStudentToggle(student?.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedStudents?.length > 0 && (
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{selectedStudents?.length}</span> student{selectedStudents?.length !== 1 ? 's' : ''} selected
                  </p>
                  {selectedClasses?.length > 1 && (
                    <p className="text-xs text-muted-foreground">
                      From {selectedClasses?.length} different classes
                    </p>
                  )}
                </div>
                {autoPopulatedFeesCount > 0 && (
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Icon name="Zap" size={14} className="text-primary" />
                      <span className="text-sm text-primary font-medium">
                        {autoPopulatedFeesCount} auto-fees
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grade-Based Selection Modal */}
      <GradeBasedSelectionModal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        onApplyToGrade={handleGradeSelection}
        onStudentExceptionToggle={handleStudentExceptionToggle}
        studentExceptions={studentExceptions}
        allStudents={allStudents}
        isLoadingStudents={isLoadingStudents}
      />
    </div>
  );
};

export default StudentSelection;

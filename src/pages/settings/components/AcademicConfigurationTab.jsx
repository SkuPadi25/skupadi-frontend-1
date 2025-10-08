import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const AcademicConfigurationTab = ({ 
  academicConfig, 
  setAcademicConfig, 
  onSave 
}) => {
  // Complete Nigerian Education System Structure
  const [existingGrades] = useState([
    // Creche Level
    { id: 'creche', name: 'Creche', level: 'CRECHE', studentCount: 25 },
    
    // Nursery Levels (1-3)
    { id: 'nursery_1', name: 'Nursery 1', level: 'NURSERY', studentCount: 45 },
    { id: 'nursery_2', name: 'Nursery 2', level: 'NURSERY', studentCount: 38 },
    { id: 'nursery_3', name: 'Nursery 3', level: 'NURSERY', studentCount: 42 },
    
    // Primary Levels (1-6)
    { id: 'primary_1', name: 'Primary 1', level: 'PRIMARY', studentCount: 52 },
    { id: 'primary_2', name: 'Primary 2', level: 'PRIMARY', studentCount: 48 },
    { id: 'primary_3', name: 'Primary 3', level: 'PRIMARY', studentCount: 50 },
    { id: 'primary_4', name: 'Primary 4', level: 'PRIMARY', studentCount: 46 },
    { id: 'primary_5', name: 'Primary 5', level: 'PRIMARY', studentCount: 44 },
    { id: 'primary_6', name: 'Primary 6', level: 'PRIMARY', studentCount: 42 },
    
    // Junior Secondary School (JSS 1-3)
    { id: 'jss_1', name: 'JSS 1', level: 'JUNIOR_SECONDARY', studentCount: 78 },
    { id: 'jss_2', name: 'JSS 2', level: 'JUNIOR_SECONDARY', studentCount: 65 },
    { id: 'jss_3', name: 'JSS 3', level: 'JUNIOR_SECONDARY', studentCount: 58 },
    
    // Senior Secondary School (SSS 1-3) - Updated naming
    { id: 'sss_1', name: 'SSS 1', level: 'SENIOR_SECONDARY', studentCount: 72 },
    { id: 'sss_2', name: 'SSS 2', level: 'SENIOR_SECONDARY', studentCount: 67 },
    { id: 'sss_3', name: 'SSS 3', level: 'SENIOR_SECONDARY', studentCount: 61 }
  ]);

  // Naming convention options
  const namingConventionOptions = [
    { value: 'alphabetic', label: 'Alphabetic (A, B, C...)' },
    { value: 'numeric', label: 'Numeric (1, 2, 3...)' },
    { value: 'descriptive', label: 'Descriptive (Science, Arts...)' },
    { value: 'custom', label: 'Custom Names' }
  ];

  // Add sub-class to a grade
  const addSubClass = (gradeId) => {
    const grade = existingGrades?.find(g => g?.id === gradeId);
    if (!grade) return;

    const currentSubClasses = academicConfig?.gradeConfigurations?.[gradeId]?.subClasses || [];
    const nextIndex = currentSubClasses?.length + 1;
    
    let newSubClassName = '';
    switch (academicConfig?.namingConvention) {
      case 'alphabetic':
        newSubClassName = `${grade?.name}${String.fromCharCode(64 + nextIndex)}`;
        break;
      case 'numeric':
        newSubClassName = `${grade?.name}-${nextIndex}`;
        break;
      case 'descriptive':
        newSubClassName = `${grade?.name} (General)`;
        break;
      default:
        newSubClassName = `${grade?.name} Sub-Class ${nextIndex}`;
    }

    const newSubClass = {
      id: `${gradeId}_sub_${nextIndex}`,
      name: newSubClassName,
      displayName: newSubClassName,
      capacity: 25,
      currentEnrollment: 0,
      specialization: 'General',
      isActive: true
    };

    setAcademicConfig(prev => ({
      ...prev,
      gradeConfigurations: {
        ...prev?.gradeConfigurations,
        [gradeId]: {
          ...prev?.gradeConfigurations?.[gradeId],
          gradeName: grade?.name,
          hasSubClasses: true,
          subClasses: [...currentSubClasses, newSubClass]
        }
      }
    }));
  };

  // Remove sub-class from a grade
  const removeSubClass = (gradeId, subClassId) => {
    const currentConfig = academicConfig?.gradeConfigurations?.[gradeId];
    if (!currentConfig) return;

    const updatedSubClasses = currentConfig?.subClasses?.filter(sc => sc?.id !== subClassId);
    
    setAcademicConfig(prev => ({
      ...prev,
      gradeConfigurations: {
        ...prev?.gradeConfigurations,
        [gradeId]: {
          ...currentConfig,
          hasSubClasses: updatedSubClasses?.length > 0,
          subClasses: updatedSubClasses
        }
      }
    }));
  };

  // Update sub-class details
  const updateSubClass = (gradeId, subClassId, updates) => {
    const currentConfig = academicConfig?.gradeConfigurations?.[gradeId];
    if (!currentConfig) return;

    const updatedSubClasses = currentConfig?.subClasses?.map(sc => 
      sc?.id === subClassId ? { ...sc, ...updates } : sc
    );
    
    setAcademicConfig(prev => ({
      ...prev,
      gradeConfigurations: {
        ...prev?.gradeConfigurations,
        [gradeId]: {
          ...currentConfig,
          subClasses: updatedSubClasses
        }
      }
    }));
  };

  // Toggle sub-classes for a grade
  const toggleGradeSubClasses = (gradeId, enabled) => {
    const grade = existingGrades?.find(g => g?.id === gradeId);
    if (!grade) return;

    if (enabled && !academicConfig?.gradeConfigurations?.[gradeId]?.hasSubClasses) {
      // Enable sub-classes - create first sub-class automatically
      addSubClass(gradeId);
    } else if (!enabled) {
      // Disable sub-classes - clear all sub-classes
      setAcademicConfig(prev => ({
        ...prev,
        gradeConfigurations: {
          ...prev?.gradeConfigurations,
          [gradeId]: {
            gradeName: grade?.name,
            hasSubClasses: false,
            subClasses: []
          }
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Class System Overview */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-info" />
          <h4 className="text-sm font-medium text-foreground">Complete Nigerian Education System Configuration</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure the complete Nigerian education system structure: Creche, Nursery (1-3), 
          Primary (1-6), Junior Secondary (JSS 1-3), and Senior Secondary (SSS 1-3) with 
          flexible sub-class organization for each level.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Creche: 1 level</span>
          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Nursery: 3 levels</span>
          <span className="text-xs bg-info/10 text-info px-2 py-1 rounded">Primary: 6 levels</span>
          <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">JSS: 3 levels</span>
          <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">SSS: 3 levels</span>
        </div>
      </div>

      {/* Master Sub-Class Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-3">
          <Icon name="Grid3X3" size={20} className="text-primary" />
          <div>
            <h3 className="text-base font-semibold text-foreground">Enable Sub-Class System</h3>
            <p className="text-sm text-muted-foreground">Activate sub-class organization across all educational levels</p>
          </div>
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={academicConfig?.subClassEnabled}
            onChange={(e) => setAcademicConfig(prev => ({
              ...prev,
              subClassEnabled: e?.target?.checked
            }))}
            className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <span className="text-sm font-medium text-foreground">
            {academicConfig?.subClassEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {/* Sub-Class Configuration */}
      <div className={`space-y-6 ${!academicConfig?.subClassEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* Global Settings */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-base font-medium text-foreground mb-4">Global Sub-Class Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Naming Convention"
              options={namingConventionOptions}
              value={academicConfig?.namingConvention}
              onChange={(value) => setAcademicConfig(prev => ({
                ...prev,
                namingConvention: value
              }))}
              placeholder="Select naming convention"
              description="How sub-classes will be named across all grade levels"
            />
            
            <Input
              label="Default Capacity"
              type="number"
              min="10"
              max="50"
              value={academicConfig?.maxStudentsPerSubClass}
              onChange={(e) => setAcademicConfig(prev => ({
                ...prev,
                maxStudentsPerSubClass: parseInt(e?.target?.value) || 25
              }))}
              placeholder="25"
              description="Default maximum students per sub-class"
            />
          </div>
        </div>

        {/* Enhanced Naming Convention Preview */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Naming Convention Preview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Show examples from each education level */}
            {[
              { level: 'Creche', example: 'Creche' },
              { level: 'Nursery', example: 'Nursery 2' },
              { level: 'Primary', example: 'Primary 3' },
              { level: 'JSS', example: 'JSS 1' },
              { level: 'SSS', example: 'SSS 2' }
            ]?.map((levelData) => {
              let exampleNames = [];
              switch (academicConfig?.namingConvention) {
                case 'alphabetic':
                  exampleNames = [`${levelData?.example}A`, `${levelData?.example}B`];
                  break;
                case 'numeric':
                  exampleNames = [`${levelData?.example}-1`, `${levelData?.example}-2`];
                  break;
                case 'descriptive':
                  if (levelData?.level === 'SSS' || levelData?.level === 'JSS') {
                    exampleNames = [`${levelData?.example} (Science)`, `${levelData?.example} (Arts)`];
                  } else {
                    exampleNames = [`${levelData?.example} (Red)`, `${levelData?.example} (Blue)`];
                  }
                  break;
                default:
                  exampleNames = [`${levelData?.example} Sub-Class 1`, `${levelData?.example} Sub-Class 2`];
              }
              
              return (
                <div key={levelData?.level} className="p-3 bg-background border border-border rounded-lg">
                  <div className="text-xs font-medium text-muted-foreground mb-2">{levelData?.level}</div>
                  <div className="space-y-1">
                    {exampleNames?.map((name, idx) => (
                      <div key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade-by-Grade Configuration - Organized by Education Levels */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-foreground">Complete Education System Configuration</h3>
            <div className="text-sm text-muted-foreground">
              {existingGrades?.length} grades • 5 education levels
            </div>
          </div>
          
          {/* Group grades by education level for better organization */}
          {[
            { level: 'CRECHE', title: 'Creche Level', color: 'primary', grades: existingGrades?.filter(g => g?.level === 'CRECHE') },
            { level: 'NURSERY', title: 'Nursery Levels (1-3)', color: 'success', grades: existingGrades?.filter(g => g?.level === 'NURSERY') },
            { level: 'PRIMARY', title: 'Primary Levels (1-6)', color: 'info', grades: existingGrades?.filter(g => g?.level === 'PRIMARY') },
            { level: 'JUNIOR_SECONDARY', title: 'Junior Secondary (JSS 1-3)', color: 'warning', grades: existingGrades?.filter(g => g?.level === 'JUNIOR_SECONDARY') },
            { level: 'SENIOR_SECONDARY', title: 'Senior Secondary (SSS 1-3)', color: 'destructive', grades: existingGrades?.filter(g => g?.level === 'SENIOR_SECONDARY') }
          ]?.map((eduLevel) => (
            <div key={eduLevel?.level} className="space-y-3">
              <div className={`flex items-center space-x-3 p-3 bg-${eduLevel?.color}/5 border border-${eduLevel?.color}/20 rounded-lg`}>
                <div className={`w-3 h-3 bg-${eduLevel?.color} rounded-full`}></div>
                <h4 className="text-sm font-semibold text-foreground">{eduLevel?.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {eduLevel?.grades?.length} grade{eduLevel?.grades?.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {eduLevel?.grades?.map((grade) => {
                  const gradeConfig = academicConfig?.gradeConfigurations?.[grade?.id];
                  const hasSubClasses = gradeConfig?.hasSubClasses || false;
                  const subClasses = gradeConfig?.subClasses || [];
                  
                  return (
                    <div key={grade?.id} className="border border-border rounded-lg p-4 bg-card">
                      {/* Grade Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-${eduLevel?.color}/10 rounded-lg flex items-center justify-center`}>
                            <Icon name="GraduationCap" size={16} className={`text-${eduLevel?.color}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{grade?.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {grade?.studentCount} students
                            </p>
                          </div>
                        </div>
                        
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={hasSubClasses}
                            onChange={(e) => toggleGradeSubClasses(grade?.id, e?.target?.checked)}
                            className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          />
                          <span className="text-xs text-foreground">Sub-Classes</span>
                        </label>
                      </div>

                      {/* Sub-Classes Management - Compact Version */}
                      {hasSubClasses && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground">
                              {subClasses?.length} Sub-Class{subClasses?.length !== 1 ? 'es' : ''}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addSubClass(grade?.id)}
                              className="flex items-center space-x-1 text-xs px-2 py-1"
                            >
                              <Icon name="Plus" size={12} />
                              <span>Add</span>
                            </Button>
                          </div>
                          
                          {subClasses?.length === 0 ? (
                            <div className="text-center py-3 text-xs text-muted-foreground bg-muted/30 rounded">
                              No sub-classes configured
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {subClasses?.map((subClass, index) => (
                                <div key={subClass?.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">{subClass?.displayName}</div>
                                    <div className="text-muted-foreground">
                                      {subClass?.currentEnrollment}/{subClass?.capacity} students
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSubClass(grade?.id, subClass?.id)}
                                    className="ml-2 p-1 h-auto text-destructive hover:text-destructive"
                                  >
                                    <Icon name="Trash2" size={12} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quick Stats */}
                      {hasSubClasses && subClasses?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-semibold text-foreground">
                                {subClasses?.reduce((sum, sc) => sum + (sc?.currentEnrollment || 0), 0)}
                              </div>
                              <div className="text-muted-foreground">Enrolled</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-foreground">
                                {subClasses?.reduce((sum, sc) => sum + (sc?.capacity || 0), 0)}
                              </div>
                              <div className="text-muted-foreground">Capacity</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Configuration Summary */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span>Complete System Configuration Summary</span>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {Object?.values(academicConfig?.gradeConfigurations || {})?.filter(gc => gc?.hasSubClasses)?.length}
              </div>
              <div className="text-muted-foreground">Grades w/ Sub-Classes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {Object?.values(academicConfig?.gradeConfigurations || {})?.reduce((sum, gc) => 
                  sum + (gc?.subClasses?.length || 0), 0
                )}
              </div>
              <div className="text-muted-foreground">Total Sub-Classes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {existingGrades?.reduce((sum, grade) => sum + grade?.studentCount, 0)}
              </div>
              <div className="text-muted-foreground">Total Students</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {Object?.values(academicConfig?.gradeConfigurations || {})?.reduce((sum, gc) => 
                  sum + (gc?.subClasses?.reduce((scSum, sc) => scSum + (sc?.capacity || 0), 0) || 0), 0
                )}
              </div>
              <div className="text-muted-foreground">Sub-Class Capacity</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground capitalize">
                {academicConfig?.namingConvention?.replace('_', ' ') || 'None'}
              </div>
              <div className="text-muted-foreground">Naming Style</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {existingGrades?.length}
              </div>
              <div className="text-muted-foreground">Grade Levels</div>
            </div>
          </div>

          {/* Education Level Breakdown */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Education Level Distribution:</div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Creche: {existingGrades?.filter(g => g?.level === 'CRECHE')?.length} level
              </span>
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                Nursery: {existingGrades?.filter(g => g?.level === 'NURSERY')?.length} levels
              </span>
              <span className="text-xs bg-info/10 text-info px-2 py-1 rounded">
                Primary: {existingGrades?.filter(g => g?.level === 'PRIMARY')?.length} levels
              </span>
              <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                JSS: {existingGrades?.filter(g => g?.level === 'JUNIOR_SECONDARY')?.length} levels
              </span>
              <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                SSS: {existingGrades?.filter(g => g?.level === 'SENIOR_SECONDARY')?.length} levels
              </span>
            </div>
          </div>
        </div>

        {/* Backend Integration Info */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Nigerian Education System Integration</h4>
          <p className="text-xs text-muted-foreground">
            This configuration implements the complete Nigerian education system structure from Creche through 
            Senior Secondary School (SSS). Sub-classes are stored as individual SchoolClass records with 
            descriptive names. Students are assigned via the existing classId relationship. Payment structures 
            inherit from grade-level defaults with sub-class overrides, ensuring compliance with Nigerian 
            educational standards while maintaining flexibility for school-specific organization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcademicConfigurationTab;
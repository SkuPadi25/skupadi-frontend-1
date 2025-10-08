// Dynamic Fee Loading Service
// Integrates payment structures with invoice creation for dynamic fee loading

import { studentClassService } from './studentClassService';

export const dynamicFeeService = {
  // Convert payment structure to fee type options
  convertPaymentStructureToFeeOptions(paymentStructures) {
    if (!Array.isArray(paymentStructures)) return [];
    
    return paymentStructures?.map(structure => ({
      value: `payment_structure_${structure?.id}`,
      label: structure?.name,
      defaultPrice: structure?.amount || 0,
      description: structure?.description || '',
      category: structure?.category || 'other',
      frequency: structure?.frequency || 'termly',
      mandatory: structure?.mandatory || false,
      integrationStatus: structure?.integrationStatus || 'active',
      classId: structure?.classId || null,
      className: structure?.className || '',
      structureId: structure?.id
    }));
  },

  // Get fee options for specific class
  async getFeeOptionsForClass(classId, paymentStructureContext) {
    if (!classId || !paymentStructureContext) return [];
    
    const classPaymentStructures = paymentStructureContext?.getPaymentStructureForClass(classId);
    return this.convertPaymentStructureToFeeOptions(classPaymentStructures);
  },

  // Get fee options for multiple students (mixed classes)
  async getFeeOptionsForStudents(studentIds, paymentStructureContext) {
    if (!studentIds?.length || !paymentStructureContext) return [];
    
    try {
      // Get unique classes from selected students
      const uniqueClasses = await studentClassService?.getUniqueClassesFromStudents(studentIds);
      
      // Collect all fee options from all classes
      const allFeeOptions = [];
      const classSpecificFees = {};
      
      for (const classData of uniqueClasses) {
        const classId = classData?.classId;
        const classFees = await this.getFeeOptionsForClass(classId, paymentStructureContext);
        
        // Store class-specific fees for reference
        classSpecificFees[classId] = classFees;
        
        // Add class info to each fee option
        const classFeesWithInfo = classFees?.map(fee => ({
          ...fee,
          classId,
          className: classData?.className,
          studentsCount: classData?.studentsCount
        }));
        
        allFeeOptions?.push(...classFeesWithInfo);
      }
      
      // Remove duplicates based on fee name and merge classes info
      const uniqueFeeOptions = this.mergeDuplicateFees(allFeeOptions);
      
      return {
        allFeeOptions: uniqueFeeOptions,
        classSpecificFees,
        uniqueClasses
      };
      
    } catch (error) {
      console.error('Error getting fee options for students:', error);
      return [];
    }
  },

  // Merge duplicate fees from different classes
  mergeDuplicateFees(feeOptions) {
    const feeMap = new Map();
    
    feeOptions?.forEach(fee => {
      const key = `${fee?.label}_${fee?.defaultPrice}`;
      
      if (feeMap?.has(key)) {
        const existingFee = feeMap?.get(key);
        // Add class info to existing fee
        existingFee.applicableClasses = existingFee?.applicableClasses || [];
        existingFee?.applicableClasses?.push({
          classId: fee?.classId,
          className: fee?.className,
          studentsCount: fee?.studentsCount
        });
      } else {
        feeMap?.set(key, {
          ...fee,
          applicableClasses: [{
            classId: fee?.classId,
            className: fee?.className,
            studentsCount: fee?.studentsCount
          }]
        });
      }
    });
    
    return Array.from(feeMap?.values());
  },

  // Auto-populate mandatory fees for selected students
  async getAutoPopulatedFees(studentIds, paymentStructureContext) {
    if (!studentIds?.length || !paymentStructureContext) return [];
    
    try {
      // Group students by class
      const groupedStudents = await studentClassService?.groupStudentsByClass(studentIds);
      const autoPopulatedFees = [];
      
      // For each class, get mandatory fees
      for (const [classId, classData] of Object.entries(groupedStudents)) {
        const mandatoryFees = paymentStructureContext?.getMandatoryFeesForClass(classId);
        
        mandatoryFees?.forEach(fee => {
          autoPopulatedFees?.push({
            id: `auto_${fee?.id}_${classId}`,
            feeType: `payment_structure_${fee?.id}`,
            description: fee?.name,
            quantity: 1,
            unitPrice: fee?.amount || 0,
            total: fee?.amount || 0,
            category: fee?.category || 'academic',
            mandatory: true,
            classId: classId,
            className: paymentStructureContext?.getClassNameFromId(classId),
            structureId: fee?.id,
            applicableStudents: classData?.students?.map(s => s?.id) || [],
            isAutoPopulated: true
          });
        });
      }
      
      return autoPopulatedFees;
      
    } catch (error) {
      console.error('Error auto-populating fees:', error);
      return [];
    }
  },

  // Get suggested optional fees for selected students
  async getSuggestedOptionalFees(studentIds, paymentStructureContext) {
    if (!studentIds?.length || !paymentStructureContext) return [];
    
    try {
      // Group students by class
      const groupedStudents = await studentClassService?.groupStudentsByClass(studentIds);
      const suggestedFees = [];
      
      // For each class, get optional fees
      for (const [classId, classData] of Object.entries(groupedStudents)) {
        const optionalFees = paymentStructureContext?.getOptionalFeesForClass(classId);
        
        optionalFees?.forEach(fee => {
          suggestedFees?.push({
            id: `optional_${fee?.id}_${classId}`,
            feeType: `payment_structure_${fee?.id}`,
            name: fee?.name,
            description: fee?.description,
            amount: fee?.amount || 0,
            category: fee?.category || 'other',
            frequency: fee?.frequency || 'termly',
            classId: classId,
            className: paymentStructureContext?.getClassNameFromId(classId),
            structureId: fee?.id,
            applicableStudents: classData?.students?.map(s => s?.id) || [],
            isOptional: true
          });
        });
      }
      
      // Remove duplicates
      const uniqueSuggestedFees = this.removeDuplicateOptionalFees(suggestedFees);
      
      return uniqueSuggestedFees;
      
    } catch (error) {
      console.error('Error getting suggested optional fees:', error);
      return [];
    }
  },

  // Remove duplicate optional fees
  removeDuplicateOptionalFees(fees) {
    const feeMap = new Map();
    
    fees?.forEach(fee => {
      const key = `${fee?.name}_${fee?.amount}`;
      
      if (feeMap?.has(key)) {
        const existingFee = feeMap?.get(key);
        // Merge applicable students
        existingFee.applicableStudents = [
          ...new Set([
            ...(existingFee?.applicableStudents || []),
            ...(fee?.applicableStudents || [])
          ])
        ];
        
        // Merge applicable classes
        existingFee.applicableClasses = existingFee?.applicableClasses || [];
        existingFee?.applicableClasses?.push({
          classId: fee?.classId,
          className: fee?.className
        });
      } else {
        feeMap?.set(key, {
          ...fee,
          applicableClasses: [{
            classId: fee?.classId,
            className: fee?.className
          }]
        });
      }
    });
    
    return Array.from(feeMap?.values());
  },

  // Apply smart defaults based on class-specific pricing
  applySmartDefaults(feeType, selectedStudents, paymentStructureContext) {
    if (!feeType?.startsWith('payment_structure_') || !selectedStudents?.length) {
      return null;
    }
    
    // Extract structure ID from fee type
    const structureId = parseInt(feeType?.replace('payment_structure_', ''));
    if (!structureId) return null;
    
    // Find the payment structure across all classes
    const allStructures = paymentStructureContext?.getAllActivePaymentStructures();
    const matchingStructure = allStructures?.find(structure => structure?.id === structureId);
    
    if (!matchingStructure) return null;
    
    return {
      description: matchingStructure?.name,
      unitPrice: matchingStructure?.amount || 0,
      category: matchingStructure?.category || 'other',
      frequency: matchingStructure?.frequency || 'termly',
      structureId: matchingStructure?.id,
      classId: matchingStructure?.classId,
      className: matchingStructure?.className
    };
  },

  // Validate fee compatibility with selected students
  async validateFeeCompatibility(feeType, selectedStudents, paymentStructureContext) {
    if (!feeType?.startsWith('payment_structure_') || !selectedStudents?.length) {
      return { isValid: true, warnings: [] };
    }
    
    try {
      // Get unique classes from selected students
      const uniqueClasses = await studentClassService?.getUniqueClassesFromStudents(selectedStudents);
      
      // Extract structure ID
      const structureId = parseInt(feeType?.replace('payment_structure_', ''));
      const warnings = [];
      
      // Check if the fee is available for all selected classes
      for (const classData of uniqueClasses) {
        const classStructures = paymentStructureContext?.getPaymentStructureForClass(classData?.classId);
        const hasStructure = classStructures?.some(structure => structure?.id === structureId);
        
        if (!hasStructure) {
          warnings?.push(`Fee not configured for ${classData?.className}`);
        }
      }
      
      return {
        isValid: warnings?.length === 0,
        warnings
      };
      
    } catch (error) {
      console.error('Error validating fee compatibility:', error);
      return { isValid: false, warnings: ['Error validating fee compatibility'] };
    }
  },

  // Enhanced grade-based fee application
  async getGradeBasedFees(gradeId, paymentStructureContext, excludeStudentIds = []) {
    if (!gradeId || !paymentStructureContext) return [];
    
    try {
      // Get all students in the grade
      const gradeStudents = await studentClassService?.getStudentsByClass(gradeId);
      
      // Filter out exception students
      const applicableStudents = gradeStudents?.filter(
        student => !excludeStudentIds?.includes(student?.id)
      );
      
      if (!applicableStudents?.length) return [];
      
      // Get mandatory fees for the grade
      const mandatoryFees = paymentStructureContext?.getMandatoryFeesForClass(gradeId) || [];
      
      // Get optional fees for the grade
      const optionalFees = paymentStructureContext?.getOptionalFeesForClass(gradeId) || [];
      
      return {
        mandatoryFees: mandatoryFees?.map(fee => ({
          id: `grade_mandatory_${fee?.id}`,
          feeType: `payment_structure_${fee?.id}`,
          description: fee?.name,
          quantity: 1,
          unitPrice: fee?.amount || 0,
          total: fee?.amount || 0,
          category: fee?.category || 'academic',
          mandatory: true,
          classId: gradeId,
          className: paymentStructureContext?.getClassNameFromId(gradeId),
          structureId: fee?.id,
          applicableStudents: applicableStudents?.map(s => s?.id),
          isAutoPopulated: true,
          gradeBasedFee: true
        })),
        optionalFees: optionalFees?.map(fee => ({
          id: `grade_optional_${fee?.id}`,
          feeType: `payment_structure_${fee?.id}`,
          name: fee?.name,
          description: fee?.description,
          amount: fee?.amount || 0,
          category: fee?.category || 'other',
          frequency: fee?.frequency || 'termly',
          classId: gradeId,
          className: paymentStructureContext?.getClassNameFromId(gradeId),
          structureId: fee?.id,
          applicableStudents: applicableStudents?.map(s => s?.id),
          isOptional: true,
          gradeBasedFee: true
        })),
        applicableStudents
      };
      
    } catch (error) {
      console.error('Error getting grade-based fees:', error);
      return [];
    }
  },

  // Handle exception students with custom fee structures
  async processStudentExceptions(exceptionStudentIds, gradeId, paymentStructureContext) {
    if (!exceptionStudentIds?.length || !gradeId || !paymentStructureContext) return [];
    
    try {
      const exceptionHandling = [];
      
      for (const studentId of exceptionStudentIds) {
        const student = await studentClassService?.getStudentById(studentId);
        if (!student) continue;
        
        // Get potential discounts, scholarships, or special charges for this student
        const studentSpecialFees = await this.getStudentSpecialFees(studentId, gradeId, paymentStructureContext);
        
        exceptionHandling?.push({
          studentId,
          studentName: student?.name,
          studentNumber: student?.studentNumber,
          specialFees: studentSpecialFees,
          requiresManualReview: true
        });
      }
      
      return exceptionHandling;
      
    } catch (error) {
      console.error('Error processing student exceptions:', error);
      return [];
    }
  },

  // Get special fees for exception students (discounts, scholarships, etc.)
  async getStudentSpecialFees(studentId, gradeId, paymentStructureContext) {
    // This would typically query a student-specific fee structure or discount system
    // For now, returning mock data structure
    return {
      hasScholarship: false,
      scholarshipPercentage: 0,
      hasDiscount: false,
      discountAmount: 0,
      specialCharges: [],
      customFeeStructure: null
    };
  },

  // Calculate total fees for grade-based invoice including exceptions
  calculateGradeBasedInvoiceTotals(gradeBasedFees, exceptionHandling = []) {
    const regularStudentCount = gradeBasedFees?.applicableStudents?.length || 0;
    const exceptionStudentCount = exceptionHandling?.length || 0;
    const totalStudentCount = regularStudentCount + exceptionStudentCount;
    
    // Calculate regular fees total
    const regularFeesTotal = gradeBasedFees?.mandatoryFees?.reduce((sum, fee) => {
      return sum + ((fee?.unitPrice || 0) * regularStudentCount);
    }, 0) || 0;
    
    // Calculate exception fees total (would need individual calculation)
    const exceptionFeesTotal = 0; // Placeholder - would calculate based on individual exceptions
    
    return {
      regularStudentCount,
      exceptionStudentCount,
      totalStudentCount,
      regularFeesTotal,
      exceptionFeesTotal,
      grandTotal: regularFeesTotal + exceptionFeesTotal,
      breakdown: {
        mandatoryFeesPerStudent: gradeBasedFees?.mandatoryFees?.reduce((sum, fee) => sum + (fee?.unitPrice || 0), 0) || 0,
        regularStudentsSubtotal: regularFeesTotal,
        exceptionsSubtotal: exceptionFeesTotal
      }
    };
  }
};

export default dynamicFeeService;
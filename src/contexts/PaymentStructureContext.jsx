import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const PaymentStructureContext = createContext();

// Custom hook to use the payment structure context
export const usePaymentStructure = () => {
  const context = useContext(PaymentStructureContext);
  if (!context) {
    throw new Error('usePaymentStructure must be used within a PaymentStructureProvider');
  }
  return context;
};

// Payment Structure Provider Component
export const PaymentStructureProvider = ({ children }) => {
  const [paymentStructures, setPaymentStructures] = useState({});
  const [paymentPlans, setPaymentPlans] = useState({}); // Legacy payment plans (kept for compatibility)
  
  // New global school-level installment configuration
  const [schoolInstallmentConfig, setSchoolInstallmentConfig] = useState({
    enabled: false,
    maxInstallments: 3,
    termly: true,
    allowedInstallments: [1, 2, 3],
    gracePeriodDays: 7,
    lateFeeAmount: 5000,
    downPaymentRequired: false,
    downPaymentPercentage: 20,
    installmentFrequency: 'monthly',
    applyToAllInvoices: true,
    defaultInstallmentPlan: {
      numberOfInstallments: 3,
      installmentType: 'equal_split',
      description: 'School-wide 3-installment payment plan'
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [integrationStatus, setIntegrationStatus] = useState({});

  // Initialize payment structures with mock data
  useEffect(() => {
    // Add a small delay to ensure router is initialized
    const timer = setTimeout(() => {
      loadPaymentStructures();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Load payment structures and plans
  const loadPaymentStructures = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPaymentStructures = {
        nursery_1: [
          {
            id: 1,
            name: 'Tuition Fee',
            amount: 65000,
            frequency: 'termly',
            category: 'academic',
            mandatory: true,
            description: 'Standard tuition fee for Nursery 1',
            integrationStatus: 'active',
            pendingInvoices: 8
          },
          {
            id: 2,
            name: 'School Bus',
            amount: 20000,
            frequency: 'termly',
            category: 'transportation',
            mandatory: false,
            description: 'Transportation fee for school bus service',
            integrationStatus: 'active',
            pendingInvoices: 5
          }
        ],
        primary_1: [
          {
            id: 3,
            name: 'Tuition Fee',
            amount: 85000,
            frequency: 'termly',
            category: 'academic',
            mandatory: true,
            description: 'Standard tuition fee for Primary 1',
            integrationStatus: 'active',
            pendingInvoices: 12
          },
          {
            id: 4,
            name: 'School Bus',
            amount: 25000,
            frequency: 'termly',
            category: 'transportation',
            mandatory: false,
            description: 'Transportation fee for school bus service',
            integrationStatus: 'active',
            pendingInvoices: 8
          },
          {
            id: 5,
            name: 'Exam Fee',
            amount: 15000,
            frequency: 'termly',
            category: 'academic',
            mandatory: true,
            description: 'Examination processing fee',
            integrationStatus: 'active',
            pendingInvoices: 0
          }
        ],
        primary_2: [
          {
            id: 6,
            name: 'Tuition Fee',
            amount: 87000,
            frequency: 'termly',
            category: 'academic',
            mandatory: true,
            description: 'Standard tuition fee for Primary 2',
            integrationStatus: 'active',
            pendingInvoices: 15
          }
        ],
        jss_1: [
          {
            id: 7,
            name: 'Tuition Fee',
            amount: 120000,
            frequency: 'termly',
            category: 'academic',
            mandatory: true,
            description: 'Standard tuition fee for JSS 1',
            integrationStatus: 'active',
            pendingInvoices: 20
          },
          {
            id: 8,
            name: 'Laboratory Fee',
            amount: 35000,
            frequency: 'termly',
            category: 'academic',
            mandatory: true,
            description: 'Science laboratory access and materials',
            integrationStatus: 'active',
            pendingInvoices: 18
          }
        ]
      };

      setPaymentStructures(mockPaymentStructures);
      
      // Load school-level installment configuration (replace individual payment plans)
      const mockSchoolInstallmentConfig = {
        enabled: true,
        maxInstallments: 3,
        termly: true,
        allowedInstallments: [1, 2, 3],
        gracePeriodDays: 7,
        lateFeeAmount: 5000,
        downPaymentRequired: false,
        downPaymentPercentage: 20,
        installmentFrequency: 'monthly',
        applyToAllInvoices: true,
        defaultInstallmentPlan: {
          numberOfInstallments: 3,
          installmentType: 'equal_split',
          description: 'School-wide termly installment plan - Maximum 3 installments per term'
        },
        lastUpdated: new Date()?.toISOString(),
        createdBy: 'School Administrator'
      };

      setSchoolInstallmentConfig(mockSchoolInstallmentConfig);
      
      // Track integration status with enhanced error handling
      const status = {};
      Object.keys(mockPaymentStructures || {})?.forEach(classId => {
        const classStructures = mockPaymentStructures?.[classId];
        if (classStructures && Array.isArray(classStructures)) {
          status[classId] = {
            totalFees: classStructures?.length || 0,
            activeFees: classStructures?.filter(fee => fee?.integrationStatus === 'active')?.length || 0,
            lastUpdated: new Date()?.toISOString(),
            isConfigured: true
          };
        }
      });
      
      setIntegrationStatus(status);
      
    } catch (err) {
      setError('Failed to load payment structures and installment configuration');
      console.error('Error loading payment structures:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get payment structure for specific class
  const getPaymentStructureForClass = (classId) => {
    if (!classId || !paymentStructures) return [];
    return paymentStructures?.[classId] || [];
  };

  // Get all active payment structures
  const getAllActivePaymentStructures = () => {
    const allStructures = [];
    if (!paymentStructures || typeof paymentStructures !== 'object') {
      return allStructures;
    }
    
    Object.entries(paymentStructures)?.forEach(([classId, structures]) => {
      if (Array.isArray(structures)) {
        structures?.forEach(structure => {
          if (structure?.integrationStatus === 'active') {
            allStructures?.push({
              ...structure,
              classId,
              className: getClassNameFromId(classId)
            });
          }
        });
      }
    });
    return allStructures;
  };

  // Get mandatory fees for class
  const getMandatoryFeesForClass = (classId) => {
    const classStructures = getPaymentStructureForClass(classId);
    if (!Array.isArray(classStructures)) return [];
    return classStructures?.filter(fee => fee?.mandatory && fee?.integrationStatus === 'active') || [];
  };

  // Get optional fees for class
  const getOptionalFeesForClass = (classId) => {
    const classStructures = getPaymentStructureForClass(classId);
    if (!Array.isArray(classStructures)) return [];
    return classStructures?.filter(fee => !fee?.mandatory && fee?.integrationStatus === 'active') || [];
  };

  // Update payment structure
  const updatePaymentStructure = (classId, structureId, updatedData) => {
    if (!classId || !structureId || !updatedData) return;
    
    setPaymentStructures(prev => {
      const currentClassStructures = prev?.[classId];
      if (!Array.isArray(currentClassStructures)) return prev;
      
      return {
        ...prev,
        [classId]: currentClassStructures?.map(structure =>
          structure?.id === structureId 
            ? { ...structure, ...updatedData }
            : structure
        ) || []
      };
    });
  };

  // Add new payment structure
  const addPaymentStructure = (classId, newStructure) => {
    if (!classId || !newStructure) return null;
    
    const structure = {
      id: Date.now(),
      integrationStatus: 'active',
      pendingInvoices: 0,
      ...newStructure
    };

    setPaymentStructures(prev => ({
      ...prev,
      [classId]: [...(prev?.[classId] || []), structure]
    }));

    // Update integration status with enhanced error handling
    setIntegrationStatus(prev => {
      const currentClassStatus = prev?.[classId] || {};
      return {
        ...prev,
        [classId]: {
          ...currentClassStatus,
          totalFees: (currentClassStatus?.totalFees || 0) + 1,
          activeFees: (currentClassStatus?.activeFees || 0) + 1,
          lastUpdated: new Date()?.toISOString(),
          isConfigured: true
        }
      };
    });

    return structure;
  };

  // New school-level installment configuration methods
  const updateSchoolInstallmentConfig = (configData) => {
    if (!configData) return;
    
    setSchoolInstallmentConfig(prev => ({
      ...prev,
      ...configData,
      lastUpdated: new Date()?.toISOString()
    }));
    
    // Clear individual payment plans when school-level is enabled
    if (configData?.enabled && configData?.applyToAllInvoices) {
      setPaymentPlans({});
    }
  };

  const getSchoolInstallmentConfig = () => {
    return schoolInstallmentConfig;
  };

  const isInstallmentEnabledForSchool = () => {
    return schoolInstallmentConfig?.enabled && schoolInstallmentConfig?.applyToAllInvoices;
  };

  const getDefaultInstallmentOptionsForInvoice = (totalAmount) => {
    if (!isInstallmentEnabledForSchool() || !totalAmount) return [];
    
    const config = schoolInstallmentConfig;
    const options = [];
    
    config?.allowedInstallments?.forEach(numInstallments => {
      if (numInstallments <= config?.maxInstallments) {
        const downPayment = config?.downPaymentRequired 
          ? (totalAmount * (config?.downPaymentPercentage / 100))
          : 0;
        
        const remainingAmount = totalAmount - downPayment;
        const installmentAmount = remainingAmount / numInstallments;
        
        options?.push({
          id: `school_plan_${numInstallments}`,
          name: `${numInstallments}-Installment Plan`,
          description: `Pay in ${numInstallments} ${config?.termly ? 'termly' : 'monthly'} installments`,
          numberOfInstallments: numInstallments,
          installmentAmount,
          downPayment,
          downPaymentRequired: config?.downPaymentRequired,
          gracePeriodDays: config?.gracePeriodDays,
          lateFeeAmount: config?.lateFeeAmount,
          frequency: config?.installmentFrequency,
          isSchoolDefault: true,
          totalAmount
        });
      }
    });
    
    return options;
  };

  const generateInstallmentSchedule = (totalAmount, numberOfInstallments, startDate) => {
    if (!isInstallmentEnabledForSchool()) return [];
    
    const config = schoolInstallmentConfig;
    const schedule = [];
    
    const downPayment = config?.downPaymentRequired 
      ? (totalAmount * (config?.downPaymentPercentage / 100))
      : 0;
    
    const remainingAmount = totalAmount - downPayment;
    const installmentAmount = remainingAmount / numberOfInstallments;
    
    // Add down payment if required
    if (config?.downPaymentRequired && downPayment > 0) {
      schedule?.push({
        id: 'down_payment',
        type: 'down_payment',
        amount: downPayment,
        dueDate: startDate,
        description: 'Down Payment',
        status: 'pending'
      });
    }
    
    // Add installments based on frequency
    for (let i = 1; i <= numberOfInstallments; i++) {
      let dueDate = new Date(startDate);
      
      if (config?.installmentFrequency === 'monthly') {
        dueDate?.setMonth(dueDate?.getMonth() + i);
      } else if (config?.installmentFrequency === 'quarterly') {
        dueDate?.setMonth(dueDate?.getMonth() + (i * 3));
      } else {
        // Default to monthly
        dueDate?.setMonth(dueDate?.getMonth() + i);
      }
      
      schedule?.push({
        id: `installment_${i}`,
        type: 'installment',
        amount: installmentAmount,
        dueDate: dueDate?.toISOString()?.split('T')?.[0],
        description: `Installment ${i} of ${numberOfInstallments}`,
        status: 'pending',
        installmentNumber: i
      });
    }
    
    return schedule;
  };

  const validateInstallmentRequest = (numberOfInstallments, totalAmount) => {
    if (!isInstallmentEnabledForSchool()) {
      return {
        valid: false,
        error: 'Installment payments are not enabled for this school'
      };
    }
    
    const config = schoolInstallmentConfig;
    
    if (numberOfInstallments > config?.maxInstallments) {
      return {
        valid: false,
        error: `Maximum ${config?.maxInstallments} installments allowed per term`
      };
    }
    
    if (!config?.allowedInstallments?.includes(numberOfInstallments)) {
      return {
        valid: false,
        error: `${numberOfInstallments} installments not allowed. Allowed: ${config?.allowedInstallments?.join(', ')}`
      };
    }
    
    if (!totalAmount || totalAmount <= 0) {
      return {
        valid: false,
        error: 'Invalid total amount for installment calculation'
      };
    }
    
    return {
      valid: true,
      config
    };
  };

  // Legacy method compatibility - redirect to school-level config
  const getPaymentPlansForClass = (classId) => {
    if (isInstallmentEnabledForSchool()) {
      // Return school-level installment options instead of class-specific plans
      return [{
        id: 'school_default_plan',
        name: 'School Installment Plan',
        description: schoolInstallmentConfig?.defaultInstallmentPlan?.description,
        numberOfInstallments: schoolInstallmentConfig?.defaultInstallmentPlan?.numberOfInstallments,
        isSchoolDefault: true,
        status: 'active',
        maxInstallments: schoolInstallmentConfig?.maxInstallments,
        allowedOptions: schoolInstallmentConfig?.allowedInstallments
      }];
    }
    
    // Fallback to legacy individual plans
    if (!classId || !paymentPlans) return [];
    return paymentPlans?.[classId] || [];
  };

  // Override add payment plan to update school config instead
  const addPaymentPlan = (classId, planData) => {
    if (planData?.isSchoolLevel) {
      updateSchoolInstallmentConfig({
        enabled: true,
        maxInstallments: planData?.maxInstallments || 3,
        allowedInstallments: planData?.allowedInstallments || [1, 2, 3],
        gracePeriodDays: planData?.gracePeriodDays || 7,
        lateFeeAmount: planData?.lateFeeAmount || 5000,
        downPaymentRequired: planData?.downPaymentRequired || false,
        downPaymentPercentage: planData?.downPaymentPercentage || 20,
        installmentFrequency: planData?.installmentFrequency || 'monthly',
        applyToAllInvoices: true,
        defaultInstallmentPlan: {
          numberOfInstallments: planData?.defaultInstallments || 3,
          installmentType: 'equal_split',
          description: planData?.description || 'School-wide installment plan'
        }
      });
      
      return {
        id: 'school_default_plan',
        isSchoolLevel: true,
        ...planData
      };
    }
    
    // Legacy individual plan creation (only if school-level is disabled)
    if (!isInstallmentEnabledForSchool()) {
      if (!classId || !planData) return null;
      
      const newPlan = {
        id: Date.now(),
        ...planData,
        createdDate: new Date()?.toISOString()
      };

      setPaymentPlans(prev => ({
        ...prev,
        [classId]: [...(prev?.[classId] || []), newPlan]
      }));

      return newPlan;
    }
    
    return null;
  };

  const getAllPaymentPlans = () => {
    const allPlans = [];
    if (!paymentPlans || typeof paymentPlans !== 'object') {
      return allPlans;
    }
    
    Object.entries(paymentPlans)?.forEach(([classId, plans]) => {
      if (Array.isArray(plans)) {
        plans?.forEach(plan => {
          allPlans?.push({
            ...plan,
            classId,
            className: getClassNameFromId(classId)
          });
        });
      }
    });
    return allPlans;
  };

  const updatePaymentPlan = (classId, planId, updatedData) => {
    if (!classId || !planId || !updatedData) return;
    
    setPaymentPlans(prev => {
      const currentClassPlans = prev?.[classId];
      if (!Array.isArray(currentClassPlans)) return prev;
      
      return {
        ...prev,
        [classId]: currentClassPlans?.map(plan =>
          plan?.id === planId 
            ? { ...plan, ...updatedData }
            : plan
        ) || []
      };
    });
  };

  const deletePaymentPlan = (classId, planId) => {
    if (!classId || !planId) return;
    
    setPaymentPlans(prev => {
      const currentClassPlans = prev?.[classId];
      if (!Array.isArray(currentClassPlans)) return prev;
      
      return {
        ...prev,
        [classId]: currentClassPlans?.filter(plan => plan?.id !== planId) || []
      };
    });
  };

  const updateInstallmentStatus = (classId, planId, installmentId, status, paidDate = null) => {
    if (!classId || !planId || !installmentId || !status) return;
    
    setPaymentPlans(prev => {
      const currentClassPlans = prev?.[classId];
      if (!Array.isArray(currentClassPlans)) return prev;
      
      return {
        ...prev,
        [classId]: currentClassPlans?.map(plan => {
          if (plan?.id === planId) {
            const updatedInstallments = plan?.installments?.map(inst => {
              if (inst?.id === installmentId) {
                return {
                  ...inst,
                  status,
                  paidDate: status === 'paid' ? (paidDate || new Date()?.toISOString()) : null
                };
              }
              return inst;
            });
            
            return {
              ...plan,
              installments: updatedInstallments
            };
          }
          return plan;
        }) || []
      };
    });
  };

  const getUpcomingInstallments = (classId) => {
    const classPlans = getPaymentPlansForClass(classId);
    const upcoming = [];
    const today = new Date();
    
    classPlans?.forEach(plan => {
      plan?.installments?.forEach(installment => {
        const dueDate = new Date(installment?.dueDate);
        if (dueDate > today && installment?.status !== 'paid') {
          upcoming?.push({
            ...installment,
            planId: plan?.id,
            planName: plan?.name,
            classId,
            className: getClassNameFromId(classId)
          });
        }
      });
    });
    
    return upcoming?.sort((a, b) => new Date(a?.dueDate) - new Date(b?.dueDate));
  };

  const getOverdueInstallments = (classId) => {
    const classPlans = getPaymentPlansForClass(classId);
    const overdue = [];
    const today = new Date();
    
    classPlans?.forEach(plan => {
      plan?.installments?.forEach(installment => {
        const dueDate = new Date(installment?.dueDate);
        const gracePeriodEnd = new Date(dueDate);
        gracePeriodEnd?.setDate(gracePeriodEnd?.getDate() + (plan?.gracePeriodDays || 0));
        
        if (gracePeriodEnd < today && installment?.status !== 'paid') {
          overdue?.push({
            ...installment,
            planId: plan?.id,
            planName: plan?.name,
            lateFeeAmount: plan?.lateFeeAmount || 0,
            classId,
            className: getClassNameFromId(classId)
          });
        }
      });
    });
    
    return overdue?.sort((a, b) => new Date(a?.dueDate) - new Date(b?.dueDate));
  };

  // Helper function to get class name from ID
  const getClassNameFromId = (classId) => {
    if (!classId || typeof classId !== 'string') return classId || 'Unknown';
    
    const classMapping = {
      nursery_1: 'Nursery 1',
      nursery_2: 'Nursery 2',
      primary_1: 'Primary 1',
      primary_2: 'Primary 2',
      primary_3: 'Primary 3',
      primary_4: 'Primary 4',
      primary_5: 'Primary 5',
      primary_6: 'Primary 6',
      jss_1: 'JSS 1',
      jss_2: 'JSS 2',
      jss_3: 'JSS 3',
      ss_1: 'SS 1',
      ss_2: 'SS 2',
      ss_3: 'SS 3'
    };
    return classMapping?.[classId] || classId;
  };

  // Updated context value with new school-level installment methods
  const value = {
    paymentStructures: paymentStructures || {},
    paymentPlans: paymentPlans || {},
    loading,
    error,
    integrationStatus: integrationStatus || {},
    loadPaymentStructures,
    getPaymentStructureForClass,
    getAllActivePaymentStructures,
    getMandatoryFeesForClass,
    getOptionalFeesForClass,
    updatePaymentStructure,
    addPaymentStructure,
    getClassNameFromId,
    // Modified payment plan methods for school-level compatibility
    getPaymentPlansForClass,
    getAllPaymentPlans,
    addPaymentPlan,
    updatePaymentPlan,
    deletePaymentPlan,
    updateInstallmentStatus,
    getUpcomingInstallments,
    getOverdueInstallments,
    // New school-level installment methods
    schoolInstallmentConfig,
    updateSchoolInstallmentConfig,
    getSchoolInstallmentConfig,
    isInstallmentEnabledForSchool,
    getDefaultInstallmentOptionsForInvoice,
    generateInstallmentSchedule,
    validateInstallmentRequest
  };

  return (
    <PaymentStructureContext.Provider value={value}>
      {children}
    </PaymentStructureContext.Provider>
  );
};

export default PaymentStructureProvider;
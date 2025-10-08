// Receipt Service for generating and managing payment receipts
// Handles receipt generation, storage, and retrieval for both full and partial payments

class ReceiptService {
  constructor() {
    this.receipts = this.loadReceiptsFromStorage();
  }

  // Load receipts from localStorage (in production, this would be from a database)
  loadReceiptsFromStorage() {
    try {
      const stored = localStorage.getItem('payment_receipts');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading receipts from storage:', error);
      return [];
    }
  }

  // Save receipts to localStorage (in production, this would be to a database)
  saveReceiptsToStorage(receipts) {
    try {
      localStorage.setItem('payment_receipts', JSON.stringify(receipts));
    } catch (error) {
      console.error('Error saving receipts to storage:', error);
    }
  }

  // Generate receipt ID in the enhanced format for EduFinance
  generateReceiptId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const session = this.getCurrentSession();
    const term = this.getCurrentTerm();
    return `EDU-${session}-${term}-${timestamp}-${random}`;
  }

  // Get current academic session
  getCurrentSession() {
    const currentYear = new Date()?.getFullYear();
    return `${currentYear}/${currentYear + 1}`;
  }

  // Get current academic term
  getCurrentTerm() {
    const currentMonth = new Date()?.getMonth() + 1;
    if (currentMonth >= 1 && currentMonth <= 4) return 'SECOND';
    if (currentMonth >= 5 && currentMonth <= 8) return 'THIRD';
    return 'FIRST';
  }

  // Generate comprehensive receipt for EduFinance with all required fields
  generateEnhancedReceipt(payment, studentData, invoiceData, schoolConfig, paymentType = 'full') {
    const receiptId = this.generateReceiptId();
    const currentDate = new Date()?.toISOString();
    const session = this.getCurrentSession();
    const term = this.getCurrentTerm();
    
    let receipt = {
      id: receiptId,
      paymentId: payment?.id,
      
      // Student Information (comprehensive)
      studentInfo: {
        name: studentData?.name || payment?.studentName,
        id: studentData?.studentId,
        class: studentData?.class,
        admissionNumber: studentData?.admissionNumber,
        email: studentData?.email,
        phone: studentData?.phone,
        parentGuardianName: studentData?.parentName,
        parentGuardianPhone: studentData?.parentPhone,
        parentGuardianEmail: studentData?.parentEmail
      },

      // School Information (from school configuration)
      schoolInfo: {
        name: schoolConfig?.schoolName || 'EduFinance School',
        address: this.formatSchoolAddress(schoolConfig),
        email: schoolConfig?.schoolEmail,
        phone: schoolConfig?.schoolPhone,
        logoUrl: schoolConfig?.schoolLogo,
        letterheadUrl: schoolConfig?.letterheadTemplate,
        watermarkUrl: schoolConfig?.watermarkImage,
        brandingConfig: {
          enabled: schoolConfig?.brandingEnabled || false,
          colorScheme: schoolConfig?.receiptColorScheme || 'blue',
          template: schoolConfig?.receiptTemplate || 'standard'
        }
      },

      // Invoice Information (comprehensive)
      invoiceInfo: {
        invoiceNumber: invoiceData?.invoiceNumber || payment?.invoiceId,
        issueDate: invoiceData?.issueDate,
        dueDate: invoiceData?.dueDate,
        term: invoiceData?.term || term,
        session: invoiceData?.session || session,
        academicYear: session
      },

      // Payment Information
      paymentInfo: {
        amount: payment?.amount,
        method: payment?.method,
        type: paymentType,
        date: payment?.paymentDate || currentDate,
        reference: payment?.reference,
        status: 'completed',
        transactionId: payment?.transactionId
      },

      // Receipt Metadata
      receiptMetadata: {
        receiptNumber: receiptId,
        generatedAt: currentDate,
        issuedBy: payment?.issuedBy || 'EduFinance System',
        qrCodeData: this.generateQRCodeData(receiptId, payment, studentData),
        watermarkPosition: 'center-middle',
        footerSignature: {
          text: 'Powered by EduFinance',
          logo: true,
          timestamp: currentDate
        },
        // Enhanced Astroidegita Technologies branding
        astroidegitaBranding: {
          logo: '/assets/images/ChatGPT_Image_Jun_19_2025_03_06_50_PM_prev_ui_1-1758892592480.png',
          copyright: '©2025 Astroidegita Technologies LTD (RC 8354011).',
          supportText: 'If you have any questions or complaints about this transaction, please contact our support team at',
          supportEmail: 'support@skupadi.com',
          brandColor: '#081C48',
          enabled: true
        }
      },

      // Enhanced Payment Breakdown with categories
      paymentBreakdown: this.generateEnhancedPaymentBreakdown(payment, invoiceData, paymentType),

      // Financial Summary
      financialSummary: this.calculateFinancialSummary(payment, invoiceData, paymentType),

      // Receipt Configuration (based on school settings)
      receiptConfig: this.generateReceiptConfiguration(schoolConfig),

      // Additional EduFinance specific fields
      eduFinanceMetadata: {
        version: '2.0',
        brandedReceipt: schoolConfig?.brandingEnabled || false,
        configurableElements: this.getConfigurableElements(schoolConfig),
        receiptTemplate: schoolConfig?.receiptTemplate || 'standard'
      }
    };

    // Add receipt to storage
    this.receipts?.push(receipt);
    this.saveReceiptsToStorage(this.receipts);

    console.log(`Enhanced EduFinance receipt ${receiptId} generated for payment ${payment?.id}`);
    return receipt;
  }

  // Format school address from configuration
  formatSchoolAddress(schoolConfig) {
    if (!schoolConfig) return 'School Address';
    
    const addressParts = [
      schoolConfig?.streetName,
      schoolConfig?.city,
      schoolConfig?.localGovernment,
      schoolConfig?.state
    ]?.filter(Boolean);

    return addressParts?.length > 0 ? addressParts?.join(', ') : 'School Address';
  }

  // Generate QR code data for receipt verification
  generateQRCodeData(receiptId, payment, studentData) {
    const qrData = {
      receiptId,
      paymentId: payment?.id,
      studentName: studentData?.name || payment?.studentName,
      amount: payment?.amount,
      date: new Date()?.toISOString(),
      verification: `EDU-${receiptId?.slice(-8)}`
    };

    // Create QR code string (in real app, this would generate actual QR code)
    return JSON.stringify(qrData);
  }

  // Generate enhanced payment breakdown with item categories
  generateEnhancedPaymentBreakdown(payment, invoiceData, paymentType) {
    // Default breakdown if no invoice data provided
    const defaultBreakdown = [
      {
        category: 'Tuition',
        type: 'Academic Fee',
        quantity: 1,
        amount: payment?.amount * 0.60,
        total: payment?.amount * 0.60
      },
      {
        category: 'Development Levy',
        type: 'Infrastructure',
        quantity: 1,
        amount: payment?.amount * 0.20,
        total: payment?.amount * 0.20
      },
      {
        category: 'Administrative Fee',
        type: 'Processing',
        quantity: 1,
        amount: payment?.amount * 0.15,
        total: payment?.amount * 0.15
      },
      {
        category: 'Library Fee',
        type: 'Academic Resource',
        quantity: 1,
        amount: payment?.amount * 0.05,
        total: payment?.amount * 0.05
      }
    ];

    // Use invoice data if available, otherwise use default
    const items = invoiceData?.items || defaultBreakdown;

    return {
      items: items?.map(item => ({
        itemCategory: item?.category || 'Fee',
        type: item?.type || 'Standard',
        quantity: item?.quantity || 1,
        unitAmount: item?.amount || 0,
        totalAmount: item?.total || item?.amount || 0,
        description: item?.description || `${item?.category} - ${item?.type}`
      })),
      subtotal: items?.reduce((sum, item) => sum + (item?.total || item?.amount || 0), 0),
      totalDiscount: invoiceData?.discount || 0,
      totalPayable: payment?.amount,
      paymentType: paymentType
    };
  }

  // Calculate comprehensive financial summary
  calculateFinancialSummary(payment, invoiceData, paymentType) {
    const totalAmount = invoiceData?.totalAmount || payment?.amount;
    const paidAmount = payment?.amount;
    const discount = invoiceData?.discount || 0;
    const outstanding = paymentType === 'partial' ? (totalAmount - paidAmount) : 0;

    return {
      subtotal: totalAmount - discount,
      totalDiscount: discount,
      totalIssued: totalAmount,
      totalPayable: totalAmount - discount,
      totalOutstanding: outstanding,
      totalPaid: paidAmount,
      paymentStatus: outstanding > 0 ? 'Partial Payment' : 'Fully Paid',
      balanceDue: outstanding
    };
  }

  // Generate receipt configuration based on school settings
  generateReceiptConfiguration(schoolConfig) {
    return {
      showLogo: schoolConfig?.brandingEnabled && schoolConfig?.schoolLogo ? true : false,
      showLetterhead: schoolConfig?.brandingEnabled && schoolConfig?.letterheadTemplate ? true : false,
      showWatermark: schoolConfig?.brandingEnabled && schoolConfig?.watermarkImage ? true : false,
      colorScheme: schoolConfig?.receiptColorScheme || 'blue',
      template: schoolConfig?.receiptTemplate || 'standard',
      showQRCode: true, // Always show QR code for EduFinance
      showFooterSignature: true,
      configurableElements: {
        studentName: true,
        studentId: true,
        studentClass: true,
        parentInfo: schoolConfig?.showParentInfo !== false,
        schoolAddress: true,
        schoolContacts: true,
        invoiceNumber: true,
        sessionTerm: true,
        paymentBreakdown: true,
        financialSummary: true,
        qrCode: true,
        watermark: false,
        eduFinanceBranding: true
      }
    };
  }

  // Get configurable elements based on school preferences
  getConfigurableElements(schoolConfig) {
    const defaultElements = {
      studentName: true,
      studentId: true,
      studentClass: true,
      schoolName: true,
      schoolAddress: true,
      schoolEmail: true,
      schoolPhone: true,
      invoiceNumber: true,
      issueDate: true,
      dueDate: true,
      sessionTerm: true,
      paymentBreakdown: true,
      qrCode: true,
      watermark: false,
      eduFinanceBranding: true
    };

    // Override with school-specific configuration if available
    return {
      ...defaultElements,
      ...(schoolConfig?.receiptElements || {})
    };
  }

  // Generate receipt data optimized for EduFinance branding and download/print
  generateEnhancedReceiptForDownload(receiptId) {
    let receipt = this.getReceiptById(receiptId);
    if (!receipt) return null;

    return {
      // Basic Receipt Info
      receiptId: receipt?.id,
      receiptNumber: receipt?.receiptMetadata?.receiptNumber,
      generatedAt: receipt?.receiptMetadata?.generatedAt,
      qrCodeData: receipt?.receiptMetadata?.qrCodeData,

      // Student Information
      student: receipt?.studentInfo,

      // School Information with Branding
      school: {
        ...receipt?.schoolInfo,
        branding: receipt?.schoolInfo?.brandingConfig
      },

      // Invoice & Academic Information
      invoice: receipt?.invoiceInfo,

      // Payment Information
      payment: receipt?.paymentInfo,

      // Enhanced Financial Breakdown
      breakdown: receipt?.paymentBreakdown,
      financialSummary: receipt?.financialSummary,

      // Receipt Configuration
      config: receipt?.receiptConfig,

      // EduFinance Metadata
      eduFinance: receipt?.eduFinanceMetadata,

      // Footer Information
      footer: {
        signature: receipt?.receiptMetadata?.footerSignature,
        issuedBy: receipt?.receiptMetadata?.issuedBy,
        timestamp: receipt?.receiptMetadata?.generatedAt,
        watermarkPosition: receipt?.receiptMetadata?.watermarkPosition
      }
    };
  }

  // Auto-generate receipt when payment status changes to 'completed'
  autoGenerateReceiptOnPaymentSuccess(payment) {
    try {
      // Check if receipt already exists for this payment
      const existingReceipts = this.getReceiptsByPaymentId(payment?.id);
      
      if (existingReceipts?.length > 0) {
        console.log(`Receipt already exists for payment ${payment?.id}`);
        return existingReceipts?.[0];
      }

      // Determine payment type based on amount (this logic would be enhanced based on business rules)
      const paymentType = this.determinePaymentType(payment);
      
      // Generate receipt using the enhanced method
      let receipt = this.generateReceipt(payment, paymentType);
      
      console.log(`Auto-generated receipt ${receipt?.id} for successful payment ${payment?.id}`);
      return receipt;
      
    } catch (error) {
      console.error('Error auto-generating receipt:', error);
      return null;
    }
  }

  // Basic receipt generation method (simplified version of generateEnhancedReceipt)
  generateReceipt(payment, paymentType = 'full') {
    const receiptId = this.generateReceiptId();
    const currentDate = new Date()?.toISOString();
    const session = this.getCurrentSession();
    const term = this.getCurrentTerm();
    
    let receipt = {
      id: receiptId,
      paymentId: payment?.id,
      
      // Basic receipt data structure for compatibility
      receiptNumber: receiptId,
      generatedAt: currentDate,
      paymentDate: payment?.paymentDate || currentDate,
      studentName: payment?.studentName,
      invoiceId: payment?.invoiceId,
      amount: payment?.amount,
      paymentMethod: payment?.method,
      paymentType: paymentType,
      reference: payment?.reference,
      status: 'completed',
      
      // Receipt data for compatibility with existing code
      receiptData: {
        receiptNumber: receiptId,
        schoolName: 'EduFinance School',
        schoolAddress: 'School Address',
        schoolPhone: 'School Phone',
        schoolEmail: 'School Email',
        breakdown: this.generateBasicPaymentBreakdown(payment),
        description: `Payment for ${payment?.studentName}`,
        notes: `Payment received via ${payment?.method}`,
        issuedBy: 'EduFinance System'
      },

      // Enhanced structure for future compatibility
      studentInfo: {
        name: payment?.studentName,
        id: payment?.studentId
      },
      
      paymentInfo: {
        amount: payment?.amount,
        method: payment?.method,
        type: paymentType,
        date: payment?.paymentDate || currentDate,
        reference: payment?.reference,
        status: 'completed'
      },
      
      receiptMetadata: {
        receiptNumber: receiptId,
        generatedAt: currentDate,
        issuedBy: 'EduFinance System'
      }
    };

    // Add receipt to storage
    this.receipts?.push(receipt);
    this.saveReceiptsToStorage(this.receipts);

    console.log(`Basic receipt ${receiptId} generated for payment ${payment?.id}`);
    return receipt;
  }

  // Generate basic payment breakdown for simple receipts
  generateBasicPaymentBreakdown(payment) {
    return [
      {
        category: 'School Fee',
        amount: payment?.amount,
        description: 'Payment for school fees'
      }
    ];
  }

  // Get receipt statistics
  getReceiptStatistics() {
    const totalReceipts = this.receipts?.length;
    const fullPaymentReceipts = this.receipts?.filter(r => 
      r?.paymentInfo?.type === 'full' || r?.paymentType === 'full'
    )?.length;
    const partialPaymentReceipts = this.receipts?.filter(r => 
      r?.paymentInfo?.type === 'partial' || r?.paymentType === 'partial'
    )?.length;
    const totalAmount = this.receipts?.reduce((sum, receipt) => 
      sum + (receipt?.paymentInfo?.amount || receipt?.amount || 0), 0
    );
    
    const methodStats = this.receipts?.reduce((stats, receipt) => {
      const method = receipt?.paymentInfo?.method || receipt?.paymentMethod || 'unknown';
      stats[method] = (stats?.[method] || 0) + 1;
      return stats;
    }, {});

    return {
      totalReceipts,
      fullPaymentReceipts,
      partialPaymentReceipts,
      totalAmount,
      methodStats,
      averageAmount: totalReceipts > 0 ? totalAmount / totalReceipts : 0
    };
  }

  // Enhanced method to apply school branding configuration to receipt data
  applySchoolBrandingToReceipt(receipt, schoolConfig) {
    if (!schoolConfig || !receipt) return receipt;

    // Apply branding configuration from school settings
    const enhancedReceipt = {
      ...receipt,
      
      // Enhanced school information with branding
      school: {
        ...receipt?.school,
        name: schoolConfig?.schoolName || receipt?.school?.name,
        address: this.formatSchoolAddress(schoolConfig),
        email: schoolConfig?.schoolEmail || receipt?.school?.email,
        phone: schoolConfig?.schoolPhone || receipt?.school?.phone,
        logoUrl: schoolConfig?.schoolLogo || receipt?.school?.logoUrl,
        letterheadUrl: schoolConfig?.letterheadTemplate || receipt?.school?.letterheadUrl,
        watermarkUrl: schoolConfig?.watermarkImage || receipt?.school?.watermarkUrl,
        branding: {
          enabled: schoolConfig?.receiptBrandingEnabled || schoolConfig?.brandingEnabled || false,
          colorScheme: schoolConfig?.receiptColorScheme || 'blue',
          template: schoolConfig?.receiptTemplate || 'standard',
          logoPosition: schoolConfig?.logoPosition || 'top-center',
          watermarkPosition: schoolConfig?.watermarkPosition || 'center-middle',
          footerStyle: schoolConfig?.footerStyle || 'standard'
        }
      },

      // Enhanced receipt configuration based on school settings
      receiptConfig: {
        ...receipt?.receiptConfig,
        showLogo: schoolConfig?.receiptBrandingEnabled && schoolConfig?.schoolLogo ? true : false,
        showLetterhead: schoolConfig?.receiptBrandingEnabled && schoolConfig?.letterheadTemplate ? true : false,
        showWatermark: schoolConfig?.receiptBrandingEnabled && schoolConfig?.watermarkImage ? true : false,
        colorScheme: schoolConfig?.receiptColorScheme || 'blue',
        template: schoolConfig?.receiptTemplate || 'standard',
        configurableElements: {
          ...receipt?.receiptConfig?.configurableElements,
          ...(schoolConfig?.receiptElements || {})
        }
      },

      // Enhanced metadata with branding information
      eduFinanceMetadata: {
        ...receipt?.eduFinanceMetadata,
        brandedReceipt: schoolConfig?.receiptBrandingEnabled || false,
        brandingVersion: '2.0',
        schoolCustomization: {
          enabled: schoolConfig?.receiptBrandingEnabled || false,
          template: schoolConfig?.receiptTemplate || 'standard',
          colorScheme: schoolConfig?.receiptColorScheme || 'blue',
          customElements: schoolConfig?.receiptElements || {}
        }
      }
    };

    return enhancedReceipt;
  }

  // Enhanced receipt generation with comprehensive school branding integration
  generateBrandedReceiptFromSchoolConfig(payment, studentData, invoiceData, schoolConfig, paymentType = 'full') {
    // Generate base receipt
    const baseReceipt = this.generateEnhancedReceipt(payment, studentData, invoiceData, schoolConfig, paymentType);
    
    // Apply additional school branding configuration
    const brandedReceipt = this.applySchoolBrandingToReceipt(baseReceipt, schoolConfig);
    
    // Update storage with branded receipt
    const receiptIndex = this.receipts?.findIndex(r => r?.id === baseReceipt?.id);
    if (receiptIndex !== -1) {
      this.receipts[receiptIndex] = brandedReceipt;
      this.saveReceiptsToStorage(this.receipts);
    }

    console.log(`Generated branded receipt ${brandedReceipt?.id} with school configuration`);
    return brandedReceipt;
  }

  // Get branded receipt data optimized for rendering with school configuration
  getBrandedReceiptForDisplay(receiptId, schoolConfig = null) {
    let receipt = this.getReceiptById(receiptId);
    if (!receipt) return null;

    // Apply current school configuration if provided
    if (schoolConfig) {
      receipt = this.applySchoolBrandingToReceipt(receipt, schoolConfig);
    }

    return {
      // Receipt identification
      receiptId: receipt?.id,
      receiptNumber: receipt?.receiptMetadata?.receiptNumber || receipt?.id,
      qrCodeData: receipt?.receiptMetadata?.qrCodeData,

      // Enhanced student information
      student: {
        ...receipt?.studentInfo,
        name: receipt?.studentInfo?.name || receipt?.studentName,
        id: receipt?.studentInfo?.id || receipt?.studentId,
        class: receipt?.studentInfo?.class,
        admissionNumber: receipt?.studentInfo?.admissionNumber,
        parentName: receipt?.studentInfo?.parentGuardianName,
        parentPhone: receipt?.studentInfo?.parentGuardianPhone,
        parentEmail: receipt?.studentInfo?.parentGuardianEmail
      },

      // Enhanced school information with branding
      school: {
        name: receipt?.school?.name || receipt?.schoolInfo?.name,
        address: receipt?.school?.address || receipt?.schoolInfo?.address,
        email: receipt?.school?.email || receipt?.schoolInfo?.email,
        phone: receipt?.school?.phone || receipt?.schoolInfo?.phone,
        logoUrl: receipt?.school?.logoUrl || receipt?.schoolInfo?.logoUrl,
        letterheadUrl: receipt?.school?.letterheadUrl || receipt?.schoolInfo?.letterheadUrl,
        watermarkUrl: receipt?.school?.watermarkUrl || receipt?.schoolInfo?.watermarkUrl,
        branding: receipt?.school?.branding || receipt?.schoolInfo?.brandingConfig || {
          enabled: receipt?.eduFinanceMetadata?.brandedReceipt || false,
          colorScheme: receipt?.receiptConfig?.colorScheme || 'blue',
          template: receipt?.receiptConfig?.template || 'standard'
        }
      },

      // Enhanced invoice information
      invoice: {
        invoiceNumber: receipt?.invoiceInfo?.invoiceNumber || receipt?.invoiceId,
        issueDate: receipt?.invoiceInfo?.issueDate,
        dueDate: receipt?.invoiceInfo?.dueDate,
        term: receipt?.invoiceInfo?.term,
        session: receipt?.invoiceInfo?.session || receipt?.invoiceInfo?.academicYear
      },

      // Enhanced payment information
      payment: {
        amount: receipt?.paymentInfo?.amount || receipt?.amount,
        method: receipt?.paymentInfo?.method || receipt?.paymentMethod,
        type: receipt?.paymentInfo?.type || receipt?.paymentType,
        date: receipt?.paymentInfo?.date || receipt?.paymentDate,
        reference: receipt?.paymentInfo?.reference || receipt?.reference,
        transactionId: receipt?.paymentInfo?.transactionId
      },

      // Enhanced payment breakdown
      breakdown: {
        items: receipt?.paymentBreakdown?.items?.map(item => ({
          itemCategory: item?.itemCategory || item?.category || item?.description,
          type: item?.type || 'Standard',
          quantity: item?.quantity || 1,
          unitAmount: item?.unitAmount || item?.amount,
          totalAmount: item?.totalAmount || item?.total || item?.amount,
          description: item?.description || `${item?.itemCategory || item?.category} - ${item?.type || 'Standard'}`
        })) || [],
        subtotal: receipt?.paymentBreakdown?.subtotal || receipt?.amount,
        totalDiscount: receipt?.financialSummary?.totalDiscount || 0
      },

      // Enhanced financial summary
      financialSummary: {
        subtotal: receipt?.financialSummary?.subtotal || receipt?.amount,
        totalDiscount: receipt?.financialSummary?.totalDiscount || 0,
        totalIssued: receipt?.financialSummary?.totalIssued || receipt?.amount,
        totalPayable: receipt?.financialSummary?.totalPayable || receipt?.amount,
        totalOutstanding: receipt?.financialSummary?.totalOutstanding || 0,
        totalPaid: receipt?.financialSummary?.totalPaid || receipt?.amount,
        paymentStatus: receipt?.financialSummary?.paymentStatus || 'Completed'
      },

      // Receipt configuration with branding
      config: receipt?.receiptConfig || {
        showLogo: receipt?.school?.branding?.enabled && receipt?.school?.logoUrl ? true : false,
        showLetterhead: receipt?.school?.branding?.enabled && receipt?.school?.letterheadUrl ? true : false,
        showWatermark: receipt?.school?.branding?.enabled && receipt?.school?.watermarkUrl ? true : false,
        colorScheme: receipt?.school?.branding?.colorScheme || 'blue',
        template: receipt?.school?.branding?.template || 'standard'
      },

      // Enhanced metadata
      eduFinance: {
        brandedReceipt: receipt?.eduFinanceMetadata?.brandedReceipt || receipt?.school?.branding?.enabled || false,
        version: receipt?.eduFinanceMetadata?.version || '2.0',
        schoolCustomization: receipt?.eduFinanceMetadata?.schoolCustomization
      }
    };
  }

  // Enhanced method to update existing receipts with current school branding
  updateReceiptsWithSchoolBranding(schoolConfig) {
    try {
      let updatedCount = 0;
      
      this.receipts = this.receipts?.map(receipt => {
        // Apply current school branding configuration
        const updatedReceipt = this.applySchoolBrandingToReceipt(receipt, schoolConfig);
        updatedCount++;
        return updatedReceipt;
      });

      // Save updated receipts
      this.saveReceiptsToStorage(this.receipts);
      
      console.log(`Updated ${updatedCount} receipts with current school branding configuration`);
      return { success: true, updatedCount };
      
    } catch (error) {
      console.error('Error updating receipts with school branding:', error);
      return { success: false, error: error?.message };
    }
  }

  // Enhanced method to get receipt statistics with branding metrics
  getBrandingStatistics() {
    const basicStats = this.getReceiptStatistics();
    
    const brandedReceipts = this.receipts?.filter(r => 
      r?.eduFinanceMetadata?.brandedReceipt || 
      r?.school?.branding?.enabled ||
      r?.receiptConfig?.showLogo ||
      r?.receiptConfig?.showWatermark
    )?.length;

    const templateStats = this.receipts?.reduce((stats, receipt) => {
      const template = receipt?.school?.branding?.template || 
                      receipt?.receiptConfig?.template || 
                      'standard';
      stats[template] = (stats?.[template] || 0) + 1;
      return stats;
    }, {});

    const colorSchemeStats = this.receipts?.reduce((stats, receipt) => {
      const colorScheme = receipt?.school?.branding?.colorScheme || 
                         receipt?.receiptConfig?.colorScheme || 
                         'blue';
      stats[colorScheme] = (stats?.[colorScheme] || 0) + 1;
      return stats;
    }, {});

    return {
      ...basicStats,
      brandedReceipts,
      nonBrandedReceipts: basicStats?.totalReceipts - brandedReceipts,
      brandingPercentage: basicStats?.totalReceipts > 0 ? 
        Math.round((brandedReceipts / basicStats?.totalReceipts) * 100) : 0,
      templateStats,
      colorSchemeStats,
      customizationFeatures: {
        withLogo: this.receipts?.filter(r => r?.receiptConfig?.showLogo)?.length,
        withWatermark: this.receipts?.filter(r => r?.receiptConfig?.showWatermark)?.length,
        withLetterhead: this.receipts?.filter(r => r?.receiptConfig?.showLetterhead)?.length,
        withQRCode: this.receipts?.filter(r => r?.receiptConfig?.showQRCode)?.length
      }
    };
  }

  // Get receipt by ID
  getReceiptById(receiptId) {
    return this.receipts?.find(receipt => receipt?.id === receiptId);
  }

  // Get receipts by payment ID
  getReceiptsByPaymentId(paymentId) {
    return this.receipts?.filter(receipt => receipt?.paymentId === paymentId);
  }

  // Get receipts by student name
  getReceiptsByStudent(studentName) {
    return this.receipts?.filter(receipt => 
      receipt?.studentInfo?.name?.toLowerCase()?.includes(studentName?.toLowerCase()) ||
      receipt?.studentName?.toLowerCase()?.includes(studentName?.toLowerCase())
    );
  }

  // Get receipts by date range
  getReceiptsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.receipts?.filter(receipt => {
      const receiptDate = new Date(receipt?.paymentInfo?.date || receipt?.paymentDate);
      return receiptDate >= start && receiptDate <= end;
    });
  }

  // Get all receipts with pagination
  getAllReceipts(page = 1, limit = 10, filters = {}) {
    let filteredReceipts = [...this.receipts];

    // Apply enhanced filters
    if (filters?.studentName) {
      filteredReceipts = filteredReceipts?.filter(receipt =>
        receipt?.studentInfo?.name?.toLowerCase()?.includes(filters?.studentName?.toLowerCase()) ||
        receipt?.studentName?.toLowerCase()?.includes(filters?.studentName?.toLowerCase())
      );
    }

    if (filters?.paymentMethod) {
      filteredReceipts = filteredReceipts?.filter(receipt =>
        receipt?.paymentInfo?.method === filters?.paymentMethod ||
        receipt?.paymentMethod === filters?.paymentMethod
      );
    }

    if (filters?.paymentType) {
      filteredReceipts = filteredReceipts?.filter(receipt =>
        receipt?.paymentInfo?.type === filters?.paymentType ||
        receipt?.paymentType === filters?.paymentType
      );
    }

    if (filters?.session) {
      filteredReceipts = filteredReceipts?.filter(receipt =>
        receipt?.invoiceInfo?.session === filters?.session
      );
    }

    if (filters?.term) {
      filteredReceipts = filteredReceipts?.filter(receipt =>
        receipt?.invoiceInfo?.term === filters?.term
      );
    }

    if (filters?.dateRange) {
      filteredReceipts = this.getReceiptsByDateRange(
        filters?.dateRange?.start,
        filters?.dateRange?.end
      );
    }

    // Sort by generation date (newest first)
    filteredReceipts?.sort((a, b) => {
      const dateA = new Date(a?.receiptMetadata?.generatedAt || a?.generatedAt);
      const dateB = new Date(b?.receiptMetadata?.generatedAt || b?.generatedAt);
      return dateB - dateA;
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReceipts = filteredReceipts?.slice(startIndex, endIndex);

    return {
      receipts: paginatedReceipts,
      totalCount: filteredReceipts?.length,
      currentPage: page,
      totalPages: Math.ceil(filteredReceipts?.length / limit),
      hasNext: endIndex < filteredReceipts?.length,
      hasPrevious: page > 1
    };
  }

  // Update receipt status (for tracking purposes)
  updateReceiptStatus(receiptId, status, notes = '') {
    const receiptIndex = this.receipts?.findIndex(receipt => receipt?.id === receiptId);
    
    if (receiptIndex !== -1) {
      this.receipts[receiptIndex] = {
        ...this.receipts?.[receiptIndex],
        status,
        updatedAt: new Date()?.toISOString(),
        statusNotes: notes
      };
      
      this.saveReceiptsToStorage(this.receipts);
      return this.receipts?.[receiptIndex];
    }
    
    return null;
  }

  // Generate receipt data for download/print
  generateReceiptForDownload(receiptId) {
    let receipt = this.getReceiptById(receiptId);
    if (!receipt) return null;

    return {
      receiptId: receipt?.id,
      receiptNumber: receipt?.receiptData?.receiptNumber,
      generatedAt: receipt?.generatedAt,
      paymentDate: receipt?.paymentDate,
      studentName: receipt?.studentName,
      invoiceId: receipt?.invoiceId,
      amount: receipt?.amount,
      paymentMethod: receipt?.paymentMethod,
      paymentType: receipt?.paymentType,
      reference: receipt?.reference,
      schoolInfo: {
        name: receipt?.receiptData?.schoolName,
        address: receipt?.receiptData?.schoolAddress,
        phone: receipt?.receiptData?.schoolPhone,
        email: receipt?.receiptData?.schoolEmail
      },
      breakdown: receipt?.receiptData?.breakdown,
      description: receipt?.receiptData?.description,
      notes: receipt?.receiptData?.notes,
      issuedBy: receipt?.receiptData?.issuedBy,
      status: receipt?.status
    };
  }

  // Enhanced auto-generation with comprehensive data integration
  autoGenerateEnhancedReceiptOnPaymentSuccess(payment, studentData, invoiceData, schoolConfig) {
    try {
      // Check if receipt already exists for this payment
      const existingReceipts = this.getReceiptsByPaymentId(payment?.id);
      
      if (existingReceipts?.length > 0) {
        console.log(`Receipt already exists for payment ${payment?.id}`);
        return existingReceipts?.[0];
      }

      // Determine payment type based on amount
      const paymentType = this.determinePaymentType(payment, invoiceData);
      
      // Generate enhanced receipt with all EduFinance features
      let receipt = this.generateEnhancedReceipt(
        payment, 
        studentData, 
        invoiceData, 
        schoolConfig, 
        paymentType
      );
      
      console.log(`Auto-generated enhanced EduFinance receipt ${receipt?.id} for payment ${payment?.id}`);
      return receipt;
      
    } catch (error) {
      console.error('Error auto-generating enhanced receipt:', error);
      return null;
    }
  }

  // Enhanced payment type determination with invoice context
  determinePaymentType(payment, invoiceData) {
    if (!invoiceData || !invoiceData?.totalAmount) {
      return 'full'; // Default to full if no invoice context
    }

    const expectedAmount = invoiceData?.totalAmount - (invoiceData?.discount || 0);
    const tolerance = 0.01; // Allow for small rounding differences
    
    if (Math.abs(payment?.amount - expectedAmount) <= tolerance) {
      return 'full';
    } else if (payment?.amount < expectedAmount) {
      return 'partial';
    } else {
      return 'overpaid'; // Handle overpayment cases
    }
  }

  // Get enhanced receipt statistics with EduFinance metrics
  getEnhancedReceiptStatistics() {
    const basicStats = this.getReceiptStatistics();
    
    const sessionStats = this.receipts?.reduce((stats, receipt) => {
      const session = receipt?.invoiceInfo?.session || 'Unknown';
      stats[session] = (stats?.[session] || 0) + 1;
      return stats;
    }, {});

    const termStats = this.receipts?.reduce((stats, receipt) => {
      const term = receipt?.invoiceInfo?.term || 'Unknown';
      stats[term] = (stats?.[term] || 0) + 1;
      return stats;
    }, {});

    const brandedReceipts = this.receipts?.filter(r => r?.eduFinanceMetadata?.brandedReceipt)?.length;
    const configurableReceipts = this.receipts?.filter(r => r?.receiptConfig?.configurableElements)?.length;

    return {
      ...basicStats,
      sessionStats,
      termStats,
      brandedReceipts,
      configurableReceipts,
      enhancedReceiptsCount: this.receipts?.filter(r => r?.eduFinanceMetadata?.version === '2.0')?.length,
      averageItemsPerReceipt: this.receipts?.reduce((sum, receipt) => {
        return sum + (receipt?.paymentBreakdown?.items?.length || 0);
      }, 0) / (this.receipts?.length || 1)
    };
  }

  // Clear all receipts (for testing purposes)
  clearAllReceipts() {
    this.receipts = [];
    this.saveReceiptsToStorage(this.receipts);
    console.log('All receipts cleared');
  }

  // Export receipts data (for backup purposes)
  exportReceipts() {
    return {
      receipts: this.receipts,
      exportedAt: new Date()?.toISOString(),
      totalCount: this.receipts?.length,
      version: '2.0',
      eduFinanceMetadata: {
        enhanced: true,
        features: ['branding', 'qr-codes', 'configurable-elements', 'comprehensive-data']
      }
    };
  }

  // Import receipts data (for backup restoration)
  importReceipts(receiptData) {
    try {
      if (receiptData?.receipts && Array.isArray(receiptData?.receipts)) {
        this.receipts = receiptData?.receipts;
        this.saveReceiptsToStorage(this.receipts);
        console.log(`Imported ${receiptData?.receipts?.length} receipts`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing receipts:', error);
      return false;
    }
  }
}

// Create singleton instance
const receiptService = new ReceiptService();

export default receiptService;
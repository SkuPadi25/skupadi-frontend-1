import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ReceiptModal = ({ receipt, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const receiptRef = useRef();

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentTypeLabel = (type) => {
    switch (type) {
      case 'full': return 'Full Payment';
      case 'partial': return 'Partial Payment';
      case 'overpaid': return 'Overpayment';
      default: return 'Payment';
    }
  };

  const getPaymentTypeBadge = (type) => {
    let badgeClass = '';
    switch (type) {
      case 'full':
        badgeClass = 'bg-success/10 text-success border-success/20';
        break;
      case 'partial':
        badgeClass = 'bg-warning/10 text-warning border-warning/20';
        break;
      case 'overpaid':
        badgeClass = 'bg-info/10 text-info border-info/20';
        break;
      default:
        badgeClass = 'bg-muted/10 text-muted-foreground border-muted/20';
    }
      
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${badgeClass}`}>
        {getPaymentTypeLabel(type)}
      </span>
    );
  };

  // Enhanced branding configuration with comprehensive settings
  const getBrandingConfig = () => {
    // Enhanced receipt structure support from school configuration
    if (receipt?.school?.branding || receipt?.schoolInfo?.brandingConfig) {
      const schoolBranding = receipt?.school?.branding || receipt?.schoolInfo?.brandingConfig;
      const schoolInfo = receipt?.school || receipt?.schoolInfo;
      
      return {
        brandingEnabled: schoolBranding?.enabled || receipt?.eduFinanceMetadata?.brandedReceipt || false,
        logoUrl: schoolInfo?.logoUrl || receipt?.receiptConfig?.showLogo ? schoolInfo?.logoUrl : null,
        letterheadUrl: schoolInfo?.letterheadUrl || null,
        watermarkUrl: schoolInfo?.watermarkUrl || null,
        colorScheme: schoolBranding?.colorScheme || receipt?.receiptConfig?.colorScheme || 'blue',
        template: schoolBranding?.template || receipt?.receiptConfig?.template || 'standard'
      };
    }

    // Enhanced receipt structure from receipt configuration
    if (receipt?.receiptConfig) {
      return {
        brandingEnabled: receipt?.receiptConfig?.showLogo || receipt?.receiptConfig?.showWatermark || false,
        logoUrl: receipt?.receiptConfig?.showLogo ? (receipt?.schoolInfo?.logoUrl || receipt?.school?.logoUrl) : null,
        letterheadUrl: receipt?.receiptConfig?.showLetterhead ? (receipt?.schoolInfo?.letterheadUrl || receipt?.school?.letterheadUrl) : null,
        watermarkUrl: receipt?.receiptConfig?.showWatermark ? (receipt?.schoolInfo?.watermarkUrl || receipt?.school?.watermarkUrl) : null,
        colorScheme: receipt?.receiptConfig?.colorScheme || 'blue',
        template: receipt?.receiptConfig?.template || 'standard'
      };
    }

    // Legacy receipt structure support
    return {
      brandingEnabled: receipt?.receiptData?.branding?.enabled || receipt?.eduFinance?.brandedReceipt || false,
      logoUrl: receipt?.receiptData?.branding?.logoUrl || receipt?.school?.logoUrl || null,
      letterheadUrl: receipt?.receiptData?.branding?.letterheadUrl || receipt?.school?.letterheadUrl || null,
      watermarkUrl: receipt?.receiptData?.branding?.watermarkUrl || receipt?.school?.watermarkUrl || null,
      colorScheme: receipt?.receiptData?.branding?.colorScheme || receipt?.config?.colorScheme || 'blue',
      template: receipt?.receiptData?.branding?.template || receipt?.config?.template || 'standard'
    };
  };

  const branding = getBrandingConfig();

  // Enhanced color scheme with more professional options
  const getColorSchemeStyles = (scheme) => {
    const colorSchemes = {
      blue: {
        primary: '#3B82F6',
        secondary: '#1E3A8A',
        accent: '#DBEAFE',
        text: '#1E40AF',
        gradient: 'linear-gradient(135deg, #DBEAFE 0%, #ffffff 100%)'
      },
      green: {
        primary: '#10B981',
        secondary: '#047857',
        accent: '#D1FAE5',
        text: '#065F46',
        gradient: 'linear-gradient(135deg, #D1FAE5 0%, #ffffff 100%)'
      },
      purple: {
        primary: '#8B5CF6',
        secondary: '#5B21B6',
        accent: '#EDE9FE',
        text: '#6B21A8',
        gradient: 'linear-gradient(135deg, #EDE9FE 0%, #ffffff 100%)'
      },
      red: {
        primary: '#EF4444',
        secondary: '#B91C1C',
        accent: '#FEE2E2',
        text: '#991B1B',
        gradient: 'linear-gradient(135deg, #FEE2E2 0%, #ffffff 100%)'
      },
      gray: {
        primary: '#6B7280',
        secondary: '#374151',
        accent: '#F3F4F6',
        text: '#1F2937',
        gradient: 'linear-gradient(135deg, #F3F4F6 0%, #ffffff 100%)'
      }
    };
    return colorSchemes?.[scheme] || colorSchemes?.blue;
  };

  const colors = getColorSchemeStyles(branding?.colorScheme);

  // Generate QR Code on component mount - FIXED: Larger QR code size
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Get QR code data from enhanced receipt structure
        const qrData = receipt?.qrCodeData || receipt?.receiptMetadata?.qrCodeData;
        
        if (qrData) {
          // In a real implementation, you would use a QR code library
          // For now, we'll create a placeholder QR code data URL with larger size
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
          setQrCodeDataUrl(qrCodeUrl);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [receipt]);

  // Get comprehensive receipt data with backward compatibility
  const getReceiptData = () => {
    // Enhanced receipt structure
    if (receipt?.student && receipt?.school && receipt?.invoice) {
      return {
        student: receipt?.student,
        school: receipt?.school,
        invoice: receipt?.invoice,
        payment: receipt?.payment,
        breakdown: receipt?.breakdown,
        financialSummary: receipt?.financialSummary,
        footer: receipt?.footer,
        receiptId: receipt?.receiptId,
        qrCodeData: receipt?.qrCodeData
      };
    }

    // Legacy receipt structure
    return {
      student: {
        name: receipt?.studentName || receipt?.studentInfo?.name,
        id: receipt?.studentInfo?.id,
        class: receipt?.studentInfo?.class,
        admissionNumber: receipt?.studentInfo?.admissionNumber,
        parentName: receipt?.studentInfo?.parentGuardianName,
        parentPhone: receipt?.studentInfo?.parentGuardianPhone,
        parentEmail: receipt?.studentInfo?.parentGuardianEmail
      },
      school: {
        name: receipt?.receiptData?.schoolName || receipt?.schoolInfo?.name,
        address: receipt?.receiptData?.schoolAddress || receipt?.schoolInfo?.address,
        phone: receipt?.receiptData?.schoolPhone || receipt?.schoolInfo?.phone,
        email: receipt?.receiptData?.schoolEmail || receipt?.schoolInfo?.email,
        logoUrl: receipt?.schoolInfo?.logoUrl,
        letterheadUrl: receipt?.schoolInfo?.letterheadUrl,
        watermarkUrl: receipt?.schoolInfo?.watermarkUrl
      },
      invoice: {
        invoiceNumber: receipt?.invoiceId || receipt?.invoiceInfo?.invoiceNumber,
        issueDate: receipt?.invoiceInfo?.issueDate,
        dueDate: receipt?.invoiceInfo?.dueDate,
        term: receipt?.invoiceInfo?.term,
        session: receipt?.invoiceInfo?.session || receipt?.invoiceInfo?.academicYear
      },
      payment: {
        amount: receipt?.amount || receipt?.paymentInfo?.amount,
        method: receipt?.paymentMethod || receipt?.paymentInfo?.method,
        type: receipt?.paymentType || receipt?.paymentInfo?.type,
        date: receipt?.paymentDate || receipt?.paymentInfo?.date,
        reference: receipt?.reference || receipt?.paymentInfo?.reference,
        transactionId: receipt?.paymentInfo?.transactionId
      },
      breakdown: receipt?.breakdown || receipt?.receiptData?.breakdown,
      financialSummary: receipt?.financialSummary,
      receiptId: receipt?.id || receipt?.receiptId,
      qrCodeData: receipt?.qrCodeData || receipt?.receiptMetadata?.qrCodeData
    };
  };

  const receiptData = getReceiptData();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create enhanced downloadable content with comprehensive data
      const receiptContent = generateEnhancedReceiptContent(receiptData, branding);
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = window.URL?.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `EduFinance-Receipt-${receiptData?.receiptId}.txt`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      
      window.URL?.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    try {
      // Create enhanced print-friendly version
      const printWindow = window.open('', '_blank');
      const receiptContent = generateEnhancedPrintableReceipt(receiptData, branding, colors, qrCodeDataUrl);
      
      printWindow?.document?.write(receiptContent);
      printWindow?.document?.close();
      printWindow?.print();
      printWindow?.close();
    } catch (error) {
      console.error('Error printing receipt:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const generateEnhancedReceiptContent = (receiptData, branding) => {
    return `
EDUFINANCE PAYMENT RECEIPT
=====================================
${receiptData?.school?.name}
${receiptData?.school?.address}
Phone: ${receiptData?.school?.phone}
Email: ${receiptData?.school?.email}
${branding?.brandingEnabled ? '\n[CUSTOM BRANDED RECEIPT]' : ''}

Receipt Number: ${receiptData?.receiptId}
Generated: ${formatDate(receiptData?.payment?.date)}

=====================================
STUDENT INFORMATION
=====================================
Student Name: ${receiptData?.student?.name}
Student ID: ${receiptData?.student?.id || 'N/A'}
Class: ${receiptData?.student?.class || 'N/A'}
Admission Number: ${receiptData?.student?.admissionNumber || 'N/A'}

Parent/Guardian Information:
Name: ${receiptData?.student?.parentName || 'N/A'}
Phone: ${receiptData?.student?.parentPhone || 'N/A'}
Email: ${receiptData?.student?.parentEmail || 'N/A'}

=====================================
ACADEMIC INFORMATION
=====================================
Invoice Number: ${receiptData?.invoice?.invoiceNumber}
Issue Date: ${receiptData?.invoice?.issueDate ? formatDate(receiptData?.invoice?.issueDate) : 'N/A'}
Due Date: ${receiptData?.invoice?.dueDate ? formatDate(receiptData?.invoice?.dueDate) : 'N/A'}
Term: ${receiptData?.invoice?.term || 'N/A'}
Session: ${receiptData?.invoice?.session || 'N/A'}

=====================================
PAYMENT DETAILS
=====================================
Payment Method: ${receiptData?.payment?.method?.replace('_', ' ')?.toUpperCase()}
Payment Type: ${getPaymentTypeLabel(receiptData?.payment?.type)}
Transaction Reference: ${receiptData?.payment?.reference}
Transaction ID: ${receiptData?.payment?.transactionId || 'N/A'}

=====================================
PAYMENT BREAKDOWN
=====================================
${receiptData?.breakdown?.items?.map(item => 
  `${item?.itemCategory || item?.description}: ${item?.type || ''}\n  Qty: ${item?.quantity} × ${formatAmount(item?.unitAmount || item?.amount)} = ${formatAmount(item?.totalAmount || item?.amount)}`
)?.join('\n\n')}

-------------------------------------
FINANCIAL SUMMARY
-------------------------------------
Subtotal: ${formatAmount(receiptData?.financialSummary?.subtotal || receiptData?.breakdown?.subtotal || receiptData?.payment?.amount)}
${receiptData?.financialSummary?.totalDiscount ? `Total Discount: ${formatAmount(receiptData?.financialSummary?.totalDiscount)}` : ''}
Total Issued: ${formatAmount(receiptData?.financialSummary?.totalIssued || receiptData?.payment?.amount)}
Total Payable: ${formatAmount(receiptData?.financialSummary?.totalPayable || receiptData?.payment?.amount)}
Total Outstanding: ${formatAmount(receiptData?.financialSummary?.totalOutstanding || 0)}
Total Paid: ${formatAmount(receiptData?.financialSummary?.totalPaid || receiptData?.payment?.amount)}

=====================================
QR CODE VERIFICATION
=====================================
${receiptData?.qrCodeData || 'QR Code data not available'}

=====================================
SIGNATURE & AUTHORIZATION
=====================================
©2025 Astroidegita Technologies LTD (RC 8354011).
If you have any questions or complaints about this transaction, please contact our support team at support@skupadi.com

Thank you for your payment!

Powered by Astroidegita Technologies - School Fee Management System
Generated on: ${formatDate(new Date()?.toISOString())}
=====================================
    `?.trim();
  };

  const generateEnhancedPrintableReceipt = (receiptData, branding, colors, qrCodeUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>EduFinance Receipt ${receiptData?.receiptId}</title>
      <style>
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          max-width: 700px; 
          margin: 0 auto; 
          padding: 20px;
          position: relative;
          color: #333;
          line-height: 1.6;
        }
        
        /* Letterhead Styling */
        .letterhead { 
          text-align: center; 
          margin-bottom: 20px; 
        }
        .letterhead img { 
          max-width: 100%; 
          height: auto; 
          max-height: 100px; 
        }
        
        /* Payment Breakdown Section with Watermark */
        .payment-breakdown-section {
          margin-bottom: 30px; 
          background: ${colors?.accent};
          padding: 20px;
          border-radius: 12px;
          border-left: 6px solid ${colors?.primary};
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          position: relative;
        }
        
        /* Watermark positioned specifically in payment breakdown area */
        .payment-breakdown-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.08;
          z-index: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .payment-breakdown-watermark img {
          width: 300px;
          height: 300px;
          object-fit: contain;
        }
        
        /* Header Styling */
        .header { 
          text-align: center; 
          border-bottom: 3px solid ${colors?.primary}; 
          padding: 25px;
          margin-bottom: 30px;
          background: ${colors?.gradient};
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .school-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin: 0 auto 15px;
          display: block;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .receipt-title {
          color: ${colors?.primary};
          font-size: 28px;
          font-weight: bold;
          margin: 15px 0 10px 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .school-info {
          color: ${colors?.text};
          margin-bottom: 15px;
        }
        
        .receipt-number {
          background: ${colors?.primary};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          display: inline-block;
          margin-top: 10px;
        }
        
        /* Section Styling */
        .section { 
          margin-bottom: 30px; 
          background: ${colors?.accent};
          padding: 20px;
          border-radius: 12px;
          border-left: 6px solid ${colors?.primary};
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .section h3 { 
          color: white;
          padding: 12px 16px; 
          margin: -20px -20px 20px -20px; 
          background: ${colors?.primary};
          border-radius: 8px 8px 0 0;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 1;
        }
        
        /* Info Grid Styling */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .info-item { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          padding: 12px 0; 
          border-bottom: 1px solid ${colors?.primary}20;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        
        .info-label {
          font-weight: 600;
          color: ${colors?.text};
        }
        
        .info-value {
          font-weight: 500;
          color: #333;
        }
        
        /* Payment Breakdown Styling */
        .breakdown-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          position: relative;
          z-index: 1;
        }
        
        .breakdown-table th {
          background: ${colors?.primary};
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        
        .breakdown-table td {
          padding: 12px;
          border-bottom: 1px solid ${colors?.primary}30;
          background: rgba(255, 255, 255, 0.9);
        }
        
        .breakdown-table tbody tr:hover {
          background: ${colors?.accent}50;
        }
        
        /* Financial Summary Styling */
        .financial-summary { 
          background: ${colors?.primary};
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          position: relative;
          z-index: 1;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .summary-row:last-child {
          border-bottom: none;
          font-size: 1.1em;
          font-weight: bold;
          margin-top: 10px;
          padding-top: 15px;
          border-top: 2px solid rgba(255,255,255,0.3);
        }
        
        /* QR Code Styling */
        .qr-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, ${colors?.accent} 0%, white 100%);
          border-radius: 12px;
          border: 2px solid ${colors?.primary}20;
        }
        
        .qr-code img {
          width: 150px;
          height: 150px;
          border: 3px solid ${colors?.primary};
          border-radius: 8px;
        }
        
        .qr-info {
          flex: 1;
          padding-right: 20px;
        }
        
        /* Footer Styling */
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 25px;
          border-top: 3px solid ${colors?.primary};
          background: ${colors?.gradient};
          border-radius: 0 0 12px 12px;
          color: ${colors?.text};
        }
        
        .signature-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding: 15px 0;
          border-top: 1px solid ${colors?.primary}30;
        }
        
        .edufinance-branding {
          color: ${colors?.primary};
          font-weight: bold;
          font-size: 14px;
        }
        
        /* Badge Styling */
        .payment-badge {
          background: ${colors?.primary};
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .status-badge {
          background: #10B981;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        /* Print Optimization */
        @media print { 
          body { 
            margin: 0; 
            box-shadow: none; 
          }
          .payment-breakdown-watermark { 
            position: absolute; 
          }
          .section {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${branding?.letterheadUrl ? `
      <div class="letterhead">
        <img src="${branding?.letterheadUrl}" alt="School Letterhead" />
      </div>
      ` : ''}
      
      <!-- Header Section -->
      <div class="header">
        ${branding?.logoUrl ? `
        <img src="${branding?.logoUrl}" alt="School Logo" class="school-logo" />
        ` : ''}
        <h1 class="school-info">${receiptData?.school?.name}</h1>
        <div class="school-info">
          <p>${receiptData?.school?.address}</p>
          <p>Phone: ${receiptData?.school?.phone} | Email: ${receiptData?.school?.email}</p>
        </div>
        <h2 class="receipt-title">PAYMENT RECEIPT</h2>
        <div class="receipt-number">Receipt #: ${receiptData?.receiptId}</div>
      </div>
      
      <!-- Student Information -->
      <div class="section">
        <h3>Student Information</h3>
        <div class="info-grid">
          <div>
            <div class="info-item">
              <span class="info-label">Student Name:</span>
              <span class="info-value">${receiptData?.student?.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Student ID:</span>
              <span class="info-value">${receiptData?.student?.id || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Class:</span>
              <span class="info-value">${receiptData?.student?.class || 'N/A'}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Parent/Guardian:</span>
              <span class="info-value">${receiptData?.student?.parentName || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Parent Phone:</span>
              <span class="info-value">${receiptData?.student?.parentPhone || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Parent Email:</span>
              <span class="info-value">${receiptData?.student?.parentEmail || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice & Academic Information -->
      <div class="section">
        <h3>Invoice & Academic Information</h3>
        <div class="info-grid">
          <div>
            <div class="info-item">
              <span class="info-label">Invoice Number:</span>
              <span class="info-value">${receiptData?.invoice?.invoiceNumber}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Issue Date:</span>
              <span class="info-value">${receiptData?.invoice?.issueDate ? formatDate(receiptData?.invoice?.issueDate) : 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Due Date:</span>
              <span class="info-value">${receiptData?.invoice?.dueDate ? formatDate(receiptData?.invoice?.dueDate) : 'N/A'}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Academic Term:</span>
              <span class="info-value">${receiptData?.invoice?.term || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Session:</span>
              <span class="info-value">${receiptData?.invoice?.session || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Type:</span>
              <span class="payment-badge">${getPaymentTypeLabel(receiptData?.payment?.type)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Details -->
      <div class="section">
        <h3>Payment Details</h3>
        <div class="info-grid">
          <div>
            <div class="info-item">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${receiptData?.payment?.method?.replace('_', ' ')?.toUpperCase()}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Reference:</span>
              <span class="info-value">${receiptData?.payment?.reference}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Transaction ID:</span>
              <span class="info-value">${receiptData?.payment?.transactionId || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Date:</span>
              <span class="info-value">${formatDate(receiptData?.payment?.date)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Payment Breakdown with improved watermark positioning -->
      <div 
        className="rounded-lg p-5 mb-6 border-l-4 relative overflow-hidden"
        style={{ 
          backgroundColor: branding?.brandingEnabled ? colors?.accent : undefined,
          borderLeftColor: branding?.brandingEnabled ? colors?.primary : undefined
        }}
      >
        {/* Watermark positioned specifically in payment breakdown area */}
        {branding?.brandingEnabled && branding?.watermarkUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="opacity-[0.08] transform rotate-12">
              <Image 
                src={branding?.watermarkUrl}
                alt="School Watermark"
                className="w-80 h-80 object-contain"
              />
            </div>
          </div>
        )}

        <h3 
          className="font-semibold text-lg flex items-center space-x-2 mb-4 relative z-10"
          style={{ 
            color: branding?.brandingEnabled ? colors?.text : undefined 
          }}
        >
          <Icon name="Receipt" size={18} />
          <span>Payment Breakdown</span>
        </h3>
        
        {/* Items Table */}
        <div className="overflow-x-auto relative z-10 bg-white/90 rounded-lg shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr 
                className="text-left text-sm"
                style={{
                  backgroundColor: branding?.brandingEnabled ? colors?.primary : undefined,
                  color: branding?.brandingEnabled ? 'white' : undefined
                }}
              >
                <th className="p-3 font-semibold">Item Category</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Qty</th>
                <th className="p-3 font-semibold">Amount (₦)</th>
                <th className="p-3 font-semibold">Total (₦)</th>
              </tr>
            </thead>
            <tbody>
              {receiptData?.breakdown?.items?.map((item, index) => (
                <tr key={index} className="border-b border-border/30 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 font-medium">{item?.itemCategory || item?.description}</td>
                  <td className="p-3 text-sm">{item?.type || 'Standard'}</td>
                  <td className="p-3 text-sm">{item?.quantity || 1}</td>
                  <td className="p-3 text-sm">{formatAmount(item?.unitAmount || item?.amount)}</td>
                  <td className="p-3 font-medium">{formatAmount(item?.totalAmount || item?.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <!-- Enhanced Financial Summary -->
        <div 
          className="mt-6 p-4 rounded-lg relative z-10 shadow-sm"
          style={{ 
            backgroundColor: branding?.brandingEnabled ? colors?.primary : undefined,
            color: branding?.brandingEnabled ? 'white' : undefined
          }}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center text-lg">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatAmount(receiptData?.financialSummary?.subtotal || receiptData?.breakdown?.subtotal || receiptData?.payment?.amount)}</span>
            </div>
            
            {receiptData?.financialSummary?.totalDiscount > 0 && (
              <div className="flex justify-between items-center">
                <span>Total Discount:</span>
                <span className="text-green-300">-{formatAmount(receiptData?.financialSummary?.totalDiscount)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span>Total Issued:</span>
              <span>{formatAmount(receiptData?.financialSummary?.totalIssued || receiptData?.payment?.amount)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Total Payable:</span>
              <span>{formatAmount(receiptData?.financialSummary?.totalPayable || receiptData?.payment?.amount)}</span>
            </div>
            
            {receiptData?.financialSummary?.totalOutstanding > 0 && (
              <div className="flex justify-between items-center text-yellow-300">
                <span>Total Outstanding:</span>
                <span>{formatAmount(receiptData?.financialSummary?.totalOutstanding)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-white/20">
              <span>Total Paid:</span>
              <span>{formatAmount(receiptData?.financialSummary?.totalPaid || receiptData?.payment?.amount)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Code Section - FIXED: Larger QR code -->
      ${qrCodeDataUrl ? `
      <div class="section">
        <h3>QR Code Verification</h3>
        <div class="qr-section">
          <div class="qr-info">
            <h4>Scan to Verify Receipt</h4>
            <p>Use this QR code to verify the authenticity of this receipt. Scan with any QR code reader 
              to access receipt verification details.</p>
            <p><strong>Receipt ID:</strong> ${receiptData?.receiptId}</p>
          </div>
          <div class="qr-code">
            <img src="${qrCodeDataUrl}" alt="Receipt QR Code" />
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Enhanced Footer with improved branding support -->
      <div class="footer">
        <h3>Thank you for your payment!</h3>
        <p>This receipt is electronically generated and digitally authorized by {receiptData?.school?.name}.</p>
        <div class="signature-section">
          <div>
            <p><strong>Issued by:</strong> {receiptData?.school?.name || 'EduFinance System'}</p>
            <p><strong>Generated:</strong> ${formatDate(new Date()?.toISOString())}</p>
            {branding?.brandingEnabled && (
              <p className="text-xs mt-1" style={{ color: colors?.primary }}>
                <Icon name="Palette" size={12} className="inline mr-1" />
                Custom Branded Receipt
              </p>
            )}
          </div>
          <div class="edufinance-branding">
            <p style="color: #081C48; font-weight: bold;">©2025 Astroidegita Technologies LTD (RC 8354011).</p>
            <p style="color: #081C48;">If you have any questions or complaints about this transaction,</p>
            <p style="color: #081C48;">please contact our support team at <strong>support@skupadi.com</strong></p>
          </div>
        </div>
        ${branding?.brandingEnabled ? `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0,0,0,0.1);">
          <p style="font-size: 12px; color: ${colors?.primary};">
            <strong>✨ Custom Branded Receipt</strong> - Configured for ${receiptData?.school?.name}
          </p>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
    `;
  };

  if (!receipt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Receipt" size={20} className="text-primary" />
              <span>EduFinance Payment Receipt</span>
            </h2>
            <p className="text-sm text-muted-foreground">Receipt #{receiptData?.receiptId}</p>
            <div className="flex items-center space-x-4 mt-1">
              {branding?.brandingEnabled && (
                <div className="flex items-center space-x-1">
                  <Icon name="Palette" size={12} className="text-primary" />
                  <span className="text-xs text-primary">Custom Branded</span>
                </div>
              )}
              {qrCodeDataUrl && (
                <div className="flex items-center space-x-1">
                  <Icon name="QrCode" size={12} className="text-success" />
                  <span className="text-xs text-success">QR Verified</span>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Enhanced Receipt Content */}
        <div className="p-6 relative" ref={receiptRef}>
          {/* Letterhead */}
          {branding?.brandingEnabled && branding?.letterheadUrl && (
            <div className="text-center mb-6 relative z-10">
              <Image 
                src={branding?.letterheadUrl}
                alt="School Letterhead"
                className="w-full h-24 object-contain mx-auto rounded-lg border border-border/50"
              />
            </div>
          )}

          {/* Enhanced School Header */}
          <div 
            className="text-center border-b-2 pb-6 mb-6 relative z-10 rounded-lg p-6"
            style={{ 
              borderBottomColor: branding?.brandingEnabled ? colors?.primary : undefined,
              background: branding?.brandingEnabled ? colors?.gradient : undefined
            }}
          >
            {/* School Logo */}
            {branding?.brandingEnabled && branding?.logoUrl && (
              <div className="mb-4">
                <Image 
                  src={branding?.logoUrl}
                  alt="School Logo"
                  className="w-20 h-20 object-contain mx-auto rounded-xl border-2 border-border shadow-sm"
                />
              </div>
            )}

            <h1 
              className="text-3xl font-bold mb-3"
              style={{ 
                color: branding?.brandingEnabled ? colors?.primary : undefined 
              }}
            >
              {receiptData?.school?.name}
            </h1>
            <p className="text-muted-foreground mb-2 text-lg">{receiptData?.school?.address}</p>
            <p className="text-muted-foreground">
              Phone: {receiptData?.school?.phone} | Email: {receiptData?.school?.email}
            </p>
            <h2 
              className="text-xl font-semibold mt-4 mb-2"
              style={{ 
                color: branding?.brandingEnabled ? colors?.text : undefined 
              }}
            >
              PAYMENT RECEIPT
            </h2>
            <div className="flex items-center justify-center space-x-4">
              <span 
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: branding?.brandingEnabled ? colors?.primary : undefined,
                  color: branding?.brandingEnabled ? 'white' : undefined
                }}
              >
                Receipt #{receiptData?.receiptId}
              </span>
              {getPaymentTypeBadge(receiptData?.payment?.type)}
            </div>
          </div>

          {/* Enhanced Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 relative z-10">
            {/* Student Information */}
            <div 
              className="rounded-lg p-5 border-l-4 space-y-4"
              style={{ 
                backgroundColor: branding?.brandingEnabled ? colors?.accent : undefined,
                borderLeftColor: branding?.brandingEnabled ? colors?.primary : undefined
              }}
            >
              <h3 
                className="font-semibold text-lg flex items-center space-x-2"
                style={{ 
                  color: branding?.brandingEnabled ? colors?.text : undefined 
                }}
              >
                <Icon name="User" size={18} />
                <span>Student Information</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Student Name:</span>
                  <span className="font-medium text-foreground">{receiptData?.student?.name}</span>
                </div>
                {receiptData?.student?.id && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Student ID:</span>
                    <span className="text-foreground">{receiptData?.student?.id}</span>
                  </div>
                )}
                {receiptData?.student?.class && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Class:</span>
                    <span className="text-foreground">{receiptData?.student?.class}</span>
                  </div>
                )}
                {receiptData?.student?.admissionNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Admission Number:</span>
                    <span className="text-foreground">{receiptData?.student?.admissionNumber}</span>
                  </div>
                )}
              </div>
              
              {/* Parent/Guardian Information */}
              {receiptData?.student?.parentName && (
                <div className="pt-3 mt-3 border-t border-border/50">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Parent/Guardian Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-foreground">{receiptData?.student?.parentName}</span>
                    </div>
                    {receiptData?.student?.parentPhone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="text-foreground">{receiptData?.student?.parentPhone}</span>
                      </div>
                    )}
                    {receiptData?.student?.parentEmail && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground text-xs">{receiptData?.student?.parentEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Invoice & Academic Information */}
            <div 
              className="rounded-lg p-5 border-l-4"
              style={{ 
                backgroundColor: branding?.brandingEnabled ? colors?.accent : undefined,
                borderLeftColor: branding?.brandingEnabled ? colors?.primary : undefined
              }}
            >
              <h3 
                className="font-semibold text-lg flex items-center space-x-2 mb-4"
                style={{ 
                  color: branding?.brandingEnabled ? colors?.text : undefined 
                }}
              >
                <Icon name="FileText" size={18} />
                <span>Invoice & Academic Info</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Invoice Number:</span>
                  <span className="font-medium text-foreground">{receiptData?.invoice?.invoiceNumber}</span>
                </div>
                {receiptData?.invoice?.issueDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="text-foreground">{formatDate(receiptData?.invoice?.issueDate)}</span>
                  </div>
                )}
                {receiptData?.invoice?.dueDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="text-foreground">{formatDate(receiptData?.invoice?.dueDate)}</span>
                  </div>
                )}
                {receiptData?.invoice?.term && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Term:</span>
                    <span 
                      className="px-2 py-1 rounded text-sm font-medium"
                      style={{
                        backgroundColor: branding?.brandingEnabled ? colors?.primary + '20' : undefined,
                        color: branding?.brandingEnabled ? colors?.primary : undefined
                      }}
                    >
                      {receiptData?.invoice?.term}
                    </span>
                  </div>
                )}
                {receiptData?.invoice?.session && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Session:</span>
                    <span className="text-foreground font-medium">{receiptData?.invoice?.session}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div 
            className="rounded-lg p-5 mb-6 border-l-4"
            style={{ 
              backgroundColor: branding?.brandingEnabled ? colors?.accent : undefined,
              borderLeftColor: branding?.brandingEnabled ? colors?.primary : undefined
            }}
          >
            <h3 
              className="font-semibold text-lg flex items-center space-x-2 mb-4"
              style={{ 
                color: branding?.brandingEnabled ? colors?.text : undefined 
              }}
            >
              <Icon name="CreditCard" size={18} />
              <span>Payment Details</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-sm">Payment Method:</span>
                <span className="text-foreground font-medium capitalize">
                  {receiptData?.payment?.method?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-sm">Reference:</span>
                <span className="font-mono text-sm text-foreground">{receiptData?.payment?.reference}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-sm">Payment Date:</span>
                <span className="text-foreground">{formatDate(receiptData?.payment?.date)}</span>
              </div>
              {receiptData?.payment?.transactionId && (
                <div className="flex flex-col space-y-1 col-span-full">
                  <span className="text-muted-foreground text-sm">Transaction ID:</span>
                  <span className="font-mono text-sm text-foreground">{receiptData?.payment?.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Section - FIXED: Larger QR code */}
          {qrCodeDataUrl && (
            <div 
              className="rounded-lg p-5 mb-6 border-l-4"
              style={{ 
                backgroundColor: branding?.brandingEnabled ? colors?.accent : undefined,
                borderLeftColor: branding?.brandingEnabled ? colors?.primary : undefined
              }}
            >
              <h3 
                className="font-semibold text-lg flex items-center space-x-2 mb-4"
                style={{ 
                  color: branding?.brandingEnabled ? colors?.text : undefined 
                }}
              >
                <Icon name="QrCode" size={18} />
                <span>QR Code Verification</span>
              </h3>
              <div className="flex items-center space-x-6">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Scan to Verify Receipt</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Use this QR code to verify the authenticity of this receipt. Scan with any QR code reader 
                    to access receipt verification details.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Receipt ID:</strong> {receiptData?.receiptId}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Image 
                    src={qrCodeDataUrl}
                    alt="Receipt QR Code"
                    className="w-36 h-36 border-2 border-border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Footer with improved branding support */}
          <div 
            className="text-center text-sm border-t pt-6 relative z-10"
            style={{ 
              borderTopColor: branding?.brandingEnabled ? colors?.primary : undefined,
              color: branding?.brandingEnabled ? colors?.text : undefined
            }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Thank you for your payment!</h3>
              <p>This receipt is electronically generated and digitally authorized by {receiptData?.school?.name}.</p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="text-left">
                <p><strong>Issued by:</strong> {receiptData?.school?.name || 'EduFinance System'}</p>
                <p><strong>Generated:</strong> {formatDate(new Date()?.toISOString())}</p>
                {branding?.brandingEnabled && (
                  <p className="text-xs mt-1" style={{ color: colors?.primary }}>
                    <Icon name="Palette" size={12} className="inline mr-1" />
                    Custom Branded Receipt
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <div 
                  className="flex items-center space-x-2 font-semibold"
                  style={{ color: '#081C48' }}
                >
                  <Icon name="Building2" size={16} />
                  <span>Astroidegita Technologies</span>
                </div>
                <p className="text-xs" style={{ color: '#081C48' }}>
                  ©2025 Astroidegita Technologies LTD (RC 8354011)
                </p>
                <p className="text-xs" style={{ color: '#081C48' }}>
                  Questions? Contact: <strong>support@skupadi.com</strong>
                </p>
              </div>
            </div>
            
            {branding?.brandingEnabled && (
              <div 
                className="mt-4 pt-4 border-t border-border/50 rounded-lg p-3"
                style={{ 
                  backgroundColor: colors?.accent 
                }}
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Icon name="Sparkles" size={14} className="text-primary" />
                  <span className="text-sm font-medium" style={{ color: colors?.primary }}>
                    School Branded Receipt Template
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Template:</span>
                    <span className="ml-1 capitalize">{branding?.template}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Color Scheme:</span>
                    <span className="ml-1 capitalize">{branding?.colorScheme}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Receipt customized for {receiptData?.school?.name} with personalized branding elements
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Actions Footer with branding status */}
        <div className="border-t border-border p-6 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span>Status:</span>
                <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
                  Generated
                </span>
              </div>
              {branding?.brandingEnabled && (
                <div className="flex items-center space-x-1">
                  <Icon name="Palette" size={12} className="text-primary" />
                  <span className="text-primary text-xs font-medium">School Branded</span>
                </div>
              )}
              {qrCodeDataUrl && (
                <div className="flex items-center space-x-1">
                  <Icon name="QrCode" size={12} className="text-success" />
                  <span className="text-success text-xs font-medium">QR Verified</span>
                </div>
              )}
              {branding?.template && branding?.template !== 'standard' && (
                <div className="flex items-center space-x-1">
                  <Icon name="Layout" size={12} className="text-info" />
                  <span className="text-info text-xs font-medium capitalize">{branding?.template} Template</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                iconName={isDownloading ? "Loader2" : "Download"}
                iconSize={14}
                className="flex items-center space-x-2"
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrint}
                disabled={isPrinting}
                iconName={isPrinting ? "Loader2" : "Printer"}
                iconSize={14}
                className="flex items-center space-x-2"
              >
                {isPrinting ? 'Printing...' : 'Print'}
              </Button>
              
              <Button variant="default" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
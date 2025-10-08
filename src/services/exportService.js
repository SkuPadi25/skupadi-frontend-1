import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { saveAs } from 'file-saver/dist/FileSaver';
import pdfGenerationService from './pdfGenerationService';

/**
 * Professional Export Service for Skupadi School Management System
 * Handles PDF, Excel, and CSV exports with clean data formatting
 */
class ExportService {
  constructor() {
    this.defaultConfig = {
      filename: 'export',
      dateFormat: 'YYYY-MM-DD',
      currency: 'NGN',
      includeTimestamp: true
    };
  }

  /**
   * Format currency for export
   */
  formatCurrency(amount, format = 'NGN') {
    const numericAmount = Number(amount) || 0;
    
    if (format === 'NGN') {
      return `₦${numericAmount?.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    
    return numericAmount?.toLocaleString('en-US', {
      style: 'currency',
      currency: format,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /**
   * Format date for export
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  }

  /**
   * Generate filename with timestamp
   */
  generateFilename(baseName, extension, includeTimestamp = true) {
    const timestamp = includeTimestamp ? 
      new Date()?.toISOString()?.slice(0, 19)?.replace(/[:.]/g, '-') : '';
    const timestampSuffix = includeTimestamp ? `_${timestamp}` : '';
    return `${baseName}${timestampSuffix}.${extension}`;
  }

  /**
   * Prepare regular invoice data for export
   */
  prepareRegularInvoicesData(invoices) {
    return invoices?.map(invoice => ({
      'Invoice Number': invoice?.id || 'N/A',
      'Student Name': invoice?.studentName || 'N/A',
      'Student ID': invoice?.studentId || 'N/A',
      'Class': invoice?.class || 'N/A',
      'Amount': this.formatCurrency(invoice?.amount),
      'Issue Date': this.formatDate(invoice?.issueDate),
      'Due Date': this.formatDate(invoice?.dueDate),
      'Payment Date': this.formatDate(invoice?.paymentDate),
      'Status': invoice?.status ? invoice?.status?.charAt(0)?.toUpperCase() + invoice?.status?.slice(1) : 'N/A',
      'Days Overdue': invoice?.status === 'overdue' ? 
        Math.ceil((new Date() - new Date(invoice?.dueDate)) / (1000 * 60 * 60 * 24)) : 0
    }));
  }

  /**
   * Prepare special invoice data for export
   */
  prepareSpecialInvoicesData(invoices) {
    return invoices?.map(invoice => ({
      'Invoice Number': invoice?.invoice_number || 'N/A',
      'Student Name': `${invoice?.student?.first_name || ''} ${invoice?.student?.last_name || ''}`?.trim() || 'N/A',
      'Student ID': invoice?.student?.student_id || 'N/A',
      'Class': invoice?.student?.class?.name || 'N/A',
      'Subclass': invoice?.student?.subclass?.name || 'N/A',
      'Service Type': invoice?.service_type || 'N/A',
      'Term': invoice?.term || 'N/A',
      'Amount': this.formatCurrency(invoice?.amount),
      'Due Date': this.formatDate(invoice?.due_date),
      'Payment Date': this.formatDate(invoice?.payment_date),
      'Status': invoice?.status ? invoice?.status?.charAt(0)?.toUpperCase() + invoice?.status?.slice(1) : 'N/A',
      'Created Date': this.formatDate(invoice?.created_at)
    }));
  }

  /**
   * Export to Excel format
   */
  async exportToExcel(data, options = {}) {
    try {
      const config = { ...this.defaultConfig, ...options };
      const filename = this.generateFilename(config?.filename || 'export', 'xlsx', config?.includeTimestamp);

      // Create workbook and worksheet
      const workbook = XLSX?.utils?.book_new();
      const worksheet = XLSX?.utils?.json_to_sheet(data);

      // Auto-size columns
      const range = XLSX?.utils?.decode_range(worksheet?.['!ref'] || 'A1');
      const columnWidths = [];
      
      for (let col = range?.s?.col; col <= range?.e?.col; col++) {
        let maxWidth = 10; // Minimum width
        for (let row = range?.s?.row; row <= range?.e?.row; row++) {
          const cellAddress = XLSX?.utils?.encode_cell({ r: row, c: col });
          const cell = worksheet?.[cellAddress];
          if (cell?.v) {
            const cellLength = cell?.v?.toString()?.length;
            maxWidth = Math.max(maxWidth, cellLength + 2);
          }
        }
        columnWidths?.push({ width: Math.min(maxWidth, 50) }); // Max width of 50
      }
      
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX?.utils?.book_append_sheet(workbook, worksheet, 'Invoices');

      // Generate binary string and save
      const excelBuffer = XLSX?.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);

      return {
        success: true,
        filename,
        recordCount: data?.length
      };
    } catch (error) {
      console.error('Excel export error:', error);
      return {
        success: false,
        error: error?.message
      };
    }
  }

  /**
   * Export to CSV format
   */
  async exportToCSV(data, options = {}) {
    try {
      const config = { ...this.defaultConfig, ...options };
      const filename = this.generateFilename(config?.filename || 'export', 'csv', config?.includeTimestamp);

      // Convert to CSV using PapaParse
      const csv = Papa?.unparse(data, {
        header: true,
        delimiter: ',',
        quotes: true,
        quoteChar: '"',
        escapeChar: '"',
        skipEmptyLines: true
      });

      // Create and save blob
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, filename);

      return {
        success: true,
        filename,
        recordCount: data?.length
      };
    } catch (error) {
      console.error('CSV export error:', error);
      return {
        success: false,
        error: error?.message
      };
    }
  }

  /**
   * Export to PDF format (bulk invoices)
   */
  async exportToPDF(invoices, options = {}) {
    try {
      const config = { ...this.defaultConfig, ...options };
      
      if (config?.type === 'summary') {
        // Generate PDF summary report
        return await this.exportPDFSummary(invoices, config);
      } else {
        // Generate individual invoice PDFs
        const result = await pdfGenerationService?.generateBulkInvoicePDFs(invoices, {
          download: true
        });

        return {
          success: result?.success,
          filename: `Bulk_Invoices_${this.generateFilename('', 'zip', true)?.replace('.zip', '')}`,
          recordCount: result?.successCount,
          errors: result?.errors
        };
      }
    } catch (error) {
      console.error('PDF export error:', error);
      return {
        success: false,
        error: error?.message
      };
    }
  }

  /**
   * Export PDF summary report
   */
  async exportPDFSummary(invoices, options = {}) {
    try {
      // This would integrate with the PDF service to create a summary report
      // For now, return success with placeholder
      const filename = this.generateFilename('Invoice_Summary', 'pdf', options?.includeTimestamp);
      
      console.log('PDF Summary export - not yet implemented');
      
      return {
        success: true,
        filename,
        recordCount: invoices?.length,
        note: 'PDF summary report generation coming soon'
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message
      };
    }
  }

  /**
   * Export comprehensive report summary as PDF
   */
  async exportReportSummaryToPDF(reportsData, options = {}) {
    try {
      const config = { ...this.defaultConfig, ...options };
      const filename = this.generateFilename(config?.filename || 'Report_Summary', 'pdf', config?.includeTimestamp);

      // Use PDF generation service to create summary report
      const summaryData = {
        title: config?.reportTitle || 'Reports Summary',
        generatedDate: new Date()?.toLocaleDateString('en-GB'),
        financialReports: reportsData?.financial || [],
        analyticsReports: reportsData?.analytics || []
      };

      const result = await pdfGenerationService?.generateReportSummaryPDF(summaryData, {
        filename: filename?.replace('.pdf', ''),
        download: true
      });

      return {
        success: result?.success,
        filename,
        recordCount: (reportsData?.financial?.length || 0) + (reportsData?.analytics?.length || 0),
        error: result?.error
      };
    } catch (error) {
      console.error('PDF report summary export error:', error);
      return {
        success: false,
        error: error?.message
      };
    }
  }

  /**
   * Export regular invoices with format selection
   */
  async exportRegularInvoices(invoices, format, options = {}) {
    try {
      const data = this.prepareRegularInvoicesData(invoices);
      const baseFilename = options?.filename || 'Regular_Invoices';

      switch (format?.toLowerCase()) {
        case 'excel':
          return await this.exportToExcel(data, { ...options, filename: baseFilename });
        case 'csv':
          return await this.exportToCSV(data, { ...options, filename: baseFilename });
        case 'pdf':
          return await this.exportToPDF(invoices, { ...options, filename: baseFilename });
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Regular invoices export error:', error);
      return {
        success: false,
        error: error?.message
      };
    }
  }

  /**
   * Export special invoices with format selection
   */
  async exportSpecialInvoices(invoices, format, options = {}) {
    try {
      const data = this.prepareSpecialInvoicesData(invoices);
      const baseFilename = options?.filename || 'Special_Invoices';

      switch (format?.toLowerCase()) {
        case 'excel':
          return await this.exportToExcel(data, { ...options, filename: baseFilename });
        case 'csv':
          return await this.exportToCSV(data, { ...options, filename: baseFilename });
        case 'pdf':
          return await this.exportToPDF(invoices, { ...options, filename: baseFilename });
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Special invoices export error:', error);
      return {
        success: false,
        error: error?.message
      };
    }
  }

  /**
   * Get export capabilities and supported formats
   */
  getCapabilities() {
    return {
      formats: ['excel', 'csv', 'pdf'],
      features: {
        autoColumnSizing: true,
        currencyFormatting: true,
        dateFormatting: true,
        timestampedFilenames: true,
        bulkExport: true,
        customFilenames: true,
        reportSummaries: true
      },
      limits: {
        maxRecords: 50000,
        maxFileSize: '100MB'
      }
    };
  }
}

// Create and export singleton instance
const exportService = new ExportService();
export default exportService;
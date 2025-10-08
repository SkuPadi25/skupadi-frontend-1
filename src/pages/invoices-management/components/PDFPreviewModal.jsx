import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import pdfGenerationService from '../../../services/pdfGenerationService';

const PDFPreviewModal = ({ invoice, isOpen = true, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState('');

  useEffect(() => {
    if (isOpen && invoice) {
      generatePreview();
    }
  }, [isOpen, invoice]);

  const generatePreview = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const pdfDataUrl = await pdfGenerationService?.previewInvoicePDF(invoice);
      setPdfUrl(pdfDataUrl);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      setError(error?.message || 'Failed to generate PDF preview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloadStatus('downloading');
    
    try {
      const result = await pdfGenerationService?.downloadInvoicePDF(invoice);
      
      if (result?.success) {
        setDownloadStatus('success');
        setTimeout(() => setDownloadStatus(''), 2000);
        
        // Show browser notification if available
        if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
          new Notification('Invoice Downloaded', {
            body: `Invoice ${invoice?.id} downloaded successfully`,
            icon: '/favicon.ico'
          });
        }
      } else {
        throw new Error(result?.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      // Create a temporary iframe to print the PDF
      const iframe = document?.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrl;
      document?.body?.appendChild(iframe);
      
      iframe.onload = () => {
        iframe?.contentWindow?.print();
        setTimeout(() => {
          document?.body?.removeChild(iframe);
        }, 1000);
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <Icon name="FileText" size={20} className="text-primary" />
              <span>Invoice Preview</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {invoice?.id} - {invoice?.studentName} - {invoice?.class}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Download Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={downloadStatus === 'downloading' || isLoading}
              iconName={
                downloadStatus === 'downloading' ? 'Loader2' : 
                downloadStatus === 'success' ? 'CheckCircle' : 
                downloadStatus === 'error' ? 'AlertCircle' : 'Download'
              } 
              iconSize={16}
              className={
                downloadStatus === 'downloading' ? 'animate-spin' : 
                downloadStatus === 'success' ? 'text-green-600' : 
                downloadStatus === 'error' ? 'text-red-600' : ''
              }
            >
              {downloadStatus === 'downloading' ? 'Downloading...' : 
               downloadStatus === 'success' ? 'Downloaded' : 
               downloadStatus === 'error' ? 'Failed' : 'Download'}
            </Button>
            
            {/* Print Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              disabled={isLoading || !pdfUrl}
              iconName="Printer" 
              iconSize={16}
            >
              Print
            </Button>
            
            {/* Close Button */}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Generating PDF Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Creating professional invoice with school branding...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <Icon name="AlertTriangle" size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Preview Error</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={generatePreview} variant="outline" iconName="RefreshCw" iconSize={16}>
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && pdfUrl && (
            <div className="h-full">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title={`Invoice Preview - ${invoice?.id}`}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={14} />
                <span>Generated: {new Date()?.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={14} />
                <span>Amount: {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })?.format(invoice?.amount)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={14} />
                <span>Due: {new Date(invoice?.dueDate)?.toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="Shield" size={12} />
                <span>Digitally Generated</span>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1 text-xs" style={{ color: '#081C48' }}>
                  <Icon name="Building2" size={12} />
                  <span className="font-medium">Astroidegita Technologies LTD</span>
                </div>
                <p className="text-xs mt-1" style={{ color: '#081C48' }}>
                  ©2025 Astroidegita Technologies LTD (RC 8354011).
                </p>
                <p className="text-xs" style={{ color: '#081C48' }}>
                  If you have any questions or complaints about this transaction, please contact our support team at{' '}
                  <span className="font-medium">support@skupadi.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
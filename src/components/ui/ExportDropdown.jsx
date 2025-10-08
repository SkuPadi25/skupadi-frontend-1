import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { Download, FileText, Table, FileSpreadsheet, ChevronDown } from 'lucide-react';

/**
 * Clean, user-friendly export dropdown component
 * Provides PDF, Excel, and CSV export options with elegant UI
 */
const ExportDropdown = ({
  onExport,
  isLoading = false,
  variant = "outline",
  size = "default",
  className = "",
  disabled = false,
  recordCount = 0,
  exportTitle = "Export All"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document?.addEventListener('mousedown', handleClickOutside);
    return () => document?.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportFormats = [
    {
      id: 'pdf',
      label: 'PDF',
      description: 'Individual invoice PDFs',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      borderColor: 'border-red-200'
    },
    {
      id: 'excel',
      label: 'Excel',
      description: 'Spreadsheet format (.xlsx)',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      id: 'csv',
      label: 'CSV',
      description: 'Comma-separated values',
      icon: Table,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200'
    }
  ];

  const handleExportClick = async (format) => {
    if (disabled || loadingFormat) return;

    setLoadingFormat(format?.id);
    setIsOpen(false);

    try {
      await onExport?.(format?.id);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setLoadingFormat(null);
    }
  };

  const handleToggleDropdown = () => {
    if (!disabled && !loadingFormat) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Main Export Button */}
      <Button
        variant={variant}
        size={size}
        onClick={handleToggleDropdown}
        disabled={disabled || loadingFormat}
        className="flex items-center space-x-2"
      >
        <Download size={16} />
        <span>{exportTitle}</span>
        {recordCount > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {recordCount}
          </span>
        )}
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30">
            <h4 className="text-sm font-medium text-foreground">Export Options</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Choose your preferred format
              {recordCount > 0 && ` (${recordCount} records)`}
            </p>
          </div>
          
          <div className="py-1">
            {exportFormats?.map((format) => {
              const IconComponent = format?.icon;
              const isFormatLoading = loadingFormat === format?.id;
              
              return (
                <button
                  key={format?.id}
                  onClick={() => handleExportClick(format)}
                  disabled={disabled || loadingFormat}
                  className={`
                    w-full px-4 py-3 text-left transition-all duration-200 
                    hover:bg-muted/50 focus:bg-muted/50 focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isFormatLoading ? 'bg-muted/30' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-lg border transition-colors duration-200
                      ${format?.bgColor} ${format?.borderColor}
                    `}>
                      {isFormatLoading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <IconComponent size={16} className={format?.color} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-foreground">
                          Export as {format?.label}
                        </span>
                        {isFormatLoading && (
                          <span className="text-xs text-muted-foreground">Processing...</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format?.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              💡 Large exports may take a few moments to process
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationResults = ({ 
  results, 
  onDownloadErrors, 
  onImportValid, 
  onStartOver 
}) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [showWarningDetails, setShowWarningDetails] = useState(false);

  if (!results) return null;

  const { 
    totalRecords, 
    validRecords, 
    errorRecords, 
    warningRecords, 
    errors, 
    warnings 
  } = results;

  const hasErrors = errorRecords > 0;
  const hasWarnings = warningRecords > 0;
  const canImport = validRecords > 0;

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${hasErrors ? 'bg-error' : 'bg-success'}
          `}>
            <Icon 
              name={hasErrors ? 'AlertCircle' : 'CheckCircle'} 
              size={20} 
              color="white" 
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Validation {hasErrors ? 'Issues Found' : 'Complete'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Processed {totalRecords.toLocaleString()} records from your CSV file
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Check" size={20} className="text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{validRecords}</p>
                <p className="text-sm text-success/80">Valid Records</p>
              </div>
            </div>
          </div>

          {hasErrors && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name="X" size={20} className="text-error" />
                <div>
                  <p className="text-2xl font-bold text-error">{errorRecords}</p>
                  <p className="text-sm text-error/80">Errors</p>
                </div>
              </div>
            </div>
          )}

          {hasWarnings && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
                <div>
                  <p className="text-2xl font-bold text-warning">{warningRecords}</p>
                  <p className="text-sm text-warning/80">Warnings</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {canImport && (
            <Button
              variant="default"
              onClick={onImportValid}
              iconName="Upload"
              iconPosition="left"
            >
              Import {validRecords} Valid Records
            </Button>
          )}

          {hasErrors && (
            <Button
              variant="outline"
              onClick={onDownloadErrors}
              iconName="Download"
              iconPosition="left"
            >
              Download Error Report
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={onStartOver}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Start Over
          </Button>
        </div>
      </div>

      {/* Error Details */}
      {hasErrors && (
        <div className="bg-card rounded-lg border border-border">
          <div 
            className="flex items-center justify-between p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setShowErrorDetails(!showErrorDetails)}
          >
            <div className="flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error" />
              <h4 className="font-medium text-foreground">
                Error Details ({errorRecords} records)
              </h4>
            </div>
            <Icon 
              name={showErrorDetails ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
              className="text-muted-foreground" 
            />
          </div>

          {showErrorDetails && (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium text-foreground">Row</th>
                      <th className="text-left py-2 px-3 font-medium text-foreground">Field</th>
                      <th className="text-left py-2 px-3 font-medium text-foreground">Error</th>
                      <th className="text-left py-2 px-3 font-medium text-foreground">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.slice(0, 10).map((error, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-2 px-3 text-muted-foreground">{error.row}</td>
                        <td className="py-2 px-3 font-medium">{error.field}</td>
                        <td className="py-2 px-3 text-error">{error.message}</td>
                        <td className="py-2 px-3 text-muted-foreground font-mono text-xs">
                          {error.value || 'Empty'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {errors.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Showing first 10 errors. Download full report for complete list.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warning Details */}
      {hasWarnings && (
        <div className="bg-card rounded-lg border border-border">
          <div 
            className="flex items-center justify-between p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setShowWarningDetails(!showWarningDetails)}
          >
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
              <h4 className="font-medium text-foreground">
                Warning Details ({warningRecords} records)
              </h4>
            </div>
            <Icon 
              name={showWarningDetails ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
              className="text-muted-foreground" 
            />
          </div>

          {showWarningDetails && (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium text-foreground">Row</th>
                      <th className="text-left py-2 px-3 font-medium text-foreground">Field</th>
                      <th className="text-left py-2 px-3 font-medium text-foreground">Warning</th>
                      <th className="text-left py-2 px-3 font-medium text-foreground">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warnings.slice(0, 10).map((warning, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-2 px-3 text-muted-foreground">{warning.row}</td>
                        <td className="py-2 px-3 font-medium">{warning.field}</td>
                        <td className="py-2 px-3 text-warning">{warning.message}</td>
                        <td className="py-2 px-3 text-muted-foreground font-mono text-xs">
                          {warning.value || 'Empty'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {warnings.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Showing first 10 warnings. Download full report for complete list.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationResults;
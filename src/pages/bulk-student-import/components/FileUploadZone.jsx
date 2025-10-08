import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileSelect, selectedFile, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        onFileSelect(file);
      } else {
        alert('Please select a CSV file only.');
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : selectedFile 
              ? 'border-success bg-success/5' :'border-border bg-muted/30 hover:border-primary/50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="space-y-4">
          {selectedFile ? (
            <>
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
                <Icon name="FileCheck" size={32} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">File Selected</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="Upload" size={32} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {isDragOver ? 'Drop your CSV file here' : 'Upload Student Data'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop your CSV file here, or click to browse
                </p>
              </div>
            </>
          )}

          <Button
            variant="outline"
            onClick={handleBrowseClick}
            disabled={isProcessing}
            iconName="FolderOpen"
            iconPosition="left"
          >
            Browse Files
          </Button>
        </div>

        {/* File Requirements */}
        <div className="mt-6 p-4 bg-card rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">File Requirements:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• File format: CSV (.csv)</li>
            <li>• Maximum file size: 10 MB</li>
            <li>• Maximum records: 1,000 students</li>
            <li>• Required columns: First Name, Last Name, Gender, Class, Date of Birth, Parent Name, Parent Phone</li>
          </ul>
        </div>
      </div>

      {/* Sample Template Download */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Download" size={20} color="white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground">Download Sample Template</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Use our CSV template to ensure your data is formatted correctly for import.
            </p>
            <Button
              variant="link"
              className="mt-2 p-0 h-auto text-primary"
              iconName="ExternalLink"
              iconPosition="right"
              iconSize={14}
            >
              Download sample_students.csv
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;
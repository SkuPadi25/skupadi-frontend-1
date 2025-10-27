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
              <div className="w-24 h-24  flex items-center justify-center mx-auto">
                {/* <Icon name="Upload" size={32} color="white" /> */}
                <svg width="102" height="54" viewBox="0 0 102 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.5 53.0684C18.4682 53.0684 12.461 51.3271 7.47845 47.8445C2.49591 44.3619 0.00309091 40.1053 0 35.0749C0 30.7631 1.81591 26.9212 5.44773 23.5491C9.07955 20.177 13.8318 18.0211 19.7045 17.0814C21.6364 11.9957 25.5 7.87734 31.2955 4.7264C37.0909 1.57547 43.6591 0 51 0C60.0409 0 67.711 2.2532 74.0103 6.75959C80.3095 11.266 83.4576 16.7519 83.4545 23.2174C88.7864 23.6597 93.211 25.3048 96.7285 28.1528C100.246 31.0008 102.003 34.3308 102 38.1429C102 42.2889 99.9724 45.8135 95.9171 48.7168C91.8618 51.6201 86.9349 53.0706 81.1364 53.0684H25.5Z" fill="#0D216C"/>
<path d="M60.5663 44.2237H41.4337V26.3555H26L51 8.84473L76 26.3555H60.5663V44.2237Z" fill="white"/>
</svg>


              </div>
              <div className='py-6'>
                <h3 className="text-lg font-semibold text-foreground py-6">
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
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>File format: CSV (.csv),Maximum file size: 10 MB,Maximum records: 1,000 students</li>
            <li> Required columns: First Name, Last Name, Gender, Class, Date of Birth, Parent Name, Parent Phone</li>
          </ul>
        </div>
      </div>

      {/* Sample Template Download */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
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
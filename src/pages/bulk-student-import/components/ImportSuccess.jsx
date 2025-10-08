import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImportSuccess = ({ importResults, onStartOver }) => {
  if (!importResults) return null;

  const { 
    successCount, 
    totalProcessed, 
    importTime, 
    duplicatesSkipped = 0 
  } = importResults;

  return (
    <div className="bg-card rounded-lg border border-border p-8 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="CheckCircle" size={40} color="white" />
      </div>

      {/* Success Message */}
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Import Successful!</h2>
        <p className="text-muted-foreground">
          Your student data has been successfully imported into the system.
        </p>
      </div>

      {/* Import Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-success">{successCount}</p>
            <p className="text-sm text-success/80">Students Imported</p>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{totalProcessed}</p>
            <p className="text-sm text-primary/80">Total Processed</p>
          </div>
        </div>

        {duplicatesSkipped > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">{duplicatesSkipped}</p>
              <p className="text-sm text-warning/80">Duplicates Skipped</p>
            </div>
          </div>
        )}
      </div>

      {/* Import Details */}
      <div className="bg-muted/30 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>Import Time: {importTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} />
            <span>Date: {new Date().toLocaleDateString('en-US')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          asChild
          variant="default"
          iconName="Users"
          iconPosition="left"
        >
          <Link to="/students-management">
            View All Students
          </Link>
        </Button>

        <Button
          variant="outline"
          onClick={onStartOver}
          iconName="Plus"
          iconPosition="left"
        >
          Import More Students
        </Button>

        <Button
          asChild
          variant="ghost"
          iconName="BarChart3"
          iconPosition="left"
        >
          <Link to="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      </div>

      {/* Additional Information */}
      <div className="mt-8 p-4 bg-card border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div className="text-left">
            <h4 className="text-sm font-medium text-foreground mb-1">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All imported students are now available in the Students Management section</li>
              <li>• You can create invoices for these students immediately</li>
              <li>• Student records can be edited or updated as needed</li>
              <li>• Import history is maintained for audit purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportSuccess;
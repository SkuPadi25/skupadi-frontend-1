import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingStatus = ({ 
  isProcessing, 
  progress, 
  currentStep, 
  totalRecords 
}) => {
  const steps = [
    { id: 'reading', label: 'Reading file', icon: 'FileText' },
    { id: 'validating', label: 'Validating data', icon: 'CheckCircle' },
    { id: 'processing', label: 'Processing records', icon: 'Cog' },
    { id: 'complete', label: 'Complete', icon: 'Check' }
  ];

  if (!isProcessing) return null;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="text-center space-y-6">
        {/* Processing Icon */}
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
          <Icon name="Loader2" size={32} color="white" className="animate-spin" />
        </div>

        {/* Current Step */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">Processing Your File</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {currentStep === 'reading' && 'Reading CSV file...'}
            {currentStep === 'validating' && `Validating ${totalRecords} records...`}
            {currentStep === 'processing' && 'Processing student data...'}
            {currentStep === 'complete' && 'Processing complete!'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center space-x-8">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200
                  ${isCompleted 
                    ? 'bg-success text-white' 
                    : isActive 
                      ? 'bg-primary text-white' :'bg-muted text-muted-foreground'
                  }
                `}>
                  <Icon 
                    name={isCompleted ? 'Check' : step.icon} 
                    size={16} 
                  />
                </div>
                <span className={`
                  text-xs transition-colors duration-200
                  ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Record Count */}
        {totalRecords > 0 && (
          <div className="text-sm text-muted-foreground">
            Processing {totalRecords.toLocaleString()} student records
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatus;
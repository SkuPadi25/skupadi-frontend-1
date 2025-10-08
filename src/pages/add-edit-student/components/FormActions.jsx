import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FormActions = ({ 
  onSave, 
  onSaveAndAddAnother, 
  onCancel, 
  isLoading, 
  isEdit = false 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-border">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="sm:order-1"
      >
        <Icon name="X" size={16} className="mr-2" />
        Cancel
      </Button>

      {!isEdit && (
        <Button
          variant="secondary"
          onClick={onSaveAndAddAnother}
          loading={isLoading}
          disabled={isLoading}
          className="sm:order-2"
        >
          <Icon name="UserPlus" size={16} className="mr-2" />
          Save & Add Another
        </Button>
      )}

      <Button
        variant="default"
        onClick={onSave}
        loading={isLoading}
        disabled={isLoading}
        className="sm:order-3"
      >
        <Icon name="Save" size={16} className="mr-2" />
        {isEdit ? 'Update Student' : 'Save Student'}
      </Button>
    </div>
  );
};

export default FormActions;
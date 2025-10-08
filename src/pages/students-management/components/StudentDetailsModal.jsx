import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudentDetailsModal = ({ student, isOpen, onClose, onEdit }) => {
  if (!isOpen || !student) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { bg: 'bg-success', text: 'text-success-foreground', label: 'Paid' },
      'overdue': { bg: 'bg-error', text: 'text-error-foreground', label: 'Overdue' },
      'pending': { bg: 'bg-warning', text: 'text-warning-foreground', label: 'Pending' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today?.getFullYear() - birthDate?.getFullYear();
    const monthDiff = today?.getMonth() - birthDate?.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today?.getDate() < birthDate?.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-primary-foreground">
                  {student?.firstName?.charAt(0)}{student?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {student?.firstName} {student?.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">Student ID: {student?.studentId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {getStatusBadge(student?.feeStatus)}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
                  <Icon name="User" size={18} />
                  <span>Personal Information</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground">{student?.firstName} {student?.lastName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-foreground">{student?.gender}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-foreground">
                      {new Date(student.dateOfBirth)?.toLocaleDateString('en-US')} 
                      <span className="text-muted-foreground ml-2">
                        (Age: {calculateAge(student?.dateOfBirth)} years)
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Class</label>
                    <p className="text-foreground font-medium">{student?.class}</p>
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
                  <Icon name="Users" size={18} />
                  <span>Parent/Guardian</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Parent Name</label>
                    <p className="text-foreground">{student?.parentName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-foreground">{student?.parentPhone}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{student?.parentEmail || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground">{student?.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
                  <Icon name="GraduationCap" size={18} />
                  <span>Academic Details</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Enrollment Date</label>
                    <p className="text-foreground">
                      {new Date(student.enrollmentDate)?.toLocaleDateString('en-US')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Academic Year</label>
                    <p className="text-foreground">2024-2025</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Section</label>
                    <p className="text-foreground">A</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                    <p className="text-foreground">{student?.rollNumber || 'Not assigned'}</p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
                  <Icon name="Banknote" size={18} />
                  <span>Financial Status</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fee Status</label>
                    <div className="mt-1">
                      {getStatusBadge(student?.feeStatus)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Fees</label>
                    <p className="text-foreground font-medium">₦2,500.00</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Amount Paid</label>
                    <p className="text-foreground">
                      {student?.feeStatus === 'paid' ? '₦2,500.00' : 
                       student?.feeStatus === 'pending' ? '₦1,250.00' : '₦0.00'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Outstanding</label>
                    <p className={`font-medium ${
                      student?.feeStatus === 'paid' ? 'text-success' : 
                      student?.feeStatus === 'overdue' ? 'text-error' : 'text-warning'
                    }`}>
                      {student?.feeStatus === 'paid' ? '₦0.00' : 
                       student?.feeStatus === 'pending' ? '₦1,250.00' : '₦2,500.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={() => onEdit(student)}
              iconName="Edit"
              iconPosition="left"
              iconSize={16}
            >
              Edit Student
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetailsModal;
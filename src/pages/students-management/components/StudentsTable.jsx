import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudentsTable = ({ 
  students, 
  selectedStudents, 
  onSelectStudent, 
  onSelectAll, 
  onEditStudent, 
  onDeleteStudent, 
  onViewStudent,
  sortConfig,
  onSort 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.id);
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} />
      : <Icon name="ArrowDown" size={14} />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { bg: 'bg-success', text: 'text-success-foreground', label: 'Paid' },
      'overdue': { bg: 'bg-error', text: 'text-error-foreground', label: 'Overdue' },
      'pending': { bg: 'bg-warning', text: 'text-warning-foreground', label: 'Pending' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length && students.length > 0}
                    onChange={onSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => onSort('name')}
                    className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>Student Name</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => onSort('class')}
                    className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>Class</span>
                    {getSortIcon('class')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-foreground">Parent Contact</span>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => onSort('enrollmentDate')}
                    className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                  >
                    <span>Enrollment Date</span>
                    {getSortIcon('enrollmentDate')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-foreground">Fee Status</span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="text-sm font-medium text-foreground">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => onSelectStudent(student.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{student.class}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-foreground">{student.parentName}</p>
                      <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {new Date(student.enrollmentDate).toLocaleDateString('en-US')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(student.feeStatus)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewStudent(student)}
                        className="h-8 w-8"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditStudent(student)}
                        className="h-8 w-8"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(student)}
                        className="h-8 w-8 text-error hover:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {students.map((student) => (
          <div key={student.id} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => onSelectStudent(student.id)}
                  className="rounded border-border mt-1"
                />
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
                </div>
              </div>
              {getStatusBadge(student.feeStatus)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Class</p>
                <p className="text-foreground font-medium">{student.class}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Enrollment</p>
                <p className="text-foreground font-medium">
                  {new Date(student.enrollmentDate).toLocaleDateString('en-US')}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Parent Contact</p>
                <p className="text-foreground font-medium">{student.parentName}</p>
                <p className="text-muted-foreground text-xs">{student.parentPhone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewStudent(student)}
                iconName="Eye"
                iconPosition="left"
                iconSize={14}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStudent(student)}
                iconName="Edit"
                iconPosition="left"
                iconSize={14}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(student)}
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
                className="text-error hover:text-error"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Delete Student</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-foreground mb-6">
              Are you sure you want to delete <strong>{studentToDelete?.firstName} {studentToDelete?.lastName}</strong>? 
              This will permanently remove their record and all associated data.
            </p>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="flex-1"
              >
                Delete Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentsTable;
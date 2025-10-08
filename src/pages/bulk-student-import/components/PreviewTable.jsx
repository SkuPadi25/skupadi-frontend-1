import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreviewTable = ({ validRecords, onConfirmImport, onCancel }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  if (!validRecords || validRecords.length === 0) return null;

  const totalPages = Math.ceil(validRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = validRecords.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Preview Valid Records</h3>
              <p className="text-sm text-muted-foreground">
                Review {validRecords.length} students before importing
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              iconName="X"
              iconPosition="left"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={onConfirmImport}
              iconName="Check"
              iconPosition="left"
            >
              Confirm Import
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">
                #
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">
                First Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">
                Last Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">
                Gender
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">
                Class
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">
                Date of Birth
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">
                Parent Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground text-sm">
                Parent Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={startIndex + index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {startIndex + index + 1}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-foreground">
                  {record.firstName}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-foreground">
                  {record.lastName}
                </td>
                <td className="py-3 px-4 text-sm text-foreground">
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${record.gender === 'Male' ?'bg-blue-100 text-blue-800' :'bg-pink-100 text-pink-800'
                    }
                  `}>
                    {record.gender}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-foreground">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {record.class}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-foreground">
                  {formatDate(record.dateOfBirth)}
                </td>
                <td className="py-3 px-4 text-sm text-foreground">
                  {record.parentName}
                </td>
                <td className="py-3 px-4 text-sm text-foreground font-mono">
                  {record.parentPhone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, validRecords.length)} of {validRecords.length} records
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewTable;
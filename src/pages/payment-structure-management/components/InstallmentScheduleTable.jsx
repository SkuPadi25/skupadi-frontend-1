import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { format } from 'date-fns';

const InstallmentScheduleTable = ({ 
  paymentPlans = [], 
  loading = false, 
  onEditPlan, 
  onDeletePlan,
  onViewInstallments
}) => {
  const [expandedPlan, setExpandedPlan] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-muted text-muted-foreground',
      completed: 'bg-info/10 text-info',
      overdue: 'bg-error/10 text-error'
    };
    return colors?.[status] || colors?.inactive;
  };

  const getNextPaymentDate = (installments) => {
    if (!installments || !Array.isArray(installments)) return null;
    
    const today = new Date();
    const upcoming = installments
      ?.filter(inst => new Date(inst?.dueDate) > today && inst?.status !== 'paid')
      ?.sort((a, b) => new Date(a?.dueDate) - new Date(b?.dueDate));
    
    return upcoming?.[0]?.dueDate || null;
  };

  const calculateProgress = (installments) => {
    if (!installments || !Array.isArray(installments)) return { paid: 0, total: 0, percentage: 0 };
    
    const paidCount = installments?.filter(inst => inst?.status === 'paid')?.length || 0;
    const totalCount = installments?.length || 0;
    const percentage = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
    
    return { paid: paidCount, total: totalCount, percentage };
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 card-shadow">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading payment plans...</span>
          </div>
        </div>
      </div>
    );
  }

  if (paymentPlans?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 card-shadow">
        <div className="text-center">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Payment Plans Found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first payment plan to enable installment-based payments.
          </p>
          <Button size="sm" iconName="Plus" iconPosition="left">
            Create Payment Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border card-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground">Payment Plans & Installments</h3>
            <p className="text-sm text-muted-foreground">
              Manage installment schedules and track payment progress
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>{paymentPlans?.length} payment plans</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Plan Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Installments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Next Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {paymentPlans?.map((plan) => {
              const progress = calculateProgress(plan?.installments);
              const nextPayment = getNextPaymentDate(plan?.installments);
              
              return (
                <React.Fragment key={plan?.id}>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground flex items-center">
                          <button
                            onClick={() => setExpandedPlan(expandedPlan === plan?.id ? null : plan?.id)}
                            className="mr-2 p-1 hover:bg-muted/40 rounded"
                          >
                            <Icon 
                              name={expandedPlan === plan?.id ? "ChevronDown" : "ChevronRight"} 
                              size={14} 
                            />
                          </button>
                          {plan?.name}
                        </div>
                        {plan?.description && (
                          <div className="text-sm text-muted-foreground mt-1 ml-7">
                            {plan?.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        ₦{plan?.totalAmount?.toLocaleString()}
                      </div>
                      {plan?.downPaymentRequired && plan?.downPaymentAmount > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Down payment: ₦{plan?.downPaymentAmount?.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {plan?.numberOfInstallments} installments
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {plan?.installmentFrequency?.replace('_', ' ')} frequency
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-muted rounded-full h-2 mb-1">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress?.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {progress?.paid} of {progress?.total} paid ({progress?.percentage?.toFixed(0)}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {nextPayment ? format(new Date(nextPayment), 'MMM dd, yyyy') : 'No upcoming payments'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan?.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                          plan?.status === 'active' ? 'bg-success' : 
                          plan?.status === 'completed' ? 'bg-info' : 
                          plan?.status === 'overdue' ? 'bg-error' : 'bg-muted-foreground'
                        }`}></div>
                        {plan?.status?.charAt(0)?.toUpperCase() + plan?.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewInstallments?.(plan)}
                          iconName="Eye"
                          iconSize={14}
                          title="View Installments"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditPlan?.(plan)}
                          iconName="Edit"
                          iconSize={14}
                          title="Edit Plan"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePlan?.(plan?.id)}
                          iconName="Trash2"
                          iconSize={14}
                          className="text-error hover:text-error"
                          title="Delete Plan"
                        />
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Row - Installment Details */}
                  {expandedPlan === plan?.id && plan?.installments && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 bg-muted/10">
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground">Installment Schedule</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plan?.installments?.map((installment, index) => (
                              <div key={installment?.id} className="bg-card border border-border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-sm font-medium">
                                    {installment?.type === 'down_payment' ? 'Down Payment' : `Installment ${index}`}
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    installment?.status === 'paid' ? 'bg-success/10 text-success' :
                                    installment?.status === 'overdue'? 'bg-error/10 text-error' : 'bg-muted/20 text-muted-foreground'
                                  }`}>
                                    {installment?.status || 'Pending'}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-lg font-semibold text-foreground">
                                    ₦{installment?.amount?.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Due: {format(new Date(installment?.dueDate), 'MMM dd, yyyy')}
                                  </div>
                                  {installment?.paidDate && (
                                    <div className="text-sm text-success">
                                      Paid: {format(new Date(installment?.paidDate), 'MMM dd, yyyy')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-muted/20 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Click on plan names to expand and view installment details</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Total Plans: {paymentPlans?.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallmentScheduleTable;
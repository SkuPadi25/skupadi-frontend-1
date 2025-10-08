import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PaymentStructureTable = ({ 
  paymentStructure, 
  loading, 
  selectedClass, 
  onEditFee, 
  onDeleteFee 
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditStart = (fee) => {
    setEditingId(fee?.id);
    setEditFormData({
      name: fee?.name,
      amount: fee?.amount?.toString(),
      frequency: fee?.frequency,
      category: fee?.category,
      mandatory: fee?.mandatory,
      description: fee?.description
    });
  };

  const handleEditSave = () => {
    const updatedData = {
      ...editFormData,
      amount: parseFloat(editFormData?.amount)
    };
    
    onEditFee?.(editingId, updatedData);
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      transportation: 'bg-green-100 text-green-800',
      accommodation: 'bg-purple-100 text-purple-800',
      activities: 'bg-orange-100 text-orange-800',
      administrative: 'bg-gray-100 text-gray-800',
      other: 'bg-yellow-100 text-yellow-800'
    };
    return colors?.[category] || colors?.other;
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      one_time: 'One-time',
      termly: 'Termly',
      annually: 'Annually',
      custom: 'Custom'
    };
    return labels?.[frequency] || frequency;
  };

  const getIntegrationStatusColor = (status) => {
    return status === 'active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 card-shadow">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading payment structure...</span>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStructure?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 card-shadow">
        <div className="text-center">
          <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {selectedClass ? 'No Fee Structure Configured' : 'No Payment Structures Found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {selectedClass 
              ? 'This class doesn\'t have any fee types configured yet.'
              : 'No payment structures match your current filters.'
            }
          </p>
          {selectedClass && (
            <Button size="sm" iconName="Plus" iconPosition="left">
              Add First Fee Type
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border card-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground">Fee Structure Configuration</h3>
            <p className="text-sm text-muted-foreground">
              {selectedClass 
                ? `Manage payment categories for the selected class`
                : `Viewing ${paymentStructure?.length} fee types across all classes`
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Database" size={16} />
            <span>{paymentStructure?.length} fee types</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Fee Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount (₦)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Integration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {paymentStructure?.map((fee) => (
              <tr key={fee?.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === fee?.id ? (
                    <input
                      type="text"
                      value={editFormData?.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e?.target?.value }))}
                      className="w-full p-2 border border-border rounded text-sm"
                    />
                  ) : (
                    <div>
                      <div className="text-sm font-medium text-foreground">{fee?.name}</div>
                      {fee?.description && (
                        <div className="text-sm text-muted-foreground">{fee?.description}</div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === fee?.id ? (
                    <input
                      type="number"
                      value={editFormData?.amount}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, amount: e?.target?.value }))}
                      className="w-full p-2 border border-border rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm font-medium text-foreground">
                      ₦{fee?.amount?.toLocaleString()}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {editingId === fee?.id ? (
                    <select
                      value={editFormData?.frequency}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, frequency: e?.target?.value }))}
                      className="w-full p-2 border border-border rounded text-sm"
                    >
                      <option value="one_time">One-time</option>
                      <option value="termly">Termly</option>
                      <option value="annually">Annually</option>
                      <option value="custom">Custom</option>
                    </select>
                  ) : (
                    getFrequencyLabel(fee?.frequency)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === fee?.id ? (
                    <select
                      value={editFormData?.category}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, category: e?.target?.value }))}
                      className="w-full p-2 border border-border rounded text-sm"
                    >
                      <option value="academic">Academic</option>
                      <option value="transportation">Transportation</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="activities">Activities</option>
                      <option value="administrative">Administrative</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(fee?.category)}`}>
                      {fee?.category?.charAt(0)?.toUpperCase() + fee?.category?.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === fee?.id ? (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editFormData?.mandatory}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, mandatory: e?.target?.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Mandatory</span>
                    </label>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fee?.mandatory 
                        ? 'bg-error/10 text-error' :'bg-success/10 text-success'
                    }`}>
                      {fee?.mandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIntegrationStatusColor(fee?.integrationStatus)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        fee?.integrationStatus === 'active' ? 'bg-success' : 'bg-muted-foreground'
                      }`}></div>
                      {fee?.integrationStatus === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    {fee?.pendingInvoices > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {fee?.pendingInvoices} pending
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === fee?.id ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleEditSave}
                        iconName="Check"
                        iconSize={14}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                        iconName="X"
                        iconSize={14}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStart(fee)}
                        disabled={!selectedClass}
                        iconName="Edit"
                        iconSize={14}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteFee?.(fee?.id)}
                        disabled={!selectedClass || fee?.pendingInvoices > 0}
                        iconName="Trash2"
                        iconSize={14}
                        className="text-error hover:text-error"
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!selectedClass && (
        <div className="p-4 bg-muted/20 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Select a specific class to edit or delete fee types</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStructureTable;
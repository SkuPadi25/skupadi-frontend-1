import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RolesPermissionsManager = () => {
  const [roles, setRoles] = useState([]);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  // Define all available permissions
  const permissionCategories = {
    'User Management': [
      { id: 'users.create', label: 'Create Users', description: 'Add new users to the system' },
      { id: 'users.read', label: 'View Users', description: 'View user profiles and information' },
      { id: 'users.update', label: 'Edit Users', description: 'Modify user profiles and settings' },
      { id: 'users.delete', label: 'Delete Users', description: 'Remove users from the system' },
      { id: 'users.reset_password', label: 'Reset Passwords', description: 'Reset user passwords' }
    ],
    'Financial Management': [
      { id: 'invoices.create', label: 'Create Invoices', description: 'Generate new invoices' },
      { id: 'invoices.read', label: 'View Invoices', description: 'View invoice details and history' },
      { id: 'invoices.update', label: 'Edit Invoices', description: 'Modify invoice information' },
      { id: 'invoices.delete', label: 'Delete Invoices', description: 'Remove invoices from system' },
      { id: 'invoices.bulk_create', label: 'Bulk Invoice Creation', description: 'Create multiple invoices at once' },
      { id: 'payments.record', label: 'Record Payments', description: 'Record payment transactions' },
      { id: 'payments.view', label: 'View Payments', description: 'View payment history and details' },
      { id: 'receipts.issue', label: 'Issue Receipts', description: 'Generate payment receipts' }
    ],
    'Payment Structure': [
      { id: 'payment_structure.create', label: 'Create Payment Structures', description: 'Set up fee structures' },
      { id: 'payment_structure.read', label: 'View Payment Structures', description: 'View existing fee structures' },
      { id: 'payment_structure.update', label: 'Edit Payment Structures', description: 'Modify fee structures' },
      { id: 'payment_structure.delete', label: 'Delete Payment Structures', description: 'Remove fee structures' }
    ],
    'Student Management': [
      { id: 'students.create', label: 'Add Students', description: 'Register new students' },
      { id: 'students.read', label: 'View Students', description: 'View student profiles and information' },
      { id: 'students.update', label: 'Edit Students', description: 'Modify student information' },
      { id: 'students.delete', label: 'Delete Students', description: 'Remove students from system' },
      { id: 'students.import', label: 'Import Students', description: 'Bulk import student data' },
      { id: 'students.export', label: 'Export Students', description: 'Export student data' }
    ],
    'Reports & Analytics': [
      { id: 'reports.financial', label: 'Financial Reports', description: 'Generate financial reports' },
      { id: 'reports.student', label: 'Student Reports', description: 'Generate student reports' },
      { id: 'reports.payment_analytics', label: 'Payment Analytics', description: 'View payment analytics' },
      { id: 'reports.export', label: 'Export Reports', description: 'Export report data' }
    ],
    'System Settings': [
      { id: 'settings.school_config', label: 'School Configuration', description: 'Modify school settings' },
      { id: 'settings.system', label: 'System Settings', description: 'Configure system-wide settings' },
      { id: 'settings.integrations', label: 'Manage Integrations', description: 'Configure third-party integrations' },
      { id: 'settings.backup', label: 'Data Backup', description: 'Manage data backups' }
    ]
  };

  // Default roles with their permissions
  const defaultRoles = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      isDefault: true,
      userCount: 1,
      permissions: Object.values(permissionCategories)?.flat()?.map(p => p?.id),
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: 2,
      name: 'Finance Manager',
      description: 'Manage invoices, payments, and financial reports. Cannot delete system data.',
      isDefault: true,
      userCount: 2,
      permissions: [
        'users.read',
        'invoices.create', 'invoices.read', 'invoices.update', 'invoices.bulk_create',
        'payments.record', 'payments.view',
        'receipts.issue',
        'payment_structure.create', 'payment_structure.read', 'payment_structure.update',
        'students.read', 'students.update',
        'reports.financial', 'reports.student', 'reports.payment_analytics', 'reports.export'
      ],
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: 3,
      name: 'Bursar',
      description: 'Record payments and issue receipts. Cannot configure system settings.',
      isDefault: true,
      userCount: 2,
      permissions: [
        'users.read',
        'invoices.read',
        'payments.record', 'payments.view',
        'receipts.issue',
        'payment_structure.read',
        'students.read',
        'reports.financial', 'reports.student', 'reports.payment_analytics'
      ],
      createdAt: '2024-12-01T10:00:00Z'
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRoles(defaultRoles);
      setLoading(false);
    }, 800);
  }, []);

  const handleCreateRole = () => {
    setEditingRole(null);
    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions({});
    setShowCreateRoleModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setNewRoleName(role?.name);
    setNewRoleDescription(role?.description);
    
    // Convert permissions array to object for checkboxes
    const permissionsObj = {};
    role?.permissions?.forEach(permission => {
      permissionsObj[permission] = true;
    });
    setSelectedPermissions(permissionsObj);
    setShowCreateRoleModal(true);
  };

  const handlePermissionChange = (permissionId, checked) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [permissionId]: checked
    }));
  };

  const handleSaveRole = async () => {
    if (!newRoleName?.trim()) {
      alert('Please enter a role name');
      return;
    }

    setLoading(true);
    try {
      const selectedPerms = Object?.keys(selectedPermissions)?.filter(key => selectedPermissions?.[key]);
      
      if (editingRole) {
        // Update existing role
        const updatedRoles = roles?.map(role => 
          role?.id === editingRole?.id 
            ? { ...role, name: newRoleName, description: newRoleDescription, permissions: selectedPerms }
            : role
        );
        setRoles(updatedRoles);
        alert('Role updated successfully');
      } else {
        // Create new role
        const newRole = {
          id: Math.max(...roles?.map(r => r?.id)) + 1,
          name: newRoleName,
          description: newRoleDescription,
          isDefault: false,
          userCount: 0,
          permissions: selectedPerms,
          createdAt: new Date()?.toISOString()
        };
        setRoles([...roles, newRole]);
        alert('Role created successfully');
      }

      setShowCreateRoleModal(false);
      setEditingRole(null);
    } catch (error) {
      console?.error('Error saving role:', error);
      alert('Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    const role = roles?.find(r => r?.id === roleId);
    if (role?.isDefault) {
      alert('Cannot delete default system roles');
      return;
    }

    if (role?.userCount > 0) {
      alert('Cannot delete role that is assigned to users. Please reassign users first.');
      return;
    }

    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles?.filter(r => r?.id !== roleId));
      alert('Role deleted successfully');
    }
  };

  const getPermissionLabel = (permissionId) => {
    for (const category of Object?.values(permissionCategories)) {
      const permission = category?.find(p => p?.id === permissionId);
      if (permission) return permission?.label;
    }
    return permissionId;
  };

  if (loading && roles?.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Roles & Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Manage user roles and define what actions each role can perform
          </p>
        </div>
        <Button onClick={handleCreateRole}>
          <Icon name="Plus" size={16} className="mr-2" />
          Create Custom Role
        </Button>
      </div>
      {/* Roles Grid */}
      <div className="grid gap-6">
        {roles?.map((role) => (
          <div key={role?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-base font-semibold text-foreground">{role?.name}</h4>
                  {role?.isDefault && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      System Role
                    </span>
                  )}
                  <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                    {role?.userCount} {role?.userCount === 1 ? 'user' : 'users'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{role?.description}</p>
                
                {/* Permissions Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Permissions ({role?.permissions?.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {role?.permissions?.slice(0, 8)?.map((permission) => (
                      <span key={permission} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        {getPermissionLabel(permission)}
                      </span>
                    ))}
                    {role?.permissions?.length > 8 && (
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        +{role?.permissions?.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditRole(role)}
                >
                  <Icon name="Edit2" size={14} className="mr-1" />
                  Edit
                </Button>
                
                {!role?.isDefault && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRole(role?.id)}
                    disabled={role?.userCount > 0}
                  >
                    <Icon name="Trash2" size={14} className="mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Create/Edit Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {editingRole ? 'Modify role details and permissions' : 'Define a new role with specific permissions'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateRoleModal(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Role Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Role Name"
                    placeholder="Enter role name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e?.target?.value)}
                    required
                  />
                  <Input
                    label="Description"
                    placeholder="Brief role description"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e?.target?.value)}
                  />
                </div>
                
                {/* Permissions */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-4">Permissions</h4>
                  <div className="space-y-6">
                    {Object?.entries(permissionCategories)?.map(([category, permissions]) => (
                      <div key={category} className="space-y-3">
                        <h5 className="text-sm font-medium text-foreground border-b border-border pb-2">
                          {category}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {permissions?.map((permission) => (
                            <div key={permission?.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={permission?.id}
                                checked={selectedPermissions?.[permission?.id] || false}
                                onChange={(checked) => handlePermissionChange(permission?.id, checked)}
                              />
                              <div className="flex-1">
                                <label 
                                  htmlFor={permission?.id}
                                  className="text-sm font-medium text-foreground cursor-pointer"
                                >
                                  {permission?.label}
                                </label>
                                <p className="text-xs text-muted-foreground">
                                  {permission?.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowCreateRoleModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRole}
                loading={loading}
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsManager;
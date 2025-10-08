import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';


const UserManagementTable = ({ onEditUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      fullName: 'Sarah Mitchell',
      email: 'sarah.mitchell@school.edu',
      phone: '+234 801 234 5678',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: '2025-01-04T08:30:00Z',
      createdAt: '2024-12-01T10:00:00Z'
    },
    {
      id: 2,
      fullName: 'Michael Johnson',
      email: 'michael.johnson@school.edu',
      phone: '+234 802 345 6789',
      role: 'Finance Manager',
      status: 'Active',
      lastLogin: '2025-01-03T14:20:00Z',
      createdAt: '2024-12-05T09:15:00Z'
    },
    {
      id: 3,
      fullName: 'Emily Rodriguez',
      email: 'emily.rodriguez@school.edu',
      phone: '+234 803 456 7890',
      role: 'Bursar',
      status: 'Active',
      lastLogin: '2025-01-04T09:45:00Z',
      createdAt: '2024-12-10T11:30:00Z'
    },
    {
      id: 4,
      fullName: 'David Thompson',
      email: 'david.thompson@school.edu',
      phone: '+234 804 567 8901',
      role: 'Finance Manager',
      status: 'Inactive',
      lastLogin: '2024-12-28T16:15:00Z',
      createdAt: '2024-11-15T13:45:00Z'
    },
    {
      id: 5,
      fullName: 'Lisa Anderson',
      email: 'lisa.anderson@school.edu',
      phone: '+234 805 678 9012',
      role: 'Bursar',
      status: 'Active',
      lastLogin: '2025-01-02T12:00:00Z',
      createdAt: '2024-12-20T15:20:00Z'
    }
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Finance Manager', label: 'Finance Manager' },
    { value: 'Bursar', label: 'Bursar' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  // Load users on component mount
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase()?.trim();
      filtered = filtered?.filter(user => 
        user?.fullName?.toLowerCase()?.includes(query) ||
        user?.email?.toLowerCase()?.includes(query) ||
        user?.role?.toLowerCase()?.includes(query)
      );
    }

    // Role filter
    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered?.filter(user => user?.role === roleFilter);
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered?.filter(user => user?.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter, statusFilter]);

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math?.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, you would call:
      // const { error } = await supabase.auth.resetPasswordForEmail(selectedUser.email);
      
      alert(`Password reset email sent to ${selectedUser?.email}`);
      setShowResetModal(false);
      setSelectedUser(null);
    } catch (error) {
      console?.error('Password reset failed:', error);
      alert('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      // Simulate API call to toggle user status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = selectedUser?.status === 'Active' ? 'Inactive' : 'Active';
      const updatedUsers = users?.map(user => 
        user?.id === selectedUser?.id 
          ? { ...user, status: newStatus }
          : user
      );
      
      setUsers(updatedUsers);
      alert(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`);
      setShowDeactivateModal(false);
      setSelectedUser(null);
    } catch (error) {
      console?.error('Status toggle failed:', error);
      alert('Failed to update user status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'Active' ?'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'Active' ? 'bg-green-400' : 'bg-red-400'
      }`} />
      {status}
    </span>
  );

  const RoleBadge = ({ role }) => {
    const getRoleColor = (role) => {
      switch (role) {
        case 'Super Admin': return 'bg-purple-100 text-purple-800';
        case 'Finance Manager': return 'bg-blue-100 text-blue-800';
        case 'Bursar': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
        {role}
      </span>
    );
  };

  if (loading && users?.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full"
            icon={<Icon name="Search" size={16} />}
          />
        </div>
        
        <div className="flex gap-3">
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={(value) => setRoleFilter(value)}
            placeholder="Filter by role"
            className="min-w-[140px]"
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            placeholder="Filter by status"
            className="min-w-[140px]"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers?.length} of {users?.length} users
        </p>
        {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
          >
            <Icon name="X" size={14} className="mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-foreground">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Last Login</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.length > 0 ? (
                filteredUsers?.map((user) => (
                  <tr key={user?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon name="User" size={20} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user?.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <RoleBadge role={user?.role} />
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={user?.status} />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">
                        {formatLastLogin(user?.lastLogin)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditUser?.(user)}
                          className="h-8 px-3"
                        >
                          <Icon name="Edit2" size={14} className="mr-1" />
                          Edit
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowResetModal(true);
                          }}
                          className="h-8 px-3"
                        >
                          <Icon name="Key" size={14} className="mr-1" />
                          Reset Password
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeactivateModal(true);
                          }}
                          className={`h-8 px-3 ${
                            user?.status === 'Active' ?'text-destructive hover:text-destructive hover:bg-destructive/10' :'text-green-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <Icon name={user?.status === 'Active' ? 'UserX' : 'UserCheck'} size={14} className="mr-1" />
                          {user?.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Icon name="Users" size={32} className="text-muted-foreground" />
                      <div>
                        <h3 className="text-sm font-medium text-foreground">No users found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' ?'Try adjusting your filters' :'No users have been created yet'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon name="Key" size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Reset Password</h3>
                <p className="text-sm text-muted-foreground">Send password reset email</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              A password reset email will be sent to <strong>{selectedUser?.email}</strong>. 
              The user will receive instructions to create a new password.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResetModal(false);
                  setSelectedUser(null);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleResetPassword}
                loading={loading}
              >
                Send Reset Email
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate/Activate Modal */}
      {showDeactivateModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedUser?.status === 'Active' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <Icon 
                  name={selectedUser?.status === 'Active' ? 'UserX' : 'UserCheck'} 
                  size={20} 
                  className={selectedUser?.status === 'Active' ? 'text-red-600' : 'text-green-600'} 
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedUser?.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser?.status === 'Active' ? 'Restrict access' : 'Restore access'}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              {selectedUser?.status === 'Active' 
                ? `Are you sure you want to deactivate ${selectedUser?.fullName}? They will lose access to the system immediately.`
                : `Are you sure you want to activate ${selectedUser?.fullName}? They will regain access to the system.`
              }
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeactivateModal(false);
                  setSelectedUser(null);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant={selectedUser?.status === 'Active' ? 'destructive' : 'default'}
                onClick={handleToggleStatus}
                loading={loading}
              >
                {selectedUser?.status === 'Active' ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
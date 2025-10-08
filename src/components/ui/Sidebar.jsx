import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import SchoolSelector from './SchoolSelector';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    tooltip: 'Overview and key metrics'
  },
  {
    label: 'Students',
    path: '/students-management',
    icon: 'Users',
    tooltip: 'Student management',
    children: [
    {
      label: 'All Students',
      path: '/students-management',
      icon: 'Users'
    },
    {
      label: 'Add Student',
      path: '/add-edit-student',
      icon: 'UserPlus'
    },
    {
      label: 'Bulk Import',
      path: '/bulk-student-import',
      icon: 'Upload'
    }]

  },
  {
    label: 'Invoices & Billing',
    path: '/invoices-management',
    icon: 'FileText',
    tooltip: 'Invoice management and billing',
    children: [
    {
      label: 'Create Invoice',
      path: '/create-invoice',
      icon: 'Plus',
      highlight: false,
      tooltip: 'Create new invoice with grade-based selection'
    },
    {
      label: 'All Invoices',
      path: '/invoices-management',
      icon: 'FileText'
    }]

  },
  {
    label: 'Payments',
    path: '/payments-management',
    icon: 'CreditCard',
    tooltip: 'Payment management and fee structures',
    children: [
    {
      label: 'Payment Management',
      path: '/payments-management',
      icon: 'CreditCard'
    },
    {
      label: 'Payment Structure',
      path: '/payment-structure-management',
      icon: 'Settings'
    }]

  },
  {
    label: 'Wallet',
    path: '/wallet',
    icon: 'Wallet',
    tooltip: 'Wallet management and transfers',
    children: [
    {
      label: 'My Wallet',
      path: '/wallet',
      icon: 'Wallet'
    },
    {
      label: 'Transfer Funds',
      path: '/transfer-wallet',
      icon: 'Send'
    }]
  },
  {
    label: 'Reports',
    path: '/reports-center',
    icon: 'BarChart',
    tooltip: 'Analytics and reports'
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    tooltip: 'Application configuration and preferences',
    children: [
    {
      label: 'School Configuration',
      path: '/settings?section=school-config',
      icon: 'School'
    },
    {
      label: 'User Management',
      path: '/settings?section=user-management',
      icon: 'Users'
    },
    {
      label: 'Security & Privacy',
      path: '/settings?section=security',
      icon: 'Shield'
    },
    {
      label: 'Notifications',
      path: '/settings?section=notifications',
      icon: 'Bell'
    },
    {
      label: 'Integrations',
      path: '/settings?section=integrations',
      icon: 'Plug'
    },
    {
      label: 'Backup & Export',
      path: '/settings?section=backup',
      icon: 'Download'
    }]

  }];


  const [expandedSections, setExpandedSections] = useState({
    Students: true,
    'Invoices & Billing': true,
    Payments: true,
    Wallet: true,
    Settings: true
  });

  const toggleSection = (sectionLabel) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionLabel]: !prev?.[sectionLabel]
    }));
  };

  const isActiveRoute = (path) => {
    // Handle both exact path matches and query parameter matches
    if (path?.includes('?section=')) {
      const [basePath, section] = path?.split('?section=');
      return location?.pathname === basePath && location?.search?.includes(`section=${section}`);
    }
    return location?.pathname === path;
  };

  const isParentActive = (item) => {
    if (item?.children) {
      return item?.children?.some((child) => isActiveRoute(child?.path));
    }
    return isActiveRoute(item?.path);
  };

  const handleLogOut = () => {
    navigate('/log-out');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onToggle} />

      }
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full border-r border-border z-50
          w-64 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        style={{ backgroundColor: '#081C48' }}>

        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center justify-center w-full">
            <div className="w-72 h-24 flex items-center justify-center">
              <img 
                src="/assets/images/SkuPadi_Logo-removebg-preview_1-1758104649539.png" 
                alt="Skupadi Logo" 
                className="w-72 h-auto max-h-24 object-contain"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-72 h-24 bg-primary rounded-lg flex items-center justify-center"><svg width="60" height="60" fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.16 5.18 9 12 5.84 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg></div>';
                }}
              />
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={onToggle}
            className="lg:hidden absolute right-6 p-1 rounded-md hover:bg-gray-700 transition-colors">
            <Icon name="X" size={20} color="white" />
          </button>
        </div>

        {/* School Selector Section - Enhanced */}
        {/* if (isSuperAdmin){
          { <div className="p-4 border-b border-gray-600">
          <SchoolSelector />
        </div> }
        */}
        

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems?.map((item) =>
          <div key={item?.label}>
              {/* Main Navigation Item */}
              <div className="relative">
                {item?.children ?
                  <button
                    onClick={() => toggleSection(item?.label)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg
                      text-sm font-medium transition-all duration-150 ease-out
                      ${isParentActive(item) ?
                        'active-nav-item text-[#081C48] font-semibold' : 'text-gray-200 hover:bg-gray-700'}
                    `}
                    title={item?.tooltip}
                    style={isParentActive(item) ? { backgroundColor: '#EAEBEF' } : {}}>
                      
                      <div className="flex items-center space-x-3">
                        <Icon
                          name={item?.icon}
                          size={18}
                          color={isParentActive(item) ? '#081C48' : 'currentColor'} />
                        <span>{item?.label}</span>
                      </div>
                      <Icon
                        name={expandedSections?.[item?.label] ? 'ChevronDown' : 'ChevronRight'}
                        size={16}
                        color={isParentActive(item) ? '#081C48' : 'currentColor'} />
                    </button> :

                  <Link
                    to={item?.path}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg
                      text-sm font-medium transition-all duration-150 ease-out
                      ${isActiveRoute(item?.path) ?
                        'active-nav-item text-[#081C48] font-semibold' : 'text-gray-200 hover:bg-gray-700'}
                    `}
                    title={item?.tooltip}
                    style={isActiveRoute(item?.path) ? { backgroundColor: '#EAEBEF' } : {}}>
                      
                      <Icon
                        name={item?.icon}
                        size={18}
                        color={isActiveRoute(item?.path) ? '#081C48' : 'currentColor'} />
                      <span>{item?.label}</span>
                    </Link>
                }
              </div>

              {/* Sub Navigation Items */}
              {item?.children && expandedSections?.[item?.label] &&
                <div className="ml-6 mt-1 space-y-1">
                  {item?.children?.map((child) =>
                    <Link
                      key={child?.path}
                      to={child?.path}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg
                        text-sm transition-all duration-150 ease-out
                        ${child?.highlight && !isActiveRoute(child?.path) ?
                          'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' :
                          isActiveRoute(child?.path) ?
                            'active-nav-item text-[#081C48] font-semibold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                      `}
                      title={child?.tooltip}
                      style={isActiveRoute(child?.path) ? { backgroundColor: '#EAEBEF' } : {}}>
                        
                        <Icon
                          name={child?.icon}
                          size={16}
                          color={child?.highlight && !isActiveRoute(child?.path) ?
                            '#059669' : isActiveRoute(child?.path) ? '#081C48' : 'currentColor'
                          } />
                        <span className={child?.highlight ? 'font-medium' : ''}>
                          {child?.label}
                        </span>
                        {child?.highlight &&
                          <span className="ml-auto">
                            <Icon name="Sparkles" size={12} color="#059669" />
                          </span>
                        }
                      </Link>
                  )}
                </div>
              }
            </div>
          )}
        </nav>

        {/* Footer with Logout */}
        <div className="border-t border-gray-600">
          {/* Logout Button */}
          <div className="p-4">
            <button
              onClick={handleLogOut}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-out text-red-400 hover:bg-red-900/20 hover:text-red-300"
              title="Log out of your account">

              <Icon name="LogOut" size={18} color="currentColor" />
              <span>Log Out</span>
            </button>
          </div>
          
          {/* Copyright */}
          <div className="p-4 pt-0">
            <div className="text-xs text-white font-bold text-center">
              © 2025 Skupadi
            </div>
          </div>
        </div>
      </aside>
    </>);

};

export default Sidebar;
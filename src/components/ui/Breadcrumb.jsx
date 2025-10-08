import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems }) => {
  let location;
  
  try {
    location = useLocation();
  } catch (error) {
    // Fallback when router is not available
    console.warn('Router context not available:', error);
    location = { pathname: '/dashboard' };
  }

  // Ensure location and pathname exist with fallback
  const currentPathname = location?.pathname || '/dashboard';
  
  const routeMap = {
    '/dashboard': { label: 'Dashboard', icon: 'BarChart3' },
    '/students-management': { label: 'Students Management', icon: 'Users' },
    '/add-edit-student': { label: 'Add Student', icon: 'UserPlus', parent: '/students-management' },
    '/bulk-student-import': { label: 'Bulk Import', icon: 'Upload', parent: '/students-management' },
    '/invoices-management': { label: 'Invoices Management', icon: 'FileText' },
    '/create-invoice': { label: 'Create Invoice', icon: 'Plus', parent: '/invoices-management' },
    '/payment-structure-management': { label: 'Payment Structures', icon: 'CreditCard' },
    '/payments-management': { label: 'Payments Management', icon: 'DollarSign' },
    '/reports-center': { label: 'Reports Center', icon: 'BarChart3' }
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const currentRoute = routeMap?.[currentPathname];
    
    if (!currentRoute) {
      return [{ label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' }];
    }

    const breadcrumbs = [];
    
    // Add parent if exists
    if (currentRoute?.parent) {
      const parentRoute = routeMap?.[currentRoute?.parent];
      if (parentRoute) {
        breadcrumbs?.push({
          label: parentRoute?.label,
          path: currentRoute?.parent,
          icon: parentRoute?.icon
        });
      }
    }
    
    // Add current route
    breadcrumbs?.push({
      label: currentRoute?.label,
      path: currentPathname,
      icon: currentRoute?.icon,
      current: true
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1 && currentPathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link 
        to="/dashboard" 
        className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150"
      >
        <Icon name="Home" size={16} />
        <span>Home</span>
      </Link>
      {breadcrumbs?.map((item, index) => (
        <React.Fragment key={item?.path || index}>
          <Icon name="ChevronRight" size={14} className="text-border" />
          
          {item?.current ? (
            <div className="flex items-center space-x-1 text-foreground font-medium">
              <Icon name={item?.icon || 'FileText'} size={16} />
              <span>{item?.label || 'Page'}</span>
            </div>
          ) : (
            <Link 
              to={item?.path || '/dashboard'}
              className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150"
            >
              <Icon name={item?.icon || 'FileText'} size={16} />
              <span>{item?.label || 'Page'}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <p className="text-muted-foreground">
            The requested path <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{location?.pathname}</code> could not be found.
          </p>
          <p className="text-muted-foreground text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            as={Link} 
            to="/" 
            variant="primary"
            className="w-full sm:w-auto"
          >
            <Icon name="Home" size={16} className="mr-2" />
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.history?.back()}
            className="w-full sm:w-auto"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our{' '}
            <a 
              href="mailto:support@skupadi.com" 
              className="text-primary hover:text-primary/80 transition-colors underline"
            >
              support team
            </a>
          </p>
        </div>

        {/* Debug Info for Development */}
        {process.env?.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-left">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Debug Info:</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Pathname:</strong> {location?.pathname}</p>
              <p><strong>Search:</strong> {location?.search || 'None'}</p>
              <p><strong>Hash:</strong> {location?.hash || 'None'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
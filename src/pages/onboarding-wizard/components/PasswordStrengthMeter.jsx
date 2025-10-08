import React from 'react';
import { cn } from '../../../utils/cn';

const PasswordStrengthMeter = ({ password, strength }) => {
  if (!password) return null;

  const { strength: level, text, color } = strength;

  // Create strength bars
  const bars = Array.from({ length: 4 }, (_, index) => (
    <div
      key={index}
      className={cn(
        "h-2 rounded-full transition-colors duration-200",
        index < level ? color : "bg-muted"
      )}
    />
  ));

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bars */}
      <div className="grid grid-cols-4 gap-1">
        {bars}
      </div>
      {/* Strength Text */}
      {text && (
        <p className={cn(
          "text-xs font-medium",
          level === 1 && "text-red-600",
          level === 2 && "text-yellow-600", 
          level === 3 && "text-blue-600",
          level === 4 && "text-green-600"
        )}>
          Password strength: {text}
        </p>
      )}
      {/* Password Requirements */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center space-x-1">
          <span className={cn(
            "w-1 h-1 rounded-full",
            password?.length >= 8 ? "bg-green-500" : "bg-muted"
          )} />
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className={cn(
            "w-1 h-1 rounded-full",
            /(?=.*[a-zA-Z])(?=.*[0-9])/?.test(password) ? "bg-green-500" : "bg-muted"
          )} />
          <span>Contains letters and numbers</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
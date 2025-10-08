import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const CountryCodeSelector = ({ 
  selectedCountryCode, 
  phoneNumber, 
  onCountryCodeChange, 
  onPhoneNumberChange, 
  error 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const countryCodes = [
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+256', country: 'Uganda', flag: '🇺🇬' }
  ];

  const selectedCountry = countryCodes?.find(c => c?.code === selectedCountryCode) || countryCodes?.[0];

  const handleCountrySelect = (countryCode) => {
    onCountryCodeChange(countryCode);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Phone Number <span className="text-destructive">*</span>
      </label>
      <div className="flex">
        {/* Country Code Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 border border-r-0 border-input bg-background rounded-l-md transition-colors",
              "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              error && "border-destructive"
            )}
          >
            <span className="text-lg">{selectedCountry?.flag}</span>
            <span className="text-sm font-medium">{selectedCountry?.code}</span>
            <Icon name="ChevronDown" size={16} className={cn(
              "transition-transform",
              isDropdownOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-10 w-64 mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {countryCodes?.map((country) => (
                <button
                  key={country?.code}
                  type="button"
                  onClick={() => handleCountrySelect(country?.code)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-muted transition-colors",
                    selectedCountryCode === country?.code && "bg-muted"
                  )}
                >
                  <span className="text-lg">{country?.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{country?.country}</div>
                    <div className="text-xs text-muted-foreground">{country?.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <Input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e?.target?.value?.replace(/\D/g, ''))}
          className={cn(
            "flex-1 rounded-l-none border-l-0",
            phoneNumber && !error ? 'border-success' : ''
          )}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default CountryCodeSelector;
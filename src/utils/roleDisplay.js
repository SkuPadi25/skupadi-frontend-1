export const SCHOOL_STAFF_ROLE_OPTIONS = [
  {
    value: 'OWNER',
    label: 'Owner',
    description: 'Primary school account holder with full control, including staff designation and ownership transfer.',
    requiresMFA: true
  },
  {
    value: 'DESIGNATED_ADMIN',
    label: 'Designated Admin',
    description: 'Staff member appointed by the owner to manage daily operations with delegated access.',
    requiresMFA: true
  }
];

export const normalizeUserRole = (value) => {
  if (!value) return '';

  const normalizedValue = String(value).trim().toUpperCase();

  if (normalizedValue === 'OWNER') return 'OWNER';
  if (normalizedValue === 'DESIGNATED_ADMIN') return 'DESIGNATED_ADMIN';

  return String(value).trim();
};

export const getRoleLabel = (value) => {
  const normalizedValue = normalizeUserRole(value);
  const roleOption = SCHOOL_STAFF_ROLE_OPTIONS.find((option) => option.value === normalizedValue);
  return roleOption?.label || normalizedValue || 'Admin';
};


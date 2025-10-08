// Special Invoice Service Types and Labels
export const SERVICE_TYPES = {
  TRANSPORTATION: 'transportation',
  ACCOMMODATION: 'accommodation',
  HOSTEL: 'hostel',
  EXCURSION: 'excursion',
  PTA_LEVY: 'pta_levy',
  COMPUTER_FEE: 'computer_fee',
  LABORATORY_FEE: 'laboratory_fee',
  SPORTS_FEE: 'sports_fee',
  LIBRARY_FEE: 'library_fee',
  UNIFORM: 'uniform',
  BOOKS: 'books',
  EXAMINATION_FEE: 'examination_fee',
  OTHER: 'other'
};

export const SERVICE_TYPE_LABELS = {
  [SERVICE_TYPES?.TRANSPORTATION]: 'Transportation',
  [SERVICE_TYPES?.ACCOMMODATION]: 'Accommodation',
  [SERVICE_TYPES?.HOSTEL]: 'Hostel Fee',
  [SERVICE_TYPES?.EXCURSION]: 'Educational Excursion',
  [SERVICE_TYPES?.PTA_LEVY]: 'PTA Levy',
  [SERVICE_TYPES?.COMPUTER_FEE]: 'Computer Fee',
  [SERVICE_TYPES?.LABORATORY_FEE]: 'Laboratory Fee',
  [SERVICE_TYPES?.SPORTS_FEE]: 'Sports Fee',
  [SERVICE_TYPES?.LIBRARY_FEE]: 'Library Fee',
  [SERVICE_TYPES?.UNIFORM]: 'School Uniform',
  [SERVICE_TYPES?.BOOKS]: 'Text Books',
  [SERVICE_TYPES?.EXAMINATION_FEE]: 'Examination Fee',
  [SERVICE_TYPES?.OTHER]: 'Other Services'
};

export const INVOICE_SCOPES = {
  ENTIRE_SCHOOL: 'entire_school',
  CLASS: 'class',
  SUBCLASS: 'subclass',
  SELECTED_STUDENTS: 'selected_students'
};

export const INVOICE_SCOPE_LABELS = {
  [INVOICE_SCOPES?.ENTIRE_SCHOOL]: 'Entire School',
  [INVOICE_SCOPES?.CLASS]: 'Class/Grade Level',
  [INVOICE_SCOPES?.SUBCLASS]: 'Sub-Class',
  [INVOICE_SCOPES?.SELECTED_STUDENTS]: 'Selected Students'
};
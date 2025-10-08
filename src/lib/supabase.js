import { createClient } from '@supabase/supabase-js';

// Get environment variables with proper validation
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Validation helper function
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed?.protocol === 'http:' || parsed?.protocol === 'https:';
  } catch {
    return false;
  }
};

// Validation helper for API key
const isValidApiKey = (key) => {
  return key && typeof key === 'string' && key?.length > 20 && !key?.includes('your-');
};

// Create a proper mock query builder that supports chaining
const createMockQueryBuilder = () => {
  const mockQueryBuilder = {
    select: (columns) => mockQueryBuilder,
    insert: (data) => mockQueryBuilder,
    update: (data) => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    upsert: (data) => mockQueryBuilder,
    eq: (column, value) => mockQueryBuilder,
    neq: (column, value) => mockQueryBuilder,
    gt: (column, value) => mockQueryBuilder,
    gte: (column, value) => mockQueryBuilder,
    lt: (column, value) => mockQueryBuilder,
    lte: (column, value) => mockQueryBuilder,
    like: (column, pattern) => mockQueryBuilder,
    ilike: (column, pattern) => mockQueryBuilder,
    is: (column, value) => mockQueryBuilder,
    in: (column, values) => mockQueryBuilder,
    not: (column, operator, value) => mockQueryBuilder,
    or: (filters) => mockQueryBuilder,
    and: (filters) => mockQueryBuilder,
    order: (column, options) => mockQueryBuilder,
    limit: (count) => mockQueryBuilder,
    range: (from, to) => mockQueryBuilder,
    single: () => mockQueryBuilder,
    maybeSingle: () => mockQueryBuilder,
    match: (query) => mockQueryBuilder,
    filter: (column, operator, value) => mockQueryBuilder,
    // Execute the query - this should be the final method in the chain
    then: (resolve, reject) => {
      console.warn('🚨 Supabase mock client: Query executed in demo mode');
      return Promise.reject(new Error('Supabase not configured'))?.then(resolve, reject);
    }
  };
  return mockQueryBuilder;
};

// Enhanced error handling and fallbacks
let supabaseClient = null;

if (!isValidUrl(supabaseUrl) || !isValidApiKey(supabaseAnonKey)) {
  console.error('🚨 Supabase Configuration Error:');
  console.error('- VITE_SUPABASE_URL:', supabaseUrl ? 'Invalid URL format' : 'Missing or empty');
  console.error('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Invalid or placeholder key' : 'Missing or empty');
  console.warn('💡 Please check your .env file and ensure both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly configured.');
  console.warn('📖 Running in demo mode with mock client. Some features may not work.');
  
  // Create a comprehensive mock client that supports full query builder pattern
  supabaseClient = {
    auth: {
      signUp: () => Promise.reject(new Error('Supabase not configured')),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured')),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: (table) => createMockQueryBuilder(),
    storage: {
      from: (bucket) => ({
        upload: () => Promise.reject(new Error('Supabase not configured')),
        download: () => Promise.reject(new Error('Supabase not configured')),
        remove: () => Promise.reject(new Error('Supabase not configured')),
        list: () => Promise.reject(new Error('Supabase not configured')),
        createSignedUrl: () => Promise.reject(new Error('Supabase not configured'))
      })
    },
    rpc: (functionName, params) => Promise.reject(new Error('Supabase not configured'))
  };
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error?.message);
    throw error;
  }
}

export const supabase = supabaseClient;

// Database service types for special invoices
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

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return isValidUrl(supabaseUrl) && isValidApiKey(supabaseAnonKey);
};

// Helper function to get configuration status
export const getSupabaseStatus = () => {
  return {
    configured: isSupabaseConfigured(),
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? (isValidApiKey(supabaseAnonKey) ? 'Valid' : 'Invalid/Placeholder') : 'Missing'
  };
};

export default supabase;
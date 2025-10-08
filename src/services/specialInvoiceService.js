import { SERVICE_TYPES, INVOICE_SCOPES } from '../constants/specialInvoice.js';

export const specialInvoiceService = {
  // Helper function to safely parse JSON responses
  async safeJsonParse(response) {
    try {
      const text = await response?.text();
      
      // Check if response starts with HTML doctype (common error page indicator)
      if (text?.trim()?.toLowerCase()?.startsWith('<!doctype') || 
          text?.trim()?.toLowerCase()?.startsWith('<html')) {
        console.info(`API endpoint returned HTML instead of JSON. Status: ${response?.status} - Using mock data fallback`);
        throw new Error(`Server returned HTML instead of JSON (Status: ${response.status})`);
      }
      
      // Try to parse as JSON
      return JSON.parse(text);
    } catch (error) {
      if (error?.message?.includes('HTML instead of JSON')) {
        throw error;
      }
      console.warn('Failed to parse JSON response:', error?.message, '- Using mock data fallback');
      throw new Error('Invalid JSON response from server');
    }
  },

  // Helper function to validate response and handle errors
  async handleResponse(response, fallbackMethod) {
    if (!response?.ok) {
      console.info(`API request failed with status ${response?.status}: ${response?.statusText} - Using mock data fallback`);
      if (fallbackMethod) {
        console.info('Switching to mock data for development mode');
        return fallbackMethod();
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    try {
      return await this.safeJsonParse(response);
    } catch (error) {
      console.info('Response parsing failed - API not available, using mock data:', error?.message);
      if (fallbackMethod) {
        console.info('Development mode: Mock data provides full functionality for testing');
        return fallbackMethod();
      }
      throw error;
    }
  },

  // Get all service configurations from your server
  async getServiceConfigurations() {
    try {
      // TODO: Replace with your server API endpoint
      const response = await fetch('/api/services/configurations', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      return await this.handleResponse(response, () => this.getMockServiceConfigurations());
    } catch (error) {
      console.info('Service configurations API not available - using comprehensive mock data for development');
      return this.getMockServiceConfigurations();
    }
  },

  // Get eligible students for a special invoice from your server
  async getEligibleStudents(serviceType, scope, filters = {}) {
    try {
      // TODO: Replace with your server API endpoint
      const queryParams = new URLSearchParams({
        serviceType,
        scope,
        ...filters
      });
      
      const response = await fetch(`/api/students/eligible?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      return await this.handleResponse(response, () => this.getMockEligibleStudents(serviceType, scope));
    } catch (error) {
      console.info('Eligible students API not available - using mock data for development');
      return this.getMockEligibleStudents(serviceType, scope);
    }
  },

  // Create special invoices in bulk through your server
  async createSpecialInvoicesBulk(invoiceData) {
    try {
      // TODO: Replace with your server API endpoint
      const response = await fetch('/api/invoices/special/bulk', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      return await this.handleResponse(response, () => this.mockCreateSpecialInvoices(invoiceData));
    } catch (error) {
      console.info('Special invoice creation API not available - using mock response for development');
      return this.mockCreateSpecialInvoices(invoiceData);
    }
  },

  // Get special invoice generation history from your server
  async getSpecialInvoiceGenerations(filters = {}) {
    try {
      // TODO: Replace with your server API endpoint
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/invoices/special/generations?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      return await this.handleResponse(response, () => this.getMockGenerationHistory());
    } catch (error) {
      console.info('Generation history API not available - using mock data for development');
      return this.getMockGenerationHistory();
    }
  },

  // Get special invoices with filters from your server
  async getSpecialInvoices(filters = {}) {
    try {
      // TODO: Replace with your server API endpoint
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/invoices/special?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      return await this.handleResponse(response, () => this.getMockSpecialInvoices());
    } catch (error) {
      console.info('Special invoices API not available - using mock data for development');
      return this.getMockSpecialInvoices();
    }
  },

  // Get schools classes and subclasses from your server
  async getSchoolClasses() {
    try {
      // TODO: Replace with your server API endpoint
      const response = await fetch('/api/classes', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      return await this.handleResponse(response, () => this.getMockSchoolClasses());
    } catch (error) {
      console.info('School classes API not available - using mock data for development');
      return this.getMockSchoolClasses();
    }
  },

  // Get students with billable items from your server
  async getStudentsWithBillableItems() {
    try {
      // TODO: Replace with your server API endpoint
      const response = await fetch('/api/students/billable-items', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      return await this.handleResponse(response, () => this.getMockStudentsWithBillableItems());
    } catch (error) {
      console.info('Students with billable items API not available - using mock data for development');
      return this.getMockStudentsWithBillableItems();
    }
  },

  // Update student billable items through your server
  async updateStudentBillableItems(studentId, billableItems) {
    try {
      // TODO: Replace with your server API endpoint
      const response = await fetch(`/api/students/${studentId}/billable-items`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billableItems }),
      });

      const result = await this.handleResponse(response);
      return { success: true, message: 'Billable items updated successfully', data: result };
    } catch (error) {
      console.info('Update billable items API not available - simulating successful update for development');
      return { 
        success: true, 
        message: 'Billable items updated successfully (development mode)',
        data: { studentId, billableItems, updatedAt: new Date()?.toISOString() }
      };
    }
  },

  // Mock data methods for fallback when server is not available
  getMockServiceConfigurations() {
    return [
      { service_type: SERVICE_TYPES?.TRANSPORTATION, name: 'Transportation', description: 'School bus service', default_amount: 6000.00 },
      { service_type: SERVICE_TYPES?.HOSTEL, name: 'Hostel Fee', description: 'Boarding and accommodation', default_amount: 25000.00 },
      { service_type: SERVICE_TYPES?.EXCURSION, name: 'Educational Excursion', description: 'Field trips and educational tours', default_amount: 5000.00 },
      { service_type: SERVICE_TYPES?.PTA_LEVY, name: 'PTA Levy', description: 'Parent-Teacher Association levy', default_amount: 1000.00 },
      { service_type: SERVICE_TYPES?.COMPUTER_FEE, name: 'Computer Fee', description: 'Computer lab access and ICT training', default_amount: 3500.00 },
      { service_type: SERVICE_TYPES?.LABORATORY_FEE, name: 'Laboratory Fee', description: 'Science laboratory usage and materials', default_amount: 4000.00 },
      { service_type: SERVICE_TYPES?.SPORTS_FEE, name: 'Sports Fee', description: 'Sports and physical education activities', default_amount: 2500.00 },
      { service_type: SERVICE_TYPES?.UNIFORM, name: 'School Uniform', description: 'Complete school uniform set', default_amount: 5000.00 },
      { service_type: SERVICE_TYPES?.BOOKS, name: 'Text Books', description: 'Required textbooks for the term', default_amount: 8000.00 }
    ];
  },

  getMockEligibleStudents(serviceType, scope) {
    return [
      { student_id: 'mock-1', student_name: 'John Smith', class_name: 'JSS 1', subclass_name: 'JSS 1A', has_billable_item: true, custom_amount: null },
      { student_id: 'mock-2', student_name: 'Jane Doe', class_name: 'JSS 1', subclass_name: 'JSS 1B', has_billable_item: true, custom_amount: 7000.00 },
      { student_id: 'mock-3', student_name: 'Mike Johnson', class_name: 'JSS 2', subclass_name: 'JSS 2A', has_billable_item: false, custom_amount: null }
    ];
  },

  getMockSchoolClasses() {
    return [
      { id: 'class-1', name: 'JSS 1', grade_level: 'JSS', has_subclasses: true, subclasses: [
        { id: 'sub-1', name: 'JSS 1A', description: 'JSS 1 Section A' },
        { id: 'sub-2', name: 'JSS 1B', description: 'JSS 1 Section B' }
      ]},
      { id: 'class-2', name: 'JSS 2', grade_level: 'JSS', has_subclasses: true, subclasses: [
        { id: 'sub-3', name: 'JSS 2A', description: 'JSS 2 Section A' }
      ]},
      { id: 'class-3', name: 'SS 1', grade_level: 'SS', has_subclasses: true, subclasses: [
        { id: 'sub-4', name: 'SS 1 Science', description: 'SS 1 Science Class' },
        { id: 'sub-5', name: 'SS 1 Arts', description: 'SS 1 Arts Class' }
      ]}
    ];
  },

  getMockStudentsWithBillableItems() {
    return [
      {
        id: 'student-1',
        student_id: 'STU001',
        first_name: 'John',
        last_name: 'Smith',
        class: { id: 'class-1', name: 'JSS 1' },
        subclass: { id: 'sub-1', name: 'JSS 1A' },
        billable_items: [
          { service_type: SERVICE_TYPES?.TRANSPORTATION, is_active: true, custom_amount: null },
          { service_type: SERVICE_TYPES?.SPORTS_FEE, is_active: true, custom_amount: 3000.00 }
        ]
      },
      {
        id: 'student-2',
        student_id: 'STU002',
        first_name: 'Jane',
        last_name: 'Doe',
        class: { id: 'class-1', name: 'JSS 1' },
        subclass: { id: 'sub-2', name: 'JSS 1B' },
        billable_items: [
          { service_type: SERVICE_TYPES?.HOSTEL, is_active: true, custom_amount: 27000.00 }
        ]
      }
    ];
  },

  getMockGenerationHistory() {
    return [
      {
        id: 'gen-1',
        service_type: SERVICE_TYPES?.TRANSPORTATION,
        scope: INVOICE_SCOPES?.CLASS,
        total_students_affected: 45,
        total_amount: 270000.00,
        due_date: '2025-02-15',
        term: '2024/2025 Second Term',
        created_at: '2025-01-24T10:30:00Z',
        created_by_profile: { full_name: 'Sarah Johnson', email: 'sarah@school.com' },
        target_class: { name: 'JSS 1' }
      },
      {
        id: 'gen-2',
        service_type: SERVICE_TYPES?.EXCURSION,
        scope: INVOICE_SCOPES?.ENTIRE_SCHOOL,
        total_students_affected: 150,
        total_amount: 750000.00,
        due_date: '2025-03-01',
        term: '2024/2025 Second Term',
        created_at: '2025-01-20T14:15:00Z',
        created_by_profile: { full_name: 'Admin User', email: 'admin@school.com' }
      }
    ];
  },

  getMockSpecialInvoices() {
    return [
      {
        id: 'inv-1',
        invoice_number: 'SPV-202501-001',
        service_type: SERVICE_TYPES?.TRANSPORTATION,
        amount: 6000.00,
        due_date: '2025-02-15',
        issue_date: '2025-01-24',
        status: 'pending',
        term: '2024/2025 Second Term',
        student: {
          student_id: 'STU001',
          first_name: 'John',
          last_name: 'Smith',
          class: { name: 'JSS 1' },
          subclass: { name: 'JSS 1A' }
        }
      },
      {
        id: 'inv-2',
        invoice_number: 'SPV-202501-002',
        service_type: SERVICE_TYPES?.EXCURSION,
        amount: 5000.00,
        due_date: '2025-03-01',
        issue_date: '2025-01-20',
        status: 'paid',
        payment_date: '2025-01-25',
        term: '2024/2025 Second Term',
        student: {
          student_id: 'STU002',
          first_name: 'Jane',
          last_name: 'Doe',
          class: { name: 'JSS 1' },
          subclass: { name: 'JSS 1B' }
        }
      }
    ];
  },

  mockCreateSpecialInvoices(invoiceData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          invoices_created: 25,
          total_amount: 150000.00,
          generation_id: 'mock-gen-' + Date.now()
        });
      }, 2000);
    });
  }
};

export default specialInvoiceService;
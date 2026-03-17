import api from './api';

const normalizeInvoice = (invoice) => ({
  id: invoice?.invoiceNumber,
  invoiceId: invoice?.id,
  studentName: `${invoice?.student?.firstName || ''} ${invoice?.student?.lastName || ''}`?.trim(),
  studentId: invoice?.student?.studentNumber,
  amount: Number(invoice?.totalAmount || 0),
  dueDate: invoice?.dueDate,
  issueDate: invoice?.issueDate,
  status: (invoice?.status || 'PENDING')?.toLowerCase(),
  class: invoice?.class?.name || invoice?.student?.class?.name || '',
  description: invoice?.description || '',
  notes: invoice?.notes || '',
  items: invoice?.items || []
});

export const invoiceService = {
  async createInvoices(payload) {
    const { data } = await api.post('/invoices', payload);
    return {
      ...data,
      invoices: (data?.invoices || [])?.map(normalizeInvoice)
    };
  },

  async getInvoices(params = {}) {
    const { data } = await api.get('/invoices', { params });
    return {
      invoices: (data?.invoices || [])?.map(normalizeInvoice),
      summary: data?.summary || null
    };
  }
};

export default invoiceService;

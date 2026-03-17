import api from './api';

export const dashboardService = {
  async getDashboardData(range = '7days') {
    const { data } = await api.get('/dashboard', {
      params: { range }
    });

    return data;
  }
};

export default dashboardService;

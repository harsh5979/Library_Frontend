import api from '@/lib/axios'

export const reportService = {
  getInventoryReport: async (): Promise<string> => {
    return api.get('/reports/inventory', { responseType: 'text' })
  },
  getBorrowingReport: async (): Promise<string> => {
    return api.get('/reports/borrowing', { responseType: 'text' })
  },
  getFineReport: async (): Promise<string> => {
    return api.get('/reports/fines', { responseType: 'text' })
  },
  getSemesterReport: async (): Promise<string> => {
    return api.get('/reports/semester', { responseType: 'text' })
  },
  getOverdueReport: async (): Promise<string> => {
    return api.get('/reports/overdue', { responseType: 'text' })
  },
}

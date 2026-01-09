import { defineStore } from 'pinia'
import { defaultPagination } from 'src/utils/pagination'
import type {
  CancelInvoiceReq,
  CreateInvoiceReq,
  Invoice,
  IssueInvoiceReq,
} from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import type { Customer } from 'src/api/Api'

interface InvoiceListQuery {
  page?: number
  itemsPerPage?: number
  customer?: Customer
  status?: Invoice['status']
  outboundDateFrom?: string
  outboundDateTo?: string
}

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoiceListQuery: {} as InvoiceListQuery,
    invoiceList: [] as Invoice[],
    invoiceListPagination: { ...defaultPagination },
    invoiceDetail: null as Invoice | null,
  }),
  actions: {
    async getInvoiceList(query?: InvoiceListQuery): Promise<void> {
      const payload = {
        page: query?.page,
        pageSize: query?.itemsPerPage,
        customerId: query?.customer?.id,
        status: query?.status,
        outboundDateFrom: query?.outboundDateFrom,
        outboundDateTo: query?.outboundDateTo,
      }
      const resp = await apiClient.billing.listInvoices(payload)
      this.invoiceList = resp.data.items ?? []
      this.invoiceListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async getInvoiceById(id: number): Promise<void> {
      const resp = await apiClient.billing.getInvoice(id)
      this.invoiceDetail = resp.data
    },
    resetInvoiceDetail(): void {
      this.invoiceDetail = null
    },
    async createInvoice(payload: CreateInvoiceReq): Promise<Invoice> {
      const resp = await apiClient.billing.createInvoice(payload)
      return resp.data
    },
    async issueInvoice(id: number, payload?: IssueInvoiceReq): Promise<Invoice> {
      const resp = await apiClient.billing.issueInvoice(id, payload)
      this.invoiceDetail = resp.data
      return resp.data
    },
    async cancelInvoice(id: number, payload?: CancelInvoiceReq): Promise<Invoice> {
      const resp = await apiClient.billing.cancelInvoice(id, payload)
      this.invoiceDetail = resp.data
      return resp.data
    },
  },
})

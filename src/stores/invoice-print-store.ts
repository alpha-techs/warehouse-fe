import { defineStore } from 'pinia'
import type { Customer, InvoicePrint, InvoicePrintReq, InvoicePrintResp } from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import { defaultPagination } from 'src/utils/pagination'

interface InvoicePrintListQuery {
  page?: number
  itemsPerPage?: number
  invoiceNumber?: string
  customer?: Customer
  status?: InvoicePrint['status']
  startDate?: string
  endDate?: string
}

export const useInvoicePrintStore = defineStore('invoice-print', {
  state: () => ({
    invoicePrintListQuery: {} as InvoicePrintListQuery,
    invoicePrintList: [] as InvoicePrint[],
    invoicePrintListPagination: { ...defaultPagination },
  }),
  actions: {
    async getInvoicePrintList(query?: InvoicePrintListQuery): Promise<void> {
      const payload = {
        page: query?.page,
        itemsPerPage: query?.itemsPerPage,
        invoiceNumber: query?.invoiceNumber,
        customerId: query?.customer?.id,
        status: query?.status,
        startDate: query?.startDate,
        endDate: query?.endDate,
      }
      const resp = await apiClient.billing.listInvoicePrints(payload)
      this.invoicePrintList = resp.data.items ?? []
      this.invoicePrintListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async generateInvoicePrint(data: InvoicePrintReq): Promise<InvoicePrintResp> {
      const resp = await apiClient.billing.generateInvoicePrint(data)
      return resp.data
    },
    async getInvoicePrintStatus(printId: string): Promise<InvoicePrint> {
      const resp = await apiClient.billing.getInvoicePrintStatus(printId)
      return resp.data
    },
    async downloadInvoicePrint(printId: string): Promise<File> {
      const resp = await apiClient.billing.downloadInvoicePrint(printId)
      return resp.data
    },
    getInvoicePrintDownloadUrl(printId: string): string {
      return apiClient.baseUrl + `/billing/invoicePrints/${printId}/download`
    },
  },
})

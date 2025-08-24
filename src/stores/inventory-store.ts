import { defineStore } from 'pinia'
import type {
  InventoryItem,
  Product,
  Warehouse,
  InventoryItemDetailResp,
  InventoryReport,
  InventoryReportReq,
} from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'

interface GetInventoryItemListQuery {
  page?: number
  itemsPerPage?: number
  lotNumber?: string
  warehouse?: Warehouse
  product?: Product
  inboundDateFrom?: string
  inboundDateTo?: string
}

interface GetInventoryReportListQuery {
  page?: number
  itemsPerPage?: number
  warehouseId?: number
  customerId?: number
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  startDate?: string
  endDate?: string
}

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventoryList: [] as InventoryItem[],
    inventoryListPagination: { ...defaultPagination },
    inventoryItemListQuery: {} as GetInventoryItemListQuery,
    inventoryItemDetail: null as InventoryItemDetailResp | null,
    inventoryReportList: [] as InventoryReport[],
    inventoryReportListPagination: { ...defaultPagination },
    inventoryReportListQuery: {} as GetInventoryReportListQuery,
  }),
  actions: {
    async getInventoryList(query?: GetInventoryItemListQuery): Promise<void> {
      const payload = {
        ...query,
        warehouse: undefined,
        warehouseId: query?.warehouse?.id,
        product: undefined,
        productId: query?.product?.id,
      }

      const resp = await apiClient.inventory.listInventory(payload)
      this.inventoryList = resp.data.items ?? []
      this.inventoryListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async getInventoryItemDetail(id: number): Promise<void> {
      const resp = await apiClient.inventory.getInventoryItemDetail(id)
      this.inventoryItemDetail = resp.data ?? null
    },
    resetList() {
      this.inventoryListPagination = { ...defaultPagination }
      this.inventoryList = []
    },
    resetDetail() {
      this.inventoryItemDetail = null
    },
    async getInventoryReportList(
      query?: GetInventoryReportListQuery,
    ): Promise<void> {
      const resp = await apiClient.inventory.listInventoryReports(query)
      this.inventoryReportList = resp.data.items ?? []
      this.inventoryReportListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async generateInventoryReport(
      request: InventoryReportReq,
    ): Promise<string> {
      const resp = await apiClient.inventory.generateInventoryReport(request)
      return resp.data.reportId ?? ''
    },
    async getInventoryReportStatus(reportId: string): Promise<InventoryReport> {
      const resp = await apiClient.inventory.getInventoryReportStatus(reportId)
      return resp.data
    },
    async downloadInventoryReport(reportId: string): Promise<File> {
      const resp = await apiClient.inventory.downloadInventoryReport(reportId)
      return resp.data
    },
    getInventoryReportDownloadUrl(reportId: string): string {
      return apiClient.baseUrl + `/inventory/reports/${reportId}/download`
    },
    resetReportList() {
      this.inventoryReportListPagination = { ...defaultPagination }
      this.inventoryReportList = []
    },
  },
})

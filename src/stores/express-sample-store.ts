import { defineStore } from 'pinia'
import {
  type Customer,
  type ExpressSampleShipment,
  type ExpressSampleShipmentItem,
  type ExpressSampleShipmentReport,
  type ExpressSampleShipmentReportReq,
  type InventoryItem,
  type Product,
} from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import { defaultPagination } from 'src/utils/pagination'
import _ from 'lodash'

type ExpressSampleShipmentStatus = NonNullable<ExpressSampleShipment['status']>

const emptyExpressSampleShipment: ExpressSampleShipment = {
  status: 'pending',
  items: [],
  deliveryService: 'regular',
  deliveryFeePayer: 'sender',
  packageCount: 1,
}

const emptyExpressSampleShipmentItem: ExpressSampleShipmentItem = {}

const emptyInventoryItem: InventoryItem = {}

interface GetExpressSampleShipmentListQuery {
  page?: number
  itemsPerPage?: number
  status?: ExpressSampleShipmentStatus
  customer?: Customer
  desiredDeliveryDateFrom?: string
  desiredDeliveryDateTo?: string
}

interface GetExpressSampleShipmentItemListQuery {
  page?: number
  itemsPerPage?: number
  expressSampleShipmentId?: number
  product?: Product
  desiredDeliveryDate?: string
}

interface GetExpressSampleShipmentReportListQuery {
  page?: number
  itemsPerPage?: number
  warehouseId?: number
  customerId?: number
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  startDate?: string
  endDate?: string
}

export const useExpressSampleStore = defineStore('expressSample', {
  state: () => ({
    expressSampleShipmentListQuery: {} as GetExpressSampleShipmentListQuery,
    expressSampleShipmentList: [] as ExpressSampleShipment[],
    expressSampleShipmentListPagination: { ...defaultPagination },
    preFormModel: _.cloneDeep(emptyExpressSampleShipment),
    formModel: _.cloneDeep(emptyExpressSampleShipment),
    itemModel: _.cloneDeep(emptyExpressSampleShipmentItem),
    inventoryItemModel: _.cloneDeep(emptyInventoryItem),
    expressSampleShipmentItemListQuery: {} as GetExpressSampleShipmentItemListQuery,
    expressSampleShipmentItemList: [] as ExpressSampleShipmentItem[],
    expressSampleShipmentItemListPagination: { ...defaultPagination },
    expressSampleShipmentReportList: [] as ExpressSampleShipmentReport[],
    expressSampleShipmentReportListPagination: { ...defaultPagination },
    expressSampleShipmentReportListQuery: {} as GetExpressSampleShipmentReportListQuery,
  }),
  actions: {
    async getExpressSampleShipmentList(
      query?: GetExpressSampleShipmentListQuery,
    ): Promise<void> {
      const payload = {
        ...query,
        customer: undefined,
        customerId: query?.customer?.id,
      }
      const resp =
        await apiClient.inventory.listExpressSampleShipments(payload)
      this.expressSampleShipmentList = resp.data.items ?? []
      this.expressSampleShipmentListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async getExpressSampleShipmentItemList(
      query?: GetExpressSampleShipmentItemListQuery,
    ): Promise<void> {
      const payload = {
        ...query,
        product: undefined,
        productId: query?.product?.id,
      }
      const resp =
        await apiClient.inventory.listExpressSampleShipmentItems(payload)
      this.expressSampleShipmentItemList = resp.data.items ?? []
      this.expressSampleShipmentItemListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    setPreFormModel(expressSampleShipment: ExpressSampleShipment) {
      this.preFormModel = _.cloneDeep(expressSampleShipment)
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(this.preFormModel)
      this.preFormModel = _.cloneDeep(emptyExpressSampleShipment)
    },
    resetItemModel(itemModel: ExpressSampleShipmentItem = emptyExpressSampleShipmentItem) {
      this.itemModel = _.cloneDeep(itemModel)
    },
    resetInventoryItemModel() {
      this.inventoryItemModel = _.cloneDeep(emptyInventoryItem)
    },
    async createExpressSampleShipment(): Promise<ExpressSampleShipment> {
      const resp = await apiClient.inventory.createExpressSampleShipment(
        this.formModel,
      )
      return resp.data
    },
    async removeExpressSampleShipmentById(id: number): Promise<void> {
      await apiClient.inventory.deleteExpressSampleShipment(id)
    },
    async getExpressSampleShipmentById(
      id: number,
    ): Promise<ExpressSampleShipment> {
      const resp = await apiClient.inventory.getExpressSampleShipment(id)
      this.formModel = resp.data
      return resp.data
    },
    async approveExpressSampleShipmentById(
      id: number,
    ): Promise<ExpressSampleShipment> {
      const resp = await apiClient.inventory.approveExpressSampleShipment(id)
      this.formModel = resp.data
      return resp.data
    },
    async rejectExpressSampleShipmentById(
      id: number,
    ): Promise<ExpressSampleShipment> {
      const resp = await apiClient.inventory.rejectExpressSampleShipment(id)
      this.formModel = resp.data
      return resp.data
    },
    async cancelExpressSampleShipmentById(
      id: number,
    ): Promise<ExpressSampleShipment> {
      const resp = await apiClient.inventory.cancelExpressSampleShipment(id)
      this.formModel = resp.data
      return resp.data
    },
    async updateExpressSampleShipment(): Promise<void> {
      const id = this.formModel.id!
      await apiClient.inventory.updateExpressSampleShipment(id, this.formModel)
    },
    getStatusBadgeAttribute(status?: ExpressSampleShipmentStatus): {
      color: string
      label: string
    } {
      const currentStatus = status ?? this.formModel.status
      switch (currentStatus) {
        case 'draft':
          return { color: 'teal', label: '下書き' }
        case 'pending':
          return { color: 'warning', label: '未確認' }
        case 'approved':
          return { color: 'green', label: '承認済' }
        case 'booked':
          return { color: 'info', label: '手配済' }
        case 'dispatched':
          return { color: 'primary', label: '出荷済' }
        case 'delivered':
          return { color: 'positive', label: '配達完了' }
        case 'rejected':
          return { color: 'red', label: '拒否' }
        case 'cancelled':
          return { color: 'grey', label: '取消' }
        default:
          return { color: 'grey', label: '未定義' }
      }
    },
    async getExpressSampleShipmentReportList(
      query?: GetExpressSampleShipmentReportListQuery,
    ): Promise<void> {
      const resp =
        await apiClient.inventory.listExpressSampleShipmentReports(query)
      this.expressSampleShipmentReportList = resp.data.items ?? []
      this.expressSampleShipmentReportListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async generateExpressSampleShipmentReport(
      request: ExpressSampleShipmentReportReq,
    ): Promise<string> {
      const resp =
        await apiClient.inventory.generateExpressSampleShipmentReport(request)
      return resp.data.reportId ?? ''
    },
    async getExpressSampleShipmentReportStatus(
      reportId: string,
    ): Promise<ExpressSampleShipmentReport> {
      const resp =
        await apiClient.inventory.getExpressSampleShipmentReportStatus(
          reportId,
        )
      return resp.data
    },
    getExpressSampleShipmentReportDownloadUrl(reportId: string): string {
      return (
        apiClient.baseUrl +
        `/inventory/expressSampleShipmentReports/${reportId}/download`
      )
    },
    resetExpressSampleShipmentReportList() {
      this.expressSampleShipmentReportListPagination = {
        ...defaultPagination,
      }
      this.expressSampleShipmentReportList = []
    },
    resetExpressSampleShipmentList() {
      this.expressSampleShipmentListPagination = {
        ...defaultPagination,
      }
      this.expressSampleShipmentList = []
    },
    resetExpressSampleShipmentItemList() {
      this.expressSampleShipmentItemListPagination = {
        ...defaultPagination,
      }
      this.expressSampleShipmentItemList = []
    },
  },
})

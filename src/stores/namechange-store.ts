import { defineStore } from 'pinia'
import type {
  Customer,
  InventoryItem,
  NameChange,
  NameChangeItem,
  Warehouse,
  Product,
  NameChangeReport,
  NameChangeReportReq,
} from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'
import _ from 'lodash'

const emptyNameChange: NameChange = {
  items: [],
  status: 'pending',
}

const emptyNameChangeItem: NameChangeItem = {}

const emptyInventoryItem: InventoryItem = {}

interface GetNameChangeItemListQuery {
  page?: number
  itemsPerPage?: number
  lotNumber?: string
  product?: Product
  nameChangeDateFrom?: string
  nameChangeDateTo?: string
}

interface GetNameChangeListQuery {
  page?: number
  itemsPerPage?: number
  nameChangeOrderId?: string
  nameChangeDateFrom?: string
  nameChangeDateTo?: string
  warehouse?: Warehouse
  customer?: Customer
  status?: string
}

interface GetNameChangeReportListQuery {
  page?: number
  itemsPerPage?: number
  warehouseId?: number
  customerId?: number
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  startDate?: string
  endDate?: string
}

export const useNameChangeStore = defineStore('namechange', {
  state: () => ({
    nameChangeListQuery: {} as GetNameChangeListQuery,
    nameChangeList: [] as NameChange[],
    nameChangeListPagination: { ...defaultPagination },
    preFormModel: _.cloneDeep(emptyNameChange),
    formModel: _.cloneDeep(emptyNameChange),
    itemModel: _.cloneDeep(emptyNameChangeItem),
    inventoryItemModel: _.cloneDeep(emptyInventoryItem),
    nameChangeItemListQuery: {} as GetNameChangeItemListQuery,
    nameChangeItemList: [] as NameChangeItem[],
    nameChangeItemListPagination: { ...defaultPagination },
    // NameChangeReport related state
    nameChangeReportList: [] as NameChangeReport[],
    nameChangeReportListPagination: { ...defaultPagination },
    nameChangeReportListQuery: {} as GetNameChangeReportListQuery,
  }),
  actions: {
    async getNameChangeList(query?: GetNameChangeListQuery): Promise<void> {
      const payload = {
        ...query,
        warehouse: undefined,
        warehouseId: query?.warehouse?.id,
        customer: undefined,
        customerId: query?.customer?.id,
      }
      const resp = await apiClient.inventory.listNameChanges(payload)
      this.nameChangeList = resp.data.items ?? []
      this.nameChangeListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async getNameChangeItemList(query?: GetNameChangeItemListQuery): Promise<void> {
      const payload = {
        ...query,
        product: undefined,
        productId: query?.product?.id,
      }
      const resp = await apiClient.inventory.listNameChangeItems(payload)
      this.nameChangeItemList = resp.data.items ?? []
      this.nameChangeItemListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    setPreFormModel(nameChange: NameChange) {
      this.preFormModel = _.cloneDeep(nameChange)
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(this.preFormModel)
      this.preFormModel = _.cloneDeep(emptyNameChange)
    },
    resetItemModel(itemModel: NameChangeItem = emptyNameChangeItem) {
      console.log(itemModel)
      this.itemModel = _.cloneDeep(itemModel)
    },
    resetInventoryItemModel() {
      this.inventoryItemModel = _.cloneDeep(emptyInventoryItem)
    },
    async createNameChange(): Promise<NameChange> {
      const resp = await apiClient.inventory.createNameChange(this.formModel)
      return resp.data
    },
    async removeNameChangeById(id: number): Promise<void> {
      await apiClient.inventory.deleteNameChange(id)
    },
    async getNameChangeById(id: number): Promise<NameChange> {
      const resp = await apiClient.inventory.getNameChange(id)
      this.formModel = resp.data
      return resp.data
    },
    async approveNameChangeById(id: number): Promise<NameChange> {
      const resp = await apiClient.inventory.approveNameChange(id)
      this.formModel = resp.data
      return resp.data
    },
    async rejectNameChangeById(id: number): Promise<NameChange> {
      const resp = await apiClient.inventory.rejectNameChange(id)
      this.formModel = resp.data
      return resp.data
    },
    async updateNameChange(): Promise<void> {
      const id = this.formModel.id!
      await apiClient.inventory.updateNameChange(id, this.formModel)
    },
    getStatusBadgeAttribute(): { color: string; label: string } {
      switch (this.formModel.status) {
        case 'draft':
          return {
            color: 'teal',
            label: '下書き',
          }
        case 'pending':
          return {
            color: 'warning',
            label: '未確認',
          }
        case 'approved':
          return {
            color: 'green',
            label: '確認済',
          }
        case 'rejected':
          return {
            color: 'red',
            label: '拒否',
          }
        case 'cancelled':
          return {
            color: 'grey',
            label: '取消',
          }
      }
      return {
        color: 'grey',
        label: '未定義',
      }
    },

    // NameChangeReport related actions
    async getNameChangeReportList(
      query?: GetNameChangeReportListQuery,
    ): Promise<void> {
      const resp = await apiClient.inventory.listNameChangeReports(query)
      this.nameChangeReportList = resp.data.items ?? []
      this.nameChangeReportListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async generateNameChangeReport(request: NameChangeReportReq): Promise<string> {
      const resp = await apiClient.inventory.generateNameChangeReport(request)
      return resp.data.reportId ?? ''
    },
    async getNameChangeReportStatus(reportId: string): Promise<NameChangeReport> {
      const resp = await apiClient.inventory.getNameChangeReportStatus(reportId)
      return resp.data
    },
    async downloadNameChangeReport(reportId: string): Promise<File> {
      const resp = await apiClient.inventory.downloadNameChangeReport(reportId)
      return resp.data
    },
    getNameChangeReportDownloadUrl(reportId: string): string {
      return (
        apiClient.baseUrl + `/inventory/nameChangeReports/${reportId}/download`
      )
    },
    resetNameChangeReportList() {
      this.nameChangeReportListPagination = { ...defaultPagination }
      this.nameChangeReportList = []
    },
  },
})

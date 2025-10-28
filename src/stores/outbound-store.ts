import { defineStore } from 'pinia'
import type {
  Customer,
  InventoryItem,
  Outbound,
  OutboundItem,
  Warehouse,
  Product,
  OutboundReport,
  OutboundReportReq,
} from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'
import _ from 'lodash'
import Big from 'big.js'

const emptyOutbound: Outbound = {
  items: [],
  status: 'pending',
  currency: 'JPY',
  subtotalAmount: 0,
  taxAmount: 0,
  totalAmount: 0,
}

const emptyOutboundItem: OutboundItem = {
  currency: 'JPY',
  quantity: 0,
  unitPrice: 0,
  lineAmount: 0,
  taxAmount: 0,
}

const emptyInventoryItem: InventoryItem = {}

const ensureOutboundItemDefaults = (
  item: OutboundItem,
  currency: OutboundItem['currency'] = 'JPY',
) => {
  if (!item.currency) {
    item.currency = currency ?? 'JPY'
  }
  if (item.quantity == null) {
    item.quantity = 0
  }
  if (item.unitPrice == null) {
    item.unitPrice = 0
  }
  if (item.lineAmount == null) {
    item.lineAmount = 0
  }
  if (item.taxAmount == null) {
    item.taxAmount = 0
  }
}

const ensureOutboundDefaults = (outbound: Outbound) => {
  const currency: Outbound['currency'] = outbound.currency ?? 'JPY'
  outbound.currency = currency
  if (!outbound.items) {
    outbound.items = []
  }
  outbound.subtotalAmount = outbound.subtotalAmount ?? 0
  outbound.taxAmount = outbound.taxAmount ?? 0
  outbound.totalAmount = outbound.totalAmount ?? 0
  outbound.items?.forEach((item) => ensureOutboundItemDefaults(item, currency))
}

interface GetOutboundItemListQuery {
  page?: number
  itemsPerPage?: number
  lotNumber?: string
  product?: Product
  outboundDateFrom?: string
  outboundDateTo?: string
}

interface GetOutboundListQuery {
  page?: number
  itemsPerPage?: number
  outboundOrderId?: string
  outboundDateFrom?: string
  outboundDateTo?: string
  warehouse?: Warehouse
  customer?: Customer
  status?: string
}

interface GetOutboundReportListQuery {
  page?: number
  itemsPerPage?: number
  warehouseId?: number
  customerId?: number
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  startDate?: string
  endDate?: string
}

export const useOutboundStore = defineStore('outbound', {
  state: () => ({
    outboundListQuery: {} as GetOutboundListQuery,
    outboundList: [] as Outbound[],
    outboundListPagination: { ...defaultPagination },
    preFormModel: _.cloneDeep(emptyOutbound),
    formModel: _.cloneDeep(emptyOutbound),
    itemModel: _.cloneDeep(emptyOutboundItem),
    inventoryItemModel: _.cloneDeep(emptyInventoryItem),
    outboundItemListQuery: {} as GetOutboundItemListQuery,
    outboundItemList: [] as OutboundItem[],
    outboundItemListPagination: { ...defaultPagination },
    // OutboundReport related state
    outboundReportList: [] as OutboundReport[],
    outboundReportListPagination: { ...defaultPagination },
    outboundReportListQuery: {} as GetOutboundReportListQuery,
  }),
  actions: {
    async getOutboundList(query?: GetOutboundListQuery): Promise<void> {
      const payload = {
        ...query,
        warehouse: undefined,
        warehouseId: query?.warehouse?.id,
        customer: undefined,
        customerId: query?.customer?.id,
      }
      const resp = await apiClient.inventory.listOutbounds(payload)
      this.outboundList = (resp.data.items ?? []).map((item) => {
        const clone = _.cloneDeep(item)
        ensureOutboundDefaults(clone)
        return clone
      })
      this.outboundListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async getOutboundItemList(query?: GetOutboundItemListQuery): Promise<void> {
      const payload = {
        ...query,
        product: undefined,
        productId: query?.product?.id,
      }
      const resp = await apiClient.inventory.listOutboundItems(payload)
      this.outboundItemList = resp.data.items ?? []
      this.outboundItemListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    setPreFormModel(outbound: Outbound) {
      const clone = _.cloneDeep(outbound)
      ensureOutboundDefaults(clone)
      this.preFormModel = clone
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(this.preFormModel)
      ensureOutboundDefaults(this.formModel)
      this.preFormModel = _.cloneDeep(emptyOutbound)
      ensureOutboundDefaults(this.preFormModel)
      this.recalculateTotals()
    },
    resetItemModel(itemModel: OutboundItem = emptyOutboundItem) {
      const clone = _.cloneDeep(itemModel)
      ensureOutboundItemDefaults(clone, this.formModel.currency ?? 'JPY')
      this.itemModel = clone
    },
    resetInventoryItemModel() {
      this.inventoryItemModel = _.cloneDeep(emptyInventoryItem)
    },
    async createOutbound(): Promise<Outbound> {
      this.recalculateTotals()
      const resp = await apiClient.inventory.createOutbound(this.formModel)
      return resp.data
    },
    async removeOutboundById(id: number): Promise<void> {
      await apiClient.inventory.deleteOutbound(id)
    },
    async getOutboundById(id: number): Promise<Outbound> {
      const resp = await apiClient.inventory.getOutbound(id)
      this.formModel = resp.data
      ensureOutboundDefaults(this.formModel)
      this.recalculateTotals()
      return resp.data
    },
    async approveOutboundById(id: number): Promise<Outbound> {
      const resp = await apiClient.inventory.approveOutbound(id)
      this.formModel = resp.data
      ensureOutboundDefaults(this.formModel)
      this.recalculateTotals()
      return resp.data
    },
    async rejectOutboundById(id: number): Promise<Outbound> {
      const resp = await apiClient.inventory.rejectOutbound(id)
      this.formModel = resp.data
      ensureOutboundDefaults(this.formModel)
      this.recalculateTotals()
      return resp.data
    },
    async updateOutbound(): Promise<void> {
      const id = this.formModel.id!
      this.recalculateTotals()
      await apiClient.inventory.updateOutbound(id, this.formModel)
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

    // OutboundReport related actions
    async getOutboundReportList(
      query?: GetOutboundReportListQuery,
    ): Promise<void> {
      const resp = await apiClient.inventory.listOutboundReports(query)
      this.outboundReportList = resp.data.items ?? []
      this.outboundReportListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async generateOutboundReport(request: OutboundReportReq): Promise<string> {
      const resp = await apiClient.inventory.generateOutboundReport(request)
      return resp.data.reportId ?? ''
    },
    async getOutboundReportStatus(reportId: string): Promise<OutboundReport> {
      const resp = await apiClient.inventory.getOutboundReportStatus(reportId)
      return resp.data
    },
    async downloadOutboundReport(reportId: string): Promise<File> {
      const resp = await apiClient.inventory.downloadOutboundReport(reportId)
      return resp.data
    },
    getOutboundReportDownloadUrl(reportId: string): string {
      return (
        apiClient.baseUrl + `/inventory/outboundReports/${reportId}/download`
      )
    },
    recalculateTotals(): void {
      ensureOutboundDefaults(this.formModel)
      const items = this.formModel.items ?? []
      let subtotal = new Big(0)
      let tax = new Big(0)

      items.forEach((item) => {
        ensureOutboundItemDefaults(item, this.formModel.currency ?? 'JPY')
        if (item.quantity != null && item.unitPrice != null) {
          const computed = new Big(item.unitPrice).times(item.quantity)
          if (item.lineAmount == null || item.lineAmount === 0) {
            item.lineAmount = computed.toNumber()
          }
        }
        if (item.lineAmount != null) {
          subtotal = subtotal.plus(item.lineAmount)
        } else if (item.quantity != null && item.unitPrice != null) {
          subtotal = subtotal.plus(new Big(item.unitPrice).times(item.quantity))
        }
        if (item.taxAmount != null) {
          tax = tax.plus(item.taxAmount)
        }
      })

      this.formModel.subtotalAmount = subtotal.toNumber()
      this.formModel.taxAmount = tax.toNumber()
      this.formModel.totalAmount = subtotal.plus(tax).toNumber()
    },
    resetOutboundReportList() {
      this.outboundReportListPagination = { ...defaultPagination }
      this.outboundReportList = []
    },
  },
})

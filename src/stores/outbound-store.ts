import { defineStore } from 'pinia'
import type {
  Customer,
  InventoryItem,
  Outbound,
  OutboundItem,
  Warehouse,
  Product,
} from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'
import _ from 'lodash'

const emptyOutbound: Outbound = {
  items: [],
  status: 'pending',
}

const emptyOutboundItem: OutboundItem = {}

const emptyInventoryItem: InventoryItem = {}

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
      this.outboundList = resp.data.items ?? []
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
      this.preFormModel = _.cloneDeep(outbound)
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(this.preFormModel)
      this.preFormModel = _.cloneDeep(emptyOutbound)
    },
    resetItemModel(itemModel: OutboundItem = emptyOutboundItem) {
      console.log(itemModel)
      this.itemModel = _.cloneDeep(itemModel)
    },
    resetInventoryItemModel() {
      this.inventoryItemModel = _.cloneDeep(emptyInventoryItem)
    },
    async createOutbound(): Promise<Outbound> {
      const resp = await apiClient.inventory.createOutbound(this.formModel)
      return resp.data
    },
    async removeOutboundById(id: number): Promise<void> {
      await apiClient.inventory.deleteOutbound(id)
    },
    async getOutboundById(id: number): Promise<Outbound> {
      const resp = await apiClient.inventory.getOutbound(id)
      this.formModel = resp.data
      return resp.data
    },
    async approveOutboundById(id: number): Promise<Outbound> {
      const resp = await apiClient.inventory.approveOutbound(id)
      this.formModel = resp.data
      return resp.data
    },
    async rejectOutboundById(id: number): Promise<Outbound> {
      const resp = await apiClient.inventory.rejectOutbound(id)
      this.formModel = resp.data
      return resp.data
    },
    async updateOutbound(): Promise<void> {
      const id = this.formModel.id!
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
  },
})

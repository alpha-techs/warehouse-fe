import { defineStore } from 'pinia'
import type { Inbound, InboundItem, Product, Warehouse } from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'
import _ from 'lodash'

const emptyInbound: Inbound = {
  items: [],
  storageFeePlans: [],
  status: 'pending',
}

const emptyItem: InboundItem = {}

interface GetInboundItemListQuery {
  page?: number;
  itemsPerPage?: number;
  lotNumber?: string;
  product?: Product;
  inboundDateFrom?: string;
  inboundDateTo?: string;
}

interface GetInboundListQuery {
  page?: number;
  itemsPerPage?: number;
  inboundOrderId?: string;
  inboundDateFrom?: string;
  inboundDateTo?: string;
  warehouse?: Warehouse;
  status?: string;
}

export const useInboundStore = defineStore('inbound', {
  state: () => ({
    inboundListQuery: {} as GetInboundListQuery,
    inboundList: [] as Inbound[],
    inboundListPagination: {...defaultPagination},
    formModel: _.cloneDeep(emptyInbound),
    itemModel: _.cloneDeep(emptyItem),
    inboundItemListQuery: {} as GetInboundItemListQuery,
    inboundItemList: [] as InboundItem[],
    inboundItemListPagination: {...defaultPagination},
  }),
  actions: {
    async getInboundList(
      query?: GetInboundListQuery,
    ): Promise<void> {
      const payload = {
        ...query,
        warehouse: undefined,
        warehouseId: query?.warehouse?.id
      }
      const resp = await apiClient.inventory.listInbounds(payload)
      this.inboundList = resp.data.items ?? []
      this.inboundListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(emptyInbound)
    },
    resetItemModel(itemModel: InboundItem = emptyItem) {
      this.itemModel = _.cloneDeep(itemModel)
    },
    async createInbound(): Promise<Inbound> {
      const resp = await apiClient.inventory.createInbound(this.formModel)
      return resp.data
    },
    async removeInboundById(id: number): Promise<void> {
      await apiClient.inventory.deleteInbound(id)
    },
    async getInboundById(id: number): Promise<Inbound> {
      const resp = await apiClient.inventory.getInbound(id)
      this.formModel = resp.data
      return resp.data
    },
    async approveInboundById(id: number): Promise<Inbound> {
      const resp = await apiClient.inventory.approveInbound(id)
      this.formModel = resp.data
      return resp.data
    },
    async rejectInboundById(id: number): Promise<Inbound> {
      const resp = await apiClient.inventory.rejectInbound(id)
      this.formModel = resp.data
      return resp.data
    },
    async updateInbound(): Promise<void> {
      const id = this.formModel.id!
      await apiClient.inventory.updateInbound(id, this.formModel)
    },
    async getInboundItemList(
      query?: GetInboundItemListQuery,
    ): Promise<void> {
      const payload = {
        ...query,
        product: undefined,
        productId: query?.product?.id
      }
      const resp = await apiClient.inventory.listInboundItems(payload)
      this.inboundItemList = resp.data.items ?? []
      this.inboundItemListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    getStatusBadgeAttribute(): { color: string, label: string } {
      return this.getStatusBadgeAttributeFromStatus(this.formModel.status)
    },
    getStatusBadgeAttributeFromStatus: (status?: string): { color: string; label: string } => {
      switch (status) {
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
    }
  }
});

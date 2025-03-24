import { defineStore } from 'pinia'
import type { Inbound, InboundItem } from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'
import _ from 'lodash'

const emptyInbound: Inbound = {
  items: [],
  storageFeePlans: [],
  status: 'pending',
}

const emptyItem: InboundItem = {}

export const useInboundStore = defineStore('inbound', {
  state: () => ({
    inboundList: [] as Inbound[],
    inboundListPagination: {...defaultPagination},
    formModel: _.cloneDeep(emptyInbound),
    itemModel: _.cloneDeep(emptyItem),
  }),
  actions: {
    async getInboundList(
      query?: {
        page?: number;
        itemsPerPage?: number;
      }
    ): Promise<void> {
      const resp = await apiClient.inventory.listInbounds(query)
      this.inboundList = resp.data.items ?? []
      this.inboundListPagination = {
        ...resp.data.pagination,
        ...defaultPagination,
      }
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(emptyInbound)
    },
    resetItemModel() {
      this.itemModel = _.cloneDeep(emptyItem)
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
    getStatusBadgeAttribute(): { color: string, label: string } {
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
  }
});

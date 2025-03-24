import { defineStore } from 'pinia'
import type { InventoryItem, Outbound, OutboundItem } from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'

const emptyOutbound: Outbound = {
  items: [],
  status: 'pending',
}

export const useOutboundStore = defineStore('outbound', {
  state: () => ({
    outboundList: [] as Outbound[],
    outboundListPagination: {...defaultPagination},
    formModel: {...emptyOutbound},
    itemModel: {} as OutboundItem,
    inventoryItemModel: {} as InventoryItem,
  }),
  actions: {
    async getOutboundList(
      query?: {
        page?: number;
        itemsPerPage?: number;
      }
    ): Promise<void> {
      const resp = await apiClient.inventory.listOutbounds(query)
      this.outboundList = resp.data.items ?? []
      this.outboundListPagination = {
        ...resp.data.pagination,
        ...defaultPagination,
      }
    },
    resetFormModel() {
      this.formModel = {...emptyOutbound}
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
  }
})

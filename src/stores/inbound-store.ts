import { defineStore } from 'pinia'
import type { Inbound, InboundItem } from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'

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
    formModel: {...emptyInbound},
    itemModel: {...emptyItem},
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
      this.formModel = {...emptyInbound}
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
  }
});

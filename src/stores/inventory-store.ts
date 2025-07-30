import { defineStore } from 'pinia'
import type { InventoryItem, Product, Warehouse, InventoryItemDetailResp } from 'src/api/Api'
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

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventoryList: [] as InventoryItem[],
    inventoryListPagination: { ...defaultPagination },
    inventoryItemListQuery: {} as GetInventoryItemListQuery,
    inventoryItemDetail: null as InventoryItemDetailResp | null,
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
  },
})

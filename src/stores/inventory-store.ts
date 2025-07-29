import { defineStore } from 'pinia'
import type { InventoryItem, Product, Warehouse } from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'

interface GetInventoryItemListQuery {
  page?: number;
  itemsPerPage?: number;
  lotNumber?: string;
  warehouse?: Warehouse;
  product?: Product;
  inboundDateFrom?: string;
  inboundDateTo?: string;
}

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventoryList: [] as InventoryItem[],
    inventoryListPagination: {...defaultPagination},
    inventoryItemListQuery: {} as GetInventoryItemListQuery,
  }),
  actions: {
    async getInventoryList(
      query?: GetInventoryItemListQuery,
    ): Promise<void> {
      const payload = {
        ...query,
        warehouse: undefined,
        warehouseId: query?.warehouse?.id,
        product: undefined,
        productId: query?.product?.id,
      }

      const resp = await apiClient.inventory.listInventory(payload)
      this.inventoryList = resp.data.items?? []
      this.inventoryListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    resetList() {
      this.inventoryListPagination = {...defaultPagination}
      this.inventoryList = []
    },
  }
})

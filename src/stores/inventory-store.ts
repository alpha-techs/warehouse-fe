import { defineStore } from 'pinia'
import type { InventoryItem } from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'
import { apiClient } from 'src/utils/api-client'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventoryList: [] as InventoryItem[],
    inventoryListPagination: {...defaultPagination},
  }),
  actions: {
    async getInventoryList(
      query?: {
        page?: number;
        itemsPerPage?: number;
        warehouseId?: number;
        customerId?: number;
        productId?: number;
      }
    ): Promise<void> {
      const resp = await apiClient.inventory.listInventory(query)
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

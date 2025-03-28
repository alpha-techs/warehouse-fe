import { apiClient } from 'src/utils/api-client'
import { defineStore } from 'pinia'
import type { Warehouse } from 'src/api/Api'
import { defaultPagination } from 'src/utils/pagination'

const emptyWarehouse: Warehouse = {
  address: {} as Warehouse['address'],
}

export const useWarehouseStore = defineStore('warehouse', {
  state: () => ({
    warehouseList: [] as Warehouse[],
    warehouseListPagination: {...defaultPagination},
    formModel: {...emptyWarehouse},
    warehouseOptions: [] as {
      id: number,
      name: string,
    }[],
  }),
  actions: {
    async getWarehouseList(
      query?: {
        page?: number;
        itemsPerPage?: number;
      }
    ): Promise<void> {
      const resp = await apiClient.warehouses.listWarehouses(query)
      this.warehouseList = resp.data.items?? []
      this.warehouseListPagination = {
        ...resp.data.pagination,
        ...defaultPagination,
      }
    },
    resetFormModel() {
      this.formModel = { ...emptyWarehouse }
    },
    async createWarehouse(): Promise<Warehouse> {
      const resp = await apiClient.warehouse.createWarehouse(this.formModel)
      return resp.data
    },
    async removeWarehouseById(id: number): Promise<void> {
      await apiClient.warehouse.deleteWarehouse(id)
    },
    async getWarehouseById(id: number): Promise<Warehouse> {
      const resp = await apiClient.warehouse.getWarehouse(id)
      this.formModel = resp.data
      return resp.data
    },
    async getWarehouseOptions(name?: string): Promise<void> {
      const resp = await apiClient.warehouses.listWarehouses({name});
      this.warehouseOptions = resp.data.items?.map(item => ({
        id: item.id!,
        name: item.name!,
      }))?? [];
    }
  }
})

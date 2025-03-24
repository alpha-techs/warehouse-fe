import { defineStore } from 'pinia'
import type { Product } from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import { defaultPagination } from 'src/utils/pagination'
import _ from 'lodash'

const emptyProduct: Product = {
  dimension: {} as Product['dimension'],
  hasSubPackage: false,
  isFixedWeight: true,
}

export const useProductStore = defineStore('product', {
  state: () => ({
    productList: [] as Product[],
    productListPagination: {...defaultPagination},
    formModel: _.cloneDeep(emptyProduct),
    productOptions: [] as {
      id: number,
      name: string,
    }[],
  }),
  actions: {
    async getProductList(
      query?: {
        page?: number;
        itemsPerPage?: number;
        name?: string;
        sku?: string;
        isActive?: boolean;
      }
    ): Promise<void> {
      const resp = await apiClient.products.listProducts(query)
      this.productList = resp.data.items ?? []
      this.productListPagination = {
        ...resp.data.pagination,
        ...defaultPagination,
      }
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(emptyProduct)
    },
    async createProduct(): Promise<Product> {
      const resp = await apiClient.product.createProduct(this.formModel)
      return resp.data
    },
    async removeProductById(id: number): Promise<void> {
      await apiClient.product.deleteProduct(id)
    },
    async getProductById(id: number): Promise<Product> {
      const resp = await apiClient.product.getProduct(id)
      this.formModel = resp.data
      return resp.data
    },
    async getProductOptions(name?: string): Promise<void> {
      const resp = await apiClient.products.listProducts({name});
      this.productOptions = resp.data.items?.map(item => ({
        id: item.id!,
        name: item.name!,
      })) ?? [];
    },
    async updateProduct(): Promise<void> {
      const id = this.formModel.id!
      await apiClient.product.updateProduct(id, this.formModel)
    },
  }
})

import { defineStore } from 'pinia'
import type { Product } from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import { defaultPagination } from 'src/utils/pagination'
import _ from 'lodash'

const emptyProduct: Product = {
  dimension: {} as Product['dimension'],
  hasSubPackage: false,
  isFixedWeight: true,
  images: [],
}

const normalizeProduct = (product?: Product): Product => {
  const base = _.cloneDeep(emptyProduct)
  if (!product) {
    return base
  }

  const normalized: Product = {
    ...base,
    ...product,
  }

  normalized.dimension = {
    ...base.dimension,
    ...product.dimension,
  }

  const sortedImages = [...(product.images ?? [])].sort((a, b) => {
    const orderA = a.order ?? 0
    const orderB = b.order ?? 0
    return orderA - orderB
  })

  normalized.images = sortedImages.map((image, index) => ({
    ...image,
    order: index,
  }))

  return normalized
}

interface GetProductListQuery {
  page: number
  itemsPerPage: number
  name?: string
  sku?: string
  isActive?: boolean
}

export const useProductStore = defineStore('product', {
  state: () => ({
    productList: [] as Product[],
    productListPagination: {...defaultPagination},
    formModel: _.cloneDeep(emptyProduct),
    productOptions: [] as Product[],
    productListQuery: {} as GetProductListQuery,
  }),
  actions: {
    async getProductList(
      query?: GetProductListQuery,
    ): Promise<void> {
      const resp = await apiClient.products.listProducts(query)
      this.productList = resp.data.items ?? []
      this.productListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    resetFormModel() {
      this.formModel = normalizeProduct()
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
      this.formModel = normalizeProduct(resp.data)
      return resp.data
    },
    async getProductOptions(name?: string): Promise<void> {
      const resp = await apiClient.products.listProducts({name});
      this.productOptions = resp.data.items ?? [];
    },
    async updateProduct(): Promise<void> {
      const id = this.formModel.id!
      await apiClient.product.updateProduct(id, this.formModel)
    },
  }
})

import { defineStore } from 'pinia'
import type { Container, ContainerItem } from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import { defaultPagination } from 'src/utils/pagination'
import _ from 'lodash'

const emptyContainer: Container = {
  items: [],
}

const emptyItem: ContainerItem = {}

interface GetContainerListQuery {
  page: number
  itemsPerPage: number
  containerNumber?: string
  "statuses[]"?: (
    | "shipping"
    | "arrived"
    | "customsClearance"
    | "discharging"
    | "discharged"
    | "empty"
    | "returned"
    | "canceled"
    )[]
}

export const useContainerStore = defineStore('container', {
  state: () => ({
    containerList: [] as Container[],
    containerListPagination: {...defaultPagination},
    formModel: _.cloneDeep(emptyContainer),
    itemModel: _.cloneDeep(emptyItem),
    containerListQuery: {} as GetContainerListQuery,
  }),
  actions: {
    async getContainerList(
      query?: GetContainerListQuery,
    ): Promise<void> {
      const resp = await apiClient.containers.listContainers(query)
      this.containerList = resp.data.items ?? []
      this.containerListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(emptyContainer)
    },
    resetItemModel(itemModel: ContainerItem = emptyItem) {
      this.itemModel = _.cloneDeep(itemModel)
    },
    async createContainer(): Promise<Container> {
      const resp = await apiClient.container.createContainer(this.formModel)
      return resp.data
    },
    async removeContainerById(id: number): Promise<void> {
      await apiClient.container.deleteContainer(id)
    },
    async getContainerById(id: number): Promise<Container> {
      const resp = await apiClient.container.getContainer(id)
      this.formModel = resp.data
      return resp.data
    },
    async updateContainer(): Promise<void> {
      const id = this.formModel.id!
      await apiClient.container.updateContainer(id, this.formModel)
    },
  }
})

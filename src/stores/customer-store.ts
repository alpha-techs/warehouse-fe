import { defineStore } from 'pinia'
import { defaultPagination } from 'src/utils/pagination'
import type { Customer, CustomerContact } from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import _ from 'lodash'

const emptyCustomer: Customer = {
  address: {} as Customer['address'],
  contacts: [] as CustomerContact[],
}

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customerList: [] as Customer[],
    customerListPagination: {...defaultPagination},
    formModel: _.cloneDeep(emptyCustomer),
    customerOptions: [] as {
      id: number,
      name: string,
    }[],
  }),
  actions: {
    async getCustomerList(
      query?: {
        page?: number;
        itemsPerPage?: number;
        name?: string;
      }
    ): Promise<void> {
      const resp = await apiClient.customers.listCustomers(query)
      this.customerList = resp.data.items?? []
      this.customerListPagination = {
        ...resp.data.pagination,
        ...defaultPagination,
      }
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(emptyCustomer)
    },
    async createCustomer(): Promise<Customer> {
      const resp = await apiClient.customer.createCustomer(this.formModel)
      return resp.data
    },
    async removeCustomerById(id: number): Promise<void> {
      await apiClient.customer.deleteCustomer(id)
    },
    async getCustomerById(id: number): Promise<Customer> {
      const resp = await apiClient.customer.getCustomer(id)
      this.formModel = resp.data
      return resp.data
    },
    async getCustomerOptions(name?: string): Promise<void> {
      const resp = await apiClient.customers.listCustomers({name});
      this.customerOptions = resp.data.items?.map(item => ({
        id: item.id!,
        name: item.name!,
      }))?? [];
    },
    async updateCustomer(): Promise<void> {
      const id = this.formModel.id!
      await apiClient.customer.updateCustomer(id, this.formModel)
    },
  }
})

import { defineStore } from 'pinia'
import type {
  Address,
  Customer,
  Order,
  OrderItem,
  OrderPrint,
  OrderPrintReq,
  OrderPrintResp,
  Product,
  CreateOrderReq,
  UpdateOrderReq,
} from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import { defaultPagination } from 'src/utils/pagination'
import _ from 'lodash'
import Big from 'big.js'

export type OrderFormItem = OrderItem & { product?: Product }

export type OrderFormModel = Order & {
  customer?: Customer
  items?: OrderFormItem[]
}

const emptyAddress: Address = {}

const emptyOrder: OrderFormModel = {
  status: 'draft',
  currency: 'JPY',
  deliveryAddress: _.cloneDeep(emptyAddress),
  items: [],
  totalAmount: 0,
}

const emptyOrderItem: OrderFormItem = {
  quantity: 0,
  unit: '',
  unitPrice: 0,
  lineAmount: 0,
  currency: 'JPY',
}

const ensureOrderItemDefaults = (
  item: OrderFormItem,
  currency: Order['currency'] = 'JPY',
) => {
  if (item.currency == null) {
    item.currency = currency ?? 'JPY'
  }
  if (item.quantity == null) {
    item.quantity = 0
  }
  if (item.unit == null) {
    item.unit = ''
  }
  if (item.unitPrice == null) {
    item.unitPrice = 0
  }
  if (item.lineAmount == null) {
    item.lineAmount = 0
  }
}

const ensureOrderDefaults = (order: OrderFormModel) => {
  order.status = order.status ?? 'draft'
  order.currency = order.currency ?? 'JPY'
  order.deliveryAddress = order.deliveryAddress ?? _.cloneDeep(emptyAddress)
  if (!order.items) {
    order.items = []
  }
  order.items.forEach((item) => ensureOrderItemDefaults(item, order.currency))
  order.totalAmount = order.totalAmount ?? 0
}

interface GetOrderListQuery {
  page?: number
  itemsPerPage?: number
  orderNumber?: string
  customerId?: number
  status?: Order['status']
  deliveryDueStart?: string
  deliveryDueEnd?: string
}

interface OrderPrintListQuery {
  page?: number
  itemsPerPage?: number
  orderNumber?: string
  customerId?: number
  status?: OrderPrint['status']
  startDate?: string
  endDate?: string
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderListQuery: {} as GetOrderListQuery,
    orderList: [] as Order[],
    orderListPagination: { ...defaultPagination },
    preFormModel: _.cloneDeep(emptyOrder),
    formModel: _.cloneDeep(emptyOrder),
    itemModel: _.cloneDeep(emptyOrderItem),
    orderPrintListQuery: {} as OrderPrintListQuery,
    orderPrintList: [] as OrderPrint[],
    orderPrintListPagination: { ...defaultPagination },
  }),
  actions: {
    async getOrderList(query?: GetOrderListQuery): Promise<void> {
      const payload = {
        page: query?.page,
        itemsPerPage: query?.itemsPerPage,
        orderNumber: query?.orderNumber,
        customerId: query?.customerId,
        status: query?.status,
        deliveryDueStart: query?.deliveryDueStart,
        deliveryDueEnd: query?.deliveryDueEnd,
      }
      const resp = await apiClient.procurement.listOrders(payload)
      this.orderList = (resp.data.items ?? []).map((item) => {
        const clone = _.cloneDeep(item)
        ensureOrderDefaults(clone)
        return clone
      })
      this.orderListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    setPreFormModel(order: OrderFormModel) {
      const clone = _.cloneDeep(order)
      ensureOrderDefaults(clone)
      this.preFormModel = clone
    },
    hydrateForm(order: OrderFormModel) {
      this.preFormModel = _.cloneDeep(order)
      ensureOrderDefaults(this.preFormModel)
      this.formModel = _.cloneDeep(this.preFormModel)
      ensureOrderDefaults(this.formModel)
      this.recalculateTotals()
    },
    prepareNewOrder() {
      this.preFormModel = _.cloneDeep(emptyOrder)
      ensureOrderDefaults(this.preFormModel)
      this.formModel = _.cloneDeep(emptyOrder)
      ensureOrderDefaults(this.formModel)
      this.recalculateTotals()
    },
    resetFormModel() {
      this.formModel = _.cloneDeep(this.preFormModel)
      ensureOrderDefaults(this.formModel)
      this.preFormModel = _.cloneDeep(emptyOrder)
      ensureOrderDefaults(this.preFormModel)
      this.recalculateTotals()
    },
    resetItemModel(itemModel: OrderFormItem = emptyOrderItem) {
      const clone = _.cloneDeep(itemModel)
      ensureOrderItemDefaults(clone, this.formModel.currency ?? 'JPY')
      this.itemModel = clone
    },
    ensureFormDefaults() {
      ensureOrderDefaults(this.formModel)
    },
    recalculateTotals() {
      if (!this.formModel.items) {
        this.formModel.items = []
      }
      const currency = this.formModel.currency ?? 'JPY'
      let total = new Big(0)
      this.formModel.items.forEach((item) => {
        ensureOrderItemDefaults(item, currency)
        const quantity = new Big(item.quantity ?? 0)
        const unitPrice = new Big(item.unitPrice ?? 0)
        const lineAmount = quantity.times(unitPrice)
        item.lineAmount = lineAmount.toNumber()
        total = total.plus(lineAmount)
      })
      this.formModel.totalAmount = total.toNumber()
    },
    async createOrder(): Promise<Order> {
      this.recalculateTotals()
      const items = (this.formModel.items ?? [])
        .filter((item) => item.product?.id)
        .map((item) => ({
          productId: item.product?.id ?? 0,
          quantity: item.quantity ?? 0,
          unit: item.unit ?? '',
          unitPrice: item.unitPrice ?? 0,
          currency: item.currency ?? this.formModel.currency ?? 'JPY',
          note: item.note,
        }))

      const payload = {
        customerId: this.formModel.customer?.id,
        deliveryDueDate: this.formModel.deliveryDueDate,
        deliveryAddress: {
          postalCode: this.formModel.deliveryAddress?.postalCode,
          detailAddress1: this.formModel.deliveryAddress?.detailAddress1,
          detailAddress2: this.formModel.deliveryAddress?.detailAddress2,
        },
        contactName: this.formModel.contactName,
        contactPhone: this.formModel.contactPhone,
        items,
        notes: this.formModel.notes,
      } as CreateOrderReq
      const resp = await apiClient.procurement.createOrder(payload)
      return resp.data
    },
    async updateOrder(): Promise<Order> {
      const id = this.formModel.id!
      this.recalculateTotals()
      const items = (this.formModel.items ?? [])
        .filter((item) => item.product?.id)
        .map((item) => ({
          productId: item.product?.id ?? 0,
          quantity: item.quantity ?? 0,
          unit: item.unit ?? '',
          unitPrice: item.unitPrice ?? 0,
          currency: item.currency ?? this.formModel.currency ?? 'JPY',
          note: item.note,
        }))

      const payload = {
        deliveryDueDate: this.formModel.deliveryDueDate,
        deliveryAddress: this.formModel.deliveryAddress,
        contactName: this.formModel.contactName,
        contactPhone: this.formModel.contactPhone,
        items,
        notes: this.formModel.notes,
      } as UpdateOrderReq
      const resp = await apiClient.procurement.updateOrder(id, payload)
      this.formModel = resp.data as OrderFormModel
      ensureOrderDefaults(this.formModel)
      this.recalculateTotals()
      return resp.data
    },
    async cancelOrderById(id: number): Promise<Order> {
      const resp = await apiClient.procurement.cancelOrderAction(id)
      if (this.formModel.id === id) {
        this.formModel = resp.data as OrderFormModel
        ensureOrderDefaults(this.formModel)
        this.recalculateTotals()
      }
      return resp.data
    },
    async submitOrderById(id: number): Promise<Order> {
      const resp = await apiClient.procurement.submitOrder(id)
      if (this.formModel.id === id) {
        this.formModel = resp.data as OrderFormModel
        ensureOrderDefaults(this.formModel)
        this.recalculateTotals()
      }
      return resp.data
    },
    async sendOrderById(id: number): Promise<Order> {
      const resp = await apiClient.procurement.sendOrder(id)
      if (this.formModel.id === id) {
        this.formModel = resp.data as OrderFormModel
        ensureOrderDefaults(this.formModel)
        this.recalculateTotals()
      }
      return resp.data
    },
    async completeOrderById(id: number): Promise<Order> {
      const resp = await apiClient.procurement.completeOrder(id)
      if (this.formModel.id === id) {
        this.formModel = resp.data as OrderFormModel
        ensureOrderDefaults(this.formModel)
        this.recalculateTotals()
      }
      return resp.data
    },
    async getOrderById(id: number): Promise<Order> {
      const resp = await apiClient.procurement.getOrder(id)
      this.formModel = resp.data as OrderFormModel
      ensureOrderDefaults(this.formModel)
      this.recalculateTotals()
      return resp.data
    },
    async getOrderPrintList(query?: OrderPrintListQuery): Promise<void> {
      const payload = {
        page: query?.page,
        itemsPerPage: query?.itemsPerPage,
        orderNumber: query?.orderNumber,
        customerId: query?.customerId,
        status: query?.status,
        startDate: query?.startDate,
        endDate: query?.endDate,
      }
      const resp = await apiClient.procurement.listOrderPrints(payload)
      this.orderPrintList = resp.data.items ?? []
      this.orderPrintListPagination = {
        ...defaultPagination,
        ...resp.data.pagination,
      }
    },
    async generateOrderPrint(request: OrderPrintReq): Promise<OrderPrintResp> {
      const resp = await apiClient.procurement.generateOrderPrint(request)
      return resp.data
    },
    async getOrderPrintStatus(printId: string): Promise<OrderPrint> {
      const resp = await apiClient.procurement.getOrderPrintStatus(printId)
      return resp.data
    },
    async downloadOrderPrint(printId: string): Promise<File> {
      const resp = await apiClient.procurement.downloadOrderPrint(printId)
      return resp.data
    },
    getOrderPrintDownloadUrl(printId: string): string {
      return `${apiClient.baseUrl}/procurement/orderPrints/${printId}/download`
    },
  },
})

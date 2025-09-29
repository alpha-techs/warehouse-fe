<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, useTemplateRef, type Ref } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { useCustomerStore } from 'stores/customer-store'
import type { QTable, QTableProps } from 'quasar'
import { useRouter } from 'vue-router'
import type { FePagination } from 'src/utils/pagination'
import { toastFormError } from 'src/utils/error-handler'
import { Notify } from 'quasar'
import type { Order, OrderPrintReq } from 'src/api/Api'

const loading = ref(false)
const generateLoading = ref<number | null>(null)
const transitionLoading = ref<{ id: number; action: 'submit' | 'send' | 'complete' | 'cancel' } | null>(null)
const tableRef = useTemplateRef<QTable | undefined>('tableRef')

const orderStore = useOrderStore()
const {
  orderList: rows,
  orderListPagination,
  orderListQuery: searchParams,
} = storeToRefs(orderStore)

const customerStore = useCustomerStore()
const { customerOptions } = storeToRefs(customerStore)
const onFilterCustomer = async (
  inputValue: string,
  doneFn: (callbackFn: () => void) => void,
) => {
  if (!inputValue || !inputValue.length) {
    await customerStore.getCustomerOptions()
    doneFn(() => {})
  } else {
    await customerStore.getCustomerOptions(inputValue)
    doneFn(() => {})
  }
}

const statusOptions = [
  { label: 'すべて', value: undefined },
  { label: '下書き', value: 'draft' },
  { label: '依頼済', value: 'requested' },
  { label: '送付済', value: 'sent' },
  { label: '完了', value: 'completed' },
  { label: '取消', value: 'cancelled' },
]

const columns: QTableProps['columns'] = [
  {
    label: '注文番号',
    name: 'orderNumber',
    field: 'orderNumber',
    align: 'left',
  },
  { label: 'お客様', name: 'customer', field: 'customer', align: 'left' },
  {
    label: '納期',
    name: 'deliveryDueDate',
    field: 'deliveryDueDate',
    align: 'left',
  },
  {
    label: '合計金額',
    name: 'totalAmount',
    field: 'totalAmount',
    align: 'right',
  },
  { label: '状態', name: 'status', field: 'status', align: 'left' },
  { label: '作成日', name: 'createdAt', field: 'createdAt', align: 'left' },
  { label: '操作', name: 'actions', field: 'actions', align: 'right' },
]

const pagination: Ref<FePagination> = ref({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
})

const maxPage = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
})

onMounted(async () => {
  if (!customerOptions.value.length) {
    await useCustomerStore().getCustomerOptions()
  }
  if (tableRef.value) {
    void tableRef.value.requestServerInteraction()
  }
})

const search = () => {
  if (tableRef.value) {
    void tableRef.value.requestServerInteraction({
      pagination: { ...pagination.value, page: 1 },
    })
  }
}

const formatDate = (value?: string) => value ?? '-'
const formatAmount = (value?: number) => {
  if (value == null) {
    return '-'
  }
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(value)
}

const statusMeta = (status: Order['status']) => {
  switch (status) {
    case 'draft':
      return { color: 'grey', label: '下書き' }
    case 'requested':
      return { color: 'orange', label: '依頼済' }
    case 'sent':
      return { color: 'blue', label: '送付済' }
    case 'completed':
      return { color: 'green', label: '完了' }
    case 'cancelled':
      return { color: 'red', label: '取消' }
    default:
      return { color: 'grey', label: '未定義' }
  }
}

const canEditOrder = (status?: Order['status']) => status === 'draft' || status === 'requested'
const canSubmitOrder = (status?: Order['status']) => status === 'draft'
const canSendOrder = (status?: Order['status']) => status === 'requested'
const canCompleteOrder = (status?: Order['status']) => status === 'sent'
const isCancelDisabled = (status?: Order['status']) => status === 'cancelled' || status === 'completed'

const onRequest = async ({
  pagination: _pagination,
}: {
  pagination: { page: number; rowsPerPage: number }
}) => {
  try {
    loading.value = true
    const { page, rowsPerPage } = _pagination
    const query = {
      ...searchParams.value,
      page,
      itemsPerPage: rowsPerPage,
    }
    await orderStore.getOrderList(query)
    pagination.value = {
      page: orderListPagination.value.page,
      rowsPerPage: orderListPagination.value.itemsPerPage,
      rowsNumber: orderListPagination.value.totalItems,
      sortBy: undefined,
      descending: false,
    }
  } catch (error) {
    await toastFormError(error)
  } finally {
    loading.value = false
  }
}

const router = useRouter()
const toCreate = async () => {
  await router.push({ name: 'order-create' })
}

const toDetail = async (id: number) => {
  await router.push({ name: 'order-detail', params: { id } })
}

const toEdit = async (id: number) => {
  await router.push({ name: 'order-edit', params: { id } })
}

const refreshTable = () => {
  if (tableRef.value) {
    void tableRef.value.requestServerInteraction()
  }
}

const handleTransition = async (
  order: Order,
  action: 'submit' | 'send' | 'complete' | 'cancel',
  performer: (id: number) => Promise<Order>,
  successMessage: string,
) => {
  if (!order.id) {
    await toastFormError('注文IDが無効です')
    return
  }
  try {
    transitionLoading.value = { id: order.id, action }
    await performer(order.id)
    Notify.create({ type: 'positive', message: successMessage, position: 'top' })
    refreshTable()
  } catch (error) {
    await toastFormError(error)
  } finally {
    transitionLoading.value = null
  }
}

const submitOrder = async (order: Order) => {
  await handleTransition(order, 'submit', (id) => orderStore.submitOrderById(id), '注文を依頼済に更新しました')
}

const sendOrder = async (order: Order) => {
  await handleTransition(order, 'send', (id) => orderStore.sendOrderById(id), '注文を送付済に更新しました')
}

const completeOrder = async (order: Order) => {
  await handleTransition(order, 'complete', (id) => orderStore.completeOrderById(id), '注文を完了に更新しました')
}

const cancelOrder = async (order: Order) => {
  await handleTransition(order, 'cancel', (id) => orderStore.cancelOrderById(id), '注文を取消しました')
}

const generatePrint = async (order: Order, format: 'excel' = 'excel') => {
  if (!order.id) {
    await toastFormError('注文IDが無効です')
    return
  }
  const request: OrderPrintReq = {
    orderId: order.id,
    format,
  }
  try {
    generateLoading.value = order.id
    const resp = await orderStore.generateOrderPrint(request)
    Notify.create({
      type: 'positive',
      message: `印刷ジョブが作成されました (ID: ${resp.printId ?? '---'})`,
      position: 'top',
      timeout: 3000,
      actions: [
        {
          label: '印刷ジョブ一覧へ',
          color: 'white',
          handler: () => {
            void router.push({ name: 'order-print-list' })
          },
        },
      ],
    })
  } catch (error) {
    await toastFormError(error)
  } finally {
    generateLoading.value = null
  }
}

const onPageChange = () => {
  refreshTable()
}

const isTransitionLoading = (orderId: number | undefined, action: 'submit' | 'send' | 'complete' | 'cancel') => {
  if (orderId == null) {
    return false
  }
  return transitionLoading.value?.id === orderId && transitionLoading.value.action === action
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section class="q-pa-none">
        <q-table
          ref="tableRef"
          :rows="rows"
          :columns="columns"
          row-key="id"
          flat
          hide-pagination
          :loading="loading"
          v-model:pagination="pagination"
          @request="onRequest"
        >
          <template #top>
            <div class="row" style="width: 100%">
              <div class="col-12 q-mb-sm">
                <div class="text-h6">注文一覧</div>
              </div>
              <q-input
                class="q-px-sm"
                v-model="searchParams.orderNumber"
                label="注文番号"
                dense
                clearable
                style="width: 200px"
                @keyup.enter="search"
              />
              <q-select
                class="q-px-sm"
                v-model="searchParams.customerId"
                label="お客様"
                :options="customerOptions"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                @filter="onFilterCustomer"
                dense
                clearable
                use-input
                input-style="width: 0px"
                style="width: 220px"
              />
              <q-select
                class="q-px-sm"
                v-model="searchParams.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                map-options
                emit-value
                label="状態"
                dense
                clearable
                style="width: 160px"
              />
              <q-input
                class="q-px-sm"
                v-model="searchParams.deliveryDueStart"
                label="納期(From)"
                type="date"
                dense
                style="width: 140px"
                @keyup.enter="search"
              />
              <div class="flex items-center" style="padding: 0 4px">～</div>
              <q-input
                class="q-px-sm"
                v-model="searchParams.deliveryDueEnd"
                label="納期(To)"
                type="date"
                dense
                style="width: 140px"
                @keyup.enter="search"
              />
              <q-space />
              <div style="display: flex; align-items: center">
                <q-btn
                  class="q-mx-sm"
                  size="sm"
                  label="検索"
                  color="primary"
                  icon="sym_r_search"
                  :disable="loading"
                  @click="search"
                />
                <q-btn
                  size="sm"
                  label="新規作成"
                  color="primary"
                  icon="sym_r_add"
                  @click="toCreate"
                />
              </div>
            </div>
          </template>
          <template #body-cell-customer="{ row }">
            <td>{{ row.customer?.name ?? '-' }}</td>
          </template>
          <template #body-cell-deliveryDueDate="{ row }">
            <td>{{ formatDate(row.deliveryDueDate) }}</td>
          </template>
          <template #body-cell-totalAmount="{ row }">
            <td class="text-right">{{ formatAmount(row.totalAmount) }}</td>
          </template>
          <template #body-cell-status="{ row }">
            <td>
              <q-chip
                :color="statusMeta(row.status).color"
                text-color="white"
                dense
              >
                {{ statusMeta(row.status).label }}
              </q-chip>
            </td>
          </template>
          <template #body-cell-createdAt="{ row }">
            <td>{{ formatDate(row.createdAt) }}</td>
          </template>
          <template #body-cell-actions="{ row }">
            <td class="text-right">
              <q-btn flat dense size="sm" icon="sym_r_more_vert">
                <q-menu anchor="bottom right" self="top right">
                  <q-list style="min-width: 180px">
                    <q-item clickable v-close-popup @click="toDetail(row.id)">
                      <q-item-section avatar>
                        <q-icon name="sym_r_visibility" />
                      </q-item-section>
                      <q-item-section>詳細を見る</q-item-section>
                    </q-item>
                    <q-item
                      v-if="canEditOrder(row.status)"
                      clickable
                      v-close-popup
                      @click="toEdit(row.id)"
                    >
                      <q-item-section avatar>
                        <q-icon name="sym_r_edit" />
                      </q-item-section>
                      <q-item-section>編集</q-item-section>
                    </q-item>
                    <q-item
                      v-if="canSubmitOrder(row.status)"
                      clickable
                      :disable="isTransitionLoading(row.id, 'submit')"
                      v-close-popup
                      @click="submitOrder(row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="sym_r_publish" />
                      </q-item-section>
                      <q-item-section>依頼済に更新</q-item-section>
                      <q-item-section side v-if="isTransitionLoading(row.id, 'submit')">
                        <q-spinner size="16px" />
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="canSendOrder(row.status)"
                      clickable
                      :disable="isTransitionLoading(row.id, 'send')"
                      v-close-popup
                      @click="sendOrder(row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="sym_r_send" />
                      </q-item-section>
                      <q-item-section>送付済に更新</q-item-section>
                      <q-item-section side v-if="isTransitionLoading(row.id, 'send')">
                        <q-spinner size="16px" />
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="canCompleteOrder(row.status)"
                      clickable
                      :disable="isTransitionLoading(row.id, 'complete')"
                      v-close-popup
                      @click="completeOrder(row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="sym_r_task_alt" />
                      </q-item-section>
                      <q-item-section>完了に更新</q-item-section>
                      <q-item-section side v-if="isTransitionLoading(row.id, 'complete')">
                        <q-spinner size="16px" />
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :disable="isCancelDisabled(row.status) || isTransitionLoading(row.id, 'cancel')"
                      v-close-popup
                      @click="cancelOrder(row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="sym_r_delete" />
                      </q-item-section>
                      <q-item-section>取消</q-item-section>
                      <q-item-section side v-if="isTransitionLoading(row.id, 'cancel')">
                        <q-spinner size="16px" />
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      :disable="generateLoading === row.id"
                      v-close-popup
                      @click="generatePrint(row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="sym_r_table_view" />
                      </q-item-section>
                      <q-item-section>印刷ジョブ作成</q-item-section>
                      <q-item-section side v-if="generateLoading === row.id">
                        <q-spinner size="16px" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </td>
          </template>
        </q-table>
        <q-separator />
        <div class="row justify-center q-my-sm">
          <q-pagination
            v-model="pagination.page"
            color="primary"
            :max="maxPage"
            max-pages="9"
            @update:model-value="onPageChange"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { QTable, QTableProps } from 'quasar'
import type { FePagination } from 'src/utils/pagination'
import { toastFormError } from 'src/utils/error-handler'
import { useOrderStore } from 'stores/order-store'
import { useCustomerStore } from 'stores/customer-store'
import type { OrderPrint } from 'src/api/Api'

const loading = ref(false)
const tableRef = useTemplateRef<QTable | undefined>('tableRef')
const refreshingIds = ref(new Set<string>())

const setRefreshing = (id: string, active: boolean) => {
  const next = new Set(refreshingIds.value)
  if (active) {
    next.add(id)
  } else {
    next.delete(id)
  }
  refreshingIds.value = next
}

const orderStore = useOrderStore()
const {
  orderPrintList: rows,
  orderPrintListPagination,
  orderPrintListQuery: searchParams,
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
  { label: '待機中', value: 'pending' },
  { label: '処理中', value: 'processing' },
  { label: '完了', value: 'completed' },
  { label: '失敗', value: 'failed' },
]

const columns: QTableProps['columns'] = [
  {
    label: 'タスクID',
    name: 'id',
    /** Head of task id column */
    field: (row) => row.id.substring(0, 8),
    align: 'left',
  },
  {
    label: '注文番号',
    name: 'orderNumber',
    field: 'orderNumber',
    align: 'left',
  },
  { label: 'お客様', name: 'customer', field: 'customer', align: 'left' },
  { label: 'フォーマット', name: 'format', field: 'format', align: 'left' },
  { label: '状態', name: 'status', field: 'status', align: 'left' },
  { label: '作成日時', name: 'createdAt', field: 'createdAt', align: 'left' },
  {
    label: '完了日時',
    name: 'completedAt',
    field: 'completedAt',
    align: 'left',
  },
  {
    label: 'ダウンロード期限',
    name: 'expiresAt',
    field: 'expiresAt',
    align: 'left',
  },
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

const router = useRouter()

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
    await orderStore.getOrderPrintList(query)
    pagination.value = {
      page: orderPrintListPagination.value.page,
      rowsPerPage: orderPrintListPagination.value.itemsPerPage,
      rowsNumber: orderPrintListPagination.value.totalItems,
      sortBy: undefined,
      descending: false,
    }
  } catch (error) {
    await toastFormError(error)
  } finally {
    loading.value = false
  }
}

const search = () => {
  if (tableRef.value) {
    void tableRef.value.requestServerInteraction({
      pagination: { ...pagination.value, page: 1 },
    })
  }
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('ja-JP')
}

const getStatusBadge = (status?: OrderPrint['status']) => {
  switch (status) {
    case 'completed':
      return { color: 'positive', label: '完了' }
    case 'processing':
      return { color: 'warning', label: '処理中' }
    case 'pending':
      return { color: 'info', label: '待機中' }
    case 'failed':
      return { color: 'negative', label: '失敗' }
    default:
      return { color: 'grey', label: '未定義' }
  }
}

const refreshStatus = async (print: OrderPrint) => {
  if (!print.id || refreshingIds.value.has(print.id)) {
    return
  }
  setRefreshing(print.id, true)
  try {
    const updated = await orderStore.getOrderPrintStatus(print.id)
    const index = orderStore.orderPrintList.findIndex(
      (item) => item.id === updated.id,
    )
    if (index !== -1) {
      orderStore.orderPrintList.splice(index, 1, updated)
    }
  } catch (error) {
    await toastFormError(error)
  } finally {
    setRefreshing(print.id, false)
  }
}

const downloadPrint = (print: OrderPrint) => {
  if (print.status !== 'completed') {
    return
  }
  const url =
    print.downloadUrl ??
    (print.id ? orderStore.getOrderPrintDownloadUrl(print.id) : undefined)
  if (!url) {
    return
  }
  window.open(url, '_blank')
}

const onPageChange = () => {
  if (tableRef.value) {
    void tableRef.value.requestServerInteraction({
      pagination: pagination.value,
    })
  }
}

const openOrderDetail = (id?: number) => {
  if (!id) {
    return
  }
  void router.push({ name: 'order-detail', params: { id } })
}

onMounted(async () => {
  if (!customerOptions.value.length) {
    await customerStore.getCustomerOptions()
  }
  if (tableRef.value) {
    void tableRef.value.requestServerInteraction()
  }
})
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
              <div class="col-12">
                <div class="row items-center no-wrap">
                  <div class="text-h6">注文印刷ジョブ一覧</div>
                </div>
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
                style="width: 120px"
              />
              <q-input
                class="q-px-sm"
                v-model="searchParams.startDate"
                label="作成日(From)"
                type="date"
                dense
                style="width: 140px"
                @keyup.enter="search"
              />
              <div class="flex items-center" style="padding: 0 4px">～</div>
              <q-input
                class="q-px-sm"
                v-model="searchParams.endDate"
                label="作成日(To)"
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
              </div>
            </div>
          </template>
          <template #body-cell-orderNumber="{ row }">
            <td>
              <q-btn
                flat
                dense
                class="q-pa-none"
                color="primary"
                :disable="!row.order?.id"
                @click="openOrderDetail(row.order?.id)"
              >
                {{ row.order?.orderNumber ?? '-' }}
              </q-btn>
            </td>
          </template>
          <template #body-cell-customer="{ row }">
            <td>{{ row.order?.customer?.name ?? '-' }}</td>
          </template>
          <template #body-cell-status="{ row }">
            <td>
              <div class="row items-center no-wrap q-gutter-xs">
                <q-chip
                  :color="getStatusBadge(row.status).color"
                  text-color="white"
                  dense
                >
                  {{ getStatusBadge(row.status).label }}
                </q-chip>
                <q-icon
                  v-if="row.status === 'failed' && row.errorMessage"
                  name="sym_r_error"
                  color="negative"
                  size="16px"
                >
                  <q-tooltip>{{ row.errorMessage }}</q-tooltip>
                </q-icon>
              </div>
            </td>
          </template>
          <template #body-cell-createdAt="{ row }">
            <td>{{ formatDateTime(row.createdAt) }}</td>
          </template>
          <template #body-cell-completedAt="{ row }">
            <td>{{ formatDateTime(row.completedAt) }}</td>
          </template>
          <template #body-cell-expiresAt="{ row }">
            <td>{{ formatDateTime(row.expiresAt) }}</td>
          </template>
          <template #body-cell-actions="{ row }">
            <td class="text-right">
              <q-btn
                size="sm"
                flat
                dense
                icon="sym_r_refresh"
                @click="refreshStatus(row)"
                :loading="row.id ? refreshingIds.has(row.id) : false"
              />
              <q-btn
                size="sm"
                flat
                dense
                icon="sym_r_download"
                color="primary"
                @click="downloadPrint(row)"
                :disable="row.status !== 'completed'"
              />
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

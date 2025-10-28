<script setup lang="ts">
import { computed, onMounted, ref, type Ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { QTable, QTableProps } from 'quasar'
import type { FePagination } from 'src/utils/pagination'
import { toastFormError } from 'src/utils/error-handler'
import { useInvoicePrintStore } from 'stores/invoice-print-store'
import { useCustomerStore } from 'stores/customer-store'
import type { InvoicePrint } from 'src/api/Api'

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

const invoicePrintStore = useInvoicePrintStore()
const {
  invoicePrintList: rows,
  invoicePrintListPagination,
  invoicePrintListQuery: searchParams,
} = storeToRefs(invoicePrintStore)

const customerStore = useCustomerStore()
const { customerOptions } = storeToRefs(customerStore)

const updateInvoiceNumber = (value: string | number | null) => {
  if (typeof value === 'string') {
    searchParams.value.invoiceNumber = value || undefined
    return
  }
  if (typeof value === 'number') {
    searchParams.value.invoiceNumber = String(value)
    return
  }
  searchParams.value.invoiceNumber = undefined
}

const statusOptions = [
  { label: '待機中', value: 'pending' },
  { label: '処理中', value: 'processing' },
  { label: '完了', value: 'completed' },
  { label: '失敗', value: 'failed' },
]

const columns: QTableProps['columns'] = [
  {
    label: 'タスクID',
    name: 'id',
    field: 'id',
    align: 'left',
  },
  {
    label: '請求書番号',
    name: 'invoiceNumber',
    field: 'invoiceNumber',
    align: 'left',
  },
  {
    label: 'お客様',
    name: 'customer',
    field: 'customer',
    align: 'left',
  },
  {
    label: 'ステータス',
    name: 'status',
    field: 'status',
    align: 'left',
  },
  {
    label: '作成日時',
    name: 'createdAt',
    field: 'createdAt',
    align: 'left',
  },
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
  {
    label: '操作',
    name: 'actions',
    field: 'actions',
    align: 'right',
  },
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
    await invoicePrintStore.getInvoicePrintList(query)
    pagination.value = {
      page: invoicePrintListPagination.value.page,
      rowsPerPage: invoicePrintListPagination.value.itemsPerPage,
      rowsNumber: invoicePrintListPagination.value.totalItems,
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
  tableRef.value?.requestServerInteraction({
    pagination: { ...pagination.value, page: 1 },
  })
}

const onPageChange = () => {
  tableRef.value?.requestServerInteraction({ pagination: pagination.value })
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('ja-JP')
}

const getStatusBadge = (status?: InvoicePrint['status']) => {
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

const refreshStatus = async (print: InvoicePrint) => {
  if (!print.id || refreshingIds.value.has(print.id)) {
    return
  }
  setRefreshing(print.id, true)
  try {
    const updated = await invoicePrintStore.getInvoicePrintStatus(print.id)
    const index = invoicePrintStore.invoicePrintList.findIndex((item) => item.id === updated.id)
    if (index !== -1) {
      invoicePrintStore.invoicePrintList.splice(index, 1, updated)
    }
  } catch (error) {
    await toastFormError(error)
  } finally {
    setRefreshing(print.id, false)
  }
}

const downloadPrint = (print: InvoicePrint) => {
  if (!print.id || print.status !== 'completed') {
    return
  }
  const downloadUrl = invoicePrintStore.getInvoicePrintDownloadUrl(print.id)
  window.open(downloadUrl, '_blank')
}

onMounted(async () => {
  await customerStore.getCustomerOptions()
  tableRef.value?.requestServerInteraction()
})
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-table
              ref="tableRef"
              flat
              :rows="rows"
              :columns="columns"
              row-key="id"
              hide-pagination
              :loading="loading"
              v-model:pagination="pagination"
              @request="onRequest"
            >
              <template #top>
                <div class="row" style="width: 100%">
                  <div class="text-h6 col-12">請求書Excel出力タスク</div>
                  <q-input
                    class="q-px-sm"
                    :model-value="searchParams.invoiceNumber"
                    @update:model-value="updateInvoiceNumber"
                    label="請求書番号"
                    dense
                    clearable
                    style="width: 200px"
                    @keyup.enter="search"
                  />
                  <q-select
                    class="q-px-sm"
                    :model-value="searchParams.customer"
                    @update:model-value="searchParams.customer = $event || undefined"
                    :options="customerOptions"
                    label="お客様"
                    option-label="name"
                    option-value="id"
                    dense
                    use-input
                    clearable
                    input-style="width: 0px"
                    style="width: 220px"
                    @filter="async (val, update) => {
                      update(async () => {
                        await customerStore.getCustomerOptions(val)
                      })
                    }"
                  />
                  <q-select
                    class="q-px-sm"
                    :model-value="searchParams.status"
                    @update:model-value="searchParams.status = $event || undefined"
                    :options="statusOptions"
                    label="ステータス"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    dense
                    clearable
                    style="width: 160px"
                  />
                  <q-input
                    class="q-px-sm"
                    type="date"
                    :model-value="searchParams.startDate"
                    @update:model-value="searchParams.startDate = ($event as string || undefined)"
                    label="開始日"
                    dense
                    style="width: 140px"
                  />
                  <div class="flex items-center" style="padding: 0 4px">～</div>
                  <q-input
                    class="q-px-sm"
                    type="date"
                    :model-value="searchParams.endDate"
                    @update:model-value="searchParams.endDate = ($event as string || undefined)"
                    label="終了日"
                    dense
                    style="width: 140px"
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
              <template #body-cell-invoiceNumber="{ row }">
                <q-td>
                  <a
                    v-if="row.invoice?.id"
                    :href="router.resolve({ name: 'invoice-detail', params: { id: row.invoice.id } }).href"
                  >
                    {{ row.invoice?.invoiceNumber ?? '-' }}
                  </a>
                  <span v-else>{{ row.invoice?.invoiceNumber ?? '-' }}</span>
                </q-td>
              </template>
              <template #body-cell-customer="{ row }">
                <q-td>
                  {{ row.invoice?.customer?.name ?? '-' }}
                </q-td>
              </template>
              <template #body-cell-status="{ row }">
                <q-td>
                  <div class="row items-center no-wrap q-gutter-xs">
                    <q-badge v-bind="getStatusBadge(row.status)" />
                    <q-icon
                      v-if="row.status === 'failed' && row.errorMessage"
                      name="sym_r_error"
                      color="negative"
                      size="16px"
                    >
                      <q-tooltip>{{ row.errorMessage }}</q-tooltip>
                    </q-icon>
                  </div>
                </q-td>
              </template>
              <template #body-cell-createdAt="{ row }">
                <q-td>
                  {{ formatDateTime(row.createdAt) }}
                </q-td>
              </template>
              <template #body-cell-completedAt="{ row }">
                <q-td>
                  {{ formatDateTime(row.completedAt) }}
                </q-td>
              </template>
              <template #body-cell-expiresAt="{ row }">
                <q-td>
                  {{ formatDateTime(row.expiresAt) }}
                </q-td>
              </template>
              <template #body-cell-actions="{ row }">
                <q-td class="text-right">
                  <q-btn
                    v-if="row.status !== 'completed'"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_refresh"
                    :loading="row.id ? refreshingIds.has(row.id) : false"
                    @click="refreshStatus(row)"
                  />
                  <q-btn
                    v-if="row.status === 'completed'"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_download"
                    @click="downloadPrint(row)"
                  />
                </q-td>
              </template>
            </q-table>
            <q-separator />
            <div class="row justify-center q-my-md">
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
      </div>
    </div>
  </q-page>
</template>

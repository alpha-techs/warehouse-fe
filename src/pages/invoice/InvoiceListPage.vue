<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { QTable, QTableProps } from 'quasar'
import { storeToRefs } from 'pinia'
import { useInvoiceStore } from 'stores/invoice-store'
import { useCustomerStore } from 'stores/customer-store'
import type { FePagination } from 'src/utils/pagination'
import { toastFormError } from 'src/utils/error-handler'
import type { Invoice } from 'src/api/Api'

const loading = ref(false)
const tableRef = useTemplateRef<QTable | undefined>('tableRef')

const invoiceStore = useInvoiceStore()
const {
  invoiceList: rows,
  invoiceListPagination,
  invoiceListQuery: searchParams,
} = storeToRefs(invoiceStore)

const customerStore = useCustomerStore()
const { customerOptions } = storeToRefs(customerStore)

const statusOptions: { label: string; value: NonNullable<Invoice['status']> }[] = [
  { label: '下書き', value: 'draft' },
  { label: '発行済', value: 'issued' },
  { label: '取消', value: 'cancelled' },
  { label: '入金済', value: 'paid' },
]

const columns: QTableProps['columns'] = [
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
    label: '支払期日',
    name: 'dueDate',
    field: 'dueDate',
    align: 'left',
  },
  {
    label: '状態',
    name: 'status',
    field: 'status',
    align: 'left',
  },
  {
    label: '合計金額',
    name: 'totalAmount',
    field: 'totalAmount',
    align: 'right',
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

const onRequest = async ({ pagination: _pagination }: { pagination: { page: number; rowsPerPage: number } }) => {
  try {
    loading.value = true
    const { page, rowsPerPage } = _pagination
    const query = {
      ...searchParams.value,
      page,
      itemsPerPage: rowsPerPage,
    }
    await invoiceStore.getInvoiceList(query)
    pagination.value = {
      page: invoiceListPagination.value.page,
      rowsPerPage: invoiceListPagination.value.itemsPerPage,
      rowsNumber: invoiceListPagination.value.totalItems,
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
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } })
}

const onPageChange = () => {
  tableRef.value?.requestServerInteraction({ pagination: pagination.value })
}

const formatAmount = (value?: number) => {
  if (value === undefined || value === null) {
    return '-'
  }
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value)
}

const getStatusLabel = (status?: Invoice['status']) => {
  switch (status) {
    case 'draft':
      return { color: 'grey', label: '下書き' }
    case 'issued':
      return { color: 'primary', label: '発行済' }
    case 'cancelled':
      return { color: 'negative', label: '取消' }
    case 'paid':
      return { color: 'positive', label: '入金済' }
    default:
      return { color: 'grey', label: '未定義' }
  }
}

const router = useRouter()
const toDetail = async (id: number) => {
  await router.push({ name: 'invoice-detail', params: { id } })
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
                  <div class="text-h6 col-12">請求書一覧</div>
                  <q-select
                    class="q-px-sm"
                    :model-value="searchParams.status"
                    @update:model-value="searchParams.status = $event || undefined"
                    :options="statusOptions"
                    label="状態"
                    dense
                    emit-value
                    map-options
                    clearable
                    style="width: 160px"
                  />
                  <q-select
                    class="q-px-sm"
                    :model-value="searchParams.customer"
                    @update:model-value="searchParams.customer = $event"
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
                  <q-input
                    class="q-px-sm"
                    type="date"
                    :model-value="searchParams.outboundDateFrom"
                    @update:model-value="searchParams.outboundDateFrom = ($event as string || undefined)"
                    label="出庫日(開始)"
                    dense
                    style="width: 140px"
                  />
                  <div class="flex items-center" style="padding: 0 4px">
                    ～
                  </div>
                  <q-input
                    class="q-px-sm"
                    type="date"
                    :model-value="searchParams.outboundDateTo"
                    @update:model-value="searchParams.outboundDateTo = ($event as string || undefined)"
                    label="出庫日(終了)"
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
              <template #body-cell-customer="{ row }">
                <q-td>
                  {{ row.customer?.name ?? '-' }}
                </q-td>
              </template>
              <template #body-cell-status="{ row }">
                <q-td>
                  <q-badge v-bind="getStatusLabel(row.status)" />
                </q-td>
              </template>
              <template #body-cell-totalAmount="{ row }">
                <q-td class="text-right">
                  {{ formatAmount(row.totalAmount) }}
                </q-td>
              </template>
              <template #body-cell-actions="{ row }">
                <q-td class="text-right">
                  <q-btn
                    size="sm"
                    flat
                    dense
                    icon="sym_r_visibility"
                    @click="toDetail(row.id!)"
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

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOutboundStore } from 'stores/outbound-store'
import type { QTable, QTableProps } from 'quasar'
import { computed, onMounted, type Ref, ref, useTemplateRef } from 'vue'
import type { OutboundReport, Warehouse, Customer } from 'src/api/Api'
import { useRouter } from 'vue-router'
import type { FePagination } from 'src/utils/pagination'
import { useWarehouseStore } from 'stores/warehouse-store'
import { useCustomerStore } from 'stores/customer-store'
import { toastFormError } from 'src/utils/error-handler'

const loading = ref(false)
const tableRef = useTemplateRef<QTable | undefined>('tableRef')
const router = useRouter()
const {
  outboundReportList: rows,
  outboundReportListPagination,
  outboundReportListQuery: searchParams,
} = storeToRefs(useOutboundStore())

const { customerOptions } = storeToRefs(useCustomerStore())

const onFilterCustomer = async (
  inputValue: string,
  doneFn: (callbackFn: () => void) => void,
) => {
  if (!inputValue || !inputValue.length) {
    await useCustomerStore().getCustomerOptions()
    doneFn(() => {})
  } else {
    await useCustomerStore().getCustomerOptions(inputValue)
    doneFn(() => {})
  }
}
const onChangeCustomer = (customer: Customer | undefined): void => {
  searchParams.value.customerId = customer?.id
}

const { warehouseOptions } = storeToRefs(useWarehouseStore())
const onFilterWarehouse = async (
  inputValue: string,
  doneFn: (callbackFn: () => void) => void,
) => {
  if (!inputValue || !inputValue.length) {
    await useWarehouseStore().getWarehouseOptions()
    doneFn(() => {})
  } else {
    await useWarehouseStore().getWarehouseOptions(inputValue)
    doneFn(() => {})
  }
}
const onChangeWarehouse = (warehouse: Warehouse | undefined): void => {
  searchParams.value.warehouseId = warehouse?.id
}

const columns: QTableProps['columns'] = [
  {
    label: '報告ID',
    name: 'id',
    field: 'id',
    align: 'left',
  },
  {
    label: '倉庫',
    name: 'warehouse',
    field: 'warehouse',
    align: 'left',
  },
  {
    label: 'お客様',
    name: 'customer',
    field: 'customer',
    align: 'left',
  },
  {
    label: '報告日',
    name: 'reportDate',
    field: 'reportDate',
    align: 'left',
  },
  {
    label: 'ステータス',
    name: 'status',
    field: 'status',
    align: 'center',
  },
  {
    label: 'フォーマット',
    name: 'format',
    field: 'format',
    align: 'center',
  },
  {
    label: '作成日時',
    name: 'createdAt',
    field: 'createdAt',
    align: 'left',
  },
  {
    label: '操作',
    name: 'actions',
    field: 'actions',
    align: 'right',
  },
]

onMounted(() => {
  tableRef.value?.requestServerInteraction()
})

const search = () => {
  tableRef.value?.requestServerInteraction({
    pagination: { ...pagination.value, page: 1 },
  })
}

const pagination: Ref<FePagination> = ref({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const maxPage = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
})

const onPageChange = () => {
  tableRef.value?.requestServerInteraction({ pagination: pagination.value })
}

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
    await useOutboundStore().getOutboundReportList(query)
    pagination.value = {
      page: outboundReportListPagination.value.page,
      rowsPerPage: outboundReportListPagination.value.itemsPerPage,
      rowsNumber: outboundReportListPagination.value.totalItems,
      sortBy: undefined,
      descending: false,
    }
  } catch (error) {
    await toastFormError(error)
  } finally {
    loading.value = false
  }
}

// Download report
const downloadReport = async (report: OutboundReport) => {
  if (report.status !== 'completed' || !report.id) {
    return
  }

  try {
    // Open download URL in new tab
    const downloadUrl = useOutboundStore().getOutboundReportDownloadUrl(
      report.id,
    )
    window.open(downloadUrl, '_blank')
  } catch (error) {
    await toastFormError(error)
  }
}

// Status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'positive'
    case 'processing':
      return 'warning'
    case 'pending':
      return 'info'
    case 'failed':
      return 'negative'
    default:
      return 'grey'
  }
}

// Status badge label
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return '完了'
    case 'processing':
      return '処理中'
    case 'pending':
      return '待機中'
    case 'failed':
      return '失敗'
    default:
      return status
  }
}
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Reports List Section -->
      <div class="col-12">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-table
              flat
              :columns="columns"
              :rows="rows"
              row-key="id"
              hide-pagination
              v-model:pagination="pagination"
              @request="onRequest"
              ref="tableRef"
              :loading="loading"
            >
              <template #top>
                <div class="row" style="width: 100%">
                  <div class="text-h6 col-12">出庫依頼書一覧</div>
                  <q-select
                    class="q-px-sm"
                    :model-value="
                      warehouseOptions.find(
                        (w) => w.id === searchParams.warehouseId,
                      )
                    "
                    @update:model-value="onChangeWarehouse"
                    label="倉庫"
                    dense
                    :options="warehouseOptions"
                    option-label="name"
                    option-value="id"
                    @filter="onFilterWarehouse"
                    clearable
                    use-input
                    input-style="width: 0px"
                  >
                  </q-select>
                  <q-select
                    class="q-px-sm"
                    :model-value="
                      customerOptions.find(
                        (c) => c.id === searchParams.customerId,
                      )
                    "
                    @update:model-value="onChangeCustomer"
                    label="お客様"
                    dense
                    :options="customerOptions"
                    option-label="name"
                    option-value="id"
                    @filter="onFilterCustomer"
                    clearable
                    use-input
                    input-style="width: 0px"
                  >
                  </q-select>
                  <q-select
                    class="q-px-sm"
                    v-model="searchParams.status"
                    label="ステータス"
                    dense
                    :options="[
                      { label: '待機中', value: 'pending' },
                      { label: '処理中', value: 'processing' },
                      { label: '完了', value: 'completed' },
                      { label: '失敗', value: 'failed' },
                    ]"
                    option-label="label"
                    option-value="value"
                    clearable
                  >
                  </q-select>
                  <q-input
                    class="q-px-sm"
                    v-model="searchParams.startDate"
                    label="開始日"
                    dense
                    type="date"
                    @keyup.enter="search"
                    style="width: 140px"
                  >
                  </q-input>
                  <q-input
                    class="q-px-sm"
                    v-model="searchParams.endDate"
                    label="終了日"
                    dense
                    type="date"
                    @keyup.enter="search"
                    style="width: 140px"
                  >
                  </q-input>
                  <q-space />
                  <div style="display: flex; align-items: center">
                    <q-btn
                      size="sm"
                      label="検索"
                      color="primary"
                      icon="sym_r_search"
                      @click="search"
                    />
                  </div>
                </div>
              </template>
              <template
                #[`body-cell-warehouse`]="{ row }: { row: OutboundReport }"
              >
                <q-td>
                  <a
                    :href="
                      router.resolve({
                        name: 'warehouse-detail',
                        params: { id: row.warehouse!.id },
                      }).href
                    "
                    v-if="row.warehouse"
                  >
                    {{ row.warehouse?.name ?? '-' }}
                  </a>
                  <span v-else>-</span>
                </q-td>
              </template>
              <template
                #[`body-cell-customer`]="{ row }: { row: OutboundReport }"
              >
                <q-td>
                  <a
                    :href="
                      router.resolve({
                        name: 'customer-detail',
                        params: { id: row.customer!.id },
                      }).href
                    "
                    v-if="row.customer"
                  >
                    {{ row.customer?.name ?? '-' }}
                  </a>
                  <span v-else>-</span>
                </q-td>
              </template>
              <template
                #[`body-cell-status`]="{ row }: { row: OutboundReport }"
              >
                <q-td>
                  <q-badge
                    :color="getStatusColor(row.status || '')"
                    :label="getStatusLabel(row.status || '')"
                  />
                </q-td>
              </template>
              <template
                #[`body-cell-format`]="{ row }: { row: OutboundReport }"
              >
                <q-td>
                  <q-chip :label="row.format?.toUpperCase()" dense />
                </q-td>
              </template>
              <template
                #[`body-cell-createdAt`]="{ row }: { row: OutboundReport }"
              >
                <q-td>
                  {{
                    row.createdAt
                      ? new Date(row.createdAt).toLocaleString('ja-JP')
                      : '-'
                  }}
                </q-td>
              </template>
              <template
                #[`body-cell-actions`]="{ row }: { row: OutboundReport }"
              >
                <q-td class="text-right">
                  <q-btn
                    v-if="row.status === 'completed'"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_download"
                    @click="downloadReport(row)"
                  />
                  <q-btn
                    v-else-if="row.status === 'failed'"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_error"
                    :disable="true"
                  />
                  <q-btn
                    v-else
                    size="sm"
                    flat
                    dense
                    icon="sym_r_hourglass_empty"
                    :disable="true"
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

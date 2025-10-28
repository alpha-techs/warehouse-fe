<script setup lang="ts">
import { computed, onMounted, ref, type Ref, useTemplateRef } from 'vue'
import type { QTable, QTableProps } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import type { ExpressSampleShipment, Customer } from 'src/api/Api'
import type { FePagination } from 'src/utils/pagination'
import { toastFormError } from 'src/utils/error-handler'
import { useExpressSampleStore } from 'stores/express-sample-store'
import { useCustomerStore } from 'stores/customer-store'

const loading = ref(false)
const generateLoading = ref<number | null>(null)
const tableRef = useTemplateRef<QTable | undefined>('tableRef')

const {
  expressSampleShipmentList: rows,
  expressSampleShipmentListPagination,
  expressSampleShipmentListQuery: searchParams,
} = storeToRefs(useExpressSampleStore())

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
  searchParams.value.customer = customer
}

const columns: QTableProps['columns'] = [
  {
    label: 'オーダー番号',
    name: 'expressSampleOrderId',
    field: 'expressSampleOrderId',
    align: 'left',
  },
  {
    label: '出庫希望日',
    name: 'requestedShipDate',
    field: 'requestedShipDate',
    align: 'left',
  },
  {
    label: '到着希望日',
    name: 'desiredDeliveryDate',
    field: 'desiredDeliveryDate',
    align: 'left',
  },
  {
    label: '時間帯',
    name: 'desiredDeliveryTimeWindow',
    field: 'desiredDeliveryTimeWindow',
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
    label: '箱数',
    name: 'packageCount',
    field: 'packageCount',
    align: 'right',
  },
  {
    label: '状態',
    name: 'status',
    field: 'status',
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

const statusOptions = [
  { label: '下書き', value: 'draft' },
  { label: '未確認', value: 'pending' },
  { label: '承認済', value: 'approved' },
  { label: '手配済', value: 'booked' },
  { label: '出荷済', value: 'dispatched' },
  { label: '配達完了', value: 'delivered' },
  { label: '拒否', value: 'rejected' },
  { label: '取消', value: 'cancelled' },
]

const deliveryTimeWindowLabel = (value?: string) => {
  switch (value) {
    case 'morning':
      return '午前中'
    case 'noon':
      return '正午'
    case 'afternoon':
      return '午後'
    case 'evening':
      return '夕方'
    case 'anytime':
      return '指定なし'
    default:
      return '-'
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
      customer: searchParams.value.customer,
    }
    await useExpressSampleStore().getExpressSampleShipmentList(query)
    pagination.value = {
      page: expressSampleShipmentListPagination.value.page,
      rowsPerPage: expressSampleShipmentListPagination.value.itemsPerPage,
      rowsNumber: expressSampleShipmentListPagination.value.totalItems,
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
  await router.push({ name: 'express-sample-create' })
}

const toDetail = async (id: number) => {
  await router.push({
    name: 'express-sample-detail',
    params: { id },
  })
}

const toEdit = async (id: number) => {
  await router.push({
    name: 'express-sample-edit',
    params: { id },
  })
}

const remove = async (row: ExpressSampleShipment) => {
  if (!row.id) {
    return
  }
  try {
    await useExpressSampleStore().removeExpressSampleShipmentById(row.id)
    tableRef.value?.requestServerInteraction()
  } catch (error) {
    await toastFormError(error)
  }
}

const generateReport = async (row: ExpressSampleShipment) => {
  if (!row.id) {
    await toastFormError('宅急便IDが無効です')
    return
  }
  try {
    generateLoading.value = row.id
    const request = {
      expressSampleShipmentId: row.id,
      format: 'excel' as const,
    }
    const reportId =
      await useExpressSampleStore().generateExpressSampleShipmentReport(
        request,
      )
    Notify.create({
      type: 'positive',
      message: `報告書生成を受け付けました。報告ID: ${reportId}`,
      position: 'top',
      timeout: 3000,
      actions: [
        {
          label: '報告書一覧へ',
          color: 'white',
          handler: () => {
            void router.push({ name: 'express-sample-report-list' })
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

const canGenerateReport = (status?: ExpressSampleShipment['status']) => {
  return ['approved', 'booked', 'dispatched', 'delivered'].includes(
    status ?? '',
  )
}

const getStatusChip = (status?: ExpressSampleShipment['status']) =>
  useExpressSampleStore().getStatusBadgeAttribute(status)
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
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
                  <div class="text-h6 col-12">宅急便依頼一覧</div>
                  <q-select
                    class="q-px-sm"
                    :model-value="searchParams.customer"
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
                  />
                  <q-select
                    class="q-px-sm"
                    v-model="searchParams.status"
                    label="状態"
                    dense
                    :options="statusOptions"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    clearable
                    style="width: 130px"
                  />
                  <q-input
                    class="q-px-sm"
                    v-model="searchParams.desiredDeliveryDateFrom"
                    label="到着希望日(From)"
                    dense
                    type="date"
                    @keyup.enter="search"
                    style="width: 160px"
                  />
                  <div style="display: flex; align-items: center">
                    <span>～</span>
                  </div>
                  <q-input
                    class="q-px-sm"
                    v-model="searchParams.desiredDeliveryDateTo"
                    label="到着希望日(To)"
                    dense
                    type="date"
                    @keyup.enter="search"
                    style="width: 160px"
                  />
                  <q-space />
                  <div style="display: flex; align-items: center">
                    <q-btn
                      class="q-mx-sm"
                      size="sm"
                      label="検索"
                      color="primary"
                      icon="sym_r_search"
                      @click="search"
                    />
                    <q-btn
                      size="sm"
                      label="新規"
                      color="primary"
                      icon="sym_r_add"
                      @click="toCreate"
                    />
                  </div>
                </div>
              </template>
              <template
                #[`body-cell-warehouse`]="{ row }: { row: ExpressSampleShipment }"
              >
                <q-td>
                  {{ row.warehouse?.name || '-' }}
                </q-td>
              </template>
              <template
                #[`body-cell-customer`]="{ row }: { row: ExpressSampleShipment }"
              >
                <q-td>
                  {{ row.customer?.name || '-' }}
                </q-td>
              </template>
              <template
                #[`body-cell-desiredDeliveryTimeWindow`]="{ row }: { row: ExpressSampleShipment }"
              >
                <q-td>
                  {{ deliveryTimeWindowLabel(row.desiredDeliveryTimeWindow) }}
                </q-td>
              </template>
              <template
                #[`body-cell-status`]="{ row }: { row: ExpressSampleShipment }"
              >
                <q-td>
                  <q-chip
                    v-bind="getStatusChip(row.status)"
                    size="sm"
                    text-color="white"
                  />
                </q-td>
              </template>
              <template
                #[`body-cell-actions`]="{ row }: { row: ExpressSampleShipment }"
              >
                <q-td class="text-right">
                  <q-btn
                    class="q-ml-sm"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_visibility"
                    @click="toDetail(row.id!)"
                  />
                  <q-btn
                    class="q-ml-sm"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_edit"
                    @click="toEdit(row.id!)"
                    v-if="row.status !== 'approved' && row.status !== 'rejected'"
                  />
                  <q-btn
                    class="q-ml-sm"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_delete"
                    @click="remove(row)"
                    v-if="row.status === 'draft' || row.status === 'pending'"
                  />
                  <q-btn
                    class="q-ml-sm"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_table_chart"
                    @click="generateReport(row)"
                    :disable="!canGenerateReport(row.status) || generateLoading !== null"
                  >
                    <q-spinner
                      v-if="generateLoading === row.id"
                      size="16px"
                      class="q-ml-sm"
                    />
                  </q-btn>
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

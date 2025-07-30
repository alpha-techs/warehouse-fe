<script setup lang="ts">
import type { Customer, Inbound, Warehouse } from 'src/api/Api'
import { storeToRefs } from 'pinia'
import { useOutboundStore } from 'stores/outbound-store'
import type { QTable, QTableProps } from 'quasar'
import { computed, onMounted, type Ref, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { useWarehouseStore } from 'stores/warehouse-store'
import { useCustomerStore } from 'stores/customer-store'
import type { FePagination } from 'src/utils/pagination'
import { toastFormError } from 'src/utils/error-handler'

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');
const {
  outboundList: rows,
  outboundListPagination,
  outboundListQuery: searchParams,
} = storeToRefs(useOutboundStore())

const {
  warehouseOptions
} = storeToRefs(useWarehouseStore())
const onFilterWarehouse = async (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (!inputValue || !inputValue.length) {
    await useWarehouseStore().getWarehouseOptions()
    doneFn(() => {});
  } else {
    await useWarehouseStore().getWarehouseOptions(inputValue)
    doneFn(() => {});
  }
}
const onChangeWarehouse = (warehouse: Warehouse | undefined): void => {
  searchParams.value.warehouse = warehouse;
}

const { customerOptions } = storeToRefs(useCustomerStore())
const onFilterCustomer = async (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (!inputValue || !inputValue.length) {
    await useCustomerStore().getCustomerOptions()
    doneFn(() => {});
  } else {
    await useCustomerStore().getCustomerOptions(inputValue)
    doneFn(() => {});
  }
}
const onChangeCustomer = (customer: Customer | undefined): void => {
  searchParams.value.customer = customer;
}

const columns: QTableProps['columns'] = [
  {
    label: 'オーダー番号',
    name: 'outboundOrderId',
    field: 'outboundOrderId',
    align: 'left',
  },
  {
    label: '出庫日',
    name: 'outboundDate',
    field: 'outboundDate',
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
  }
]

onMounted (() => {
  tableRef.value?.requestServerInteraction();
})

const search = () => {
  tableRef.value?.requestServerInteraction(
    { pagination: { ...pagination.value, page: 1 } },
  );
}

const pagination: Ref<FePagination> = ref({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
});

const maxPage = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0;
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
})
const onPageChange = () => {
  tableRef.value?.requestServerInteraction({ pagination: pagination.value });
};

const onRequest = async ({ pagination: _pagination }: { pagination: { page: number, rowsPerPage: number} }) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const query = {
      ...searchParams.value,
      page,
      itemsPerPage: rowsPerPage,
    }
    await useOutboundStore().getOutboundList(query)
    pagination.value = {
      page: outboundListPagination.value.page,
      rowsPerPage: outboundListPagination.value.itemsPerPage,
      rowsNumber: outboundListPagination.value.totalItems,
      sortBy: undefined,
      descending: false,
    }
  } catch (error) {
    await toastFormError(error);
  } finally {
    loading.value = false;
  }
}

const router = useRouter()
const toCreate = async () => {
  await router.push({
    name: 'outbound-create',
  })
}

const toDetail = async (key: number) => {
  await router.push({
    name: 'outbound-detail',
    params: {
      id: key,
    },
  });
}

const toEdit = async (key: number) => {
  await router.push({
    name: 'outbound-edit',
    params: {
      id: key,
    },
  });
}

const remove = async (row: any) => {
  await useOutboundStore().removeOutboundById(row.id)
  await useOutboundStore().getOutboundList()
}
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
            >
              <template #top>
                <div class="row" style="width: 100%">
                  <div class="text-h6 col-12">出庫依頼一覧</div>
                  <q-input
                    class="q-px-sm"
                    v-model="searchParams.outboundOrderId"
                    label="オーダー番号"
                    dense
                    @keyup.enter="search"
                    style="width: 120px;"
                  ></q-input>
                  <q-select
                    class="q-px-sm"
                    :model-value="searchParams.warehouse"
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
                  >
                  </q-select>
                  <q-input
                    class="q-px-sm"
                    v-model="searchParams.outboundDateFrom"
                    label="出庫日(From)"
                    dense
                    @keyup.enter="search"
                    style="width: 120px;"
                  ></q-input>
                  <div style="display: flex; align-items: center;">
                    <span>～</span>
                  </div>
                  <q-input
                    class="q-px-sm"
                    v-model="searchParams.outboundDateTo"
                    label="出庫日(To)"
                    dense
                    @keyup.enter="search"
                    style="width: 120px;"
                  ></q-input>
                  <q-space/>
                  <div style="display: flex; align-items: center;">
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
                      @click="toCreate()"
                    />
                  </div>
                </div>
              </template>
              <template #[`body-cell-warehouse`]="{ row }: { row: Inbound }">
                <q-td>
                  {{ row.warehouse?.name }}
                </q-td>
              </template>
              <template #[`body-cell-customer`]="{ row }: { row: Inbound }">
                <q-td >
                  {{ row.customer?.name }}
                </q-td>
              </template>
              <template #[`body-cell-status`]="{ row }: { row: Inbound }">
                <q-td>
                  <q-chip color="teal" label="下書き" dark v-if="row.status == 'draft'" />
                  <q-chip color="warning" label="未確認" dark v-if="row.status == 'pending'" />
                  <q-chip color="green" label="確認済" dark v-if="row.status == 'approved'" />
                  <q-chip color="red" label="拒否" dark v-if="row.status == 'rejected'" />
                  <q-chip color="grey" label="取消" dark v-if="row.status == 'cancelled'" />
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key, row }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail(key)" />
                  <q-btn
                    class="q-ml-sm"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_edit"
                    @click="toEdit(key)"
                    v-if="row.status != 'approved'"
                  />
                  <q-btn
                    class="q-ml-sm"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_delete"
                    @click="remove(row)"
                    v-if="row.status != 'approved'"
                  />
                </q-td>
              </template>
            </q-table>
            <q-separator/>
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

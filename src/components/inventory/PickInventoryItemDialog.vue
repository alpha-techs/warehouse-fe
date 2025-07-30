<script setup lang="ts">
import { computed, nextTick, type Ref, ref, useTemplateRef } from 'vue'
import type { InventoryItem, Product, Warehouse } from 'src/api/Api'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from 'stores/inventory-store'
import type { QTable, QTableProps } from 'quasar'
import { useRouter } from 'vue-router'
import type { FePagination } from 'src/utils/pagination'
import { toastFormError } from 'src/utils/error-handler'
import { useProductStore } from 'stores/product-store'
import { useWarehouseStore } from 'stores/warehouse-store'

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [value: InventoryItem]
}>();

const submit = () => {
  if (selectedRows.value.length > 0) {
    const row = selectedRows.value[0] as InventoryItem
    emit('submit', row);
    emit('update:show', false);
  }
}

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');

const {
  inventoryList: rows,
  inventoryListPagination,
  inventoryItemListQuery: searchParams,
} = storeToRefs(useInventoryStore())

const {
  productOptions
} = storeToRefs(useProductStore())

const onFilterProduct = async (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (!inputValue || !inputValue.length) {
    await useProductStore().getProductOptions()
    doneFn(() => { });
  } else {
    await useProductStore().getProductOptions(inputValue)
    doneFn(() => { });
  }
}
const onChangeProduct = (product: Product | undefined): void => {
  searchParams.value.product = product;
}

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

const columns: QTableProps['columns'] = [
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
    label: 'オーダー番号',
    name: 'inboundOrderId',
    field: 'inboundOrderId',
    align: 'left',
  },
  {
    label: '入庫日',
    name: 'inboundDate',
    field: 'inboundDate',
    align: 'left',
  },
  {
    label: '商品',
    name: 'product',
    field: 'product',
    align: 'left',
  },
  {
    label: 'LOT番号',
    name: 'lotNumber',
    field: 'lotNumber',
    align: 'left',
  },
  {
    label: '入庫元数',
    name: 'inboundQuantity',
    field: 'inboundQuantity',
    align: 'right',
  },
  {
    label: '在庫数',
    name: 'leftQuantity',
    field: 'leftQuantity',
    align: 'right',
  },
];

const search = () => {
  tableRef.value?.requestServerInteraction(
    { pagination: { ...pagination.value, page: 1 } },
  );
};

const pagination: Ref<FePagination> = ref({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 10,
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


const onRequest = async ({ pagination: _pagination }: { pagination: { page: number, rowsPerPage: number } }) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const query = {
      ...searchParams.value,
      page,
      itemsPerPage: rowsPerPage,
    }
    await useInventoryStore().getInventoryList(query)
    pagination.value = {
      page: inventoryListPagination.value.page,
      rowsPerPage: inventoryListPagination.value.itemsPerPage,
      rowsNumber: inventoryListPagination.value.totalItems,
      sortBy: undefined,
      descending: false,
    }
  } catch (error) {
    await toastFormError(error);
  } finally {
    loading.value = false;
  }
};

const selectedRows = ref<InventoryItem[]>([])

const router = useRouter()

const reload = async (
  params: {
    warehouse?: Warehouse
  }
) => {
  selectedRows.value = []
  useInventoryStore().resetList()
  pagination.value = {
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    sortBy: undefined,
    descending: false,
  }
  searchParams.value.warehouse = params.warehouse
  await nextTick(() => {
    tableRef.value?.requestServerInteraction();
  })
}

defineExpose({
  reload,
})
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" persistent maximized>
      <q-card class="card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">在庫商品選択</div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-table
            flat
            :columns="columns"
            :rows="rows"
            row-key="id"
            hide-pagination
            selection="single"
            v-model:selected="selectedRows"
            v-model:pagination="pagination"
            @request="onRequest"
            ref="tableRef"
          >
            <template #top>
              <div class="row" style="width: 100%">
                <q-input
                  class="q-px-sm"
                  v-model="searchParams.lotNumber"
                  label="LOT番号"
                  dense
                  @keyup.enter="search"
                  style="width: 100px;"
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
                  :model-value="searchParams.product"
                  @update:model-value="onChangeProduct"
                  label="商品"
                  dense
                  :options="productOptions"
                  option-label="name"
                  option-value="id"
                  @filter="onFilterProduct"
                  clearable
                  use-input
                  input-style="width: 0px"
                >
                </q-select>
                <q-input
                  class="q-px-sm"
                  v-model="searchParams.inboundDateFrom"
                  label="入庫日(From)"
                  dense
                  @keyup.enter="search"
                  style="width: 120px;"
                ></q-input>
                <div style="display: flex; align-items: center;">
                  <span>～</span>
                </div>
                <q-input
                  class="q-px-sm"
                  v-model="searchParams.inboundDateTo"
                  label="入庫日(To)"
                  dense
                  @keyup.enter="search"
                  style="width: 120px;"
                ></q-input>
                <q-space/>
                <div style="display: flex; align-items: center;">
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
            <template #[`body-cell-warehouse`]="{ row }: { row: InventoryItem }">
              <q-td>
                <a :href="router.resolve({ name: 'warehouse-detail', params: { id: row.warehouse!.id } }).href"
                  v-if="row.warehouse">
                  {{ row.warehouse!.name }}
                </a>
              </q-td>
            </template>
            <template #[`body-cell-customer`]="{ row }: { row: InventoryItem }">
              <q-td>
                <a :href="router.resolve({ name: 'customer-detail', params: { id: row.customer!.id } }).href"
                  v-if="row.customer">
                  {{ row.customer!.name }}
                </a>
              </q-td>
            </template>
            <template #[`body-cell-product`]="{ row }: { row: InventoryItem }">
              <q-td>
                <a :href="router.resolve({ name: 'product-detail', params: { id: row.product!.id } }).href"
                  v-if="row.product">
                  {{ row.product!.name }}
                </a>
              </q-td>
            </template>
          </q-table>
          <q-separator />
          <div class="row justify-center q-my-md">
            <q-pagination v-model="pagination.page" color="primary" :max="maxPage" max-pages="9"
              @update:model-value="onPageChange" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn label="取消" color="negative" @click="$emit('update:show', false)" />
          <q-btn label="確認" color="primary" @click="submit" disablednvm />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

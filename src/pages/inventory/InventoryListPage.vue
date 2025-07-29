<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInventoryStore } from 'stores/inventory-store'
import type { QTable, QTableProps } from 'quasar'
import { computed, onMounted, type Ref, ref, useTemplateRef } from 'vue'
import type { InventoryItem, Product, Warehouse } from 'src/api/Api'
import { useRouter } from 'vue-router'
import type { FePagination } from 'src/utils/pagination'
import { useProductStore } from 'stores/product-store'
import { useWarehouseStore } from 'stores/warehouse-store'
import { toastFormError } from 'src/utils/error-handler'

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');
const router = useRouter()
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

const selectedRows = ref<InventoryItem[]>([])
const columns: QTableProps['columns'] = [
  {
    label: '倉庫',
    name: 'warehouse',
    field: 'warehouse',
    align: 'left',
  },
  {
    label: 'LOT番号',
    name: 'lotNumber',
    field: 'lotNumber',
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
    label: '規格',
    name: 'dimensionDescription',
    field: 'dimensionDescription',
    align: 'left',
  },
  {
    label: '賞味期限',
    name: 'bestBeforeDate',
    field: 'bestBeforeDate',
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
  {
    label: '操作',
    name: 'actions',
    field: 'actions',
    align: 'right',
  }
]

onMounted(() => {
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
}

const toDetail = () => {}

const outbound = (rows: InventoryItem[]) => {
  console.log(rows)
}
const changeOwner = (rows: InventoryItem[]) => {
  console.log(rows)
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
              selection="multiple"
              v-model:selected="selectedRows"
              v-model:pagination="pagination"
              @request="onRequest"
              ref="tableRef"
            >
              <template #top>
                <div class="row" style="width: 100%">
                  <div class="text-h6 col-12">在庫商品一覧</div>
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
                <div class="row" style="width: 100%">
                  <template v-if="selectedRows.length > 0">
                    <q-space/>
                    <div style="display: flex; align-items: center;">
                      <q-btn
                        label="出庫"
                        color="primary"
                        class="float-right q-mx-sm"
                        icon="sym_r_outbound"
                        @click="outbound(selectedRows)"
                      />
                      <q-btn
                        label="名義変更"
                        color="primary"
                        class="float-right q-mx-sm"
                        icon="sym_r_swap_horizontal_circle"
                        @click="changeOwner(selectedRows)"
                      />
                    </div>
                  </template>
                </div>
              </template>
              <template #[`body-cell-warehouse`]="{ row }: { row: InventoryItem }">
                <q-td>
                  <a :href="router.resolve({ name: 'warehouse-detail', params: { id: row.warehouse!.id }}).href" v-if="row.warehouse">
                    {{ row.warehouse?.name ?? '-' }}
                  </a>
                </q-td>
              </template>
              <template #[`body-cell-product`]="{ row }: { row: InventoryItem }">
                <q-td>
                  <a :href="router.resolve({ name: 'product-detail', params: { id: row.product!.id }}).href" v-if="row.product">
                    {{ row.product?.name ?? '-' }}
                  </a>
                </q-td>
              </template>
              <template #[`body-cell-dimensionDescription`]="{ row }: { row: InventoryItem }">
                <q-td>
                  {{ row.product?.dimension?.description }}
                </q-td>
              </template>
              <template #[`body-cell-bestBeforeDate`]="{ row }: { row: InventoryItem }">
                <q-td>
                  {{ row.bestBeforeDate }}
                </q-td>
              </template>
              <template #[`body-cell-actions`]>
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail" />
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

<script setup lang="ts">
import type { QTable, QTableProps } from 'quasar'
import { storeToRefs } from 'pinia'
import { useInboundStore } from 'stores/inbound-store'
import type { Ref} from 'vue';
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import type { InboundItem, Product } from 'src/api/Api'
import type { FePagination } from 'src/utils/pagination'
import { useProductStore } from 'stores/product-store'
import { toastFormError } from 'src/utils/error-handler'

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');
const {
  inboundItemList: rows,
  inboundItemListPagination,
  inboundItemListQuery: searchParams,
} = storeToRefs(useInboundStore())

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

const columns: QTableProps['columns'] = [
  {
    label: '入庫依頼',
    name: 'inboundId',
    field: 'inboundId',
    align: 'left',
  },
  {
    label: '倉庫',
    name: 'warehouse',
    field: 'warehouse',
    align: 'left',
  },
  {
    label: '入庫日',
    name: 'inboundDate',
    field: 'inboundDate',
    align: 'left',
  },
  {
    label: 'LOT番号',
    name: 'lotNumber',
    field: 'lotNumber',
    align: 'left',
  },
  {
    label: '商品',
    name: 'product',
    field: 'product',
    align: 'left',
  },
  {
    label: '賞味期限',
    name: 'bestBeforeDate',
    field: 'bestBeforeDate',
    align: 'left',
  },
  {
    label: '入庫数量',
    name: 'quantity',
    field: 'quantity',
    align: 'right',
  },
];

onMounted(() => {
  tableRef.value?.requestServerInteraction();
})

const search = () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } });
};

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
    await useInboundStore().getInboundItemList(query)
    pagination.value = {
      page: inboundItemListPagination.value.page,
      rowsPerPage: inboundItemListPagination.value.itemsPerPage,
      rowsNumber: inboundItemListPagination.value.totalItems,
      sortBy: undefined,
      descending: false,
    }
  } catch (error) {
    await toastFormError(error);
  } finally {
    loading.value = false;
  }
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
                  <div class="text-h6 col-12">入庫商品一覧</div>
                  <q-input
                    class="q-px-sm"
                    v-model="searchParams.lotNumber"
                    label="LOT番号"
                    dense
                    @keyup.enter="search"
                    style="width: 100px;"
                  ></q-input>
                  <q-select
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
              <template #[`body-cell-warehouse`]="{ row }: { row: InboundItem }">
                <q-td>
                  {{ row.inbound?.warehouse?.name }}
                </q-td>
              </template>
              <template #[`body-cell-inboundDate`]="{ row }: { row: InboundItem }">
                <q-td>
                  {{ row.inbound?.inboundDate }}
                </q-td>
              </template>
              <template #[`body-cell-product`]="{ row }: { row: InboundItem }">
                <q-td>
                  {{ row.product?.name }}
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

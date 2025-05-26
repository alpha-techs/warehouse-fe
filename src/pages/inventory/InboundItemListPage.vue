<script setup lang="ts">
import type { QTable, QTableProps } from 'quasar'
import { storeToRefs } from 'pinia'
import { useInboundStore } from 'stores/inbound-store'
import type { Ref} from 'vue';
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import type { InboundItem } from 'src/api/Api'
import type { FePagination } from 'src/utils/pagination'

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');
const {
  inboundItemList: rows,
  inboundItemListPagination,
  inboundItemListQuery: searchParams,
} = storeToRefs(useInboundStore())

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
    console.error(error);
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
                <div class="row">
                  <div class="text-h6 col-12">入庫商品一覧</div>
                  <div class="col-12">
                    <q-input
                      v-model="searchParams.lotNumber"
                      label="LOT番号"
                      dense
                      @keyup.enter="search"
                      style="width: 100px"
                    ></q-input>
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

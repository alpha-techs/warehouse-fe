<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInventoryStore } from 'stores/inventory-store'
import type { QTable, QTableProps } from 'quasar'
import { computed, onMounted, type Ref, ref, useTemplateRef } from 'vue'
import type { InventoryItem } from 'src/api/Api'
import { useRouter } from 'vue-router'
import type { FePagination } from 'src/utils/pagination'

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');
const router = useRouter()
const {
  inventoryList: rows,
  inventoryListPagination,
} = storeToRefs(useInventoryStore())
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
    console.error(error);
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
              <template #top-left>
                <div class="text-h6">在庫一覧</div>
              </template>
              <template #top-right>
                <template v-if="selectedRows.length > 0">
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
                </template>
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

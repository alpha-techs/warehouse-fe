<script setup lang="ts">
import { useProductStore } from 'stores/product-store'
import { storeToRefs } from 'pinia'
import type { QTable, QTableProps } from 'quasar'
import { computed, onMounted, type Ref, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import type { FePagination } from 'src/utils/pagination'

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');
const {
  productList: rows,
  productListPagination,
} = storeToRefs(useProductStore())

const columns: QTableProps['columns'] = [
  {
    label: '商品名',
    name: 'name',
    field: 'name',
    align: 'left',
  },
  {
    label: '荷印',
    name: 'cargoMark',
    field: 'cargoMark',
    align: 'left',
  },
  {
    label: '規格',
    name: 'dimensionDescription',
    field: 'dimensionDescription',
    align: 'left',
  },
  {
    label: 'サイズ',
    name: 'size',
    field: 'size',
    align: 'right',
  },
  {
    label: '個別重量',
    name: 'unitWeight',
    field: 'unitWeight',
    align: 'right',
  },
  {
    label: '総重量',
    name: 'totalWeight',
    field: 'totalWeight',
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
}

const onRequest = async ({ pagination: _pagination }: { pagination: { page: number, rowsPerPage: number} }) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    await useProductStore().getProductList({
      page,
      itemsPerPage: rowsPerPage,
    })
    pagination.value = {
      page: productListPagination.value.page,
      rowsPerPage: productListPagination.value.itemsPerPage,
      rowsNumber: productListPagination.value.totalItems,
      sortBy: undefined,
      descending: false,
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const router = useRouter()
const toCreate = async () => {
  await router.push({
    name: 'product-create',
  });
}

const toDetail = async (key: number) => {
  await router.push({
    name: 'product-detail',
    params: {
      id: key,
    },
  });
}

const toEdit = async (key: number) => {
  await router.push({
    name: 'product-edit',
    params: {
      id: key,
    },
  });
}

const remove = async (row: any) => {
  await useProductStore().removeProductById(row.id)
}
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card bordered>
          <q-linear-progress v-if="loading" />
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
              <template #top-left>
                <div class="text-h6">商品一覧</div>
              </template>
              <template #top-right>
                <q-btn
                  label="新規"
                  color="primary"
                  icon="sym_r_add"
                  @click="toCreate()"
                />
              </template>
              <template #[`body-cell-dimensionDescription`]="{ row }">
                <q-td>
                  {{ row.dimension.description }}
                </q-td>
              </template>
              <template #[`body-cell-size`]="{ row }">
                <q-td class="text-right">
                  <template v-if="row.dimension.length && row.dimension.width && row.dimension.height">
                    {{ row.dimension.width }} x {{ row.dimension.height }} x {{ row.dimension.length }} ({{ row.dimension.lengthUnit }})
                  </template>
                </q-td>
              </template>
              <template #[`body-cell-unitWeight`]="{ row }">
                <q-td class="text-right">
                  <template v-if="row.dimension.unitWeight">
                    {{ row.dimension.unitWeight }} ({{ row.dimension.weightUnit }})
                  </template>
                </q-td>
              </template>
              <template #[`body-cell-totalWeight`]="{ row }">
                <q-td class="text-right">
                  <template v-if="row.dimension.totalWeight">
                    {{ row.dimension.totalWeight }} ({{ row.dimension.weightUnit }})
                  </template>
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key, row }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="toEdit(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="remove(row)" />
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

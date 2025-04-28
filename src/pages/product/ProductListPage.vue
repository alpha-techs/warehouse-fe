<script setup lang="ts">
import { useProductStore } from 'stores/product-store'
import { storeToRefs } from 'pinia'
import type { QTableProps } from 'quasar'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { productList: rows } = storeToRefs(useProductStore())
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

onMounted(async () => {
  await useProductStore().getProductList()
})

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
          <q-card-section class="q-pa-none">
            <q-table
              :columns="columns"
              :rows="rows"
              row-key="id"
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
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

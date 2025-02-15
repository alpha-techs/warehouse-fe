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
    name: 'dimension',
    field: 'dimension',
    align: 'right',
  },
  {
    label: '重量',
    name: 'weight',
    field: 'weight',
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
              <template #[`body-cell-dimension`]="{ row }">
                <q-td class="text-right">
                  <template v-if="row.dimension.length && row.dimension.width && row.dimension.height">
                    {{ row.dimension.width }} x {{ row.dimension.height }} x {{ row.dimension.length }} ({{ row.dimension.lengthUnit }})
                  </template>
                </q-td>
              </template>
              <template #[`body-cell-weight`]="{ row }">
                <q-td class="text-right">
                  <template v-if="row.dimension.weight">
                    {{ row.dimension.weight }} ({{ row.dimension.weightUnit }})
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

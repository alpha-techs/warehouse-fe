<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWarehouseStore } from 'stores/warehouse-store'
import type { QTableProps } from 'quasar'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { warehouseList: rows } = storeToRefs(useWarehouseStore())
const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: '倉庫名',
    align: 'left',
    field: 'name',
  },
  {
    name: 'address',
    label: '住所',
    align: 'left',
    field: 'address',
  },
  {
      name: 'actions',
      label: '操作',
      align: 'right',
      field: 'actions',
  }
]

onMounted(async () => {
  await useWarehouseStore().getWarehouseList()
})

const router = useRouter()
const toCreate = async () => {
  await router.push({
    name: 'warehouse-create',
  })
}

const toDetail = async (key: number) => {
  await router.push({
    name: 'warehouse-detail',
    params: {
      id: key,
    },
  })
}

const toEdit = async (key: number) => {
  await router.push({
    name: 'warehouse-edit',
    params: {
      id: key,
    },
  })
}

const remove = async (row: any) => {
  await useWarehouseStore().removeWarehouseById(row.id)
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
                <div class="text-h6">倉庫一覧</div>
              </template>
              <template #top-right>
                <q-btn
                  label="新規"
                  color="primary"
                  icon="sym_r_add"
                  @click="toCreate()"
                />
              </template>
              <template #[`body-cell-address`]="{ row }">
                <q-td>
                  {{ row.address?.postalCode }} {{ row.address?.detailAddress1 }} {{ row.address?.detailAddress2 }}
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

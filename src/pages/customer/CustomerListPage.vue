<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { QTableProps } from 'quasar'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from 'stores/customer-store'

const { customerList: rows } = storeToRefs(useCustomerStore())
const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: '名称',
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
    name: 'contact',
    label: '担当者',
    align: 'left',
    field: 'contact',
  },
  {
    name: 'contactTel',
    label: '担当者電話番号',
    align: 'left',
    field: 'contactTel',
  },
  {
    name: 'actions',
    label: '操作',
    align: 'right',
    field: 'actions',
  }
]

onMounted(async () => {
  await useCustomerStore().getCustomerList()
})

const router = useRouter()
const toCreate = async () => {
  await router.push({
    name: 'customer-create',
  })
}

const toDetail = async (key: number) => {
  await router.push({
    name: 'customer-detail',
    params: {
      id: key,
    },
  })
}

const toEdit = async (key: number) => {
  await router.push({
    name: 'customer-edit',
    params: {
      id: key,
    },
  })
}

const remove = async (row: any) => {
  await useCustomerStore().removeCustomerById(row.id)
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
                <div class="text-h6">お客様一覧</div>
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
              <template #[`body-cell-contact`]="{ row }">
                <q-td>
                  {{ row.contact?.name }}
                </q-td>
              </template>
              <template #[`body-cell-contactTel`]="{ row }">
                <q-td>
                  {{ row.contact?.tel }}
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key, row }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="toEdit(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="remove(row)" v-if="row.id != 1" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Inbound } from 'src/api/Api'
import { storeToRefs } from 'pinia'
import { useOutboundStore } from 'stores/outbound-store'
import type { QTableProps } from 'quasar'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { outboundList: rows } = storeToRefs(useOutboundStore())

const columns: QTableProps['columns'] = [
  {
    label: 'オーダー番号',
    name: 'outboundOrderId',
    field: 'outboundOrderId',
    align: 'left',
  },
  {
    label: '出庫日',
    name: 'outboundDate',
    field: 'outboundDate',
    align: 'left',
  },
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
    label: '状態',
    name: 'status',
    field: 'status',
    align: 'left',
  },
  {
    label: '操作',
    name: 'actions',
    field: 'actions',
    align: 'right',
  }
]

onMounted(async () => {
  await useOutboundStore().getOutboundList()
})

const router = useRouter()
const toCreate = async () => {
  await router.push({
    name: 'outbound-create',
  })
}

const toDetail = async (key: number) => {
  await router.push({
    name: 'outbound-detail',
    params: {
      id: key,
    },
  });
}

const toEdit = async (key: number) => {
  await router.push({
    name: 'outbound-edit',
    params: {
      id: key,
    },
  });
}

const remove = async (row: any) => {
  await useOutboundStore().removeOutboundById(row.id)
  await useOutboundStore().getOutboundList()
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
                <div class="text-h6">出庫一覧</div>
              </template>
              <template #top-right>
                <q-btn
                  label="新規"
                  color="primary"
                  icon="sym_r_add"
                  @click="toCreate()"
                />
              </template>
              <template #[`body-cell-warehouse`]="{ row }: { row: Inbound }">
                <q-td>
                  {{ row.warehouse?.name }}
                </q-td>
              </template>
              <template #[`body-cell-customer`]="{ row }: { row: Inbound }">
                <q-td >
                  {{ row.customer?.name }}
                </q-td>
              </template>
              <template #[`body-cell-status`]="{ row }: { row: Inbound }">
                <q-td>
                  <q-chip color="teal" label="下書き" dark v-if="row.status == 'draft'" />
                  <q-chip color="warning" label="未確認" dark v-if="row.status == 'pending'" />
                  <q-chip color="green" label="確認済" dark v-if="row.status == 'approved'" />
                  <q-chip color="red" label="拒否" dark v-if="row.status == 'rejected'" />
                  <q-chip color="grey" label="取消" dark v-if="row.status == 'cancelled'" />
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

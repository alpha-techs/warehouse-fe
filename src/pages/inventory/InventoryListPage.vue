<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInventoryStore } from 'stores/inventory-store'
import type { QTableProps } from 'quasar'
import { onMounted, ref } from 'vue'
import type { InventoryItem } from 'src/api/Api'
import { useRouter } from 'vue-router'

const router = useRouter()

const { inventoryList: rows } = storeToRefs(useInventoryStore())
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

onMounted(async () => {
  await useInventoryStore().getInventoryList()
})

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
              :columns="columns"
              :rows="rows"
              row-key="id"
              selection="multiple"
              v-model:selected="selectedRows"
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
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import type { InventoryItem } from 'src/api/Api'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from 'stores/inventory-store'
import type { QTableProps } from 'quasar'
import { useRouter } from 'vue-router'

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add',
  },
});

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [value: InventoryItem]
}>();

const submit = () => {
  if (selectedRows.value.length > 0) {
    const row = selectedRows.value[0] as InventoryItem
    emit('submit', row);
    emit('update:show', false);
  }
}

const { inventoryList: rows } = storeToRefs(useInventoryStore())
const columns: QTableProps['columns'] = [
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
    label: 'オーダー番号',
    name: 'inboundOrderId',
    field: 'inboundOrderId',
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
    label: 'LOT番号',
    name: 'lotNumber',
    field: 'lotNumber',
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
]

const selectedRows = ref<InventoryItem[]>([])

const router = useRouter()

const reload = async () => {
  selectedRows.value = []
  useInventoryStore().resetList()
  await useInventoryStore().getInventoryList()
}

defineExpose({
  reload,
})
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      :model-value="show"
      @update:model-value="$emit('update:show', $event)"
      persistent
      full-width
    >
      <q-card class="card">
        <q-card-section class="q-pa-none">
          <q-table
            flat
            :columns="columns"
            :rows="rows"
            row-key="id"
            selection="single"
            v-model:selected="selectedRows"
          >
            <template #[`body-cell-warehouse`]="{ row }: { row: InventoryItem }">
              <q-td>
                <a :href="router.resolve({ name: 'warehouse-detail', params: { id: row.warehouse!.id }}).href" v-if="row.warehouse">
                  {{ row.warehouse!.name }}
                </a>
              </q-td>
            </template>
            <template #[`body-cell-customer`]="{ row }: { row: InventoryItem }">
              <q-td>
                <a :href="router.resolve({ name: 'customer-detail', params: { id: row.customer!.id }}).href" v-if="row.customer">
                  {{ row.customer!.name }}
                </a>
              </q-td>
            </template>
            <template #[`body-cell-product`]="{ row }: { row: InventoryItem }">
              <q-td>
                <a :href="router.resolve({ name: 'product-detail', params: { id: row.product!.id }}).href" v-if="row.product">
                  {{ row.product!.name }}
                </a>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn label="取消" color="negative" @click="$emit('update:show', false)" />
          <q-btn label="確認" color="primary" @click="submit" disablednvm />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


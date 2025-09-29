<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOrderStore } from 'stores/order-store'
import type { QTableProps } from 'quasar'
import { computed, ref } from 'vue'
import OrderItemDialog from 'components/procurement/OrderItemDialog.vue'
import type { OrderFormItem } from 'stores/order-store'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const { formModel: order } = storeToRefs(useOrderStore())

const columns: QTableProps['columns'] = [
  {
    label: '商品',
    name: 'product',
    field: 'product',
    align: 'left',
  },
  {
    label: 'SKU',
    name: 'sku',
    field: 'sku',
    align: 'left',
  },
  {
    label: '単位',
    name: 'unit',
    field: 'unit',
    align: 'left',
  },
  {
    label: '数量',
    name: 'quantity',
    field: 'quantity',
    align: 'right',
  },
  {
    label: '単価',
    name: 'unitPrice',
    field: 'unitPrice',
    align: 'right',
  },
  {
    label: '金額',
    name: 'lineAmount',
    field: 'lineAmount',
    align: 'right',
  },
  {
    label: '備考',
    name: 'note',
    field: 'note',
    align: 'left',
  },
  {
    label: '操作',
    name: 'actions',
    field: 'actions',
    align: 'right',
  },
]

const visibleColumns = computed(() => {
  if (props.readonly) {
    return columns
      .filter((column) => column.name !== 'actions')
      .map((column) => column.name)
  }
  return columns.map((column) => column.name)
})

const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editIndex = ref<number>(-1)

const formatAmount = (value?: number) => {
  if (value == null) {
    return '-'
  }
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: order.value.currency ?? 'JPY',
    minimumFractionDigits: 0,
  }).format(value)
}

const showAddingDialog = () => {
  useOrderStore().resetItemModel()
  dialogMode.value = 'add'
  showDialog.value = true
}

const onSubmit = (data: OrderFormItem) => {
  if (!order.value.items) {
    order.value.items = []
  }
  if (dialogMode.value === 'add') {
    order.value.items.push(data)
  } else if (editIndex.value >= 0 && order.value.items[editIndex.value]) {
    order.value.items[editIndex.value] = data
  }
  useOrderStore().recalculateTotals()
}

const onEditItem = (item: OrderFormItem, index: number) => {
  useOrderStore().resetItemModel(item)
  dialogMode.value = 'edit'
  editIndex.value = index
  showDialog.value = true
}

const onDeleteItem = (index: number) => {
  if (order.value.items && index >= 0 && index < order.value.items.length) {
    order.value.items.splice(index, 1)
  }
  useOrderStore().recalculateTotals()
}
</script>

<template>
  <q-table
    :rows="order.items ?? []"
    :columns="columns"
    :visible-columns="visibleColumns"
    flat
    hide-pagination
    hide-no-data
  >
    <template #top-left>
      <div class="text-h6">商品リスト</div>
    </template>
    <template #top-right v-if="!readonly">
      <q-btn
        label="追加"
        color="primary"
        class="float-right text-capitalize shadow-3"
        icon="sym_r_add"
        @click="showAddingDialog()"
        :disable="loading"
      />
    </template>
    <template #[`body-cell-product`]="{ row }: { row: OrderFormItem }">
      <td>
        {{ row.product?.name ?? '-' }}
      </td>
    </template>
    <template #[`body-cell-sku`]="{ row }: { row: OrderFormItem }">
      <td>
        {{ row.product?.sku ?? '-' }}
      </td>
    </template>
    <template #[`body-cell-unitPrice`]="{ row }: { row: OrderFormItem }">
      <td class="text-right">
        {{ formatAmount(row.unitPrice) }}
      </td>
    </template>
    <template #[`body-cell-lineAmount`]="{ row }: { row: OrderFormItem }">
      <td class="text-right">
        {{ formatAmount(row.lineAmount) }}
      </td>
    </template>
    <template #[`body-cell-actions`]="{ row, rowIndex }: { row: OrderFormItem, rowIndex: number }">
      <td class="text-right">
        <template v-if="!readonly">
          <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="onEditItem(row, rowIndex)" />
          <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="onDeleteItem(rowIndex)" />
        </template>
      </td>
    </template>
  </q-table>
  <order-item-dialog
    :show="showDialog"
    :mode="dialogMode"
    @update:show="showDialog = $event"
    @submit="onSubmit"
  />
</template>

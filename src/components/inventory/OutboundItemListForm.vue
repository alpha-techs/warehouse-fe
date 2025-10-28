<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOutboundStore } from 'stores/outbound-store'
import type { QTableProps } from 'quasar'
import { computed, ref } from 'vue'
import type { OutboundItem } from 'src/api/Api'
import OutboundItemDialog from 'components/inventory/OutboundItemDialog.vue'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const {
  formModel: outbound
} = storeToRefs(useOutboundStore())

const columns: QTableProps['columns'] = [
  {
    label: '商品',
    name: 'product',
    field: 'product',
    align: 'left',
  },
  {
    label: '規格',
    name: 'dimension',
    field: 'dimension',
    align: 'left',
  },
  {
    label: '出庫数量',
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
    label: '税額',
    name: 'taxAmount',
    field: 'taxAmount',
    align: 'right',
  },
  {
    label: 'LOT番号',
    name: 'lotNumber',
    field: 'lotNumber',
    align: 'left',
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
    return columns.filter(column => column.name!== 'actions').map(column => column.name);
  }
  return columns.map(column => column.name);
})

const showDialog = ref(false);
const dialogMode = ref<'add' | 'edit'>('add');
const editItemIndex = ref<number>(-1);

const formatAmount = (value?: number, currency?: string) => {
  if (value === undefined || value === null) {
    return '-'
  }
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currency ?? outbound.value.currency ?? 'JPY',
  }).format(value)
}

const showAddingDialog = () => {
  useOutboundStore().resetItemModel();
  dialogMode.value = 'add';
  showDialog.value = true;
};

const onSubmit = (data: OutboundItem) => {
  if (outbound.value.items == undefined) {
    outbound.value.items = [];
  }

  if (dialogMode.value === 'add') {
    outbound.value.items.push(data);
  } else {
    if (outbound.value.items[editItemIndex.value]) {
      outbound.value.items[editItemIndex.value] = data;
    }
  }

  if (outbound.value.warehouse == undefined) {
    outbound.value.warehouse = data.warehouse;
  }

  useOutboundStore().recalculateTotals();
}

const onEditItem = (data: OutboundItem, rowIndex: number) => {
  useOutboundStore().resetItemModel(data);
  dialogMode.value = 'edit';
  editItemIndex.value = rowIndex
  showDialog.value = true;
}

const onDeleteItem = (data: OutboundItem) => {
  const index = outbound.value.items?.findIndex(item => item.id === data.id);
  if (index != undefined && index >= 0) {
    outbound.value.items?.splice(index, 1);
  }
  useOutboundStore().recalculateTotals();
}
</script>

<template>
  <q-table
    :rows="outbound.items!"
    :columns="columns"
    :visibleColumns="visibleColumns"
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
    <template #[`body-cell-product`]="{ row }: { row: OutboundItem }">
      <td>
        {{ row.product?.name }}
      </td>
    </template>
    <template #[`body-cell-dimension`]="{ row }: { row: OutboundItem }">
      <td>
        {{ row.product?.dimension?.description }}
      </td>
    </template>
    <template #[`body-cell-unitPrice`]="{ row }: { row: OutboundItem }">
      <td class="text-right">
        {{ formatAmount(row.unitPrice, row.currency) }}
      </td>
    </template>
    <template #[`body-cell-lineAmount`]="{ row }: { row: OutboundItem }">
      <td class="text-right">
        {{ formatAmount(row.lineAmount, row.currency) }}
      </td>
    </template>
    <template #[`body-cell-taxAmount`]="{ row }: { row: OutboundItem }">
      <td class="text-right">
        {{ formatAmount(row.taxAmount, row.currency) }}
      </td>
    </template>
    <template #[`body-cell-actions`]="{ row, rowIndex }: { row: OutboundItem, rowIndex: number }">
      <td class="text-right">
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="onEditItem(row, rowIndex)"/>
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="onDeleteItem(row)"/>
      </td>
    </template>
  </q-table>
  <outbound-item-dialog
    :show="showDialog"
    :mode="dialogMode"
    @update:show="showDialog = $event"
    @submit="onSubmit"
  />
</template>

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

const { formModel: outbound } = storeToRefs(useOutboundStore())

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
    label: 'LOT番号',
    name: 'lotNumber',
    field: 'lotNumber',
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

const showAddingDialog = () => {
  dialogMode.value = 'add';
  showDialog.value = true;
};

const onSubmit = (data: OutboundItem) => {
  if (outbound.value.items == undefined) {
    outbound.value.items = [];
  }
  outbound.value.items.push(data);
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
  </q-table>
  <outbound-item-dialog
    :show="showDialog"
    :mode="dialogMode"
    @update:show="showDialog = $event"
    @submit="onSubmit"
  />
</template>

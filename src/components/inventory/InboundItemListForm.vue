<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInboundStore } from 'stores/inbound-store'
import type { QTableProps } from 'quasar'
import { computed, ref } from 'vue'
import InboundItemDialog from 'components/inventory/InboundItemDialog.vue'
import type { InboundItem } from 'src/api/Api'

const { formModel: inbound } = storeToRefs(useInboundStore())

const columns: QTableProps['columns'] = [
  {
    label: '商品',
    name: 'product',
    field: 'product',
    align: 'left',
  },
  {
    label: '数量',
    name: 'quantity',
    field: 'quantity',
    align: 'right',
  },
  {
    label: '単量',
    name: 'perItemWeight',
    field: 'perItemWeight',
    align: 'right',
  },
  {
    label: '重さ',
    name: 'totalWeight',
    field: 'totalWeight',
    align: 'right',
  },
  {
    label: '製造日',
    name: 'manufactureDate',
    field: 'manufactureDate',
    align: 'left',
  },
  {
    label: '賞味期限',
    name: 'bestBeforeDate',
    field: 'bestBeforeDate',
    align: 'left',
  },
  {
    label: 'LOT番号',
    name: 'lotNumber',
    field: 'lotNumber',
    align: 'left',
  },
  {
    label: '船名',
    name: 'shipName',
    field: 'shipName',
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


const showDialog = ref(false);
const dialogMode = ref<'add' | 'edit'>('add');

const showAddingDialog = () => {
  dialogMode.value = 'add';
  showDialog.value = true;
};

const onSubmit = (data: InboundItem) => {
  if (inbound.value.items == undefined) {
    inbound.value.items = [];
  }
  inbound.value.items.push(data);
}
</script>

<template>
  <q-table
    :rows="inbound.items!"
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
    <template #[`body-cell-product`]="{ row }: { row: InboundItem}">
      <td>
        {{ row.product?.name }}
      </td>
    </template>
    <template #[`body-cell-perItemWeight`]="{ row }: { row: InboundItem}">
      <td class="text-right">
        {{ row.perItemWeight }} <template v-if="row.perItemWeightUnit">({{ row.perItemWeightUnit }})</template>
      </td>
    </template>
    <template #[`body-cell-totalWeight`]="{ row }: { row: InboundItem}">
      <td class="text-right">
        {{ row.totalWeight }} <template v-if="row.perItemWeightUnit">({{ row.perItemWeightUnit }})</template>
      </td>
    </template>
  </q-table>
  <inbound-item-dialog
    :show="showDialog"
    :mode="dialogMode"
    @update:show="showDialog = $event"
    @submit="onSubmit"
  />
</template>

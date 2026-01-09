<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { QTableProps } from 'quasar'
import type { ExpressSampleShipmentItem } from 'src/api/Api'
import { useExpressSampleStore } from 'stores/express-sample-store'
import ExpressSampleItemDialog from 'components/inventory/ExpressSampleItemDialog.vue'

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

const { formModel: expressSample } = storeToRefs(useExpressSampleStore())

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
    label: '規格',
    name: 'specification',
    field: 'specification',
    align: 'left',
  },
  {
    label: '数量',
    name: 'quantity',
    field: 'quantity',
    align: 'right',
  },
  {
    label: '数量単位',
    name: 'quantityUnit',
    field: 'quantityUnit',
    align: 'left',
  },
  {
    label: 'サンプル梱包',
    name: 'samplePackaging',
    field: 'samplePackaging',
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
    return columns
      .filter((column) => column.name !== 'actions')
      .map((column) => column.name)
  }
  return columns.map((column) => column.name)
})

const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editItemIndex = ref<number>(-1)

const showAddingDialog = () => {
  useExpressSampleStore().resetItemModel()
  dialogMode.value = 'add'
  showDialog.value = true
}

const onSubmit = (data: ExpressSampleShipmentItem) => {
  if (!expressSample.value.items) {
    expressSample.value.items = []
  }

  if (dialogMode.value === 'add') {
    expressSample.value.items.push(data)
  } else if (
    editItemIndex.value >= 0 &&
    editItemIndex.value < expressSample.value.items.length
  ) {
    expressSample.value.items[editItemIndex.value] = data
  }
}

const onEditItem = (data: ExpressSampleShipmentItem, rowIndex: number) => {
  useExpressSampleStore().resetItemModel(data)
  dialogMode.value = 'edit'
  editItemIndex.value = rowIndex
  showDialog.value = true
}

const onDeleteItem = (rowIndex: number) => {
  if (!expressSample.value.items) {
    return
  }
  expressSample.value.items.splice(rowIndex, 1)
}
</script>

<template>
  <q-table
    :rows="expressSample.items || []"
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
        @click="showAddingDialog"
        :disable="loading"
      />
    </template>
    <template #[`body-cell-product`]="{ row }: { row: ExpressSampleShipmentItem }">
      <td>{{ row.product?.name }}</td>
    </template>
    <template #[`body-cell-sku`]="{ row }: { row: ExpressSampleShipmentItem }">
      <td>{{ row.product?.sku || '-' }}</td>
    </template>
    <template
      #[`body-cell-specification`]="{ row }: { row: ExpressSampleShipmentItem }"
    >
      <td>{{ row.product?.specification || '-' }}</td>
    </template>
    <template #[`body-cell-quantity`]="{ row }: { row: ExpressSampleShipmentItem }">
      <td class="text-right">{{ row.quantity ?? '-' }}</td>
    </template>
    <template
      #[`body-cell-quantityUnit`]="{ row }: { row: ExpressSampleShipmentItem }"
    >
      <td>{{ row.quantityUnit || '-' }}</td>
    </template>
    <template
      #[`body-cell-samplePackaging`]="{ row }: { row: ExpressSampleShipmentItem }"
    >
      <td>{{ row.samplePackaging || '-' }}</td>
    </template>
    <template #[`body-cell-note`]="{ row }: { row: ExpressSampleShipmentItem }">
      <td>{{ row.note || '-' }}</td>
    </template>
    <template
      #[`body-cell-actions`]="{ row, rowIndex }: { row: ExpressSampleShipmentItem; rowIndex: number }"
    >
      <td class="text-right">
        <q-btn
          class="q-ml-sm"
          size="sm"
          flat
          dense
          icon="sym_r_edit"
          @click="onEditItem(row, rowIndex)"
        />
        <q-btn
          class="q-ml-sm"
          size="sm"
          flat
          dense
          icon="sym_r_delete"
          @click="onDeleteItem(rowIndex)"
        />
      </td>
    </template>
  </q-table>
  <express-sample-item-dialog
    :show="showDialog"
    :mode="dialogMode"
    @update:show="showDialog = $event"
    @submit="onSubmit"
  />
</template>

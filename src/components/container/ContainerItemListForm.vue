<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useContainerStore } from 'stores/container-store'
import type { ContainerItem } from 'src/api/Api'
import { computed, ref } from 'vue'
import ContainerItemDialog from './ContainerItemDialog.vue'
import type { QTableProps } from 'quasar'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  }
});

const { formModel: container } = storeToRefs(useContainerStore())

const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')

const showAddingDialog = () => {
  useContainerStore().resetItemModel();
  dialogMode.value = 'add';
  showDialog.value = true;
}

const columns: QTableProps['columns'] = [
  {
    name: 'product',
    label: '商品',
    field: 'product',
    align: 'left',
  },
  {
    name: 'quantity',
    label: '数量',
    field: 'quantity',
    align: 'left',
  },
  {
    name: 'manufactureDate',
    label: '製造日',
    field: 'manufactureDate',
    align: 'left',
  },
  {
    name: 'bestBeforeDate',
    label: '賞味期限',
    field: 'bestBeforeDate',
    align: 'left',
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    align: 'right',
  }
]

const visibleColumns = computed(() => {
  if (props.readonly) {
    return columns.filter(column => column.name!== 'actions').map(column => column.name);
  }
  return columns.map(column => column.name);
})

const onSubmit = (data: ContainerItem) => {
  if (dialogMode.value === 'add') {
    if (container.value.items == undefined) {
      container.value.items = [];
    }
    container.value.items.push(data);
  } else {
    const index = container.value.items?.findIndex(item => item.id === data.id);
    if (index != undefined && index >= 0) {
      container.value.items![index] = data;
    }
  }
}

const onEditItem = (data: ContainerItem) => {
  useContainerStore().resetItemModel(data);
  dialogMode.value = 'edit';
  showDialog.value = true;
}

const onDeleteItem = (data: ContainerItem) => {
  const index = container.value.items?.findIndex(item => item.id === data.id);
  if (index != undefined && index >= 0) {
    container.value.items?.splice(index, 1);
  }
}
</script>

<template>
  <q-table
    :rows="container.items!"
    :columns="columns"
    :visibleColumns="visibleColumns"
    flat
    hide-pagination
    hide-no-data
  >
    <template #[`body-cell-product`]="{ row }: { row: ContainerItem }">
      <q-td>
        {{ row.product?.name }}
      </q-td>
    </template>
    <template #[`body-cell-actions`]="{ row }: { row: ContainerItem }">
      <q-td class="text-right">
        <q-btn-group flat>
          <q-btn flat dense size="sm" icon="sym_r_edit" @click="onEditItem(row)" />
          <q-btn flat dense size="sm" icon="sym_r_delete" @click="onDeleteItem(row)" />
        </q-btn-group>
      </q-td>
    </template>
  </q-table>
  <q-btn
    v-if="!readonly"
    flat
    color="primary"
    icon="add"
    label="商品を追加"
    @click="showAddingDialog"
  />
  <container-item-dialog v-model:show="showDialog" :mode="dialogMode" @submit="onSubmit" />
</template>

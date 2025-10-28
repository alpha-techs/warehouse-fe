<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNameChangeStore } from 'stores/namechange-store'
import type { QTableProps } from 'quasar'
import { computed, ref } from 'vue'
import type { NameChangeItem } from 'src/api/Api'
import NameChangeItemDialog from 'components/inventory/NameChangeItemDialog.vue'

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
    formModel: nameChange
} = storeToRefs(useNameChangeStore())

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
        label: '名義変更数量',
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
        return columns.filter(column => column.name !== 'actions').map(column => column.name);
    }
    return columns.map(column => column.name);
})

const showDialog = ref(false);
const dialogMode = ref<'add' | 'edit'>('add');
const editItemIndex = ref<number>(-1);

const showAddingDialog = () => {
    useNameChangeStore().resetItemModel();
    dialogMode.value = 'add';
    showDialog.value = true;
};

const onSubmit = (data: NameChangeItem) => {
    if (nameChange.value.items == undefined) {
        nameChange.value.items = [];
    }

    if (dialogMode.value === 'add') {
        nameChange.value.items.push(data);
    } else {
        if (nameChange.value.items[editItemIndex.value]) {
            nameChange.value.items[editItemIndex.value] = data;
        }
    }

    if (nameChange.value.warehouse == undefined) {
        nameChange.value.warehouse = data.warehouse;
    }
}

const onEditItem = (data: NameChangeItem, rowIndex: number) => {
    useNameChangeStore().resetItemModel(data);
    dialogMode.value = 'edit';
    editItemIndex.value = rowIndex
    showDialog.value = true;
}

const onDeleteItem = (data: NameChangeItem) => {
    const index = nameChange.value.items?.findIndex(item => item.id === data.id);
    if (index != undefined && index >= 0) {
        nameChange.value.items?.splice(index, 1);
    }
}
</script>

<template>
    <q-table :rows="nameChange.items!" :columns="columns" :visibleColumns="visibleColumns" flat hide-pagination
        hide-no-data>
        <template #top-left>
            <div class="text-h6">商品リスト</div>
        </template>
        <template #top-right v-if="!readonly">
            <q-btn label="追加" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add"
                @click="showAddingDialog()" :disable="loading" />
        </template>
        <template #[`body-cell-product`]="{ row }: { row: NameChangeItem }">
            <td>
                {{ row.product?.name }}
            </td>
        </template>
        <template #[`body-cell-dimension`]="{ row }: { row: NameChangeItem }">
            <td>
                {{ row.product?.dimension?.description }}
            </td>
        </template>
        <template #[`body-cell-actions`]="{ row, rowIndex }: { row: NameChangeItem, rowIndex: number }">
            <td class="text-right">
                <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="onEditItem(row, rowIndex)" />
                <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="onDeleteItem(row)" />
            </td>
        </template>
    </q-table>
    <name-change-item-dialog :show="showDialog" :mode="dialogMode" @update:show="showDialog = $event"
        @submit="onSubmit" />
</template>

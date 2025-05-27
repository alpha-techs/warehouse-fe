<script setup lang="ts">
import { useContainerStore } from 'stores/container-store'
import { storeToRefs } from 'pinia'
import type { QTableProps } from 'quasar';
import { QTable, useQuasar } from 'quasar'
import { computed, onMounted, type Ref, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import type { FePagination } from 'src/utils/pagination'
import type { Container } from 'src/api/Api'

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');
const {
  containerList: rows,
  containerListPagination,
  containerListQuery: searchParams,
} = storeToRefs(useContainerStore());
const $q = useQuasar();

const columns: QTableProps['columns'] = [
  {
    label: 'コンテナ番号',
    name: 'containerNumber',
    field: 'containerNumber',
    align: 'left',
  },
  {
    label: '船会社',
    name: 'shippingLine',
    field: 'shippingLine',
    align: 'left',
  },
  {
    label: '船名',
    name: 'vesselName',
    field: 'vesselName',
    align: 'left',
  },
  {
    label: '航海番号',
    name: 'voyageNumber',
    field: 'voyageNumber',
    align: 'left',
  },
  {
    label: '入港日',
    name: 'arrivalDate',
    field: 'arrivalDate',
    align: 'left',
  },
  {
    label: '通関日',
    name: 'clearanceDate',
    field: 'clearanceDate',
    align: 'left',
  },
  {
    label: '荷揚げ日',
    name: 'dischargeDate',
    field: 'dischargeDate',
    align: 'left',
  },
  {
    label: '空コンテナ返却日',
    name: 'returnDate',
    field: 'returnDate',
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

onMounted(() => {
  tableRef.value?.requestServerInteraction();
})

const pagination: Ref<FePagination> = ref({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const maxPage = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0;
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
})

const onPageChange = () => {
  tableRef.value?.requestServerInteraction({ pagination: pagination.value });
}

const onRequest = async ({ pagination: _pagination }: { pagination: { page: number, rowsPerPage: number } }) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const query = {
      ...searchParams.value,
      page,
      itemsPerPage: rowsPerPage,
    }
    await useContainerStore().getContainerList(query)
    pagination.value = {
      page: containerListPagination.value.page,
      rowsPerPage: containerListPagination.value.itemsPerPage,
      rowsNumber: containerListPagination.value.totalItems,
      sortBy: undefined,
      descending: false,
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const router = useRouter()
const toCreate = async () => {
  await router.push({
    name: 'container-create',
  });
}

const toDetail = async (key: number) => {
  await router.push({
    name: 'container-detail',
    params: {
      id: key,
    },
  });
}

const toEdit = async (key: number) => {
  await router.push({
    name: 'container-edit',
    params: {
      id: key,
    },
  });
}

const remove = (row: Container) => {
  $q.dialog({
    title: 'コンテナ削除',
    message: `コンテナ「${row.containerNumber}」を削除しますか？`,
    ok: { label: '確認', color: 'negative' },
    cancel: { label: 'キャンセル', color: 'grey-8' },
    persistent: true,
  }).onOk(() => {
    void (async () => {
      if (!row.id) {
        return;
      }
      try {
        await useContainerStore().removeContainerById(row.id)
      } catch (e) {
        console.error(e);
      }
      tableRef.value?.requestServerInteraction();
    })();
  });
}

const search = () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } })
}
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card bordered>
          <q-linear-progress v-if="loading" />
          <q-card-section class="q-pa-none">
            <q-table flat :columns="columns" :rows="rows" row-key="id" hide-pagination v-model:pagination="pagination"
              @request="onRequest" ref="tableRef">
              <template #top>
                <div class="row" style="width: 100%">
                  <div class="text-h6">コンテナ一覧</div>
                  <q-space />
                  <div style="display: flex; align-items: center;">
                    <q-btn size="sm" label="新規" color="primary" icon="sym_r_add" @click="toCreate()" />
                  </div>
                </div>
                <div class="row" style="width: 100%">
                  <q-input class="q-pr-sm" v-model="searchParams.containerNumber" label="コンテナ番号" dense
                    @keyup.enter="search" style="width: 180px;"></q-input>
                  <q-select class="q-pr-sm" v-model="searchParams['statuses[]']" label="状態" dense multiple :options="[
                    { label: '輸送中', value: 'shipping' },
                    { label: '入港済', value: 'arrived' },
                    { label: '通関中', value: 'customsClearance' },
                    { label: '荷揚げ中', value: 'discharging' },
                    { label: '荷揚げ済', value: 'discharged' },
                    { label: '空コンテナ', value: 'empty' },
                    { label: '返却済', value: 'returned' },
                    { label: 'キャンセル', value: 'canceled' },
                  ]" emit-value map-options style="width: 180px;"></q-select>
                  <q-space />
                  <div style="display: flex; align-items: center;">
                    <q-btn size="sm" label="検索" color="primary" icon="sym_r_search" @click="search" />
                  </div>
                </div>
              </template>
              <template #[`body-cell-status`]="{ row }">
                <q-td>
                  <q-chip :color="{
                    shipping: 'blue',
                    arrived: 'green',
                    customsClearance: 'orange',
                    discharging: 'purple',
                    discharged: 'teal',
                    empty: 'grey',
                    returned: 'grey-8',
                    canceled: 'red',
                  }[row.status || '']" text-color="white" dense>
                    {{
                      {
                        shipping: '輸送中',
                        arrived: '入港済',
                        customsClearance: '通関中',
                        discharging: '荷揚げ中',
                        discharged: '荷揚げ済',
                        empty: '空コンテナ',
                        returned: '返却済',
                        canceled: 'キャンセル',
                      }[row.status || '']
                    }}
                  </q-chip>
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key, row }: { key: number, row: Container }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="toEdit(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="remove(row)" />
                </q-td>
              </template>
            </q-table>
            <q-separator />
            <div class="row justify-center q-my-md">
              <q-pagination v-model="pagination.page" color="primary" :max="maxPage" max-pages="9"
                @update:model-value="onPageChange" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

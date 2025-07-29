<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInboundStore } from 'stores/inbound-store'
import type { QTable, QTableProps } from 'quasar'
import { useRouter } from 'vue-router'
import { computed, onMounted, type Ref, ref, useTemplateRef } from 'vue'
import type { Inbound } from 'src/api/Api'
import type { FePagination } from 'src/utils/pagination'

const loading = ref(false);
const tableRef = useTemplateRef<QTable | undefined>('tableRef');
const {
  inboundList: rows,
  inboundListPagination,
} = storeToRefs(useInboundStore())
const columns: QTableProps['columns'] = [
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

onMounted( () => {
  tableRef.value?.requestServerInteraction();
})

const pagination: Ref<FePagination> = ref({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 15,
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
};

const onRequest = async ({ pagination: _pagination }: { pagination: { page: number, rowsPerPage: number} }) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const query = {
      page,
      itemsPerPage: rowsPerPage,
    }
    await useInboundStore().getInboundList(query)
    pagination.value = {
      page: inboundListPagination.value.page,
      rowsPerPage: inboundListPagination.value.itemsPerPage,
      rowsNumber: inboundListPagination.value.totalItems,
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
    name: 'inbound-create',
  });
}

const toDetail = async (key: number) => {
  await router.push({
    name: 'inbound-detail',
    params: {
      id: key,
    },
  });
}

const toEdit = async (key: number) => {
  await router.push({
    name: 'inbound-edit',
    params: {
      id: key,
    },
  });
}

const remove = async (row: any) => {
  await useInboundStore().removeInboundById(row.id)
  await useInboundStore().getInboundList()
}
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-table
              flat
              :columns="columns"
              :rows="rows"
              row-key="id"
              hide-pagination
              v-model:pagination="pagination"
              @request="onRequest"
              ref="tableRef"
            >
              <template #top-left>
                <div class="text-h6">入庫依頼一覧</div>
              </template>
              <template #top-right>
                <q-btn
                  label="新規"
                  color="primary"
                  icon="sym_r_add"
                  @click="toCreate()"
                />
              </template>
              <template #[`body-cell-warehouse`]="{ row }: { row: Inbound }">
                <q-td>
                  {{ row.warehouse?.name }}
                </q-td>
              </template>
              <template #[`body-cell-customer`]="{ row }: { row: Inbound }">
                <q-td >
                  {{ row.customer?.name }}
                </q-td>
              </template>
              <template #[`body-cell-status`]="{ row }: { row: Inbound }">
                <q-td>
                  <q-chip color="teal" label="下書き" dark v-if="row.status == 'draft'" />
                  <q-chip color="warning" label="未確認" dark v-if="row.status == 'pending'" />
                  <q-chip color="green" label="確認済" dark v-if="row.status == 'approved'" />
                  <q-chip color="red" label="拒否" dark v-if="row.status == 'rejected'" />
                  <q-chip color="grey" label="取消" dark v-if="row.status == 'cancelled'" />
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key, row }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail(key)" />
                  <q-btn
                    class="q-ml-sm"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_edit"
                    @click="toEdit(key)"
                    v-if="row.status != 'approved'"
                  />
                  <q-btn
                    class="q-ml-sm"
                    size="sm"
                    flat
                    dense
                    icon="sym_r_delete"
                    @click="remove(row)"
                    v-if="row.status != 'approved'"
                  />
                </q-td>
              </template>
            </q-table>
            <q-separator/>
            <div class="row justify-center q-my-md">
              <q-pagination
                v-model="pagination.page"
                color="primary"
                :max="maxPage"
                max-pages="9"
                @update:model-value="onPageChange"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

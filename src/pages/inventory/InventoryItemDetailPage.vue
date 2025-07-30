<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventoryStore } from 'stores/inventory-store'
import { storeToRefs } from 'pinia'
import type { OutboundItem } from 'src/api/Api'

const loading = ref(false)
const router = useRouter()

const inventoryItemId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

const {
  inventoryItemDetail
} = storeToRefs(useInventoryStore())

onMounted(async () => {
  await reload();
});

const reload = async () => {
  loading.value = true;
  await useInventoryStore().getInventoryItemDetail(inventoryItemId.value);
  await nextTick(() => {
    loading.value = false;
  });
};

const backToList = async () => {
  await router.push({ name: 'inventory-list' });
}

const toProductDetail = async (productId: number) => {
  await router.push({ name: 'product-detail', params: { id: productId } });
}

const toWarehouseDetail = async (warehouseId: number) => {
  await router.push({ name: 'warehouse-detail', params: { id: warehouseId } });
}

const toCustomerDetail = async (customerId: number) => {
  await router.push({ name: 'customer-detail', params: { id: customerId } });
}

const toInboundDetail = async (inboundId: number) => {
  await router.push({ name: 'inbound-detail', params: { id: inboundId } });
}

const toOutboundDetail = async (outboundId: number) => {
  await router.push({ name: 'outbound-detail', params: { id: outboundId } });
}
</script>

<template>
  <q-page padding>
    <q-linear-progress indeterminate v-if="loading" />

    <div v-if="!loading && inventoryItemDetail" class="q-pa-md">
      <!-- 页面标题 -->
      <div class="row items-center q-mb-md">
        <div class="text-h6">在庫商品詳細</div>
        <q-space />
        <span class="text-caption text-grey-6">ID: {{ inventoryItemDetail.id }}</span>
      </div>

      <!-- 基本情報 -->
      <section class="q-mb-md">
        <div class="row items-center q-mb-sm">
          <h3 class="text-subtitle2 text-weight-bold text-blue-8 q-ma-none">基本情報</h3>
        </div>
        <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #e0e0e0;">
          <div class="row">
            <div class="col-12">
              <div class="text-caption text-grey-7 q-mb-xs">倉庫</div>
              <div class="text-body2">
                <q-btn
                  v-if="inventoryItemDetail.warehouse"
                  @click="toWarehouseDetail(inventoryItemDetail.warehouse!.id!)"
                  color="primary"
                  flat
                  no-caps
                  class="text-weight-bold q-pa-none"
                  size="sm"
                >
                  {{ inventoryItemDetail.warehouse.name }}
                </q-btn>
                <span v-else class="text-grey-6">-</span>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-7 q-mb-xs">商品</div>
              <div class="text-body2">
                <q-btn
                  v-if="inventoryItemDetail.product"
                  @click="toProductDetail(inventoryItemDetail.product!.id!)"
                  color="primary"
                  flat
                  no-caps
                  class="text-weight-bold q-pa-none"
                  size="sm"
                >
                  {{ inventoryItemDetail.product.name }}
                </q-btn>
                <span v-else class="text-grey-6">-</span>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-7 q-mb-xs">お客様</div>
              <div class="text-body2">
                <q-btn
                  v-if="inventoryItemDetail.customer"
                  @click="toCustomerDetail(inventoryItemDetail.customer!.id!)"
                  color="primary"
                  flat
                  no-caps
                  class="text-weight-bold q-pa-none"
                  size="sm"
                >
                  {{ inventoryItemDetail.customer.name }}
                </q-btn>
                <span v-else class="text-grey-6">-</span>
              </div>
            </div>
            <div class="col-3">
              <div class="text-caption text-grey-7 q-mb-xs">ロット番号</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.lotNumber || '-' }}
              </div>
            </div>
            <div class="col-3">
              <div class="text-caption text-grey-7 q-mb-xs">船名</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.shipName || '-' }}
              </div>
            </div>
            <div class="col-3">
              <div class="text-caption text-grey-7 q-mb-xs">製造日</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.manufactureDate || '-' }}
              </div>
            </div>
            <div class="col-3">
              <div class="text-caption text-grey-7 q-mb-xs">賞味期限</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.bestBeforeDate || '-' }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 商品サイズ -->
      <section class="q-mb-md" v-if="inventoryItemDetail.product?.dimension">
        <div class="row items-center q-mb-sm">
          <h3 class="text-subtitle2 text-weight-bold text-orange-8 q-ma-none">商品サイズ</h3>
        </div>
        <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #e0e0e0;">
          <div class="row">
            <div class="col-12">
              <div class="text-caption text-grey-7 q-mb-xs">サイズ説明</div>
              <div class="text-body2 text-weight-medium q-mb-md">
                {{ inventoryItemDetail.product.dimension.description || '-' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption text-grey-7 q-mb-xs">長さ</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.product.dimension.length || 0 }} {{inventoryItemDetail.product.dimension.lengthUnit || 'cm' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption text-grey-7 q-mb-xs">幅</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.product.dimension.width || 0 }} {{ inventoryItemDetail.product.dimension.lengthUnit || 'cm' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption text-grey-7 q-mb-xs">高さ</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.product.dimension.height || 0 }} {{ inventoryItemDetail.product.dimension.lengthUnit || 'cm' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption text-grey-7 q-mb-xs">重量</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.product.dimension.weight || 0 }} {{ inventoryItemDetail.product.dimension.weightUnit || 'kg' }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 在庫情報 -->
      <section class="q-mb-md">
        <div class="row items-center q-mb-sm">
          <h3 class="text-subtitle2 text-weight-bold text-green-8 q-ma-none">在庫情報</h3>
        </div>
        <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #e0e0e0;">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-7 q-mb-xs">入庫数量</div>
              <div class="text-subtitle2  text-blue-8">
                {{ inventoryItemDetail.inboundQuantity || 0 }}
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-7 q-mb-xs">残存数量</div>
              <div class="text-subtitle2  text-green-8">
                {{ inventoryItemDetail.leftQuantity || 0 }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 入庫記録 -->
      <section class="q-mb-md" v-if="inventoryItemDetail.inboundId">
        <div class="row items-center q-mb-sm">
          <h3 class="text-subtitle2 text-weight-bold text-purple-8 q-ma-none">入庫記録</h3>
        </div>
        <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #e0e0e0;">
          <div class="row">
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-7 q-mb-xs">入庫記録ID</div>
              <div class="text-body2">
                <q-btn
                  v-if="inventoryItemDetail.inboundId"
                  @click="toInboundDetail(inventoryItemDetail.inboundId!)"
                  color="purple"
                  flat
                  no-caps
                  class="text-weight-bold q-pa-none"
                  size="sm"
                >
                  {{ inventoryItemDetail.inboundId }}
                </q-btn>
                <span v-else class="text-grey-6">-</span>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-7 q-mb-xs">入庫オーダーID</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.inboundOrderId || '-' }}
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-7 q-mb-xs">入庫日</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.inboundDate || '-' }}
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-7 q-mb-xs">単品重量</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.perItemWeight || 0 }} {{ inventoryItemDetail.perItemWeightUnit || 'kg' }}
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-7 q-mb-xs">総重量</div>
              <div class="text-body2 text-weight-medium">
                {{ inventoryItemDetail.totalWeight || 0 }} {{ inventoryItemDetail.perItemWeightUnit || 'kg' }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 出庫記録 -->
      <section class="q-mb-md"
               v-if="inventoryItemDetail.outboundItems && inventoryItemDetail.outboundItems.length > 0">
        <div class="row items-center q-mb-sm">
          <h3 class="text-subtitle2 text-weight-bold text-red-8 q-ma-none">出庫記録</h3>
        </div>
        <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #e0e0e0;">
          <q-table :rows="inventoryItemDetail.outboundItems" :columns="[
                        { name: 'outboundId', label: '出庫記録ID', field: 'outboundId', align: 'left' },
                        { name: 'outboundOrderId', label: '出庫オーダーID', field: 'outbound.outboundOrderId', align: 'left' },
                        { name: 'outboundDate', label: '出庫日', field: 'outbound.outboundDate', align: 'left' },
                        { name: 'quantity', label: '出庫数量', field: 'quantity', align: 'right' },
                        { name: 'note', label: '備考', field: 'note', align: 'left' }
                    ]" row-key="id" hide-pagination flat class="bg-transparent" dense>
            <template #[`body-cell-outboundId`]="{ row }: { row: OutboundItem }">
              <q-td>
                <q-btn
                  v-if="row.outboundId"
                  @click="toOutboundDetail(row.outboundId!)"
                  color="red"
                  flat
                  no-caps
                  size="sm"
                  class="text-weight-medium q-pa-none"
                >
                  {{ row.outboundId }}
                </q-btn>
                <span v-else class="text-grey-6">-</span>
              </q-td>
            </template>
            <template #[`body-cell-outboundOrderId`]="{ row }: { row: OutboundItem }">
              <q-td>
                <span class="text-weight-medium">{{ row.outbound?.outboundOrderId || '-' }}</span>
              </q-td>
            </template>
            <template #[`body-cell-outboundDate`]="{ row }: { row: OutboundItem }">
              <q-td>
                <span class="text-weight-medium">{{ row.outbound?.outboundDate || '-' }}</span>
              </q-td>
            </template>
            <template #[`body-cell-quantity`]="{ row }: { row: OutboundItem }">
              <q-td class="text-right">
                {{ row.quantity || 0 }}
              </q-td>
            </template>
            <template #[`body-cell-note`]="{ row }: { row: OutboundItem }">
              <q-td>
                <span class="text-caption text-grey-7">{{ row.note || '-' }}</span>
              </q-td>
            </template>
          </q-table>
        </div>
      </section>

      <!-- 无出库记录时的提示 -->
      <section class="q-mb-md" v-else>
        <div class="row items-center q-mb-sm">
          <h3 class="text-subtitle2 text-grey-8 q-ma-none">出庫記録</h3>
        </div>
        <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #e0e0e0;">
          <div class="text-center q-pa-lg">
            <q-icon name="inventory_2" size="48px" color="grey-4" />
            <div class="text-grey-6 q-mt-sm text-body2">出庫記録がありません</div>
          </div>
        </div>
      </section>

      <!-- 操作按钮 -->
      <div class="row justify-end q-mt-md">
        <q-btn
          style="width: 100px"
          color="primary"
          label="一覧に戻る"
          @click="backToList"
          :disable="loading"
          size="sm"
        />
      </div>
    </div>
  </q-page>
</template>

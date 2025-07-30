<template>
  <q-page class="q-pa-md">
    <!-- 统计卡片 -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">総在庫数量</div>
            <div class="text-h4">
              {{ dashboardStore.stats.totalInventoryCount || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h6">今月入庫</div>
            <div class="text-h4">
              {{ dashboardStore.stats.monthlyInboundCount || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="bg-negative text-white">
          <q-card-section>
            <div class="text-h6">今月出庫</div>
            <div class="text-h4">
              {{ dashboardStore.stats.monthlyOutboundCount || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 第二行统计卡片 -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-6">
        <q-card class="bg-warning text-white">
          <q-card-section>
            <div class="text-h6">処理待ち入庫</div>
            <div class="text-h4">
              {{ dashboardStore.stats.pendingInboundCount || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <q-card class="bg-info text-white">
          <q-card-section>
            <div class="text-h6">処理待ち出庫</div>
            <div class="text-h4">
              {{ dashboardStore.stats.pendingOutboundCount || 0 }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
        <QuickActions />
      </div>
    </div>

    <!-- 统计图表 -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <StatsChart
          title="今月入出庫統計"
          subtitle="数量比較"
          :inbound-count="dashboardStore.stats.monthlyInboundCount || 0"
          :outbound-count="dashboardStore.stats.monthlyOutboundCount || 0"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">システム概要</div>
            <div class="text-caption text-grey-7">各モジュールデータ統計</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-4">
                <div class="text-center">
                  <div class="text-h5 text-secondary">
                    {{ dashboardStore.stats.productCount || 0 }}
                  </div>
                  <div class="text-caption">商品</div>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  <div class="text-h5 text-accent">
                    {{ dashboardStore.stats.warehouseCount || 0 }}
                  </div>
                  <div class="text-caption">倉庫</div>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  <div class="text-h5 text-deep-purple">
                    {{ dashboardStore.stats.customerCount || 0 }}
                  </div>
                  <div class="text-caption">お客様</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 库存过久商品警告 -->
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="bg-red-1">
          <q-card-section>
            <div class="text-h6 text-red-8">
              <q-icon name="warning" class="q-mr-sm" />
              長期在庫商品アラート
            </div>
            <div class="text-caption text-grey-7 q-mt-sm">
              以下の商品は入庫期間が長いため、速やかな処理が必要です
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 库存过久商品列表 -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">長期在庫商品リスト</div>
            <div class="text-caption text-grey-7 q-mt-sm">
              入庫期間が長い商品を表示。3ヶ月超過でミュート可、6ヶ月超過でミュート不可、即座の対応が必要
            </div>
          </q-card-section>

          <q-card-section>
            <q-table
              :rows="dashboardStore.agedInventoryItems"
              :columns="agedInventoryColumns"
              :loading="dashboardStore.agedInventoryLoading"
              :pagination="pagination"
              @request="onRequest"
              row-key="id"
            >
              <!-- 状态列 -->
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="getStatusColor(props.row)"
                    :label="getStatusLabel(props.row)"
                    :text-color="getStatusTextColor(props.row)"
                    size="sm"
                  />
                </q-td>
              </template>

              <!-- 操作列 -->
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    v-if="canMute(props.row) && !props.row.muted"
                    color="warning"
                    label="ミュート"
                    size="sm"
                    class="q-mr-xs"
                    @click="muteItem(props.row)"
                  />
                  <q-btn
                    color="primary"
                    label="詳細表示"
                    size="sm"
                    @click="viewDetail(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { type QTableProps, useQuasar } from 'quasar'
import { useDashboardStore } from 'stores/dashboard-store'
import StatsChart from 'components/dashboard/StatsChart.vue'
import QuickActions from 'components/dashboard/QuickActions.vue'
import type { InventoryItem } from '../api/Api'

const router = useRouter()
const $q = useQuasar()
const dashboardStore = useDashboardStore()

// 分页配置
const pagination = computed(() => ({
  page: dashboardStore.agedInventoryPagination.page,
  rowsPerPage: dashboardStore.agedInventoryPagination.itemsPerPage,
  rowsNumber: dashboardStore.agedInventoryPagination.totalItems,
}))

// 表格列定义
const agedInventoryColumns: QTableProps['columns'] = [
  {
    name: 'product',
    label: '商品名',
    field: (row: InventoryItem) => row.product?.name,
    align: 'left',
    sortable: true,
  },
  {
    name: 'warehouse',
    label: '倉庫',
    field: (row: InventoryItem) => row.warehouse?.name,
    align: 'left',
  },
  {
    name: 'customer',
    label: 'お客様',
    field: (row: InventoryItem) => row.customer?.name,
    align: 'left',
  },
  {
    name: 'inboundDate',
    label: '入庫日',
    field: 'inboundDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'inboundDays',
    label: '入庫日数',
    field: (row: InventoryItem) => getInboundDays(row.inboundDate || ''),
    align: 'center',
    sortable: true,
  },
  {
    name: 'leftQuantity',
    label: '残数量',
    field: 'leftQuantity',
    align: 'center',
  },
  {
    name: 'status',
    label: 'ステータス',
    field: 'status',
    align: 'center',
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    align: 'center',
  },
]

// ダッシュボード統計データ取得
const fetchDashboardStats = async () => {
  try {
    await dashboardStore.getDashboardStats()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'ダッシュボード統計データの取得に失敗しました',
    })
  }
}

// 長期在庫商品リスト取得
const fetchAgedInventory = async () => {
  try {
    await dashboardStore.getAgedInventoryList()
  } catch {
    $q.notify({
      type: 'negative',
      message: '長期在庫商品リストの取得に失敗しました',
    })
  }
}

// 处理表格分页请求
const onRequest = async () => {
  await dashboardStore.getAgedInventoryList()
}

// 计算入库天数
const getInboundDays = (inboundDate: string) => {
  const today = new Date()
  const inbound = new Date(inboundDate)
  const diffTime = Math.abs(today.getTime() - inbound.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 获取状态颜色
const getStatusColor = (item: InventoryItem) => {
  const days = getInboundDays(item.inboundDate || '')
  if (days > 180) return 'negative' // 超过6个月
  if (days > 90) return 'warning' // 超过3个月
  return 'positive'
}

// ステータスラベル取得
const getStatusLabel = (item: InventoryItem) => {
  const days = getInboundDays(item.inboundDate || '')
  if (days > 180) return '6ヶ月超過'
  if (days > 90) return '3ヶ月超過'
  return '正常'
}

// ステータステキストカラー取得
const getStatusTextColor = (item: InventoryItem) => {
  const days = getInboundDays(item.inboundDate || '')
  if (days > 180) return 'white'
  if (days > 90) return 'black'
  return 'black'
}

// ミュート可否判定
const canMute = (item: InventoryItem) => {
  const days = getInboundDays(item.inboundDate || '')
  return days > 90 && days <= 180 // 3-6ヶ月間でミュート可能
}

// ミュート操作
const muteItem = async (item: InventoryItem) => {
  try {
    await dashboardStore.muteAgedInventoryItem(item.id!)
    $q.notify({
      type: 'positive',
      message: 'ミュートしました',
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: '操作に失敗しました',
    })
  }
}

// 查看详情
const viewDetail = (item: InventoryItem) => {
  void router.push({
    name: 'inventory-item-detail',
    params: { id: item.id },
  })
}

// 页面加载时获取数据
onMounted(async () => {
  await Promise.all([fetchDashboardStats(), fetchAgedInventory()])
})
</script>

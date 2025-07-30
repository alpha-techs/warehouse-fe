<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
      <div class="text-caption text-grey-7">{{ subtitle }}</div>
    </q-card-section>

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <div class="text-center">
            <div class="text-h4 text-primary">{{ inboundCount }}</div>
            <div class="text-caption">今月入庫</div>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-center">
            <div class="text-h4 text-negative">{{ outboundCount }}</div>
            <div class="text-caption">今月出庫</div>
          </div>
        </div>
      </div>
      
      <!-- 简单的进度条显示 -->
      <div class="q-mt-md">
        <div class="text-caption q-mb-xs">入庫 vs 出庫比率</div>
        <q-linear-progress
          :value="inboundRatio"
          color="primary"
          class="q-mb-xs"
        />
        <div class="text-caption text-grey-7">
          入庫: {{ inboundCount }} | 出庫: {{ outboundCount }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  inboundCount?: number
  outboundCount?: number
  inboundWeight?: number
  outboundWeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '今月統計',
  subtitle: '入庫出庫データ比較',
  inboundCount: 0,
  outboundCount: 0,
  inboundWeight: 0,
  outboundWeight: 0
})

// 计算入库出库比例
const inboundRatio = computed(() => {
  const total = props.inboundCount + props.outboundCount
  if (total === 0) return 0
  return props.inboundCount / total
})
</script> 
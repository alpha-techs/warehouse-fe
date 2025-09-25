<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toastFormError } from 'src/utils/error-handler'
import { apiClient } from 'src/utils/api-client'
import type { Outbound, OutboundItem } from 'src/api/Api'
import { useInvoiceStore } from 'stores/invoice-store'
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'

const router = useRouter()
const route = useRoute()

const form = ref({
  outboundId: undefined as number | undefined,
  dueDate: undefined as string | undefined,
  autoIssue: false,
  notes: undefined as string | undefined,
})

const selectedOutbound = ref<Outbound | null>(null)
const loadingOutbound = ref(false)
const creating = ref(false)

const formatAmount = (value?: number, currency?: string) => {
  if (value === undefined || value === null) {
    return '-'
  }
  const resolvedCurrency = currency ?? selectedOutbound.value?.currency ?? 'JPY'
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: resolvedCurrency,
  }).format(value)
}

const outboundItemColumns: QTableProps['columns'] = [
  {
    name: 'product',
    label: '商品',
    align: 'left',
    field: (row: OutboundItem) => row.product?.name ?? '-',
  },
  {
    name: 'dimension',
    label: '規格',
    align: 'left',
    field: (row: OutboundItem) => row.product?.dimension?.description ?? '-',
  },
  {
    name: 'quantity',
    label: '出庫数量',
    align: 'right',
    field: (row: OutboundItem) => row.quantity,
    format: (val?: number) =>
      typeof val === 'number' ? val.toLocaleString() : '-',
  },
  {
    name: 'unitPrice',
    label: '単価',
    align: 'right',
    field: (row: OutboundItem) => row.unitPrice,
    format: (val: number | undefined, row: OutboundItem) =>
      formatAmount(val, row.currency),
  },
  {
    name: 'lineAmount',
    label: '金額',
    align: 'right',
    field: (row: OutboundItem) => row.lineAmount,
    format: (val: number | undefined, row: OutboundItem) =>
      formatAmount(val, row.currency),
  },
  {
    name: 'taxAmount',
    label: '税額',
    align: 'right',
    field: (row: OutboundItem) => row.taxAmount,
    format: (val: number | undefined, row: OutboundItem) =>
      formatAmount(val, row.currency),
  },
  {
    name: 'lotNumber',
    label: 'LOT番号',
    align: 'left',
    field: (row: OutboundItem) => row.lotNumber ?? '-',
  },
  {
    name: 'note',
    label: '備考',
    align: 'left',
    field: (row: OutboundItem) => row.note ?? '-',
  },
]

const outboundItemRows = computed(
  (): OutboundItem[] => selectedOutbound.value?.items ?? [],
)

const loadOutbound = async () => {
  if (!form.value.outboundId) {
    await toastFormError(
      '出庫が指定されていません。出庫詳細から作成してください。',
    )
    return
  }
  try {
    loadingOutbound.value = true
    const resp = await apiClient.inventory.getOutbound(form.value.outboundId)
    selectedOutbound.value = resp.data
  } catch (error) {
    selectedOutbound.value = null
    await toastFormError(error)
  } finally {
    loadingOutbound.value = false
  }
}

const submit = async () => {
  if (!selectedOutbound.value?.id) {
    await toastFormError('請求書を作成する出庫を選択してください')
    return
  }
  if (!selectedOutbound.value.customer?.id) {
    await toastFormError('出庫に紐付く顧客情報が不足しています')
    return
  }
  try {
    creating.value = true
    const invoice = await useInvoiceStore().createInvoice({
      outboundId: selectedOutbound.value.id,
      customerId: selectedOutbound.value.customer.id,
      dueDate: form.value.dueDate,
      autoIssue: form.value.autoIssue,
      notes: form.value.notes,
    })
    Notify.create({ type: 'positive', message: '請求書を作成しました' })
    if (invoice.id) {
      await router.push({ name: 'invoice-detail', params: { id: invoice.id } })
    } else {
      await router.push({ name: 'invoice-list' })
    }
  } catch (error) {
    await toastFormError(error)
  } finally {
    creating.value = false
  }
}

const goBack = async () => {
  await router.push({ name: 'invoice-list' })
}

onMounted(async () => {
  const outboundIdParam = route.query.outboundId
  if (outboundIdParam) {
    const parsed = Number(outboundIdParam)
    if (!Number.isNaN(parsed)) {
      form.value.outboundId = parsed
      await loadOutbound()
    }
  }
})
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section class="row items-center">
        <div class="text-h6">請求書作成</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-md">
        <div>
          <div class="row q-col-gutter-md items-start">
            <div class="col-12 col-md-4">
              <q-input
                :model-value="form.outboundId ?? ''"
                label="出庫ID"
                readonly
                :loading="loadingOutbound"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                type="date"
                :model-value="form.dueDate"
                @update:model-value="
                  form.dueDate = ($event as string) || undefined
                "
                label="支払期日"
                :disable="creating"
              />
            </div>
            <div class="col-12 col-md-4 form-toggle-wrapper">
              <q-toggle
                v-model="form.autoIssue"
                label="作成後すぐに発行"
                :disable="creating"
                class="form-toggle"
              />
            </div>
          </div>
        </div>
        <q-input
          class="q-mt-sm"
          type="textarea"
          :model-value="form.notes"
          @update:model-value="form.notes = ($event as string) || undefined"
          label="備考"
          autogrow
          :disable="creating"
        />
        <q-banner
          v-if="loadingOutbound"
          dense
          class="bg-grey-2 text-grey-8 q-mt-md"
        >
          出庫情報を読み込んでいます...
        </q-banner>
        <q-banner
          v-else-if="!selectedOutbound"
          dense
          class="bg-grey-2 text-grey-8 q-mt-md"
        >
          出庫IDを読み込み、請求対象の出庫を確認してください。
        </q-banner>
        <div v-else class="outbound-summary q-mt-md">
          <div>
            <div class="text-subtitle1 q-mb-sm">出庫概要</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="selectedOutbound.outboundOrderId ?? '-'"
                  label="オーダー番号"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="selectedOutbound.outboundDate ?? '-'"
                  label="出庫日"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="selectedOutbound.customer?.name ?? '-'"
                  label="お客様"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="selectedOutbound.currency ?? 'JPY'"
                  label="通貨"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="
                    formatAmount(
                      selectedOutbound.subtotalAmount,
                      selectedOutbound.currency,
                    )
                  "
                  label="小計"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="
                    formatAmount(
                      selectedOutbound.totalAmount,
                      selectedOutbound.currency,
                    )
                  "
                  label="合計"
                  readonly
                />
              </div>
            </div>
          </div>
          <div class="outbound-items q-mt-lg">
            <div class="text-subtitle1 q-mb-sm">出庫物品一覧</div>
            <div class="outbound-items-table">
              <q-table
                :rows="outboundItemRows"
                :columns="outboundItemColumns"
                row-key="id"
                flat
                dense
                hide-pagination
                :loading="loadingOutbound"
                :hide-no-data="outboundItemRows.length > 0"
              />
            </div>
            <q-banner
              v-if="!outboundItemRows.length && !loadingOutbound"
              dense
              class="bg-grey-2 text-grey-8 q-mt-sm"
            >
              出庫に商品が登録されていません。
            </q-banner>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-gutter-sm">
        <q-btn
          label="一覧へ"
          color="primary"
          flat
          @click="goBack"
          :disable="creating"
        />
        <q-btn
          label="作成"
          color="primary"
          :loading="creating"
          @click="submit"
          :disable="creating || !selectedOutbound"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style scoped>
.outbound-summary {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: #f5f5f5;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-toggle-wrapper {
  display: flex;
  align-items: center;
  min-height: 56px;
}

.form-toggle {
  min-height: 56px;
}

.outbound-items-table {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  background: #ffffff;
  overflow-x: auto;
}

.outbound-items-table :deep(.q-table) {
  min-width: 720px;
}

@media (max-width: 599px) {
  .outbound-summary {
    padding: 12px;
    gap: 16px;
  }

  .outbound-items-table :deep(.q-table) {
    min-width: 100%;
  }
}
</style>

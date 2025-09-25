<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInvoiceStore } from 'stores/invoice-store'
import { toastFormError } from 'src/utils/error-handler'
import { Notify } from 'quasar'
import type { Invoice } from 'src/api/Api'

const loading = ref(false)
const issueDialog = ref(false)
const cancelDialog = ref(false)
const issueDate = ref<string | undefined>(undefined)
const issueMessage = ref<string | undefined>(undefined)
const cancelReason = ref<string | undefined>(undefined)

const router = useRouter()
const route = useRoute()

const invoiceId = computed(() => Number(route.params.id))

const invoiceStore = useInvoiceStore()
const { invoiceDetail: invoice } = storeToRefs(invoiceStore)

const getStatusBadge = (status?: Invoice['status']) => {
  switch (status) {
    case 'draft':
      return { color: 'grey', label: '下書き' }
    case 'issued':
      return { color: 'primary', label: '発行済' }
    case 'cancelled':
      return { color: 'negative', label: '取消' }
    case 'paid':
      return { color: 'positive', label: '入金済' }
    default:
      return { color: 'grey', label: '未定義' }
  }
}

const formatAmount = (value?: number) => {
  if (value === undefined || value === null) {
    return '-'
  }
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value)
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('ja-JP')
}

const reload = async () => {
  try {
    loading.value = true
    await invoiceStore.getInvoiceById(invoiceId.value)
  } catch (error) {
    await toastFormError(error)
  } finally {
    loading.value = false
  }
}

const toList = async () => {
  await router.push({ name: 'invoice-list' })
}

const toOutboundDetail = async (outboundId?: number) => {
  if (!outboundId) {
    return
  }
  await router.push({ name: 'outbound-detail', params: { id: outboundId } })
}

const issueInvoice = async () => {
  try {
    await invoiceStore.issueInvoice(invoiceId.value, {
      issueDate: issueDate.value,
      message: issueMessage.value,
    })
    issueDialog.value = false
    Notify.create({ type: 'positive', message: '請求書を発行しました' })
  } catch (error) {
    await toastFormError(error)
  }
}

const cancelInvoice = async () => {
  try {
    await invoiceStore.cancelInvoice(invoiceId.value, {
      reason: cancelReason.value,
    })
    cancelDialog.value = false
    Notify.create({ type: 'positive', message: '請求書を取消しました' })
  } catch (error) {
    await toastFormError(error)
  }
}

onMounted(async () => {
  await reload()
})
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <div class="row items-start q-col-gutter-lg">
          <div class="col-xs-12 col-md-8">
            <div class="text-h6">請求書詳細</div>
            <div class="text-subtitle2 text-grey">請求書番号: {{ invoice?.invoiceNumber ?? '-' }}</div>
          </div>
          <div class="col-xs-12 col-md-4 text-right">
            <q-badge v-if="!loading" v-bind="getStatusBadge(invoice?.status)" />
          </div>
        </div>
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6">
            <q-input :model-value="invoice?.customer?.name" label="お客様" readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input :model-value="invoice?.dueDate" label="支払期日" readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input :model-value="invoice?.issueDate ? formatDateTime(invoice?.issueDate) : '-'" label="発行日時" readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input :model-value="invoice?.currency ?? '-'" label="通貨" readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input :model-value="formatAmount(invoice?.subtotalAmount)" label="小計" readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input :model-value="formatAmount(invoice?.taxAmount)" label="税額" readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input :model-value="formatAmount(invoice?.totalAmount)" label="合計" readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input :model-value="invoice?.outboundId ? String(invoice?.outboundId) : '-'" label="紐付け出庫ID" readonly>
              <template #append>
                <q-btn
                  v-if="invoice?.outboundId"
                  dense
                  flat
                  icon="sym_r_open_in_new"
                  @click="toOutboundDetail(invoice?.outboundId)"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input :model-value="invoice?.notes ?? '-'" type="textarea" label="備考" readonly autogrow />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-h6 q-mb-md">明細</div>
        <q-table
          :rows="invoice?.items ?? []"
          flat
          hide-bottom
        >
          <template #header>
            <q-tr>
              <q-th>出庫オーダー</q-th>
              <q-th>商品</q-th>
              <q-th class="text-right">数量</q-th>
              <q-th class="text-right">単価</q-th>
              <q-th class="text-right">金額</q-th>
              <q-th class="text-right">税額</q-th>
            </q-tr>
          </template>
          <template #body="{ row }">
            <q-tr>
              <q-td>{{ row.outboundOrderId ?? '-' }}</q-td>
              <q-td>{{ row.product?.name ?? '-' }}</q-td>
              <q-td class="text-right">{{ row.quantity ?? '-' }}</q-td>
              <q-td class="text-right">{{ formatAmount(row.unitPrice) }}</q-td>
              <q-td class="text-right">{{ formatAmount(row.lineAmount) }}</q-td>
              <q-td class="text-right">{{ formatAmount(row.taxAmount) }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn label="一覧へ" color="primary" @click="toList" />
        <q-btn
          v-if="invoice?.status === 'draft'"
          label="請求書を発行"
          color="primary"
          flat
          @click="issueDialog = true"
        />
        <q-btn
          v-if="invoice?.status === 'draft' || invoice?.status === 'issued'"
          label="請求書を取消"
          color="negative"
          flat
          @click="cancelDialog = true"
        />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="issueDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">請求書を発行</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            type="datetime-local"
            v-model="issueDate"
            label="発行日時"
          />
          <q-input
            type="textarea"
            v-model="issueMessage"
            label="送信メッセージ"
            autogrow
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="negative" v-close-popup />
          <q-btn flat label="発行" color="primary" @click="issueInvoice" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="cancelDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">請求書を取消</div>
        </q-card-section>
        <q-card-section>
          <q-input
            type="textarea"
            v-model="cancelReason"
            label="取消理由"
            autogrow
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="閉じる" color="primary" v-close-popup />
          <q-btn flat label="取消" color="negative" @click="cancelInvoice" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

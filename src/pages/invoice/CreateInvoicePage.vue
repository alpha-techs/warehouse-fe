<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toastFormError } from 'src/utils/error-handler'
import { apiClient } from 'src/utils/api-client'
import type { Outbound } from 'src/api/Api'
import { useInvoiceStore } from 'stores/invoice-store'
import { Notify } from 'quasar'

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

const formatAmount = (value?: number) => {
  if (value === undefined || value === null) {
    return '-'
  }
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value)
}

const loadOutbound = async () => {
  if (!form.value.outboundId) {
    await toastFormError('出庫IDを入力してください')
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
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">請求書作成</div>
        <q-btn label="一覧へ" color="primary" flat @click="goBack" />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              type="number"
              :model-value="form.outboundId"
              @update:model-value="form.outboundId = $event ? Number($event) : undefined"
              label="出庫ID"
              :disable="loadingOutbound"
            />
          </div>
          <div class="col-12 col-md-2 flex items-end">
            <q-btn
              color="primary"
              label="出庫読込"
              @click="loadOutbound"
              :loading="loadingOutbound"
            />
          </div>
        </div>
        <q-banner v-if="!selectedOutbound" dense class="bg-grey-2 text-grey-8">
          出庫IDを読み込み、請求対象の出庫を確認してください。
        </q-banner>
        <q-card v-else bordered flat class="q-pa-md">
          <div class="text-subtitle1 q-mb-sm">出庫概要</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input :model-value="selectedOutbound.outboundOrderId ?? '-'" label="オーダー番号" readonly />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="selectedOutbound.outboundDate ?? '-'" label="出庫日" readonly />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="selectedOutbound.customer?.name ?? '-'" label="お客様" readonly />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="selectedOutbound.currency ?? 'JPY'" label="通貨" readonly />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="formatAmount(selectedOutbound.subtotalAmount)" label="小計" readonly />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="formatAmount(selectedOutbound.totalAmount)" label="合計" readonly />
            </div>
          </div>
        </q-card>
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-4">
            <q-input
              type="date"
              :model-value="form.dueDate"
              @update:model-value="form.dueDate = ($event as string || undefined)"
              label="支払期日"
              :disable="creating"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-toggle
              v-model="form.autoIssue"
              label="作成後すぐに発行"
              :disable="creating"
            />
          </div>
        </div>
        <q-input
          type="textarea"
          :model-value="form.notes"
          @update:model-value="form.notes = ($event as string || undefined)"
          label="備考"
          autogrow
          :disable="creating"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn label="作成" color="primary" :loading="creating" @click="submit" :disable="creating || !selectedOutbound" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

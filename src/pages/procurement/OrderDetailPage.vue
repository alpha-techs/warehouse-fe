<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import OrderForm from 'components/procurement/OrderForm.vue'
import OrderItemListForm from 'components/procurement/OrderItemListForm.vue'
import { useOrderStore } from 'stores/order-store'
import type { OrderFormModel } from 'stores/order-store'
import { toastFormError } from 'src/utils/error-handler'
import { Notify } from 'quasar'
import type { OrderPrintReq } from 'src/api/Api'

const loading = ref(true)
const transitionLoading = ref<'submit' | 'send' | 'complete' | 'cancel' | null>(null)
const generateLoading = ref(false)

const route = useRoute()
const router = useRouter()
const orderId = computed(() => Number(route.params.id))
const orderStore = useOrderStore()
const { formModel: order } = storeToRefs(orderStore)

const loadOrder = async () => {
  const id = orderId.value
  if (!id) {
    throw new Error('注文IDが無効です')
  }
  const data = await orderStore.getOrderById(id)
  orderStore.hydrateForm(data as OrderFormModel)
}

onMounted(async () => {
  try {
    loading.value = true
    await loadOrder()
  } catch (error) {
    await toastFormError(error)
  } finally {
    loading.value = false
  }
})

const toEdit = async () => {
  await router.push({ name: 'order-edit', params: { id: orderId.value } })
}

const handleTransition = async (
  action: 'submit' | 'send' | 'complete' | 'cancel',
  performer: () => Promise<unknown>,
  successMessage: string,
) => {
  try {
    transitionLoading.value = action
    await performer()
    Notify.create({ type: 'positive', message: successMessage, position: 'top' })
    await loadOrder()
  } catch (error) {
    await toastFormError(error)
  } finally {
    transitionLoading.value = null
  }
}

const cancelOrder = async () => {
  const id = orderId.value
  if (!id) {
    await toastFormError('注文IDが無効です')
    return
  }
  await handleTransition('cancel', () => orderStore.cancelOrderById(id), '注文を取消しました')
}

const submitOrder = async () => {
  const id = orderId.value
  if (!id) {
    await toastFormError('注文IDが無効です')
    return
  }
  await handleTransition('submit', () => orderStore.submitOrderById(id), '注文を依頼済に更新しました')
}

const sendOrder = async () => {
  const id = orderId.value
  if (!id) {
    await toastFormError('注文IDが無効です')
    return
  }
  await handleTransition('send', () => orderStore.sendOrderById(id), '注文を送付済に更新しました')
}

const completeOrder = async () => {
  const id = orderId.value
  if (!id) {
    await toastFormError('注文IDが無効です')
    return
  }
  await handleTransition('complete', () => orderStore.completeOrderById(id), '注文を完了に更新しました')
}

const generatePrint = async () => {
  const id = orderId.value
  if (!id) {
    await toastFormError('注文IDが無効です')
    return
  }
  const request: OrderPrintReq = {
    orderId: id,
    format: 'excel',
  }
  try {
    generateLoading.value = true
    const resp = await orderStore.generateOrderPrint(request)
    Notify.create({
      type: 'positive',
      message: `印刷ジョブが作成されました (ID: ${resp.printId ?? '---'})`,
      position: 'top',
      timeout: 3000,
      actions: [
        {
          label: '印刷ジョブ一覧へ',
          color: 'white',
          handler: () => {
            void router.push({ name: 'order-print-list' })
          },
        },
      ],
    })
  } catch (error) {
    await toastFormError(error)
  } finally {
    generateLoading.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h5">注文詳細</div>
          <div class="row q-gutter-sm">
            <q-btn color="secondary" label="戻る" flat @click="goBack" />
            <q-btn
              color="primary"
              label="編集"
              icon="sym_r_edit"
              @click="toEdit"
              :disable="loading || !['draft', 'requested'].includes(order.status ?? '')"
            />
            <q-btn
              color="primary"
              label="依頼済に更新"
              icon="sym_r_publish"
              @click="submitOrder"
              :loading="transitionLoading === 'submit'"
              v-if="order.status === 'draft'"
            />
            <q-btn
              color="primary"
              label="送付済に更新"
              icon="sym_r_send"
              @click="sendOrder"
              :loading="transitionLoading === 'send'"
              v-if="order.status === 'requested'"
            />
            <q-btn
              color="positive"
              label="完了に更新"
              icon="sym_r_task_alt"
              @click="completeOrder"
              :loading="transitionLoading === 'complete'"
              v-if="order.status === 'sent'"
            />
            <q-btn
              color="secondary"
              label="印刷ジョブ作成"
              icon="sym_r_table_view"
              @click="generatePrint"
              :loading="generateLoading"
              :disable="loading || order.status === 'cancelled'"
            />
            <q-btn
              color="negative"
              label="取消"
              icon="sym_r_delete"
              @click="cancelOrder"
              :loading="transitionLoading === 'cancel'"
              :disable="loading || order.status === 'cancelled' || order.status === 'completed'"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-linear-progress indeterminate v-if="loading" />
      <template v-else>
        <q-card-section>
          <order-form readonly />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <order-item-list-form readonly />
        </q-card-section>
      </template>
    </q-card>
  </q-page>
</template>

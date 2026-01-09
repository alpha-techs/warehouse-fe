<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OrderForm from 'components/procurement/OrderForm.vue'
import OrderItemListForm from 'components/procurement/OrderItemListForm.vue'
import { useOrderStore } from 'stores/order-store'
import type { OrderFormModel } from 'stores/order-store'
import { toastFormError } from 'src/utils/error-handler'
import { Notify } from 'quasar'

const loading = ref(true)
const saving = ref(false)

const route = useRoute()
const router = useRouter()
const orderId = computed(() => Number(route.params.id))

const loadOrder = async () => {
  const id = orderId.value
  if (!id) {
    throw new Error('注文IDが無効です')
  }
  const data = await useOrderStore().getOrderById(id)
  useOrderStore().hydrateForm(data as OrderFormModel)
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

const onSave = async () => {
  try {
    saving.value = true
    await useOrderStore().updateOrder()
    Notify.create({ type: 'positive', message: '注文を更新しました', position: 'top' })
    await router.push({ name: 'order-detail', params: { id: orderId.value } })
  } catch (error) {
    await toastFormError(error)
  } finally {
    saving.value = false
  }
}

const onCancel = () => {
  router.back()
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form @submit.prevent="onSave">
        <q-card-section class="row items-center justify-between">
          <div class="text-h5">注文編集</div>
          <div class="row q-gutter-sm">
            <q-btn color="secondary" label="戻る" flat @click="onCancel" />
            <q-btn
              color="primary"
              label="保存"
              icon="sym_r_save"
              type="submit"
              :loading="saving"
              :disable="loading"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-linear-progress indeterminate v-if="loading" />
        <template v-else>
          <q-card-section>
            <order-form />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <order-item-list-form :loading="saving" />
          </q-card-section>
        </template>
      </q-form>
    </q-card>
  </q-page>
</template>

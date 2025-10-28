<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import OrderForm from 'components/procurement/OrderForm.vue'
import OrderItemListForm from 'components/procurement/OrderItemListForm.vue'
import { useOrderStore } from 'stores/order-store'
import { toastFormError } from 'src/utils/error-handler'
import { Notify } from 'quasar'

const saving = ref(false)
const router = useRouter()

onMounted(() => {
  useOrderStore().prepareNewOrder()
})

const onSave = async () => {
  try {
    saving.value = true
    const order = await useOrderStore().createOrder()
    Notify.create({ type: 'positive', message: '注文を作成しました', position: 'top' })
    await router.push({ name: 'order-detail', params: { id: order.id } })
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
          <div class="text-h5">新規注文</div>
          <div class="row q-gutter-sm">
            <q-btn color="secondary" label="戻る" flat @click="onCancel" />
            <q-btn
              color="primary"
              label="保存"
              icon="sym_r_save"
              type="submit"
              :loading="saving"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <order-form create />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <order-item-list-form :loading="saving" />
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

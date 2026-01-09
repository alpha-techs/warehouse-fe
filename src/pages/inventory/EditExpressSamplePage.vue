<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toastFormError } from 'src/utils/error-handler'
import { useExpressSampleStore } from 'stores/express-sample-store'
import ExpressSampleForm from 'components/inventory/ExpressSampleForm.vue'
import ExpressSampleItemListForm from 'components/inventory/ExpressSampleItemListForm.vue'

const loading = ref(false)
const saving = ref(false)
const router = useRouter()

const expressSampleId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

onMounted(async () => {
  await reload()
})

const reload = async () => {
  loading.value = true
  await useExpressSampleStore().getExpressSampleShipmentById(
    expressSampleId.value,
  )
  await nextTick(() => {
    loading.value = false
  })
}

const cancel = async () => {
  await router.push({ name: 'express-sample-list' })
}

const save = async () => {
  saving.value = true
  try {
    await useExpressSampleStore().updateExpressSampleShipment()
    await reload()
  } catch (error) {
    await toastFormError(error)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <express-sample-form v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <express-sample-item-list-form />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="cancel"
          :disable="loading"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="save"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

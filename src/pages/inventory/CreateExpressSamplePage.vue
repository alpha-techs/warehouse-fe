<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toastFormError } from 'src/utils/error-handler'
import { useExpressSampleStore } from 'stores/express-sample-store'
import ExpressSampleForm from 'components/inventory/ExpressSampleForm.vue'
import ExpressSampleItemListForm from 'components/inventory/ExpressSampleItemListForm.vue'

const saving = ref(false)
const loading = ref(false)
const router = useRouter()

onMounted(() => {
  loading.value = true
  useExpressSampleStore().resetFormModel()
  loading.value = false
})

const onSave = async () => {
  saving.value = true
  try {
    await useExpressSampleStore().createExpressSampleShipment()
    await router.push({
      name: 'express-sample-list',
    })
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
      <q-form>
        <q-card-section>
          <div class="text-h5">新規宅急便依頼</div>
        </q-card-section>
        <q-separator />
        <q-linear-progress indeterminate v-if="saving" />
        <q-card-section>
          <express-sample-form create v-if="!loading" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <express-sample-item-list-form />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            style="width: 100px"
            color="primary"
            label="保存"
            @click="onSave"
            :disable="loading || saving"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

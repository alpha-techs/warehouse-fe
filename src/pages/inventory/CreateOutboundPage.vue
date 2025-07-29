<script setup lang="ts">
import OutboundForm from 'components/inventory/OutboundForm.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOutboundStore } from 'stores/outbound-store'
import OutboundItemListForm from 'components/inventory/OutboundItemListForm.vue'
import { toastFormError } from 'src/utils/error-handler'

const saving = ref(false)
const loading = ref(false)

const router = useRouter()

onMounted(() => {
  loading.value = true
  useOutboundStore().resetFormModel()
  loading.value = false
})

const onSave = async() => {
  saving.value = true
  try {
    await useOutboundStore().createOutbound()
    await router.push({
      name: 'outbound-list',
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
          <div class="text-h5">新規出庫</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-linear-progress indeterminate v-if="saving" />
        <q-card-section>
          <outbound-form create v-if="!loading" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <outbound-item-list-form />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn
            style="width: 100px"
            color="primary"
            label="保存"
            @click="onSave"
            :disable="loading || saving"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

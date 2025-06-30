<script setup lang="ts">
import ContainerForm from 'components/container/ContainerForm.vue'
import ContainerItemListForm from 'components/container/ContainerItemListForm.vue'
import { onMounted, ref } from 'vue'
import { useContainerStore } from 'stores/container-store'
import { useRouter } from 'vue-router'
import { toastFormError } from 'src/utils/error-handler'

const saving = ref(false)
const loading = ref(false)

const router = useRouter()

onMounted(() => {
  loading.value = true
  useContainerStore().resetFormModel()
  loading.value = false
})

const onSave = async () => {
  saving.value = true
  try {
    await useContainerStore().createContainer()
    await router.push({
      name: 'container-list',
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
          <div class="text-h5">新規コンテナ</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-linear-progress indeterminate v-if="saving" />
        <q-card-section>
          <container-form create v-if="!loading" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <container-item-list-form />
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

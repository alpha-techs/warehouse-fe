<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOutboundStore } from 'stores/outbound-store'
import OutboundForm from 'components/inventory/OutboundForm.vue'
import OutboundItemListForm from 'components/inventory/OutboundItemListForm.vue'
import { toastFormError } from 'src/utils/error-handler'

const loading = ref(false)
const saving = ref(false)
const router = useRouter()

const outboundId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

onMounted(async () => {
  await reload();
});

const reload = async () => {
  loading.value = true;
  await useOutboundStore().getOutboundById(outboundId.value);
  await nextTick(() => {
    loading.value = false;
  });
};

const cancel = async () => {
  await router.push({ name: 'outbound-list' });
}

const save = async () => {
  saving.value = true;
  try {
    await useOutboundStore().updateOutbound();
    await reload();
  } catch (error) {
    await toastFormError(error);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <outbound-form v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <outbound-item-list-form />
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

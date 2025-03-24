<script setup lang="ts">
import InboundForm from 'components/inventory/InboundForm.vue'
import InboundItemListForm from 'components/inventory/InboundItemListForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInboundStore } from 'stores/inbound-store'

const loading = ref(false)
const saving = ref(false)
const router = useRouter()

const inboundId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

onMounted(async () => {
  await reload();
});

const reload = async () => {
  loading.value = true;
  await useInboundStore().getInboundById(inboundId.value);
  await nextTick(() => {
    loading.value = false;
  });
};

const cancel = async () => {
  await router.push({ name: 'inbound-list' });
}

const save = async () => {
  saving.value = true;
  await useInboundStore().updateInbound();
  saving.value = false;
  await reload();
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <inbound-form v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <inbound-item-list-form />
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

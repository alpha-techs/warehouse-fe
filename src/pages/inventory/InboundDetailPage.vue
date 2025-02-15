<script setup lang="ts">
import InboundForm from 'components/inventory/InboundForm.vue'
import InboundItemListForm from 'components/inventory/InboundItemListForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInboundStore } from 'stores/inbound-store'

const loading = ref(false)
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

const backToList = async () => {
  await router.push({ name: 'inbound-list' });
}

const toEdit = async () => {
  await router.push({ name: 'inbound-edit', params: { id: inboundId.value } });
}

const approve = async () => {
  await useInboundStore().approveInboundById(inboundId.value);
}

const reject = async () => {
  await useInboundStore().rejectInboundById(inboundId.value);
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <inbound-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <inbound-item-list-form readonly />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="primary"
          label="承認"
          @click="approve"
        />
        <q-btn
          style="width: 100px"
          color="negative"
          label="拒否"
          @click="reject"
        />
        <q-separator vertical class="q-mx-lg" />
        <q-btn
          style="width: 100px"
          color="primary"
          label="一覧へ"
          @click="backToList"
          :disable="loading"
        />
        <q-btn style="width: 100px" color="negative" label="編集" @click="toEdit" />
        <q-btn style="width: 100px" color="negative" label="削除" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import OutboundItemListForm from 'components/inventory/OutboundItemListForm.vue'
import OutboundForm from 'components/inventory/OutboundForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOutboundStore } from 'stores/outbound-store'

const loading = ref(false)
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

const backToList = async () => {
  await router.push({ name: 'outbound-list' });
}

const toEdit = async () => {
  await router.push({ name: 'outbound-edit', params: { id: outboundId.value } });
}

const approve = async () => {
  await useOutboundStore().approveOutboundById(outboundId.value);
}

const reject = async () => {
  await useOutboundStore().rejectOutboundById(outboundId.value);
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <outbound-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <outbound-item-list-form readonly />
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

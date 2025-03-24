<script setup lang="ts">
import InboundForm from 'components/inventory/InboundForm.vue'
import InboundItemListForm from 'components/inventory/InboundItemListForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInboundStore } from 'stores/inbound-store'
import { storeToRefs } from 'pinia'

const loading = ref(false)
const router = useRouter()

const inboundId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

const { formModel: inbound } = storeToRefs(useInboundStore())

const statusBadgeAttribute = computed(() => {
  return useInboundStore().getStatusBadgeAttribute()
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
        <q-list class="row">
          <q-item class="col-12 q-gutter-none justify-between">
            <div class="text-h6">入庫詳細</div>
            <q-badge v-bind="statusBadgeAttribute" v-if="!loading" />
          </q-item>
        </q-list>
        <inbound-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <inbound-item-list-form readonly />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" v-if="!loading">
        <template v-if="inbound.status == 'pending'">
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
        </template>
        <q-btn
          style="width: 100px"
          color="primary"
          label="一覧へ"
          @click="backToList"
          :disable="loading"
        />
        <template v-if="inbound.status != 'approved'">
          <q-btn style="width: 100px" color="negative" label="編集" @click="toEdit" />
          <q-btn style="width: 100px" color="negative" label="削除" />
        </template>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

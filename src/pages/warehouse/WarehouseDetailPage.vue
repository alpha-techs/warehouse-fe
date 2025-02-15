<script setup lang="ts">
import WarehouseForm from 'components/warehouse/WarehouseForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWarehouseStore } from 'stores/warehouse-store'

const loading = ref(false)
const router = useRouter()

const warehouseId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

onMounted(async () => {
  await reload();
})

const reload = async () => {
  loading.value = true;
  await useWarehouseStore().getWarehouseById(warehouseId.value);
  await nextTick(() => {
    loading.value = false;
  });
}

const backToList = async () => {
  await router.push({ name: 'warehouse-list' });
}

const toEdit = async () => {
  await router.push({ name: 'warehouse-edit', params: { id: warehouseId.value } });
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <warehouse-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
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

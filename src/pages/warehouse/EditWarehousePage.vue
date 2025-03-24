<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WarehouseForm from 'components/warehouse/WarehouseForm.vue'
import { useWarehouseStore } from 'stores/warehouse-store'

const loading = ref(false)
const saving = ref(false)
const router = useRouter()

const warehouseId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

onMounted(async () => {
  await reload();
})

const cancel = async () => {
  await router.push({ name: 'warehouse-list' });
}

const save = async () => {
  saving.value = true;
  await useWarehouseStore().updateWarehouse();
  saving.value = false;
  await reload();
}

const reload = async () => {
  loading.value = true;
  await useWarehouseStore().getWarehouseById(warehouseId.value);
  await nextTick(() => {
    loading.value = false;
  });
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <warehouse-form v-if="!loading" />
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

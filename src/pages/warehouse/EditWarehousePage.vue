<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import WarehouseForm from 'components/warehouse/WarehouseForm.vue'

const loading = ref(false)
const saving = ref(false)
const router = useRouter()

const cancel = async () => {
  await router.push({ name: 'warehouse-list' });
}

const save = async () => {
  saving.value = true;
  await nextTick();
  saving.value = false;
  await router.push({ name: 'warehouse-list' });
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

<script setup lang="ts">
import WarehouseForm from 'components/warehouse/WarehouseForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWarehouseStore } from 'stores/warehouse-store'

const saving = ref(false)
const loading = ref(false)

const router = useRouter()

const onSave = async() => {
  saving.value = true
  await useWarehouseStore().createWarehouse()
  saving.value = false
  await router.push({
    name: 'warehouse-list',
  })
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規倉庫</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-linear-progress indeterminate v-if="saving" />
        <q-card-section>
          <warehouse-form create v-if="!loading" />
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

<script setup lang="ts">
import CustomerForm from 'components/customer/CustomerForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from 'stores/customer-store'

const loading = ref(false)
const saving = ref(false)
const router = useRouter()

const customerId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

onMounted(async () => {
  await reload();
})

const reload = async () => {
  loading.value = true;
  await useCustomerStore().getCustomerById(customerId.value);
  await nextTick(() => {
    loading.value = false;
  })
}

const cancel = async () => {
  await router.push({ name: 'customer-list' });
}

const save = async () => {
  saving.value = true;
  await useCustomerStore().updateCustomer();
  saving.value = false;
  await reload();
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <customer-form v-if="!loading" />
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

<script setup lang="ts">
import CustomerForm from 'components/customer/CustomerForm.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from 'stores/customer-store'

const saving = ref(false)
const loading = ref(false)

const router = useRouter()

onMounted(() => {
  loading.value = true
  useCustomerStore().resetFormModel()
  loading.value = false
})

const onSave = async() => {
  saving.value = true
  const newCustomer = await useCustomerStore().createCustomer()
  saving.value = false
  await router.push({
    name: 'customer-detail',
    params: {
      id: newCustomer.id,
    },
  })
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規お客様</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-linear-progress indeterminate v-if="saving" />
        <q-card-section>
          <customer-form create v-if="!loading" />
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

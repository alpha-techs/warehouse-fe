<script setup lang="ts">
import ProductForm from 'components/product/ProductForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from 'stores/product-store'

const loading = ref(false)
const saving = ref(false)
const router = useRouter()

const productId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

onMounted(async () => {
  await reload();
});

const cancel = async () => {
  await router.push({ name: 'product-list' });
}

const save = async () => {
  saving.value = true;
  await useProductStore().updateProduct();
  saving.value = false;
  await reload();
}

const reload = async () => {
  loading.value = true;
  await useProductStore().getProductById(productId.value);
  await nextTick(() => {
    loading.value = false;
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <product-form v-if="!loading" />
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

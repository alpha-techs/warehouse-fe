<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import ProductForm from 'components/product/ProductForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from 'stores/product-store'

const loading = ref(false)
const router = useRouter()

const productId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

onMounted(async () => {
  await reload();
});

const reload = async () => {
  loading.value = true;
  await useProductStore().getProductById(productId.value);
  await nextTick(() => {
    loading.value = false;
  });
};

const backToList = async () => {
  await router.push({ name: 'product-list' });
}

const toEdit = async () => {
  await router.push({ name: 'product-edit', params: { id: productId.value } });
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <product-form readonly v-if="!loading" />
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

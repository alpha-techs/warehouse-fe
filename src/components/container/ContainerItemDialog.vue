<script setup lang="ts">
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useContainerStore } from 'stores/container-store'
import type { ContainerItem, Product } from 'src/api/Api'
import { useProductStore } from 'stores/product-store'

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add',
  },
});

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [value: ContainerItem]
}>();

const { itemModel: model } = storeToRefs(useContainerStore())

const submit = () => {
  const value = { ...model.value };
  emit('submit', value);
  emit('update:show', false);
}

const { productOptions } = storeToRefs(useProductStore())
const onFilterProduct = async (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (!inputValue || !inputValue.length) {
    await useProductStore().getProductOptions()
    doneFn(() => { });
  } else {
    await useProductStore().getProductOptions(inputValue)
    doneFn(() => { });
  }
}
const onChangeProduct = (product: Product | undefined): void => {
  model.value.product = product;
}
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" persistent>
      <q-card class="card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ mode === 'add' ? '商品を追加' : '商品を編集' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-select :model-value="model.product" @update:model-value="onChangeProduct" label="商品"
                  :options="productOptions" option-label="name" option-value="id" @filter="onFilterProduct" clearable
                  use-input>
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-4">
              <q-item-section>
                <q-input v-model.number="model.quantity" type="number" label="数量" />
              </q-item-section>
            </q-item>
            <q-item class="col-4">
              <q-item-section>
                <q-input v-model="model.manufactureDate" type="date" label="製造日" />
              </q-item-section>
            </q-item>
            <q-item class="col-4">
              <q-item-section>
                <q-input v-model="model.bestBeforeDate" type="date" label="賞味期限" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="キャンセル" @click="$emit('update:show', false)" />
          <q-btn flat label="確定" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

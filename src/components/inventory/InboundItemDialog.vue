<script setup lang="ts">
import type { PropType } from 'vue'
import type { InboundItem } from 'src/api/Api'
import { storeToRefs } from 'pinia'
import { useInboundStore } from 'stores/inbound-store'
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
  submit: [value: InboundItem]
}>();

const { itemModel: model } = storeToRefs(useInboundStore())

const submit = () => {
  const value = {...model.value};
  emit('submit', value);
  emit('update:show', false);
}

const { productOptions } = storeToRefs(useProductStore())
const onFilterProduct = async (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (!inputValue || !inputValue.length) {
    await useProductStore().getProductOptions()
    doneFn(() => {});
  } else {
    await useProductStore().getProductOptions(inputValue)
    doneFn(() => {});
  }
}
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      :model-value="show"
      @update:model-value="$emit('update:show', $event)"
      persistent
    >
      <q-card class="card">
        <q-card-section class="bg-primary">
          <div class="text-h6">入庫商品</div>
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-select
                  :model-value="model.product"
                  @update:model-value="model.product = $event"
                  label="商品"
                  :options="productOptions"
                  option-label="name"
                  option-value="id"
                  @filter="onFilterProduct"
                  clearable
                  use-input
                >
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col-3">
              <q-item-section>
                <q-input
                  :model-value="model.quantity"
                  @update:model-value="model.quantity = ($event as number || undefined)"
                  label="数量"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-3">
              <q-item-section>
                <q-input
                  :model-value="model.perItemWeight"
                  @update:model-value="model.perItemWeight = ($event as number || undefined)"
                  label="単量"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-3">
              <q-item-section>
                <q-select
                  :model-value="model.perItemWeightUnit"
                  @update:model-value="model.perItemWeightUnit = $event"
                  label="単量単位"
                  :options="[
                    { label: 'kg', value: 'kg' },
                    { label: 'g', value: 'g' },
                  ]"
                  emit-value
                  map-options
                />
              </q-item-section>
            </q-item>
            <q-item class="col-3">
              <q-item-section>
                <q-input
                  :model-value="model.totalWeight"
                  @update:model-value="model.totalWeight = ($event as number || undefined)"
                  label="重量"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-3">
              <q-item-section>
                <q-input
                  :model-value="model.manufactureDate"
                  @update:model-value="model.manufactureDate = ($event as string || undefined)"
                  label="製造日"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-3">
              <q-item-section>
                <q-input
                  :model-value="model.bestBeforeDate"
                  @update:model-value="model.bestBeforeDate = ($event as string || undefined)"
                  label="賞味期限"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-3">
              <q-item-section>
                <q-input
                  :model-value="model.lotNumber"
                  @update:model-value="model.lotNumber = ($event as string || undefined)"
                  label="LOT番号"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-3">
              <q-item-section>
                <q-input
                  :model-value="model.shipName"
                  @update:model-value="model.shipName = ($event as string || undefined)"
                  label="船名"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn label="取消" color="negative" @click="$emit('update:show', false)" />
          <q-btn label="確認" color="primary" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

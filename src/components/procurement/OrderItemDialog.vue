<script setup lang="ts">
import { watch } from 'vue'
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from 'stores/order-store'
import type { OrderFormItem } from 'stores/order-store'
import { useProductStore } from 'stores/product-store'
import type { Product } from 'src/api/Api'
import Big from 'big.js'

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add',
  },
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [value: OrderFormItem]
}>()

const { itemModel: model, formModel: order } = storeToRefs(useOrderStore())
const { productOptions } = storeToRefs(useProductStore())

const onFilterProduct = async (
  inputValue: string,
  doneFn: (callbackFn: () => void) => void,
) => {
  if (!inputValue || !inputValue.length) {
    await useProductStore().getProductOptions()
    doneFn(() => {})
  } else {
    await useProductStore().getProductOptions(inputValue)
    doneFn(() => {})
  }
}

const onChangeProduct = (product: Product | undefined): void => {
  model.value.product = product
}

watch(
  () => [model.value.quantity, model.value.unitPrice],
  ([quantity, unitPrice]) => {
    if (quantity == null || unitPrice == null) {
      return
    }
    const computed = new Big(unitPrice).times(quantity)
    model.value.lineAmount = computed.toNumber()
    if (!model.value.currency) {
      model.value.currency = order.value.currency ?? 'JPY'
    }
  },
  { immediate: true },
)

const submit = () => {
  emit('submit', { ...model.value })
  emit('update:show', false)
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
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">注文商品</div>
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-select
                  :model-value="model.product"
                  @update:model-value="onChangeProduct"
                  label="商品"
                  :options="productOptions"
                  option-label="name"
                  option-value="id"
                  @filter="onFilterProduct"
                  clearable
                  use-input
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.product?.sku"
                  label="SKU"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.unit"
                  @update:model-value="model.unit = ($event as string) || ''"
                  label="単位"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  type="number"
                  :model-value="model.quantity"
                  @update:model-value="model.quantity = Number($event ?? 0)"
                  label="数量"
                  min="0"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  type="number"
                  :model-value="model.unitPrice"
                  @update:model-value="model.unitPrice = Number($event ?? 0)"
                  label="単価"
                  :step="0.01"
                  min="0"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.currency ?? order.currency ?? 'JPY'"
                  label="通貨"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.lineAmount"
                  label="金額"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  :model-value="model.note"
                  @update:model-value="model.note = ($event as string) || undefined"
                  label="備考"
                  autogrow
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="取消" color="negative" @click="$emit('update:show', false)" />
          <q-btn label="確認" color="primary" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

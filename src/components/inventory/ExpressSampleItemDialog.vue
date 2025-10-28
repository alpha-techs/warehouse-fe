<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useExpressSampleStore } from 'stores/express-sample-store'
import type {
  ExpressSampleShipmentItem,
  InventoryItem,
} from 'src/api/Api'
import PickInventoryItemDialog from 'components/inventory/PickInventoryItemDialog.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

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
  submit: [value: ExpressSampleShipmentItem]
}>()

const {
  itemModel: model,
  inventoryItemModel,
  formModel: expressSampleModel,
} = storeToRefs(useExpressSampleStore())

const submit = () => {
  const value = { ...model.value }
  emit('submit', value)
  emit('update:show', false)
}

const subDialog =
  useTemplateRef<ComponentExposed<typeof PickInventoryItemDialog>>('subDialog')

const showDialog = ref(false)

const showSubDialog = async () => {
  showDialog.value = true
  await subDialog.value?.reload({
    warehouse: expressSampleModel.value.warehouse,
  })
}

const onSubmit = (data: InventoryItem) => {
  inventoryItemModel.value = data
  model.value.inventoryItemId = data.id
  model.value.inventoryItem = {
    id: data.id,
    lotNumber: data.lotNumber,
    inboundNo: data.inboundOrderId,
    inboundDate: data.inboundDate,
  }
  model.value.product = {
    id: data.product?.id,
    name: data.product?.name,
    specification: data.product?.dimension?.description,
  }
  model.value.quantity =
    model.value.quantity && model.value.quantity > 0 ? model.value.quantity : 1
  if (!expressSampleModel.value.warehouse && data.warehouse) {
    expressSampleModel.value.warehouse = data.warehouse
  }
  if (!expressSampleModel.value.customer && data.customer) {
    expressSampleModel.value.customer = data.customer
  }
}

const onDialogClose = () => {
  useExpressSampleStore().resetItemModel()
  useExpressSampleStore().resetInventoryItemModel()
}
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      :model-value="show"
      @update:model-value="(val) => { $emit('update:show', val); if (!val) onDialogClose() }"
      persistent
    >
      <q-card class="card">
        <q-card-section class="bg-primary">
          <div class="text-h6 text-white">宅急便サンプル商品</div>
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-input :model-value="model.product?.name" label="商品" readonly>
                  <template #after>
                    <q-btn
                      color="primary"
                      round
                      dense
                      flat
                      icon="sym_r_ink_selection"
                      @click="showSubDialog"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  :model-value="model.product?.specification"
                  label="規格"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.inventoryItem?.lotNumber"
                  label="LOT番号"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.inventoryItem?.inboundNo"
                  label="入庫番号"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.inventoryItem?.inboundDate"
                  label="入庫日"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="inventoryItemModel?.leftQuantity"
                  label="在庫数"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.quantity"
                  @update:model-value="
                    model.quantity = Number($event) || undefined
                  "
                  label="出荷数量"
                  type="number"
                  min="1"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input
                  :model-value="model.quantityUnit"
                  @update:model-value="
                    model.quantityUnit = ($event as string) || undefined
                  "
                  label="数量単位"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  :model-value="model.samplePackaging"
                  @update:model-value="
                    model.samplePackaging = ($event as string) || undefined
                  "
                  label="サンプル梱包"
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
        <q-card-actions align="right" class="text-primary">
          <q-btn label="取消" color="negative" @click="$emit('update:show', false)" />
          <q-btn label="確認" color="primary" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <pick-inventory-item-dialog
    :show="showDialog"
    @update:show="showDialog = $event"
    @submit="onSubmit"
    ref="subDialog"
  />
</template>

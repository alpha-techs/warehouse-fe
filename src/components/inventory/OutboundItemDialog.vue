<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useOutboundStore } from 'stores/outbound-store'
import type { InboundItem, InventoryItem } from 'src/api/Api'
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
});

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [value: InboundItem]
}>();

const {
  itemModel: model,
  inventoryItemModel,
  formModel: outboundModel,
} = storeToRefs(useOutboundStore())

const submit = () => {
  const value = { ...model.value };
  emit('submit', value);
  emit('update:show', false);
}

const subDialog = useTemplateRef<ComponentExposed<typeof PickInventoryItemDialog>>('subDialog')

const showSubDialog = async () => {
  showDialog.value = true;
  await subDialog.value?.reload({
    warehouse: outboundModel.value.warehouse,
  });
}

const showDialog = ref(false);

const onSubmit = (data: InventoryItem) => {
  inventoryItemModel.value = data
  model.value.inventoryItemId = data.id
  model.value.inboundItemId = data.inboundItemId
  model.value.warehouse = data.warehouse
  model.value.product = data.product
  model.value.lotNumber = data.lotNumber
  model.value.quantity = 0
  model.value.inventoryQuantity = data.leftQuantity
  model.value.note = undefined
}
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" persistent>
      <q-card class="card">
        <q-card-section class="bg-primary">
          <div class="text-h6 text-white">出庫商品</div>
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-input :model-value="model.product?.name" label="商品" readonly>
                  <template v-slot:after>
                    <q-btn color="primary" round dense flat icon="sym_r_ink_selection" @click="showSubDialog" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input :model-value="model.product?.dimension?.description" label="規格" readonly />
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input :model-value="model.lotNumber" label="LOT番号" readonly />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input :model-value="model.quantity"
                  @update:model-value="model.quantity = ($event as number || undefined)" label="出庫数" />
              </q-item-section>
            </q-item>
            <q-item class="col-6">
              <q-item-section>
                <q-input :model-value="model.inventoryQuantity"
                  @update:model-value="model.inventoryQuantity = ($event as number || undefined)" label="在庫数"
                  readonly />
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input :model-value="model.note" @update:model-value="model.note = ($event as string || undefined)"
                  label="備考" autogrow />
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
  <pick-inventory-item-dialog :show="showDialog" @update:show="showDialog = $event" @submit="onSubmit"
    ref="subDialog" />
</template>

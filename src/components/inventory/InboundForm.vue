<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useInboundStore } from 'stores/inbound-store'
import { useWarehouseStore } from 'stores/warehouse-store'
import { useCustomerStore } from 'stores/customer-store'

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  create: {
    type: Boolean,
    default: false,
  }
});

const { formModel: inbound } = storeToRefs(useInboundStore())

const { warehouseOptions } = storeToRefs(useWarehouseStore())
const onFilterWarehouse = async (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (!inputValue || !inputValue.length) {
    await useWarehouseStore().getWarehouseOptions()
    doneFn(() => {});
  } else {
    await useWarehouseStore().getWarehouseOptions(inputValue)
    doneFn(() => {});
  }
}

const { customerOptions } = storeToRefs(useCustomerStore())
const onFilterCustomer = async (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (!inputValue || !inputValue.length) {
    await useCustomerStore().getCustomerOptions()
    doneFn(() => {});
  } else {
    await useCustomerStore().getCustomerOptions(inputValue)
    doneFn(() => {});
  }
}
</script>

<template>
  <q-list class="row">
    <q-item class="col-12" v-if="!create">
      <q-item-section>
        <q-input v-model="inbound.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="inbound.inboundOrderId"
          @update:model-value="inbound.inboundOrderId = ($event as string || undefined)"
          label="オーダー番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="inbound.inboundDate"
          @update:model-value="inbound.inboundDate = ($event as string || undefined)"
          label="入庫日"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-select
          :model-value="inbound.warehouse"
          @update:model-value="inbound.warehouse = $event"
          label="倉庫"
          :options="warehouseOptions"
          option-label="name"
          option-value="id"
          @filter="onFilterWarehouse"
          :readonly="readonly"
          clearable
          use-input
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-select
          :model-value="inbound.customer"
          @update:model-value="inbound.customer = $event"
          label="お客様"
          :options="customerOptions"
          option-label="name"
          option-value="id"
          @filter="onFilterCustomer"
          :readonly="readonly"
          clearable
          use-input
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

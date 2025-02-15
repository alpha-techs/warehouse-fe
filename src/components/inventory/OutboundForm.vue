<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOutboundStore } from 'stores/outbound-store'
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

const { formModel: outbound } = storeToRefs(useOutboundStore())

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
        <q-input v-model="outbound.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="outbound.outboundOrderId"
          @update:model-value="outbound.outboundOrderId = ($event as string || undefined)"
          label="オーダー番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="outbound.outboundDate"
          @update:model-value="outbound.outboundDate = ($event as string || undefined)"
          label="出庫日"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-select
          :model-value="outbound.warehouse"
          @update:model-value="outbound.warehouse = $event"
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
          :model-value="outbound.customer"
          @update:model-value="outbound.customer = $event"
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
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="outbound.carrierName"
          @update:model-value="outbound.carrierName = ($event as string || undefined)"
          label="取扱便"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

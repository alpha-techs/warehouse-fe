<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNameChangeStore } from 'stores/namechange-store'
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
  },
})

const { formModel: nameChange } = storeToRefs(useNameChangeStore())

const { warehouseOptions } = storeToRefs(useWarehouseStore())
const onFilterWarehouse = async (
  inputValue: string,
  doneFn: (callbackFn: () => void) => void,
) => {
  if (!inputValue || !inputValue.length) {
    await useWarehouseStore().getWarehouseOptions()
    doneFn(() => {})
  } else {
    await useWarehouseStore().getWarehouseOptions(inputValue)
    doneFn(() => {})
  }
}

const { customerOptions } = storeToRefs(useCustomerStore())
const onFilterCustomer = async (
  inputValue: string,
  doneFn: (callbackFn: () => void) => void,
) => {
  if (!inputValue || !inputValue.length) {
    await useCustomerStore().getCustomerOptions()
    doneFn(() => {})
  } else {
    await useCustomerStore().getCustomerOptions(inputValue)
    doneFn(() => {})
  }
}
</script>

<template>
  <q-list class="row">
    <q-item class="col-12" v-if="!create">
      <q-item-section>
        <q-input v-model="nameChange.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="nameChange.nameChangeOrderId"
          @update:model-value="
            nameChange.nameChangeOrderId = ($event as string) || undefined
          "
          label="オーダー番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="nameChange.nameChangeDate"
          @update:model-value="
            nameChange.nameChangeDate = ($event as string) || undefined
          "
          label="名義変更日"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-select
          :model-value="nameChange.warehouse"
          @update:model-value="nameChange.warehouse = $event"
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
          :model-value="nameChange.customer"
          @update:model-value="nameChange.customer = $event"
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

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useExpressSampleStore } from 'stores/express-sample-store'
import { useWarehouseStore } from 'stores/warehouse-store'
import { useCustomerStore } from 'stores/customer-store'
import type { ExpressSampleShipment } from 'src/api/Api'

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

const { formModel: expressSample } = storeToRefs(useExpressSampleStore())

const { warehouseOptions } = storeToRefs(useWarehouseStore())
const { customerOptions } = storeToRefs(useCustomerStore())

const deliveryServiceOptions = [
  { label: '通常便', value: 'regular' },
  { label: 'クール便', value: 'cool' },
  { label: '冷凍便', value: 'frozen' },
  { label: 'タイムバリュー', value: 'timeValue' },
]

const deliveryFeePayerOptions = [
  { label: '弊社負担', value: 'sender' },
  { label: '受取人負担', value: 'recipient' },
  { label: '第三者負担', value: 'thirdParty' },
]

const deliveryTimeWindowOptions = [
  { label: '午前中', value: 'morning' },
  { label: '正午', value: 'noon' },
  { label: '午後', value: 'afternoon' },
  { label: '夕方', value: 'evening' },
  { label: '指定なし', value: 'anytime' },
]

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

const hasRecipient = computed(() => !!expressSample.value.recipient)

const onUpdateDeliveryTimeWindow = (
  value: ExpressSampleShipment['desiredDeliveryTimeWindow'] | null,
) => {
  expressSample.value.desiredDeliveryTimeWindow = value ?? undefined
}

const onUpdateDeliveryService = (
  value: ExpressSampleShipment['deliveryService'] | null,
) => {
  expressSample.value.deliveryService = value ?? undefined
}

const onUpdateDeliveryFeePayer = (
  value: ExpressSampleShipment['deliveryFeePayer'] | null,
) => {
  expressSample.value.deliveryFeePayer = value ?? undefined
}
</script>

<template>
  <q-list class="row">
    <q-item class="col-12" v-if="!create">
      <q-item-section>
        <q-input v-model="expressSample.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.expressSampleOrderId"
          @update:model-value="
            expressSample.expressSampleOrderId = ($event as string) || undefined
          "
          label="宅急便オーダー番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-input
          :model-value="expressSample.requestedShipDate"
          @update:model-value="
            expressSample.requestedShipDate = ($event as string) || undefined
          "
          label="出庫希望日"
          :readonly="readonly"
          type="date"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-input
          :model-value="expressSample.desiredDeliveryDate"
          @update:model-value="
            expressSample.desiredDeliveryDate = ($event as string) || undefined
          "
          label="希望到着日"
          :readonly="readonly"
          type="date"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-select
          :model-value="expressSample.desiredDeliveryTimeWindow"
          @update:model-value="onUpdateDeliveryTimeWindow"
          label="到着時間帯"
          :options="deliveryTimeWindowOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          :readonly="readonly"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-select
          :model-value="expressSample.deliveryService"
          @update:model-value="onUpdateDeliveryService"
          label="配送種別"
          :options="deliveryServiceOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          :readonly="readonly"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-input
          :model-value="expressSample.packageCount"
          @update:model-value="
            expressSample.packageCount = Number($event) || undefined
          "
          label="箱数"
          :readonly="readonly"
          type="number"
          min="1"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-input
          :model-value="expressSample.packageType"
          @update:model-value="
            expressSample.packageType = ($event as string) || undefined
          "
          label="梱包仕様"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-select
          :model-value="expressSample.deliveryFeePayer"
          @update:model-value="onUpdateDeliveryFeePayer"
          label="送料負担"
          :options="deliveryFeePayerOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          :readonly="readonly"
          dense
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.samplePurpose"
          @update:model-value="
            expressSample.samplePurpose = ($event as string) || undefined
          "
          label="サンプル送付目的"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.note"
          @update:model-value="
            expressSample.note = ($event as string) || undefined
          "
          label="備考"
          :readonly="readonly"
          autogrow
        />
      </q-item-section>
    </q-item>
    <q-separator spaced inset />
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-select
          :model-value="expressSample.warehouse"
          @update:model-value="expressSample.warehouse = $event"
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
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-select
          :model-value="expressSample.customer"
          @update:model-value="expressSample.customer = $event"
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
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.customerContactId"
          @update:model-value="
            expressSample.customerContactId = Number($event) || undefined
          "
          label="お客様担当者ID"
          :readonly="readonly"
          type="number"
          min="1"
        />
      </q-item-section>
    </q-item>
    <q-separator spaced inset />
    <q-item class="col-12">
      <q-item-section>
        <div class="text-subtitle2 text-grey-8 q-mb-sm">
          お届け先情報
        </div>
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.companyName"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              companyName: ($event as string) || undefined,
            }
          "
          label="会社名"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.department"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              department: ($event as string) || undefined,
            }
          "
          label="部署名"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.name"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              name: ($event as string) || undefined,
            }
          "
          label="ご担当者"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.phoneNumber"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              phoneNumber: ($event as string) || undefined,
            }
          "
          label="電話番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.postalCode"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              postalCode: ($event as string) || undefined,
            }
          "
          label="郵便番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.prefecture"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              prefecture: ($event as string) || undefined,
            }
          "
          label="都道府県"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.city"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              city: ($event as string) || undefined,
            }
          "
          label="市区町村"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-3">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.addressLine1"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              addressLine1: ($event as string) || undefined,
            }
          "
          label="住所1"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.recipient?.addressLine2"
          @update:model-value="
            expressSample.recipient = {
              ...expressSample.recipient,
              addressLine2: ($event as string) || undefined,
            }
          "
          label="住所2"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-separator spaced inset v-if="hasRecipient" />
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.emergencyContact?.name"
          @update:model-value="
            expressSample.emergencyContact = {
              ...expressSample.emergencyContact,
              name: ($event as string) || undefined,
            }
          "
          label="緊急連絡先氏名"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.emergencyContact?.phoneNumber"
          @update:model-value="
            expressSample.emergencyContact = {
              ...expressSample.emergencyContact,
              phoneNumber: ($event as string) || undefined,
            }
          "
          label="緊急連絡先電話番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.carrierName"
          @update:model-value="
            expressSample.carrierName = ($event as string) || undefined
          "
          label="配送業者"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12 col-md-6">
      <q-item-section>
        <q-input
          :model-value="expressSample.trackingNumber"
          @update:model-value="
            expressSample.trackingNumber = ($event as string) || undefined
          "
          label="追跡番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

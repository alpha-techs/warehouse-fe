<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, watchEffect } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { useCustomerStore } from 'stores/customer-store'
import type { Address } from 'src/api/Api'

const { readonly, create } = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  create: {
    type: Boolean,
    default: false,
  },
})

const { formModel: order } = storeToRefs(useOrderStore())
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

onMounted(async () => {
  useOrderStore().ensureFormDefaults()
  if (!customerOptions.value.length) {
    await useCustomerStore().getCustomerOptions()
  }
})

watchEffect(() => {
  if (!order.value.deliveryAddress) {
    order.value.deliveryAddress = {} as Address
  }
})

const statusMeta = computed(() => {
  switch (order.value.status) {
    case 'draft':
      return { color: 'grey', label: '下書き' }
    case 'requested':
      return { color: 'orange', label: '依頼済' }
    case 'sent':
      return { color: 'blue', label: '送付済' }
    case 'completed':
      return { color: 'green', label: '完了' }
    case 'cancelled':
      return { color: 'red', label: '取消' }
    default:
      return { color: 'grey', label: '未定義' }
  }
})

const formatAmount = (value?: number) => {
  if (value == null) {
    return '-'
  }
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: order.value.currency ?? 'JPY',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <q-list class="row">
    <q-item class="col-12" v-if="!create">
      <q-item-section>
        <q-input v-model="order.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12" v-if="!create">
      <q-item-section>
        <q-input v-model="order.orderNumber" label="注文番号" readonly />
      </q-item-section>
      <q-item-section side>
        <q-chip
          :color="statusMeta.color"
          text-color="white"
          class="text-caption"
        >
          {{ statusMeta.label }}
        </q-chip>
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-select
          v-model="order.customer"
          label="お客様"
          :options="customerOptions"
          option-label="name"
          option-value="id"
          @filter="onFilterCustomer"
          :use-input="!readonly"
          :readonly="readonly"
          clearable
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          v-model="order.deliveryDueDate"
          label="納期"
          :readonly="readonly"
          type="date"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-4">
      <q-item-section>
        <q-input
          v-model="order.deliveryAddress!.postalCode"
          label="郵便番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-4">
      <q-item-section>
        <q-input
          v-model="order.deliveryAddress!.detailAddress1"
          label="住所1"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-4">
      <q-item-section>
        <q-input
          v-model="order.deliveryAddress!.detailAddress2"
          label="住所2"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-6">
      <q-item-section>
        <q-input
          v-model="order.contactName"
          label="担当者"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-6">
      <q-item-section>
        <q-input
          v-model="order.contactPhone"
          label="連絡先"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          v-model="order.notes"
          label="備考"
          :readonly="readonly"
          autogrow
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="formatAmount(order.totalAmount)"
          label="合計金額"
          readonly
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

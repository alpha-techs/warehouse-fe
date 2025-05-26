<script setup lang="ts">
import { storeToRefs } from 'pinia'
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

const { formModel: customer } = storeToRefs(useCustomerStore())
</script>

<template>
  <q-list>
    <q-item-label header>基本情報</q-item-label>
    <q-item class="col-12" v-if="!create">
      <q-item-section>
        <q-input v-model="customer.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.name"
          @update:model-value="customer.name = ($event as string || undefined)"
          label="名称"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.tel"
          @update:model-value="customer.tel = ($event as string || undefined)"
          label="電話番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.fax"
          @update:model-value="customer.fax = ($event as string || undefined)"
          label="FAX"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.address!.postalCode"
          @update:model-value="customer.address!.postalCode = ($event as string || undefined)"
          label="郵便番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.address!.detailAddress1"
          @update:model-value="customer.address!.detailAddress1 = ($event as string || undefined)"
          label="詳細住所1"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.address!.detailAddress2"
          @update:model-value="customer.address!.detailAddress2 = ($event as string || undefined)"
          label="詳細住所2"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-separator spaced />
    <q-item-label header>担当者情報</q-item-label>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.contact!.name"
          @update:model-value="customer.contact!.name = ($event as string || undefined)"
          label="名前"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.contact!.tel"
          @update:model-value="customer.contact!.tel = ($event as string || undefined)"
          label="電話番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="customer.contact!.email"
          @update:model-value="customer.contact!.email = ($event as string || undefined)"
          label="メールアドレス"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

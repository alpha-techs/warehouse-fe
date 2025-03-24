<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWarehouseStore } from 'stores/warehouse-store'

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

const { formModel: warehouse } = storeToRefs(useWarehouseStore());
</script>

<template>
  <q-list class="row">
    <q-item class="col-12" v-if="!create">
      <q-item-section>
        <q-input v-model="warehouse.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="warehouse.name"
          @update:model-value="warehouse.name = ($event as string || undefined)"
          label="倉庫名"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="warehouse.tel"
          @update:model-value="warehouse.tel = ($event as string || undefined)"
          label="電話番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="warehouse.fax"
          @update:model-value="warehouse.fax = ($event as string || undefined)"
          label="FAX番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="warehouse.address!.postalCode"
          @update:model-value="warehouse.address!.postalCode = ($event as string || undefined)"
          label="郵便番号"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="warehouse.address!.detailAddress1"
          @update:model-value="warehouse.address!.detailAddress1 = ($event as string || undefined)"
          label="詳細住所1"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="warehouse.address!.detailAddress2"
          @update:model-value="warehouse.address!.detailAddress2 = ($event as string || undefined)"
          label="詳細住所2"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

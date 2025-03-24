<script setup lang="ts">
import { useProductStore } from 'stores/product-store'
import { storeToRefs } from 'pinia'

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

const { formModel: product } = storeToRefs(useProductStore());
</script>

<template>
  <q-list class="row">
    <q-item class="col-12" v-if="!create">
      <q-item-section>
        <q-input v-model="product.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="product.name"
          @update:model-value="product.name = ($event as string || undefined)"
          label="商品名"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          :model-value="product.sku"
          @update:model-value="product.sku = ($event as string || undefined)"
          label="sku"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
      <q-item-section>
        <q-select
          :model-value="product.leafCategory"
          @update:model-value="product.leafCategory = $event"
          label="カテゴリ"
          :readonly="readonly"
          :options="[
            { label: '冷凍', value: 'frozen' },
            { label: '生鮮', value: 'fresh' },
          ]"
          emit-value
          map-options
        >
        </q-select>
      </q-item-section>
    </q-item>
    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
      <q-item-section>
        <q-input
          :model-value="product.cargoMark"
          @update:model-value="product.cargoMark = ($event as string || undefined)"
          label="荷印"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
      <q-item-section>
        <q-input
          :model-value="product.dimension!.description"
          @update:model-value="product.dimension!.description = ($event as string || undefined)"
          label="規格"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
      <q-item-section>
        <q-input
          :model-value="product.dimension!.length"
          @update:model-value="product.dimension!.length = ($event as number || undefined)"
          label="長さ"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
      <q-item-section>
        <q-input
          :model-value="product.dimension!.width"
          @update:model-value="product.dimension!.width = ($event as number || undefined)"
          label="幅"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
      <q-item-section>
        <q-input
          :model-value="product.dimension!.height"
          @update:model-value="product.dimension!.height = ($event as number || undefined)"
          label="高さ"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
      <q-item-section>
        <q-select
          :model-value="product.dimension?.lengthUnit"
          @update:model-value="product.dimension!.lengthUnit = $event"
          label="長さ単位"
          :readonly="readonly"
          :options="[
            { label: 'm', value: 'm' },
            { label: 'cm', value: 'cm' },
            { label: 'mm', value: 'mm' },
          ]"
          emit-value
          map-options
        >
        </q-select>
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
      <q-item-section>
        <q-input
          :model-value="product.dimension!.weight"
          @update:model-value="product.dimension!.weight = ($event as number || undefined)"
          label="重さ"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
      <q-item-section>
        <q-select
          :model-value="product.dimension?.weightUnit"
          @update:model-value="product.dimension!.weightUnit = $event"
          label="重さ単位"
          :readonly="readonly"
          :options="[
            { label: 'kg', value: 'kg' },
            { label: 'g', value: 'g' },
          ]"
          emit-value
          map-options
        >
        </q-select>
      </q-item-section>
    </q-item>
    <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-item-section>
        <q-toggle
          :model-value="product.hasSubPackage"
          @update:model-value="product.hasSubPackage = $event"
          label="個包装の有無"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input
          :model-value="product.subPackageCount"
          @update:model-value="product.subPackageCount = ($event as number || undefined)"
          label="個包装数"
          :readonly="readonly || !product.hasSubPackage"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-item-section>
        <q-toggle
          :model-value="product.isFixedWeight"
          @update:model-value="product.isFixedWeight = $event"
          label="定貫"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

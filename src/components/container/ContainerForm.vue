<script setup lang="ts">
import { useContainerStore } from 'stores/container-store'
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

const { formModel: container } = storeToRefs(useContainerStore());
</script>

<template>
    <q-list class="row">
        <q-item class="col-12" v-if="!create">
            <q-item-section>
                <q-input v-model="container.id" label="管理番号" readonly />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-input :model-value="container.containerNumber"
                    @update:model-value="container.containerNumber = ($event as string || undefined)" label="集装箱号"
                    :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-input :model-value="container.shippingLine"
                    @update:model-value="container.shippingLine = ($event as string || undefined)" label="船公司"
                    :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-input :model-value="container.vesselName"
                    @update:model-value="container.vesselName = ($event as string || undefined)" label="船名"
                    :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-input :model-value="container.voyageNumber"
                    @update:model-value="container.voyageNumber = ($event as string || undefined)" label="航次号"
                    :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-input :model-value="container.arrivalDate"
                    @update:model-value="container.arrivalDate = ($event as string || undefined)" label="到港日期"
                    type="date" :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-input :model-value="container.clearanceDate"
                    @update:model-value="container.clearanceDate = ($event as string || undefined)" label="清关日期"
                    type="date" :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-input :model-value="container.dischargeDate"
                    @update:model-value="container.dischargeDate = ($event as string || undefined)" label="卸货日期"
                    type="date" :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-input :model-value="container.returnDate"
                    @update:model-value="container.returnDate = ($event as string || undefined)" label="空箱归还日期"
                    type="date" :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-select :model-value="container.status" @update:model-value="container.status = $event" label="状态"
                    :readonly="readonly" :options="[
                        { label: '在途', value: 'shipping' },
                        { label: '已到港', value: 'arrived' },
                        { label: '清关中', value: 'customsClearance' },
                        { label: '卸货中', value: 'discharging' },
                        { label: '已卸货', value: 'discharged' },
                        { label: '空箱', value: 'empty' },
                        { label: '已归还', value: 'returned' },
                        { label: '已取消', value: 'canceled' },
                    ]" emit-value map-options />
            </q-item-section>
        </q-item>
    </q-list>
</template>

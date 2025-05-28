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
        <q-item class="col-sm-6 col-xs-12">
            <q-item-section>
                <q-input :model-value="container.containerNumber"
                    @update:model-value="container.containerNumber = ($event as string || undefined)" label="コンテナ番号"
                    :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
            <q-item-section>
                <q-input :model-value="container.shippingLine"
                    @update:model-value="container.shippingLine = ($event as string || undefined)" label="船会社"
                    :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
            <q-item-section>
                <q-input :model-value="container.vesselName"
                    @update:model-value="container.vesselName = ($event as string || undefined)" label="船名"
                    :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
            <q-item-section>
                <q-input :model-value="container.voyageNumber"
                    @update:model-value="container.voyageNumber = ($event as string || undefined)" label="航海番号"
                    :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
            <q-item-section>
                <q-input :model-value="container.arrivalDate"
                    @update:model-value="container.arrivalDate = ($event as string || undefined)" label="入港日"
                    type="date" :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
            <q-item-section>
                <q-input :model-value="container.clearanceDate"
                    @update:model-value="container.clearanceDate = ($event as string || undefined)" label="通関日"
                    type="date" :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
            <q-item-section>
                <q-input :model-value="container.dischargeDate"
                    @update:model-value="container.dischargeDate = ($event as string || undefined)" label="荷揚げ日"
                    type="date" :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-sm-6 col-xs-12">
            <q-item-section>
                <q-input :model-value="container.returnDate"
                    @update:model-value="container.returnDate = ($event as string || undefined)" label="空コンテナ返却日"
                    type="date" :readonly="readonly" />
            </q-item-section>
        </q-item>
        <q-item class="col-12">
            <q-item-section>
                <q-select :model-value="container.status" @update:model-value="container.status = $event" label="状態"
                    :readonly="readonly" :options="[
                        { label: '輸送中', value: 'shipping' },
                        { label: '入港済み', value: 'arrived' },
                        { label: '通関中', value: 'customsClearance' },
                        { label: '荷揚げ中', value: 'discharging' },
                        { label: '荷揚げ完了', value: 'discharged' },
                        { label: '空コンテナ', value: 'empty' },
                        { label: '返却済み', value: 'returned' },
                        { label: 'キャンセル', value: 'canceled' },
                    ]" emit-value map-options />
            </q-item-section>
        </q-item>
    </q-list>
</template>

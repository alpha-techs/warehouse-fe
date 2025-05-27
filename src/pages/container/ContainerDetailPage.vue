<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import ContainerForm from 'components/container/ContainerForm.vue'
import ContainerItemListForm from 'components/container/ContainerItemListForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { useContainerStore } from 'stores/container-store'

const loading = ref(false)
const router = useRouter()

const containerId = computed(() => {
    const id = useRoute().params.id as string
    return Number.parseInt(id)
})

onMounted(async () => {
    await reload();
});

const reload = async () => {
    loading.value = true;
    await useContainerStore().getContainerById(containerId.value);
    await nextTick(() => {
        loading.value = false;
    });
};

const backToList = async () => {
    await router.push({ name: 'container-list' });
}

const toEdit = async () => {
    await router.push({ name: 'container-edit', params: { id: containerId.value } });
}
</script>

<template>
    <q-page padding>
        <q-card bordered>
            <q-linear-progress indeterminate v-if="loading" />
            <q-card-section>
                <q-list class="row">
                    <q-item class="col-12 q-gutter-none justify-between">
                        <div class="text-h6">コンテナ詳細</div>
                    </q-item>
                </q-list>
                <container-form readonly v-if="!loading" />
            </q-card-section>
            <q-separator />
            <q-card-section>
                <container-item-list-form readonly />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right" v-if="!loading">
                <q-btn style="width: 100px" color="primary" label="一覧へ" @click="backToList" :disable="loading" />
                <q-btn style="width: 100px" color="negative" label="編集" @click="toEdit" />
                <q-btn style="width: 100px" color="negative" label="削除" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

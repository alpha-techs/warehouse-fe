<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import ContainerForm from 'components/container/ContainerForm.vue'
import ContainerItemListForm from 'components/container/ContainerItemListForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { useContainerStore } from 'stores/container-store'

const saving = ref(false)
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

const onSave = async () => {
    saving.value = true;
    try {
        await useContainerStore().updateContainer();
        await router.push({ name: 'container-list' });
    } catch (error) {
        console.error(error);
    } finally {
        saving.value = false;
    }
}

const backToList = async () => {
    await router.push({ name: 'container-list' });
}
</script>

<template>
    <q-page padding>
        <q-card bordered>
            <q-linear-progress indeterminate v-if="loading" />
            <q-card-section>
                <q-list class="row">
                    <q-item class="col-12 q-gutter-none justify-between">
                        <div class="text-h6">コンテナ編集</div>
                    </q-item>
                </q-list>
                <container-form v-if="!loading" />
            </q-card-section>
            <q-separator />
            <q-card-section>
                <container-item-list-form />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right" v-if="!loading">
                <q-btn style="width: 100px" color="primary" label="一覧へ" @click="backToList" :disable="saving" />
                <q-btn style="width: 100px" color="negative" label="保存" @click="onSave" :loading="saving" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

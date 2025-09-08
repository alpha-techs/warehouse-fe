<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNameChangeStore } from 'stores/namechange-store'
import NameChangeForm from 'components/inventory/NameChangeForm.vue'
import NameChangeItemListForm from 'components/inventory/NameChangeItemListForm.vue'
import { toastFormError } from 'src/utils/error-handler'

const loading = ref(false)
const saving = ref(false)
const router = useRouter()

const nameChangeId = computed(() => {
    const id = useRoute().params.id as string
    return Number.parseInt(id)
})

onMounted(async () => {
    await reload();
});

const reload = async () => {
    loading.value = true;
    await useNameChangeStore().getNameChangeById(nameChangeId.value);
    await nextTick(() => {
        loading.value = false;
    });
};

const cancel = async () => {
    await router.push({ name: 'namechange-list' });
}

const save = async () => {
    saving.value = true;
    try {
        await useNameChangeStore().updateNameChange();
        await reload();
    } catch (error) {
        await toastFormError(error);
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <q-page padding>
        <q-card bordered>
            <q-linear-progress indeterminate v-if="loading || saving" />
            <q-card-section>
                <name-change-form v-if="!loading" />
            </q-card-section>
            <q-separator />
            <q-card-section>
                <name-change-item-list-form />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
                <q-btn style="width: 100px" color="negative" label="取消" @click="cancel" :disable="loading" />
                <q-btn style="width: 100px" color="primary" label="保存" @click="save" :disable="loading" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

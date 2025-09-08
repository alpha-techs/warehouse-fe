<script setup lang="ts">
import NameChangeItemListForm from 'components/inventory/NameChangeItemListForm.vue'
import NameChangeForm from 'components/inventory/NameChangeForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNameChangeStore } from 'stores/namechange-store'
import { storeToRefs } from 'pinia'
import { toastFormError } from 'src/utils/error-handler'

const loading = ref(false)
const router = useRouter()

const nameChangeId = computed(() => {
    const id = useRoute().params.id as string
    return Number.parseInt(id)
})

const { formModel: nameChange } = storeToRefs(useNameChangeStore())

const statusBadgeAttribute = computed(() => {
    return useNameChangeStore().getStatusBadgeAttribute();
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

const backToList = async () => {
    await router.push({ name: 'namechange-list' });
}

const toEdit = async () => {
    await router.push({ name: 'namechange-edit', params: { id: nameChangeId.value } });
}

const approve = async () => {
    try {
        await useNameChangeStore().approveNameChangeById(nameChangeId.value);
    } catch (error) {
        await toastFormError(error);
    }
}

const reject = async () => {
    await useNameChangeStore().rejectNameChangeById(nameChangeId.value);
}
</script>

<template>
    <q-page padding>
        <q-card bordered>
            <q-linear-progress indeterminate v-if="loading" />
            <q-card-section>
                <q-list class="row">
                    <q-item class="col-12 q-gutter-none justify-between">
                        <div class="text-h6">名義変更詳細</div>
                        <q-badge v-bind="statusBadgeAttribute" v-if="!loading" />
                    </q-item>
                </q-list>
                <name-change-form readonly v-if="!loading" />
            </q-card-section>
            <q-separator />
            <q-card-section>
                <name-change-item-list-form readonly />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right" v-if="!loading">
                <template v-if="nameChange.status == 'pending'">
                    <q-btn style="width: 100px" color="primary" label="承認" @click="approve" />
                    <q-btn style="width: 100px" color="negative" label="拒否" @click="reject" />
                    <q-separator vertical class="q-mx-lg" />
                </template>
                <q-btn style="width: 100px" color="primary" label="一覧へ" @click="backToList" :disable="loading" />
                <template v-if="nameChange.status != 'approved'">
                    <q-btn style="width: 100px" color="negative" label="編集" @click="toEdit" />
                    <q-btn style="width: 100px" color="negative" label="削除" />
                </template>
            </q-card-actions>
        </q-card>
    </q-page>
</template>

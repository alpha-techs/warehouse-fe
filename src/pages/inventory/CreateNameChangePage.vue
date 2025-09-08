<script setup lang="ts">
import NameChangeForm from 'components/inventory/NameChangeForm.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNameChangeStore } from 'stores/namechange-store'
import NameChangeItemListForm from 'components/inventory/NameChangeItemListForm.vue'
import { toastFormError } from 'src/utils/error-handler'

const saving = ref(false)
const loading = ref(false)

const router = useRouter()

onMounted(() => {
    loading.value = true
    useNameChangeStore().resetFormModel()
    loading.value = false
})

const onSave = async () => {
    saving.value = true
    try {
        await useNameChangeStore().createNameChange()
        await router.push({
            name: 'namechange-list',
        })
    } catch (error) {
        await toastFormError(error)
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <q-page padding>
        <q-card bordered>
            <q-form>
                <q-card-section>
                    <div class="text-h5">新規名義変更</div>
                </q-card-section>
                <q-separator></q-separator>
                <q-linear-progress indeterminate v-if="saving" />
                <q-card-section>
                    <name-change-form create v-if="!loading" />
                </q-card-section>
                <q-separator></q-separator>
                <q-card-section>
                    <name-change-item-list-form />
                </q-card-section>
                <q-separator></q-separator>
                <q-card-actions align="right">
                    <q-btn style="width: 100px" color="primary" label="保存" @click="onSave"
                        :disable="loading || saving"></q-btn>
                </q-card-actions>
            </q-form>
        </q-card>
    </q-page>
</template>

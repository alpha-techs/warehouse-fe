<script setup lang="ts">
import ExpressSampleForm from 'components/inventory/ExpressSampleForm.vue'
import ExpressSampleItemListForm from 'components/inventory/ExpressSampleItemListForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Notify } from 'quasar'
import { toastFormError } from 'src/utils/error-handler'
import { useExpressSampleStore } from 'stores/express-sample-store'

const loading = ref(false)
const generateLoading = ref(false)
const router = useRouter()

const expressSampleId = computed(() => {
  const id = useRoute().params.id as string
  return Number.parseInt(id)
})

const { formModel: expressSample } = storeToRefs(useExpressSampleStore())

const statusBadgeAttribute = computed(() =>
  useExpressSampleStore().getStatusBadgeAttribute(expressSample.value.status),
)

onMounted(async () => {
  await reload()
})

const reload = async () => {
  loading.value = true
  await useExpressSampleStore().getExpressSampleShipmentById(
    expressSampleId.value,
  )
  await nextTick(() => {
    loading.value = false
  })
}

const backToList = async () => {
  await router.push({ name: 'express-sample-list' })
}

const toEdit = async () => {
  await router.push({
    name: 'express-sample-edit',
    params: { id: expressSampleId.value },
  })
}

const approve = async () => {
  try {
    await useExpressSampleStore().approveExpressSampleShipmentById(
      expressSampleId.value,
    )
  } catch (error) {
    await toastFormError(error)
  }
}

const reject = async () => {
  try {
    await useExpressSampleStore().rejectExpressSampleShipmentById(
      expressSampleId.value,
    )
  } catch (error) {
    await toastFormError(error)
  }
}

const cancelShipment = async () => {
  try {
    await useExpressSampleStore().cancelExpressSampleShipmentById(
      expressSampleId.value,
    )
  } catch (error) {
    await toastFormError(error)
  }
}

const generateReport = async () => {
  if (!expressSample.value.id) {
    await toastFormError('宅急便IDが無効です')
    return
  }
  try {
    generateLoading.value = true
    const reportId =
      await useExpressSampleStore().generateExpressSampleShipmentReport({
        expressSampleShipmentId: expressSample.value.id,
        format: 'excel',
      })
    Notify.create({
      type: 'positive',
      message: `報告書生成を受け付けました。報告ID: ${reportId}`,
      position: 'top',
      timeout: 3000,
      actions: [
        {
          label: '報告書一覧へ',
          color: 'white',
          handler: () => {
            void router.push({ name: 'express-sample-report-list' })
          },
        },
      ],
    })
  } catch (error) {
    await toastFormError(error)
  } finally {
    generateLoading.value = false
  }
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <q-list class="row">
          <q-item class="col-12 q-gutter-none justify-between">
            <div class="text-h6">宅急便依頼詳細</div>
            <q-badge v-bind="statusBadgeAttribute" v-if="!loading" />
          </q-item>
        </q-list>
        <express-sample-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <express-sample-item-list-form readonly />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" v-if="!loading">
        <template v-if="expressSample.status === 'pending'">
          <q-btn
            style="width: 100px"
            color="primary"
            label="承認"
            @click="approve"
          />
          <q-btn
            style="width: 100px"
            color="negative"
            label="拒否"
            @click="reject"
          />
          <q-btn
            style="width: 100px"
            color="grey-7"
            label="取消"
            @click="cancelShipment"
          />
          <q-separator vertical class="q-mx-lg" />
        </template>
        <q-btn
          style="width: 120px"
          color="primary"
          label="Excel報告書生成"
          @click="generateReport"
          :loading="generateLoading"
          v-if="expressSample.status && ['approved', 'booked', 'dispatched', 'delivered'].includes(expressSample.status)"
        />
        <q-separator vertical class="q-mx-lg" />
        <q-btn
          style="width: 100px"
          color="primary"
          label="一覧へ"
          @click="backToList"
          :disable="loading"
        />
        <template
          v-if="
            expressSample.status !== 'approved' &&
            expressSample.status !== 'rejected'
          "
        >
          <q-btn
            style="width: 100px"
            color="negative"
            label="編集"
            @click="toEdit"
          />
        </template>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

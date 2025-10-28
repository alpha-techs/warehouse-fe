<script setup lang="ts">
import { useProductStore } from 'stores/product-store'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { apiClient } from 'src/utils/api-client'
import type { ProductImage } from 'src/api/Api'
import { useQuasar } from 'quasar'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
})

const $q = useQuasar()
const { formModel } = storeToRefs(useProductStore())

if (!formModel.value.images) {
  formModel.value.images = []
}

const images = computed(() => formModel.value.images ?? [])
const fileModel = ref<File[] | null>(null)
const uploading = ref(false)
const previewUrls = ref<Record<string, string>>({})
const apiBaseUrl = (import.meta.env.VITE_APP_API_URL || '').replace(/\/$/, '')
const placeholderSrc =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice"><rect width="320" height="240" fill="#ECEFF1"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#90A4AE" font-family="Arial, sans-serif" font-size="20">No Image</text></svg>',
  )

const getImageSrc = (image: ProductImage) => {
  if (!image?.mediaId) {
    return placeholderSrc
  }

  const fromCache = previewUrls.value[image.mediaId]
  if (fromCache) {
    return fromCache
  }

  return `${apiBaseUrl}/media/images/${encodeURIComponent(image.mediaId)}`
}

const syncOrder = () => {
  images.value.forEach((image, index) => {
    image.order = index
  })
}

const addImages = async (files: File[]) => {
  if (!files.length) {
    return
  }

  uploading.value = true
  try {
    for (const file of files) {
      const resp = await apiClient.media.uploadMediaImage({ file })
      const newImage: ProductImage = {
        mediaId: resp.data.mediaId,
        altText: resp.data.fileName,
        order: images.value.length,
      }

      formModel.value.images = formModel.value.images ?? []
      formModel.value.images.push(newImage)

      if (resp.data.url) {
        previewUrls.value = {
          ...previewUrls.value,
          [newImage.mediaId]: resp.data.url,
        }
      }
    }
    syncOrder()
    $q.notify({ type: 'positive', message: '画像を追加しました' })
  } catch (error) {
    console.error('画像のアップロードに失敗しました', error)
    $q.notify({ type: 'negative', message: '画像のアップロードに失敗しました' })
  } finally {
    uploading.value = false
    fileModel.value = null
  }
}

const onFilesSelected = async (value: File[] | File | null) => {
  if (!value || props.readonly) {
    fileModel.value = null
    return
  }

  const files = Array.isArray(value) ? value : [value]
  await addImages(files)
}

const moveImage = (from: number, to: number) => {
  if (props.readonly || to < 0 || to >= images.value.length) {
    return
  }

  const list = images.value
  const [moved] = list.splice(from, 1)
  if (!moved) {
    return
  }

  list.splice(to, 0, moved)
  syncOrder()
}

const removeImage = (index: number) => {
  if (props.readonly || index < 0 || index >= images.value.length) {
    return
  }

  const [removed] = images.value.splice(index, 1)
  if (removed?.mediaId) {
    const rest = { ...previewUrls.value }
    delete rest[removed.mediaId]
    previewUrls.value = rest
  }
  syncOrder()
}
</script>

<template>
  <div class="product-image-manager q-gutter-md">
    <div class="row items-center q-col-gutter-sm">
      <div class="col">
        <div class="text-subtitle1">商品画像</div>
        <div class="text-caption text-grey-7">表示順を変更する際は矢印ボタンをご利用ください</div>
      </div>
      <div class="col-auto" v-if="!readonly">
        <q-file
          v-model="fileModel"
          accept="image/*"
          use-chips
          multiple
          dense
          outlined
          clearable
          :loading="uploading"
          :disable="uploading"
          label="画像を追加"
          @update:model-value="onFilesSelected"
        >
          <template #prepend>
            <q-icon name="file_upload" />
          </template>
        </q-file>
      </div>
    </div>

    <div v-if="!images.length" class="text-body2 text-grey-7">
      現在登録されている画像はありません。
    </div>

    <div v-else class="row q-col-gutter-md">
      <div
        class="col-xs-12 col-sm-6 col-md-4"
        v-for="(image, index) in images"
        :key="`${image.mediaId}-${index}`"
      >
        <q-card flat bordered>
          <q-img
            :src="getImageSrc(image)"
            :placeholder-src="placeholderSrc"
            class="bg-grey-2 product-image-manager__preview"
            spinner-color="primary"
          >
            <template #error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                プレビューを取得できません
              </div>
            </template>
          </q-img>
          <q-separator />
          <q-card-section>
            <q-input
              v-model="image.altText"
              label="代替テキスト"
              dense
              :readonly="readonly"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="between">
            <div class="row items-center q-gutter-xs">
              <q-btn
                dense
                icon="arrow_upward"
                flat
                :disable="readonly || index === 0"
                @click="moveImage(index, index - 1)"
              />
              <q-btn
                dense
                icon="arrow_downward"
                flat
                :disable="readonly || index === images.length - 1"
                @click="moveImage(index, index + 1)"
              />
            </div>
            <q-btn
              dense
              color="negative"
              icon="delete"
              flat
              :disable="readonly"
              @click="removeImage(index)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-image-manager__preview {
  height: 200px;
}
</style>

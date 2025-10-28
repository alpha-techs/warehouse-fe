<template>
  <q-page class="bg-grey-2 flex flex-center">
    <q-card flat bordered class="login-card">
      <q-card-section class="text-center">
        <div class="text-h5 q-mb-sm">{{ appName }}</div>
        <div class="text-subtitle2 text-grey-7">
          ログインしてシステムを利用してください
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-form ref="formRef" class="q-gutter-md" @submit.prevent="onSubmit">
          <q-input
            v-model="credentials.email"
            label="メールアドレス"
            type="email"
            autocomplete="email"
            :rules="emailRules"
            dense
            outlined
            clearable
          />

          <q-input
            v-model="credentials.password"
            label="パスワード"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :rules="passwordRules"
            dense
            outlined
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              label="ログイン"
              type="submit"
              color="primary"
              class="full-width"
              unelevated
              :loading="authStore.loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import type { QForm } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const appName = computed(() => import.meta.env.VITE_APP_NAME || 'Warehouse App')
const formRef = ref<QForm | null>(null)
const showPassword = ref(false)
const credentials = reactive({
  email: '',
  password: '',
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const emailRules = [
  (val: string) => !!val || 'メールアドレスを入力してください',
  (val: string) =>
    /.+@.+/.test(val) || 'メールアドレスの形式が正しくありません',
]
const passwordRules = [(val: string) => !!val || 'パスワードを入力してください']

const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object') {
    const maybeError = error as {
      error?: { message?: string }
      message?: string
    }
    if (maybeError.error?.message) {
      return maybeError.error.message
    }
    if (maybeError.message) {
      return maybeError.message
    }
  }

  return 'ログインに失敗しました。時間をおいて再度お試しください'
}

const onSubmit = async () => {
  const isValid = await formRef.value?.validate()
  if (!isValid) {
    return
  }

  try {
    await authStore.login({ ...credentials })

    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : undefined
    await router.replace(redirect || { name: 'dashboard' })

    $q.notify({
      type: 'positive',
      message: 'ログインしました',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: extractErrorMessage(error),
    })
  }
}
</script>

<style scoped>
.login-card {
  width: 360px;
  max-width: calc(100vw - 32px);
}
</style>

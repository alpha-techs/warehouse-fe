<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ appName }}
        </q-toolbar-title>

        <q-space />

        <div v-if="appVersionLabel" class="text-caption q-mr-md">
          {{ appVersionLabel }}
        </div>

        <q-btn
          flat
          dense
          no-caps
          icon="sym_r_account_circle"
          :label="userDisplayName"
        >
          <q-menu anchor="bottom end" self="top end">
            <q-list padding>
              <q-item>
                <q-item-section>
                  <q-item-label>{{ userDisplayName }}</q-item-label>
                  <q-item-label v-if="userEmail" caption>{{
                    userEmail
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>ログアウト</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import EssentialLink, {
  type EssentialLinkProps,
} from 'components/EssentialLink.vue'
import { useAuthStore } from 'src/stores/auth-store'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const linksList: EssentialLinkProps[] = [
  {
    title: 'ダッシュボード',
    icon: 'sym_r_dashboard',
    link: router.resolve({ name: 'dashboard' }).href,
  },
  {
    title: '商品管理',
    icon: 'sym_r_dns',
    link: router.resolve({ name: 'product-list' }).href,
  },
  {
    title: '倉庫管理',
    icon: 'sym_r_warehouse',
    link: router.resolve({ name: 'warehouse-list' }).href,
  },
  {
    title: 'お客様管理',
    icon: 'sym_r_account_circle',
    link: router.resolve({ name: 'customer-list' }).href,
  },
  {
    title: 'コンテナ管理',
    icon: 'sym_r_package_2',
    link: router.resolve({ name: 'container-list' }).href,
  },
  {
    title: '在庫管理',
    icon: 'sym_r_inventory',
    subMenu: [
      {
        title: '在庫リスト',
        icon: 'sym_r_inventory_2',
        link: router.resolve({ name: 'inventory-list' }).href,
      },
      {
        title: '在庫報告書リスト',
        icon: 'sym_r_assignment',
        link: router.resolve({ name: 'inventory-report-list' }).href,
      },
    ],
  },
  {
    title: '入庫管理',
    icon: 'sym_r_move_to_inbox',
    subMenu: [
      {
        title: '入庫商品一覧',
        icon: 'sym_r_pallet',
        link: router.resolve({ name: 'inbound-item-list' }).href,
      },
      {
        title: '入庫依頼一覧',
        icon: 'sym_r_directions_boat',
        link: router.resolve({ name: 'inbound-list' }).href,
      },
      {
        title: '入庫報告書リスト',
        icon: 'sym_r_assignment',
        link: router.resolve({ name: 'inbound-report-list' }).href,
      },
    ],
  },
  {
    title: '出庫管理',
    icon: 'sym_r_outbox',
    subMenu: [
      {
        title: '出庫商品一覧',
        icon: 'sym_r_conveyor_belt',
        link: router.resolve({ name: 'outbound-item-list' }).href,
      },
      {
        title: '出庫依頼一覧',
        icon: 'sym_r_delivery_truck_speed',
        link: router.resolve({ name: 'outbound-list' }).href,
      },
      {
        title: '出庫報告書リスト',
        icon: 'sym_r_assignment',
        link: router.resolve({ name: 'outbound-report-list' }).href,
      },
    ],
  },
  {
    title: '請求管理',
    icon: 'sym_r_receipt_long',
    subMenu: [
      {
        title: '請求書一覧',
        icon: 'sym_r_receipt_long',
        link: router.resolve({ name: 'invoice-list' }).href,
      },
      {
        title: '請求書Excel出力',
        icon: 'sym_r_table_view',
        link: router.resolve({ name: 'invoice-print-list' }).href,
      },
    ],
  },
  {
    title: '名義変更管理',
    icon: 'sym_r_partner_exchange',
    subMenu: [
      {
        title: '名義変更依頼一覧',
        icon: 'sym_r_swap_horiz',
        link: router.resolve({ name: 'namechange-list' }).href,
      },
      {
        title: '名義変更報告書リスト',
        icon: 'sym_r_assignment',
        link: router.resolve({ name: 'namechange-report-list' }).href,
      },
    ],
  },
  {
    title: '注文書管理',
    icon: 'sym_r_contract_edit',
    subMenu: [
      {
        title: '注文一覧',
        icon: 'sym_r_content_paste',
        link: router.resolve({ name: 'order-list' }).href,
      },
      {
        title: '注文印刷ジョブ',
        icon: 'sym_r_table_view',
        link: router.resolve({ name: 'order-print-list' }).href,
      },
    ],
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const appName = computed(() => import.meta.env.VITE_APP_NAME)
const appVersion = computed(() => import.meta.env.VITE_APP_VERSION)
const appVersionLabel = computed(() =>
  appVersion.value ? `v${appVersion.value}` : '',
)
const userDisplayName = computed(
  () => authStore.profile?.name || authStore.profile?.email || 'マイアカウント',
)
const userEmail = computed(() => authStore.profile?.email || '')

async function handleLogout() {
  await authStore.logout()
  await router.replace({ name: 'login' })
  $q.notify({ type: 'info', message: 'ログアウトしました' })
}
</script>

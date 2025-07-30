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

        <div>{{ appVersion }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
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
import { useRouter } from 'vue-router'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const router = useRouter();
const linksList: EssentialLinkProps[] = [
  {
    title: '商品管理',
    icon: 'sym_r_dns',
    link: router.resolve({ name: 'product-list' }).href,
  },
  {
    title: '倉庫管理',
    icon:'sym_r_warehouse',
    link: router.resolve({ name: 'warehouse-list' }).href,
  },
  {
    title: 'お客様管理',
    icon:'sym_r_account_circle',
    link: router.resolve({ name: 'customer-list' }).href,
  },
  {
    title: 'コンテナ管理',
    icon:'sym_r_package_2',
    link: router.resolve({ name: 'container-list' }).href,
  },
  {
    title: '在庫管理',
    icon:'sym_r_inventory',
    link: router.resolve({ name: 'inventory-list' }).href,
  },
  {
    title: '入庫管理',
    icon:'sym_r_move_to_inbox',
    subMenu: [
      {
        'title': '入庫商品一覧',
        'icon': 'sym_r_pallet',
        'link': router.resolve({ name: 'inbound-item-list' }).href,
      },
      {
        'title': '入庫依頼一覧',
        'icon': 'sym_r_directions_boat',
        'link': router.resolve({ name: 'inbound-list' }).href,
      }
    ],
  },
  {
    title: '出庫管理',
    icon:'sym_r_outbox',
    subMenu: [
      {
        'title': '出庫商品一覧',
        'icon': 'sym_r_conveyor_belt',
        'link': router.resolve({ name: 'outbound-item-list' }).href,
      },
      {
        'title': '出庫依頼一覧',
        'icon': 'sym_r_delivery_truck_speed',
        'link': router.resolve({ name: 'outbound-list' }).href,
      }
    ],
  }
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const appName = computed(() => import.meta.env.VITE_APP_NAME)
const appVersion = computed(() => import.meta.env.VITE_APP_VERSION)
</script>

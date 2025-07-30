<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">クイック操作</div>
      <div class="text-caption text-grey-7">よく使う機能のショートカット</div>
    </q-card-section>

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-6 col-sm-3">
          <q-btn
            color="primary"
            icon="sym_r_move_to_inbox"
            label="入庫作成"
            class="full-width"
            @click="createInbound"
          />
        </div>
        <div class="col-6 col-sm-3">
          <q-btn
            color="negative"
            icon="sym_r_outbox"
            label="出庫作成"
            class="full-width"
            @click="createOutbound"
          />
        </div>
        <div class="col-6 col-sm-3">
          <q-btn
            color="secondary"
            icon="sym_r_dns"
            label="商品追加"
            class="full-width"
            @click="createProduct"
          />
        </div>
        <div class="col-6 col-sm-3">
          <q-btn
            color="accent"
            icon="sym_r_account_circle"
            label="お客様追加"
            class="full-width"
            @click="createCustomer"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const createInbound = () => {
  void router.push({ name: 'inbound-create' })
}

const createOutbound = () => {
  void router.push({ name: 'outbound-create' })
}

const createProduct = () => {
  void router.push({ name: 'product-create' })
}

const createCustomer = () => {
  void router.push({ name: 'customer-create' })
}
</script>

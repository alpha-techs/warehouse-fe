import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'products',
        name: 'product-list',
        component: () => import('pages/product/ProductListPage.vue')
      },
      {
        path: 'products/new',
        name: 'product-create',
        component: () => import('pages/product/CreateProductPage.vue')
      },
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('pages/product/ProductDetailPage.vue')
      },
      {
        path: 'products/:id/edit',
        name: 'product-edit',
        component: () => import('pages/product/EditProductPage.vue')
      },
      {
        path: 'warehouses',
        name: 'warehouse-list',
        component: () => import('pages/warehouse/WarehouseListPage.vue')
      },
      {
        path: 'warehouses/new',
        name: 'warehouse-create',
        component: () => import('pages/warehouse/CreateWarehousePage.vue')
      },
      {
        path: 'warehouses/:id',
        name: 'warehouse-detail',
        component: () => import('pages/warehouse/WarehouseDetailPage.vue')
      },
      {
        path: 'warehouses/:id/edit',
        name: 'warehouse-edit',
        component: () => import('pages/warehouse/EditWarehousePage.vue')
      },
      {
        path: 'customers',
        name: 'customer-list',
        component: () => import('pages/customer/CustomerListPage.vue')
      },
      {
        path: 'customers/new',
        name: 'customer-create',
        component: () => import('pages/customer/CreateCustomerPage.vue')
      },
      {
        path: 'customers/:id',
        name: 'customer-detail',
        component: () => import('pages/customer/CustomerDetailPage.vue')
      },
      {
        path: 'customers/:id/edit',
        name: 'customer-edit',
        component: () => import('pages/customer/EditCustomerPage.vue')
      },
      {
          path: 'inventory',
          name: 'inventory-list',
          component: () => import('pages/inventory/InventoryListPage.vue')
      },
      {
          path: 'inventory/inbounds',
          name: 'inbound-list',
          component: () => import('pages/inventory/InboundListPage.vue')
      },
      {
          path: 'inventory/inbound/new',
          name: 'inbound-create',
          component: () => import('pages/inventory/CreateInboundPage.vue')
      },
      {
          path: 'inventory/inbound/:id',
          name: 'inbound-detail',
          component: () => import('pages/inventory/InboundDetailPage.vue')
      },
      {
          path: 'inventory/inbound/:id/edit',
          name: 'inbound-edit',
          component: () => import('pages/inventory/EditInboundPage.vue')
      },
      {
          path: 'inventory/inboundItems',
          name: 'inbound-item-list',
          component: () => import('pages/inventory/InboundItemListPage.vue')
      },
      {
          path: 'inventory/outbounds',
          name: 'outbound-list',
          component: () => import('pages/inventory/OutboundListPage.vue')
      },
      {
          path: 'inventory/outbound/new',
          name: 'outbound-create',
          component: () => import('pages/inventory/CreateOutboundPage.vue')
      },
      {
          path: 'inventory/outbound/:id',
          name: 'outbound-detail',
          component: () => import('pages/inventory/OutboundDetailPage.vue')
      },
      {
          path: 'inventory/outbound/:id/edit',
          name: 'outbound-edit',
          component: () => import('pages/inventory/EditOutboundPage.vue')
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

<template>
  <q-expansion-item
    expand-separator
    :icon="icon"
    :label="title"
    :caption="caption"
    :header-inset-level="insetLevel"
    v-if="subMenu.length > 0"
  >
    <q-list>
      <essential-link
        v-for="(link, index) in subMenu"
        :key="index"
        v-bind="link"
        :inset-level="insetLevel + 0.5"
      />
    </q-list>
  </q-expansion-item>

  <q-item
    clickable
    tag="a"
    :href="link"
    :inset-level="insetLevel"
    v-else
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  insetLevel?: number;
  subMenu?: EssentialLinkProps[];
}

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
  insetLevel: 0,
  subMenu: () => [],
});
</script>

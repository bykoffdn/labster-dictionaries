<template>
  <PageHeader />

  <DictionaryList />

  <PageFooter />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import PageHeader from "@/components/PageHeader.vue";
import DictionaryList from "@/components/DictionaryList.vue";
import PageFooter from "@/components/PageFooter.vue";

export default defineComponent({
  name: "App",

  components: {
    PageFooter,
    PageHeader,
    DictionaryList
  }
});
</script>

<style lang="scss">
:root {
  --font-family: "Montserrat";
}
</style>

<style scoped lang="scss">
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/gaps";

.dictionary-list {
  margin-top: var(--gap-12x);
}
</style>

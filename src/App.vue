<template>
  <PageHeader />

  <DictionaryList />

  <PageFooter />
</template>

<script>
import PageHeader from "@/components/PageHeader";
import DictionaryList from "@/components/DictionaryList";
import PageFooter from "@/components/PageFooter";

export default {
  name: "App",

  components: {
    PageFooter,
    PageHeader,
    DictionaryList
  }
};
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

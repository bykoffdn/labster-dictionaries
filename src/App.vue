<template>
  <PageHeading />

  <DictionaryList />
</template>

<script>
import DictionaryList from "@/components/DictionaryList";
import PageHeading from "@/components/PageHeading";

export default {
  name: "App",

  components: {
    PageHeading,
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

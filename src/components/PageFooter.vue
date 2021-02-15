<template>
  <DGrid tag="footer">
    <DTypography :content="interfaceCopyright.heading" size="h3" />
    <pre>{{ dictionaryList }}</pre>
  </DGrid>
</template>

<script>
import { mapState } from "vuex";

/** static data **/
import interfaceCopyright from "../../interface-copyright/pageFooter";

/** components **/
import { DGrid, DTypography } from "@darwin-studio/ui-vue";

/**
 * @version 1.0.0
 * @author [Dmitriy Bykov] (https://github.com/d-darwin)
 */
export default {
  name: "PageFooter",

  components: {
    DGrid,
    DTypography
  },

  data() {
    return {
      interfaceCopyright
    };
  },

  computed: {
    ...mapState(["dictionaryList"])
  }
};
</script>

<style scoped lang="scss">
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/gaps";
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/colors";

.d-typography {
  margin-top: var(--gap-12x);
  padding-top: var(--gap-4x);
  border-top: 1px solid var(--color-separator);
}
</style>

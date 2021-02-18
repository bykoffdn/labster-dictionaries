<template>
  <DGrid class="dictionary-list">
    <DictionaryItem
      v-for="dictionary in dictionaryList"
      :key="dictionary && dictionary.id"
      :data="dictionary"
    />

    <DTypography
      v-if="!dictionaryList || !dictionaryList.length"
      :content="interfaceCopyright.emptyListText"
      size="augmented"
    />
  </DGrid>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import interfaceCopyright from "@/interface-copyright/dictionaryList";

/** components **/
// @ts-ignore
import { DGrid, DTypography } from "@darwin-studio/ui-vue";
import DictionaryItem from "@/components/DictionaryItem";

/**
 * @version 1.0.0
 * @author [Dmitriy Bykov] (https://github.com/d-darwin)
 */
export default defineComponent({
  name: "DictionaryList",

  components: {
    DictionaryItem,
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
});
</script>

<style scoped lang="scss">
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/gaps";

.dictionary-list {
  margin-bottom: calc(-1 * var(--gap-6x));
}

.d-typography {
  text-align: center;
  margin-bottom: var(--gap-6x);
}
</style>

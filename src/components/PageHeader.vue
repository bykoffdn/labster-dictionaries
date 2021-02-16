<template>
  <DGrid tag="header">
    <DTypography size="h1">{{ interfaceCopyright.heading }}</DTypography>

    <div class="new-dictionary-container">
      <DInput
        :value="dictionaryName"
        :placeholder="interfaceCopyright.dictionaryNamePlaceholder"
        @update:value="changeNewDictionaryName"
      />

      <DButton
        :disabled="!dictionaryName ? true : undefined"
        @click="createDictionaryHandler"
      >
        {{ interfaceCopyright.createDictionaryBtnText }}
      </DButton>
    </div>
  </DGrid>

  <DNotification :content="notification" />
</template>

<script>
import { mapState } from "vuex";

/** static data **/
import interfaceCopyright from "../../interface-copyright/pageHeader";

/** mixins **/
import errorHandler from "../../mixins/errorHandler";

/** components **/
import {
  DGrid,
  DTypography,
  DInput,
  DButton,
  DNotification
} from "@darwin-studio/ui-vue";

/**
 * @version 1.0.0
 * @author [Dmitriy Bykov] (https://github.com/d-darwin)
 */
export default {
  name: "PageHeading",

  components: {
    DGrid,
    DTypography,
    DInput,
    DButton,
    DNotification
  },

  mixins: [errorHandler],

  data() {
    return {
      interfaceCopyright,
      dictionaryName: "",
    };
  },

  computed: {
    ...mapState(["dictionaryList"])
  },

  methods: {
    changeNewDictionaryName(e) {
      this.dictionaryName = e.value;
    },

    async createDictionaryHandler() {
      // all consistency checks take place into the store
      try {
        await this.$store.dispatch("createDictionary", {
          name: this.dictionaryName
        });
      } catch (e) {
        // if there any errors it is thrown
        this.errorHandler(e.message);
      }

      // reset new dictionary name
      this.dictionaryName = "";
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/gaps";
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/controls";

.d-typography {
  margin-top: var(--gap-12x);
  grid-column: 1/13;
  text-align: center;
}

.new-dictionary-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.d-input,
.d-button {
  margin-top: var(--gap-6x);
}
</style>

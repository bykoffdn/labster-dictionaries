<template>
  <DGrid tag="header">
    <DTypography size="h1">{{ interfaceCopyright.heading }}</DTypography>

    <div class="new-dictionary-container">
      <DInput
        :value="dictionaryName"
        :error="nameInputError"
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

/** utils **/
import { utils } from "@darwin-studio/ui-vue";

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

  data() {
    return {
      interfaceCopyright,
      dictionaryName: "",
      notification: "",
      nameInputError: ""
    };
  },

  computed: {
    ...mapState(["dictionaryList"])
  },

  methods: {
    changeNewDictionaryName(e) {
      this.nameInputError = "";
      this.dictionaryName = e.value;
    },

    createDictionaryHandler() {
      if (this.dictionaryName) {
        // TODO: each dictionary should have unique name, so need validation

        const hasDuplicateName = this.dictionaryList.find(
          dictionary => dictionary.name === this.dictionaryName
        );

        if (hasDuplicateName) {
          this.notification = "";

          this.$nextTick(() => {
            this.notification = this.nameInputError =
              interfaceCopyright.duplicateDictionaryNameNotification;
          });

          return;
        }

        this.$store.dispatch("createDictionary", {
          name: this.dictionaryName,
          // in real world we would use id from an API
          id: utils.uuid()
        });

        this.dictionaryName = "";
      } else {
        this.notification = "";

        this.$nextTick(() => {
          this.notification = this.nameInputError =
            interfaceCopyright.emptyDictionaryNameNotification;
        });
      }
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

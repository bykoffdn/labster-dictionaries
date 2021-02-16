<template>
  <div class="dictionary-item">
    <DTypography :content="data.name" size="h5" class="heading" />

    <DButton
      type="danger"
      :icon-only="true"
      size="medium"
      class="button-delete"
      @click="showDeleteModalHandler"
    >
      <IconTrash />
    </DButton>

    <DictionaryRow
      v-for="(to, from) in data.rowMap"
      :key="from"
      :from="from"
      :to="to"
      @update-row="updateRowHandler"
      @delete-row="deleteRowHandler"
    />

    <DictionaryRow :create-mode="true" @update-row="createRowHandler" />
  </div>

  <DNotification :content="notification" />

  <DModal
    v-if="isDeleteModalShown"
    :heading="interfaceCopyright.deleteDictionaryModalHeading"
    :content="interfaceCopyright.deleteDictionaryModalText"
    :accept-button-content="interfaceCopyright.deleteDictionaryModalConfirmText"
    :accept-button-props="{ type: 'danger' }"
    @close="showDeleteModalHandler(false)"
    @accept="deleteDictionaryHandler"
  />
</template>

<script>
/** static data **/
import interfaceCopyright from "../../interface-copyright/dictionaryItem";

/** mixins **/
import errorHandler from "../../mixins/errorHandler";

/** components **/
import {
  DTypography,
  DButton,
  DNotification,
  DModal
} from "@darwin-studio/ui-vue";

import DictionaryRow from "@/components/DictionaryRow";
import IconTrash from "@/components/IconTrash";

/**
 * @version 1.0.0
 * @author [Dmitriy Bykov] (https://github.com/d-darwin)
 */
export default {
  name: "DictionaryItem",

  components: {
    IconTrash,
    DictionaryRow,
    DTypography,
    DButton,
    DNotification,
    DModal
  },

  mixins: [errorHandler],

  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      interfaceCopyright,
      isDeleteModalShown: false
    };
  },

  methods: {
    async createRowHandler({ from, to }) {
      // all consistency checks take place into the store
      try {
        await this.$store.dispatch("createDictionaryRow", {
          id: this.data.id,
          from,
          to
        });
      } catch (e) {
        // if there any errors it is thrown
        this.errorHandler(e.message);
      }
    },

    async updateRowHandler({ prevFrom, from, to }) {
      // all consistency checks take place into the store
      try {
        // prevFrom is used to identify which row we are going to update
        // of course in production we should use id, but this is a test project
        await this.$store.dispatch("updateDictionaryRow", {
          id: this.data.id,
          prevFrom,
          from,
          to
        });
      } catch (e) {
        // if there any errors it is thrown
        this.errorHandler(e.message);
      }
    },

    async deleteRowHandler({ from }) {
      // all consistency checks take place into the store
      try {
        await this.$store.dispatch("deleteDictionaryRow", {
          id: this.data.id,
          from
        });
      } catch (e) {
        // if there any errors it is thrown
        this.errorHandler(e.message);
      }
    },

    showDeleteModalHandler(show = true) {
      this.isDeleteModalShown = show;
    },

    async deleteDictionaryHandler() {
      try {
        await this.$store.dispatch("deleteDictionary", { id: this.data.id });
      } catch (e) {
        // if there any errors it is thrown
        this.errorHandler(e.message);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/gaps";
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/colors";
@import "~@darwin-studio/ui-vue/src/assets/styles/mixins/shadows";

.dictionary-item {
  @include shadow-medium;

  margin-bottom: var(--gap-6x);
  background: var(--color-background);
  padding: var(--gap-6x) var(--gap-4x);
  grid-column-end: span 6;
  position: relative;

  &:hover {
    .button-delete {
      visibility: visible;
      opacity: 1;
    }
  }
}

.heading {
  padding-bottom: var(--gap-2x);
  border-bottom: 1px solid var(--color-separator);
  text-align: center;
}

.button-delete {
  position: absolute;
  top: calc(-1 * var(--gap-4x));
  right: calc(-1 * var(--gap-4x));
  visibility: hidden;
  opacity: 0;
  transition: opacity 150ms ease;
}
</style>

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

    <DictionaryRow :create-mode="true" @update-row="addRowHandler" />
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

  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      interfaceCopyright,
      notification: "",
      isDeleteModalShown: false
    };
  },

  methods: {
    addRowHandler({ from, to }) {
      if (from && to) {
        // check for duplicates
        // TODO: move all checks to store ???
        const duplicateRow =
          this.data && this.data.rowMap && this.data.rowMap[from];

        if (duplicateRow) {
          this.notification = "";

          this.$nextTick(() => {
            this.notification = interfaceCopyright.duplicateRowDataNotification;
          });

          return;
        }

        // insert new row
        this.$store.dispatch("createDictionaryRow", {
          id: this.data.id,
          rowData: { from, to }
        });
      } else {
        this.notification = "";

        this.$nextTick(() => {
          this.notification = interfaceCopyright.invalidRowDataNotification;
        });
      }
      console.log("addRowHandler");
    },

    updateRowHandler({ prevFrom, from, to }) {
      console.log("updateRowHandler", prevFrom, from, to);

      if (prevFrom && from && to) {
        // prevFrom is used to identify which row we are going to update
        // of course in production we should use id, but this is a test project
      }
    },

    deleteRowHandler({ from }) {
      console.log("deleteRowHandler", from);

      if (from) {
        // from is used to identify which row we are going to delete
        // of course in production we should use id, but this is a test project
      }
    },

    showDeleteModalHandler(show = true) {
      this.isDeleteModalShown = show;
    },

    deleteDictionaryHandler() {
      this.$store.dispatch("deleteDictionary", { id: this.data.id });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/gaps";
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/colors";
@import "~@darwin-studio/ui-vue/src/assets/styles/mixins/shadows";
@import "~@darwin-studio/ui-vue/src/assets/styles/transitions/opacity";

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

<template>
  <div class="dictionary-item">
    <DTypography :content="data.name" size="h5" class="heading" />

    <DButton
      type="alternative"
      :icon-only="true"
      :title="interfaceCopyright.validateDictionaryBtnTitle"
      size="medium"
      class="button-validate"
      @click="validateDictionaryHandler"
    >
      <IconSearch />
    </DButton>

    <DButton
      type="danger"
      :icon-only="true"
      :title="interfaceCopyright.deleteDictionaryBtnTitle"
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

<script lang="ts">
import { defineComponent, PropType } from "vue";

/** types **/
import Dictionary from "@/models/Dictionary";
import DictionaryRowPayload from "@/models/DictionaryRowPayload";

/** static data **/
import interfaceCopyright from "@/interface-copyright/dictionaryItem";

/** mixins **/
import notificationHandler from "@/mixins/notificationHandler";

/** components **/
import {
  DTypography,
  DButton,
  DNotification,
  DModal
  // @ts-ignore
} from "@darwin-studio/ui-vue";

import DictionaryRow from "@/components/DictionaryRow.vue";
import IconTrash from "@/components/icons/Trash.vue";
import IconSearch from "@/components/icons/Search.vue";

/**
 * @version 1.0.0
 * @author [Dmitriy Bykov] (https://github.com/d-darwin)
 */
export default defineComponent({
  name: "DictionaryItem",

  components: {
    IconSearch,
    IconTrash,
    DictionaryRow,
    DTypography,
    DButton,
    DNotification,
    DModal
  },

  mixins: [notificationHandler],

  props: {
    data: {
      type: Object as PropType<Dictionary>,
      required: true
    }
  },

  data() {
    return {
      interfaceCopyright,
      isDeleteModalShown: false
    };
  },

  methods: {
    async createRowHandler(payload: DictionaryRowPayload) {
      // all consistency checks take place into the store
      try {
        await this.$store.dispatch("createDictionaryRow", {
          id: this.data.id,
          ...payload
        });
      } catch (e) {
        // if there any errors it is thrown
        await this.notificationHandler(e.message);
      }
    },

    async updateRowHandler(payload: DictionaryRowPayload) {
      // all consistency checks take place into the store
      try {
        // prevFrom is used to identify which row we are going to update
        // of course in production we should use id, but this is a test project
        await this.$store.dispatch("updateDictionaryRow", {
          id: this.data.id,
          ...payload
        });
      } catch (e) {
        // if there any errors it is thrown
        await this.notificationHandler(e.message);
      }
    },

    async deleteRowHandler(payload: { from: string }) {
      // all consistency checks take place into the store
      try {
        await this.$store.dispatch("deleteDictionaryRow", {
          id: this.data.id,
          ...payload
        });
      } catch (e) {
        // if there any errors it is thrown
        await this.notificationHandler(e.message);
      }
    },

    validateDictionaryHandler() {
      // we don't actually need this function,
      // because store setup itself doesn't allow inconsistent data

      // to emulate possibility of clones and forks turn rowMap object to an array
      const rowList = Object.entries(this.data.rowMap).map(([key, value]) => {
        return { from: key, to: value };
      });

      // both clones and forks check
      if (this.hasDuplicateFrom(rowList)) {
        this.notificationHandler(interfaceCopyright.validationCheckError);
      } else {
        this.notificationHandler(interfaceCopyright.validationCheckOk);
      }
    },

    hasDuplicateFrom(array: { from: string }[]) {
      // is there the same 'from' values
      // it satisfies both requirements (clone and fork)
      let seenFrom = new Set();
      return array.some(row => {
        // as soon as we find duplicate 'from'
        // the equation below will be true
        return seenFrom.size === seenFrom.add(row.from).size;
      });
    },

    showDeleteModalHandler(show: boolean = true) {
      // such a critical action need to be confirmed
      this.isDeleteModalShown = show;
    },

    async deleteDictionaryHandler() {
      // all consistency checks take place into the store
      try {
        await this.$store.dispatch("deleteDictionary", { id: this.data.id });
      } catch (e) {
        // if there any errors it is thrown
        await this.notificationHandler(e.message);
      }
    }
  }
});
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
    .button-delete,
    .button-validate {
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

.button-delete,
.button-validate {
  position: absolute;
  top: calc(-1 * var(--gap-4x));
  visibility: hidden;
  opacity: 0;
  transition: opacity 150ms ease;
}

.button-delete {
  right: calc(-1 * var(--gap-4x));
}

.button-validate {
  left: calc(-1 * var(--gap-4x));
}
</style>

<template>
  <div class="row">
    <DInput
      :value="innerFrom"
      :placeholder="interfaceCopyright.fromPlaceholder"
      size="medium"
      roundness="boxed"
      @update:value="changeNewRowFrom"
    />

    <DIconArrow />

    <DInput
      :value="innerTo"
      :placeholder="interfaceCopyright.toPlaceholder"
      size="medium"
      roundness="boxed"
      @update:value="changeNewRowTo"
    />

    <div class="buttons-container">
      <DButton
        :type="createMode ? 'primary' : 'alternative'"
        :disabled="
          innerFrom && innerTo && (from !== innerFrom || to !== innerTo)
            ? undefined
            : true
        "
        :icon-only="true"
        :title="
          createMode
            ? interfaceCopyright.createDictionaryRowBtnTitle
            : interfaceCopyright.updateDictionaryRowBtnTitle
        "
        size="medium"
        @click="updateRowHandler"
      >
        <IconPlusMinus v-if="createMode" />
        <IconRefresh v-else />
      </DButton>

      <DButton
        v-if="!createMode"
        type="danger"
        :icon-only="true"
        :title="interfaceCopyright.deleteDictionaryRowBtnTitle"
        size="medium"
        class="button-delete"
        @click="deleteRowHandler"
      >
        <IconPlusMinus :is-minus="true" />
      </DButton>
    </div>
  </div>
</template>

<script>
/** static data **/
import interfaceCopyright from "../interface-copyright/dictionaryRow";

/** components **/
import { DInput, DIconArrow, DButton } from "@darwin-studio/ui-vue";
import IconPlusMinus from "@/components/icons/PlusMinus";
import IconRefresh from "@/components/icons/Refresh";

/**
 * @version 1.0.0
 * @author [Dmitriy Bykov] (https://github.com/d-darwin)
 */
export default {
  name: "DictionaryRow",

  components: {
    IconRefresh,
    IconPlusMinus,
    DInput,
    DIconArrow,
    DButton
  },

  props: {
    from: {
      type: String,
      default: ""
    },

    to: {
      type: String,
      default: ""
    },

    createMode: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      interfaceCopyright,
      innerFrom: this.from,
      innerTo: this.to
    };
  },

  methods: {
    changeNewRowFrom(e) {
      this.innerFrom = e.value;
    },

    changeNewRowTo(e) {
      this.innerTo = e.value;
    },

    updateRowHandler() {
      this.$emit("update-row", {
        prevFrom: this.from,
        from: this.innerFrom,
        to: this.innerTo
      });

      if (this.createMode) {
        this.innerFrom = "";
        this.innerTo = "";
      }
    },

    deleteRowHandler() {
      this.$emit("delete-row", {
        from: this.from
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/gaps";
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/colors";
@import "~@darwin-studio/ui-vue/src/assets/styles/tokens/controls";

.row {
  --control-min-width: var(--gap-24x);

  margin-top: var(--gap-2x);
  display: flex;
  align-items: center;
  position: relative;

  * + * {
    margin-left: var(--gap-base);
  }

  .d-icon-arrow {
    transform: rotate(90deg);
  }

  &:hover {
    .button-delete {
      visibility: visible;
      opacity: 1;
    }
  }
}

.buttons-container {
  display: flex;
  align-items: center;
  min-width: 80px;
}

.button-delete {
  opacity: 0;
  transition: opacity 150ms ease;
}
</style>

<template>
  <div class="icon">
    <div class="horizontal-line" />
    <div :class="{ __collapsed: isMinus }" class="vertical-line" />
  </div>
</template>

<script>
/**
 * Анимированный компонент содержит html-код.<br>
 *
 * @version 1.0.0
 * @author [Dmitriy Bykov] (https://github.com/d-darwin)
 */
export default {
  name: "IconPlusMinus",

  props: {
    /**
     * Определяет состояние компонента.
     */
    isMinus: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="scss">
.icon {
  height: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.horizontal-line {
  height: 2px;
  width: 16px;
  background: currentColor;
}

.vertical-line {
  transition: opacity 150ms ease;

  height: 16px;
  width: 2px;
  background: currentColor;
  position: absolute;

  &.__collapsed {
    height: 2px;
  }
}
</style>

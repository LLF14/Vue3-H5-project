<script setup lang="ts"></script>

<template>
  <van-nav-bar left-arrow fixed placeholder title="注册" right-text="注册" />
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>

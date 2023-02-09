<script setup lang="ts">
/*
  学习目标：cpNavbar组件封装 - 静态结构和代码解读
  步骤：
     1. 
     2. 
     3. 
*/
</script>

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

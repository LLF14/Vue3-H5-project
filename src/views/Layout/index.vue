<script lang="ts" setup>
import { ref } from 'vue'
</script>

<template>
  <router-view></router-view>
  <VanTabbar>
    <van-tabbar-item to="/home">首页</van-tabbar-item>
    <van-tabbar-item to="/article">健康百科</van-tabbar-item>
    <van-tabbar-item to="/notify">消息中心</van-tabbar-item>
    <van-tabbar-item to="/user">我的</van-tabbar-item>
  </VanTabbar>
</template>

<style lang="scss" scoped></style>

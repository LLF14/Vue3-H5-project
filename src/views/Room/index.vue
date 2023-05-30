<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { onMounted } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { onUnmounted } from 'vue'
import { ref } from 'vue'
import type { Message } from '@/types/room'
import { getOrderDetailAPI } from '@/services/consult'
// 参数1：不传默认是当前服务域名，开发中传入服务器地址
// 参数2：配置参数，根据需要再来介绍

const store = useUserStore()
const route = useRoute()

const list = ref<Message[]>([])
let socket: Socket
onMounted(() => {
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.userInfo?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })

  socket.on('connect', () => {
    // 建立连接成功
    console.log('connect')
  })

  socket.on('chatMsgList', ({ data }) => {
    list.value = data[0].items
  })

  // 订单状态 在onMounted注册
  socket.on('statusChange', loadOrderDetail)
})

const loadOrderDetail = async () => {
  const res = await getOrderDetailAPI(route.query.orderId as string)
}

onMounted(loadOrderDetail)

onUnmounted(() => {
  socket.close()
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status></room-status>
    <room-message :list="list"></room-message>
    <room-action></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>

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
import type { ConsultOrderItem, Image } from '@/types/consult'
import { MsgType, OrderType } from '@/enums'
import { nextTick } from 'vue'
import { showToast } from 'vant'
import dayjs from 'dayjs'
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
    loading.value = false
    console.log('chatMsgList', data)

    if (!data.length) {
      finished.value = true
      return showToast('没有更多数据了')
    }
    nextTime.value = data[0].items[0].createTime
    if (!list.value.length) {
      list.value.push(...data[0].items)
      nextTick(() => {
        // 2. 第一次加载后滚动到底部
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      })
    } else {
      list.value.unshift(...data[0].items)
    }
  })

  // 订单状态 在onMounted注册
  socket.on('statusChange', loadOrderDetail)

  // 接收消息 在onMounted注册
  socket.on('receiveChatMsg', (data) => {
    console.log('125', data)
    list.value.push(data)
    nextTick(() => {
      // 2. 第一次加载后滚动到底部
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
  })
})
const finished = ref(false)

const orderDetail = ref<ConsultOrderItem>()
const loadOrderDetail = async () => {
  const res = await getOrderDetailAPI(route.query.orderId as string)
  orderDetail.value = res.data
  console.log(1122, orderDetail.value)
}

onMounted(loadOrderDetail)

onUnmounted(() => {
  socket.close()
})

const onSendText = (text: string) => {
  socket.emit('sendChatMsg', {
    from: store.userInfo?.id,
    to: orderDetail.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
  console.log(text)
  // console.log(orderDetail.value)
}
const onSendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.userInfo?.id,
    to: orderDetail.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 下拉
const loading = ref(false)
const nextTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
  socket.emit('getChatMsgList', 20, nextTime.value, route.query.orderId)
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="orderDetail?.status" :countdown="orderDetail?.countdown"></room-status>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list" />
    </van-pull-refresh>
    <room-action :disabled="false" @send-text="onSendText" @send-image="onSendImage"></room-action>
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

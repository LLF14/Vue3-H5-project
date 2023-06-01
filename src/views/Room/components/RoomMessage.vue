<script setup lang="ts">
import { IllnessTime, MsgType } from '@/enums'
import EvaluateCard from './EvaluateCard.vue'

import type { Message } from '@/types/room'
import type { Image } from '@/types/consult'
import { showImagePreview } from 'vant'
import { getConsultFlagText, getIllnessTimeText } from '@/constants'
import { useUserStore } from '@/stores'
import docImg from '@/assets/avatar-doctor.svg'
import dayjs from 'dayjs'
const formatTime = (time: string) => dayjs(time).format('HH:mm')
defineProps<{ list: Message[] }>()

const onPreview = (pics?: Image[]) => {
  if (!pics || !pics.length) return

  const urlList = pics.map((item) => item.url)
  showImagePreview(urlList)
}
const store = useUserStore()

const onLoad = () => {
  window.scrollTo({ top: document.body.scrollHeight })
}
</script>

<template>
  <div v-for="{ msgType, msg, id, from, createTime } in list" :key="id">
    <!-- 病情描述 - 💥💥注意不能用v-show -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom" v-if="msg.consultRecord">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord!.illnessTime) }} |
          {{ getConsultFlagText(msg.consultRecord!.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="onPreview(msg.consultRecord?.pictures)"> 点击查看 </van-col>
      </van-row>
    </div>
    <!-- 温馨提示 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通用通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>

    <!-- 我发的消息 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.userInfo?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.userInfo?.avatar" />
    </div>

    <!-- 医生发的消息 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.userInfo?.id !== from">
      <van-image :src="docImg" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>

    <!-- 发消息-图片 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && store.userInfo?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" @load="onLoad" />
      </div>
      <van-image :src="store.userInfo?.avatar" />
    </div>

    <!-- 收消息-图片 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && store.userInfo?.id !== from">
      <van-image :src="docImg" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" @load="onLoad" />
      </div>
    </div>
    <!-- 处方 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content" v-if="msg.prescription">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p>原始处方 <van-icon name="arrow"></van-icon></p>
          </div>
          <p>
            {{ msg.prescription.name }} {{ msg.prescription.genderValue }}
            {{ msg.prescription.age }}岁 {{ msg.prescription.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="med in msg.prescription.medicines" :key="med.id">
            <div class="drug">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot">
          <span>购买药品</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
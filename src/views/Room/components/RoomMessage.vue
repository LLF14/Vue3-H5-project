<script setup lang="ts">
import { IllnessTime, MsgType } from '@/enums'
import EvaluateCard from './EvaluateCard.vue'

import type { Message } from '@/types/room'
import type { Image } from '@/types/consult'
import { showImagePreview } from 'vant'
import { getConsultFlagText, getIllnessTimeText } from '@/constants'
defineProps<{ list: Message[] }>()

const onPreview = (pics?: Image[]) => {
  if (!pics || !pics.length) return

  const urlList = pics.map((item) => item.url)
  showImagePreview(urlList)
}
</script>

<template>
  <div v-for="{ msgType, msg, id } in list" :key="id">
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
    <div class="msg msg-tip" v-if="msgType === 31">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>

<script setup lang="ts">
import { getDoctorPageAPI } from '@/services/consult'
import DoctorCard from './DoctorCard.vue'
import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'
import type { Doctor } from '@/types/consult'
import { onMounted } from 'vue'
const { width } = useWindowSize()

const list = ref<Doctor[]>([])
const loadData = async () => {
  const res = await getDoctorPageAPI()
  list.value = res.data.rows
}
onMounted(loadData)

const onFollowById = (id: string) => {
  const index = list.value.findIndex((item) => {
    return item.id === id
  })

  list.value[index].likeFlag = list.value[index].likeFlag ? 0 : 1
}
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe :width="(150 / 375) * width" :showIndicators="false" :loop="false">
        <van-swipe-item v-for="item in list" :key="item.id">
          <DoctorCard :item="item" @followById="onFollowById" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>

<script setup lang="ts">
import { useCancel, useDel, usePreview } from '@/composable'
import { getConsultFlagText, getIllnessTimeText } from '@/constants'
import { OrderType } from '@/enums'
import { getOrderDetailAPI } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import { showToast } from 'vant'
import { watch } from 'vue'
const route = useRoute()
const detail = ref<ConsultOrderItem>()
onMounted(async () => {
  const res = await getOrderDetailAPI(route.params.id as string)
  detail.value = res.data
})

const router = useRouter()
const { loading, onCancel } = useCancel()
const { delLoading, onDel } = useDel(() => router.back())
const { onPreviewImg } = usePreview()

const show = ref(false)

const { copy, copied, isSupported } = useClipboard()
const onCopy = () => {
  if (!isSupported.value) return showToast('未授权，不支持')
  copy(detail.value!.orderNo)
}
watch(copied, () => {
  if (copied.value) showToast('已复制')
})
</script>

<template>
  <div class="consult-detail-page" v-if="detail">
    <cp-nav-bar title="问诊详情" />
    <div class="detail-head">
      <div class="text">
        <h3>图文问诊 {{ detail.payment }} 元</h3>
        <span
          class="sta"
          :class="{
            orange: detail.status === OrderType.ConsultPay,
            green: detail.status === OrderType.ConsultChat
          }"
          >{{ detail.statusValue }}</span
        >
        <p class="tip">服务医生信息</p>
      </div>
      <div class="card">
        <img class="avatar" src="@/assets/avatar-doctor.svg" alt="" />
        <p class="doc">
          <span>极速问诊</span>
          <span>{{ detail.docInfo?.name }}</span>
        </p>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="detail-patient">
      <van-cell-group :border="false">
        <van-cell
          title="患者信息"
          :value="`${detail.patientInfo.name} | ${detail.patientInfo.genderValue} | ${detail.patientInfo.age}岁`"
        />
        <van-cell title="患病时长" :value="getIllnessTimeText(detail.illnessTime)" />
        <van-cell title="就诊情况" :value="getConsultFlagText(detail.consultFlag)" />
        <van-cell title="病情描述" :label="detail.illnessDesc" />
      </van-cell-group>
    </div>
    <div class="detail-order">
      <h3>订单信息</h3>
      <van-cell-group :border="false">
        <van-cell title="订单编号">
          <template #value>
            <span class="copy" @click="onCopy">复制</span>
            {{ detail.orderNo }}
          </template>
        </van-cell>
        <van-cell title="创建时间" :value="detail.createTime" />
        <van-cell title="应付款" :value="`￥${detail.payment}`" />
        <van-cell title="优惠券" :value="`-￥${detail.couponDeduction}`" />
        <van-cell title="积分抵扣" :value="`-￥${detail.pointDeduction}`" />
        <van-cell title="实付款" :value="`￥${detail.payment}`" class="price" />
      </van-cell-group>
    </div>
    <div class="detail-time" v-if="detail.status === OrderType.ConsultPay">
      请在
      <van-count-down :time="detail.countdown * 1000" /> 内完成支付，超时订单将取消
    </div>
    <div class="detail-action van-hairline--top" v-if="detail.status === OrderType.ConsultPay">
      <div class="price">
        <span>需付款</span>
        <span>￥{{ detail.actualPayment.toFixed(2) }}</span>
      </div>
      <van-button type="default" round @click="onCancel(detail!)" :loading="loading"
        >取消问诊</van-button
      >
      <van-button type="primary" round @click="show = !show">继续支付</van-button>
    </div>
    <div class="detail-action van-hairline--top" v-if="detail.status === OrderType.ConsultWait">
      <van-button type="default" round @click="onCancel(detail!)" :loading="loading"
        >取消问诊</van-button
      >
      <van-button type="primary" round :to="`/room?orderId=${detail.id}`">继续沟通</van-button>
    </div>
    <div class="detail-action van-hairline--top" v-if="detail.status === OrderType.ConsultChat">
      <van-button type="default" round v-if="detail.prescriptionId">查看处方</van-button>
      <van-button type="primary" round :to="`/room?orderId=${detail.id}`">继续沟通</van-button>
    </div>
    <div class="detail-action van-hairline--top" v-if="detail.status === OrderType.ConsultComplete">
      <cp-consult-more
        :disabled="!detail.prescriptionId"
        @on-del="onDel(detail!.id)"
        @on-preview="onPreviewImg(detail?.prescriptionId!)"
      ></cp-consult-more>
      <van-button type="default" round :to="`/room?orderId=${detail.id}`">问诊记录</van-button>
      <van-button type="primary" round v-if="detail.evaluateId">写评价</van-button>
      <van-button type="default" round v-else>查看评价</van-button>
    </div>
    <div class="detail-action van-hairline--top" v-if="detail.status === OrderType.ConsultCancel">
      <van-button type="default" round @click="onDel(detail!.id)" :loading="delLoading"
        >删除订单</van-button
      >
      <van-button type="primary" round to="/">咨询其他医生</van-button>
    </div>
    <cp-pay-sheet
      v-model:show="show"
      pay-callback="http://localhost:5173/room"
      :order-id="detail.id"
    />
  </div>
  <div class="consult-detail-page" v-else>
    <cp-nav-bar title="问诊详情" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
  </div>
</template>

<style lang="scss" scoped>
.detail-head {
  height: 140px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 135px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0), rgba(44, 181, 165, 0.2));
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;
  }
  padding: 15px;
  .text {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 3px;
    .sta {
      color: var(--cp-tag);
      font-weight: 500;
      font-size: 16px;
      &.green {
        color: var(--cp-primary);
      }
      &.orange {
        color: #f2994a;
      }
    }
    .tip {
      width: 100%;
      color: var(--cp-text3);
      margin-top: 5px;
    }
  }
  .card {
    height: 74px;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    .avatar {
      width: 38px;
      height: 38px;
    }
    .doc {
      flex: 1;
      padding-left: 15px;
      > span {
        display: block;
        font-size: 16px;
        &:last-child {
          font-size: 13px;
          color: var(--cp-text3);
        }
      }
    }
    .van-icon {
      color: var(--cp-tip);
    }
  }
}
.detail-patient {
  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
  }
}
.detail-order {
  > h3 {
    padding: 10px 18px;
    font-weight: normal;
  }
  .copy {
    padding: 2px 10px;
    border: 1px solid var(--cp-primary);
    background-color: var(--cp-plain);
    color: var(--cp-primary);
    font-size: 12px;
    border-radius: 12px;
    margin-right: 10px;
  }
  :deep(.van-cell__title) {
    width: 70px;
    flex: none;
  }
  .price :deep(.van-cell__value) {
    font-size: 16px;
    color: var(--cp-price);
  }
}
.detail-action {
  height: 65px;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: flex-end;
  padding: 0 15px;
  box-sizing: border-box;
  .price {
    flex: 1;
    > span:last-child {
      font-size: 18px;
      color: var(--cp-price);
      padding-left: 5px;
    }
  }
  .van-button {
    margin-left: 10px;
    padding-left: 17px;
    padding-right: 17px;
  }
  :deep(.van-button--default) {
    background-color: var(--cp-bg);
    color: var(--cp-text3);
  }
}
.van-cell {
  padding-left: 18px;
  padding-right: 18px;
}
.detail-time {
  position: fixed;
  left: 0;
  bottom: 65px;
  width: 100%;
  height: 44px;
  background-color: #fff7eb;
  text-align: center;
  line-height: 44px;
  font-size: 13px;
  color: #f2994a;
  .van-count-down {
    display: inline;
    color: #f2994a;
  }
}
</style>

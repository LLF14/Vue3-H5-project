<script setup lang="ts">
import { consultPayApi, createOrderAPI, getPatientDetail, getPreOrderAPI } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { OrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { showToast } from 'vant'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'
const store = useConsultStore()

const patient = ref<Patient>()
const payInfo = ref<OrderPreData>()
// 患者信息
const onLoaddDetails = async () => {
  if (!store.consult.patientId) return showToast('')
  const res = await getPatientDetail(store.consult.patientId)
  console.log('onLoaddDetails', res)
  patient.value = res.data
}
// 订单信息
const getLoadOrder = async () => {
  const res = await getPreOrderAPI({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  console.log('getLoadOrder', res)
  payInfo.value = res.data
}
const router = useRouter()
onMounted(() => {
  if (!store.isNotEmpty) {
    showToast('问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付')
    router.push('/')
    return
  }
  onLoaddDetails()
  getLoadOrder()
})

onBeforeRouteLeave(() => {
  if (!store.isNotEmpty) {
    return true
  }
  return false
})

const agree = ref(false) //同意协议
const isshow = ref(false) //选择支付弹窗
const paymentMethod = ref<0 | 1>(1) //0微信 1支付宝
const loading = ref(false) //防抖
const orderId = ref('')
const onNext = async () => {
  if (!agree.value) return showToast('请先同意支付协议')
  isshow.value = !isshow.value
  loading.value = true
  const res = await createOrderAPI(store.consult)
  store.clear() //清除信息防止重复生成订单
  orderId.value = res.data.id
}

const onPay = async () => {
  const res = await consultPayApi({
    orderId: orderId.value,
    paymentMethod: paymentMethod.value,
    payCallback: 'http://localhost:5173/room'
  })

  window.location.href = res.data.payUrl
}
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <van-submit-bar
      :loading="loading"
      @click="onNext()"
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
    />
    <van-action-sheet
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
      v-model:show="isshow"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo?.payment }}元</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block @click="onPay()">立即支付</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 0 0 50px;
}

.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}

.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}

.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}

::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}

.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>

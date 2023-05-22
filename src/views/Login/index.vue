<script setup lang="ts">
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { useRouter } from 'vue-router'
import { showSuccessToast, showToast } from 'vant'
import { onUnmounted, ref } from 'vue'
import { codeLoginAPI, loginAPI, sendCodeAPI } from '@/services/user'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
const router = useRouter()
const store = useUserStore()
const mobile = ref('13230000001')
const password = ref('abc12345')
const isShow = ref(true)

const agree = ref(false)
const onsubmit = async () => {
  if (!agree.value) {
    showToast('请勾选用户协议')
    return
  }
  const res = isPass.value
    ? await loginAPI(mobile.value, password.value)
    : await codeLoginAPI(mobile.value, code.value)
  // localStorage.setItem('userData', JSON.stringify(res.data))
  if (res.data) {
    store.saveUser(res.data)
    console.log(res)
    showSuccessToast('登录成功')
    router.push('/')
  } else {
    // @ts-ignore
    showToast(res.message)
  }
}

const isPass = ref(true)
const onSend = () => {
  isPass.value = !isPass.value
}

const send = ref(0)
const code = ref('')
let timerId: number
const onSendCode = async () => {
  send.value = 60
  const res = await sendCodeAPI(mobile.value)
  // @ts-ignore
  showToast(res.message)
  timerId = setInterval(() => {
    send.value--
    console.log('定时器')
    if (send.value === 0) clearInterval(timerId)
  }, 1000)
}
onUnmounted(() => {
  clearInterval(timerId)
})
</script>

<template>
  <div class="login-page">
    <cp-nav-bar right-text="注册"></cp-nav-bar>
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="onSend()">
        <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- form 表单 -->
    <van-form autocomplete="off" @submit="onsubmit()">
      <van-field
        placeholder="请输入手机号"
        type="tel"
        :rules="mobileRules"
        v-model="mobile"
      ></van-field>
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        :type="isShow ? 'password' : 'text'"
        v-model="password"
        :rules="passwordRules"
      >
        <template #button>
          <CpIcon
            :name="isShow ? 'login-eye-off' : 'login-eye-on'"
            @click="isShow = !isShow"
          ></CpIcon>
        </template>
      </van-field>
      <van-field
        placeholder="短信验证码"
        v-if="!isPass"
        v-model="code"
        :rules="codeRules"
        type="number"
      >
        <template #button>
          <!-- <span>获取验证码</span> -->
          <!-- <van-button :disabled="send != 0" @click="onSendCode()">{{
            send === 0 ? '获取验证码' : `${send}s重新获取验证码`
          }}</van-button> -->
          <span class="sand-code" v-show="send === 0" @click="onSendCode()"
            >获取验证码</span
          >
          <span v-show="send != 0">{{ `${send}s重新获取` }}</span>
        </template>
      </van-field>

      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>

    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}

.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .sand-code {
    color: var(--cp-primary);
  }
}
</style>

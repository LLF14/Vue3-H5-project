import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 登陆成功的用户数据
    const userInfo = ref<User>()
    //    保存
    const saveUser = (data: User) => {
      userInfo.value = data
    }
    //   清空
    const delUser = () => {
      userInfo.value = undefined
    }

    return { userInfo, saveUser, delUser }
  },
  {
    persist: true
  }
)

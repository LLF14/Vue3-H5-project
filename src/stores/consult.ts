import { defineStore } from 'pinia'
import type { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 💥💥 全部可选是因为信息是一点一点累加上去的
    /** 用以收集用户选择的对象 */
    const consult = ref<PartialConsult>({})
    // 设置问诊类型
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 设置极速问诊类型
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 设置科室
    const setDep = (id: string) => (consult.value.depId = id)

    return { consult, setType, setIllnessType, setDep }
  },
  {
    persist: true
  }
)

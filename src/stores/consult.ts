import { defineStore } from 'pinia'
import type { ConsultType } from '@/enums'
import type { ConsultIllness, PartialConsult } from '@/types/consult'
import { ref } from 'vue'
import { computed } from 'vue'

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

    const setIllness = (formData: ConsultIllness) => {
      consult.value.illnessDesc = formData.illnessDesc
      consult.value.illnessTime = formData.illnessTime
      consult.value.consultFlag = formData.consultFlag
      consult.value.pictures = formData.pictures
    }

    const setPatinetId = (id: string) => (consult.value.patientId = id)

    // 清除
    const clear = () => [(consult.value = {})]

    const isNotEmpty = computed(() => {
      return (
        consult.value.illnessDesc ||
        consult.value.illnessType ||
        consult.value.consultFlag !== undefined
      )
    })
    return { consult, setType, setIllnessType, setDep, setIllness, setPatinetId, clear, isNotEmpty }
  },
  {
    persist: true
  }
)

<script setup lang="ts">
import { ref } from 'vue'
import ConsultItem from './ConsultItem.vue'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { getOrderRecordsAPI } from '@/services/consult'
import type { ConsultType } from '@/enums'

interface Props {
  type: ConsultType
}
const props = defineProps<Props>()
const list = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const total = ref(9999)
const current = ref(1)

const finished = ref(false)

const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: current.value,
  pageSize: 5
})
const onLoad = async () => {
  const res = await getOrderRecordsAPI(params.value)
  list.value.push(...res.data.rows)
  total.value = res.data.total
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}

const onDel = (id: string) => [
  (list.value = list.value.filter((item) => {
    return item.id != id
  }))
]
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      @load="onLoad"
      :finished="list.length >= total"
      finished-text="没有更多数据了"
    >
      <consult-item v-for="item in list" :key="item.id" :item="item" @on-del="onDel" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>

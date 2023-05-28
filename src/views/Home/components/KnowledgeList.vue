<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import { getKnowledgePageAPI } from '@/services/consult'
import type { KnowledgeType, Knowledge, KnowledgeParams } from '@/types/consult'

const list = ref<Knowledge[]>([])
const loading = ref(false)
// const finished = ref(false)
const total = ref(9999999)

const props = defineProps<{ type: KnowledgeType }>()
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
const onLoad = async () => {
  const res = await getKnowledgePageAPI(params.value)
  params.value.current++
  loading.value = false
  list.value.push(...res.data.rows)
  total.value = res.data.total
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      @load="onLoad"
      v-model:loading="loading"
      :finished="list.length >= total"
      finished-text="我们也是有底线的哦 (#^.^#)"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>

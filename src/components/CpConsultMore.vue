<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ disabled?: boolean }>()
// 💥💥注意：使用计算属性，props.disabled刚开始可能为undefined
const actions = computed(() => [
  { text: '查看处方', disabled: props.disabled },
  { text: '删除订单' }
])

interface Emits {
  (name: 'on-del'): void
  (name: 'on-preview'): void
}
const emit = defineEmits<Emits>()
const onSelect = (actions: any, index: number) => {
  if (index === 0) emit('on-preview')
  if (index === 1) emit('on-del')
}
</script>

<template>
  <div class="cp-consult-more">
    <van-popover placement="top-start" :actions="actions" @select="onSelect">
      <template #reference> 更多 </template>
    </van-popover>
  </div>
</template>

<style lang="scss" scoped>
.cp-consult-more {
  flex: 1;
  color: var(--cp-tag);
}
</style>

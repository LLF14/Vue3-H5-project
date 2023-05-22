<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  rightText?: string
  onBack?: () => void
}
const props = defineProps<Props>()
const router = useRouter()

type Emits = {
  (name: 'click-right'): void
}
const emit = defineEmits<Emits>()
const clickLeft = () => {
  if (props.onBack) {
    props.onBack()
    return
  }
  router.back()
}
</script>

<template>
  <div>
    <VanNavBar
      left-arrow
      fixed
      placeholder
      :title="title"
      :right-text="rightText"
      @click-left="clickLeft()"
      @click-right="emit('click-right')"
    ></VanNavBar>
  </div>
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>

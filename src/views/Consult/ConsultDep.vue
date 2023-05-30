<script setup lang="ts">
import { getAllDepAPI } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { SubDep, TopDep } from '@/types/consult'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'

const list = ref<TopDep[]>([])

const loadData = async () => {
  const res = await getAllDepAPI()
  list.value = res.data
}

onMounted(loadData)

const active = ref(0)
const sublist = computed<SubDep[]>(() => {
  return list.value[active.value]?.child || []
})

const store = useConsultStore()
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="item in list" :key="item.id" :title="item.name" />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="item in sublist"
          :key="item.id"
          @click="store.setDep(item.id)"
          >{{ item.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
</style>

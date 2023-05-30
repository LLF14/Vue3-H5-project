<script setup lang="ts">
import { IllnessTime } from '@/enums'
import { ref } from 'vue'
import type { ConsultIllness } from '@/types/consult'
import { uploadImageAPI } from '@/services/consult'

import { showConfirmDialog, showToast, type UploaderFileListItem } from 'vant'
import { computed } from 'vue'
import { useConsultStore } from '@/stores'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { flagOptions, timeOptions } from '@/constants'
const fileList = ref<UploaderFileListItem[]>([])

const store = useConsultStore()
const router = useRouter()

const formData = ref<ConsultIllness>({
  pictures: []
})
const onAfterRead = async (item: UploaderFileListItem | UploaderFileListItem[]) => {
  if (Array.isArray(item)) return
  if (!item.file) return
  // 开始上传
  item.status = 'uploading'
  item.message = '上传中...'
  try {
    const res = await uploadImageAPI(item.file)
    item.status = 'done'
    item.message = ''
    item.url = res.data.url
    formData.value.pictures?.push(res.data)
  } catch (error) {
    item.status = 'failed'
    item.message = '上传失败'
  }
}
const onDel = (item: UploaderFileListItem) => {
  formData.value.pictures = formData.value.pictures?.filter((_item) => {
    return _item.url != item.url
  })
}

const disabled = computed(() => {
  return (
    !formData.value.illnessDesc ||
    formData.value.illnessTime === undefined ||
    formData.value.consultFlag === undefined
  )
})

const onNext = () => {
  if (!formData.value.illnessDesc) return showToast('请输入病情描述')
  if (formData.value.illnessTime === undefined) return showToast('请选择症状持续时间')
  if (formData.value.consultFlag === undefined) return showToast('请选择是否已经就诊过')
  store.setIllness(formData.value)
  // 跳转档案管理（复用），需要根据 isSelect 实现选择功能
  router.push('/user/patient?isSelect=1')
}

// 回显数据
onMounted(() => {
  if (store.consult.illnessDesc) {
    console.log('112290', store.consult)
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢？',
      confirmButtonColor: 'var(--cp-primary)',
      closeOnPopstate: false
    }).then(() => {
      // 确认
      const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
      formData.value = { illnessDesc, illnessTime, consultFlag, pictures }
      // 图片回显
      fileList.value = pictures || []
    })
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
  </div>

  <!-- 医生提示 -->
  <div class="illness-tip van-hairline--bottom">
    <img class="img" src="@/assets/avatar-doctor.svg" />
    <div class="info">
      <p class="tit">在线医生</p>
      <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
      <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
    </div>
  </div>

  <!-- 表单 -->
  <div class="illness-form">
    <van-field
      type="textarea"
      rows="3"
      placeholder="请详细描述您的病情，病情描述不能为空"
      v-model="formData.illnessDesc"
    />
    <div class="item">
      <p>本次患病多久了？</p>
      <cp-radio-btn :options="timeOptions" v-model="formData.illnessTime" />
    </div>
    <div class="item">
      <p>此次病情是否去医院就诊过？</p>
      <cp-radio-btn :options="flagOptions" v-model="formData.consultFlag" />
    </div>

    <!-- 图片上传区域 -->
    <div class="illness-img">
      <van-uploader
        v-model="fileList"
        :after-read="onAfterRead"
        @delete="onDel"
        max-count="9"
        :max-size="5 * 1024 * 1024"
        upload-icon="photo-o"
        upload-text="上传图片"
      />
      <p class="tip" v-show="!fileList.length">上传内容仅医生可见,最多9张图,最大5MB</p>
    </div>

    <van-button @click="onNext()" :class="{ disabled }" type="primary" block round
      >下一步</van-button
    >
  </div>
</template>

<style lang="scss" scoped>
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}

.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}

.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}

.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>

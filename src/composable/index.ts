import { OrderType } from '@/enums'
import { cancelOrderAPI, delOrderAPI, getPrescriptionPicAPI } from '@/services/consult'
import { getMedicalOrderDetailAPI } from '@/services/order'
import type { ConsultOrderItem } from '@/types/consult'
import type { OrderDetail } from '@/types/order'
import { showImagePreview, showToast } from 'vant'
import { onMounted } from 'vue'
import { ref } from 'vue'

// 封装查看处方逻辑
export const usePreview = () => {
  const onPreviewImg = async (id: string) => {
    const res = await getPrescriptionPicAPI(id)
    showImagePreview([res.data.url])
  }
  return { onPreviewImg }
}

export const useCancel = () => {
  const loading = ref(false)
  const onCancel = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      await cancelOrderAPI(item.id)
      showToast('取消成功')
      item.status = OrderType.ConsultCancel
      item.statusValue = '取消订单'
      loading.value = false
    } catch (error) {
      loading.value = false
      showToast('取消失败')
    }
  }
  return { onCancel, loading }
}

export const useDel = (fn: any) => {
  const delLoading = ref(false)
  const onDel = async (id: string) => {
    try {
      delLoading.value = true
      await delOrderAPI(id)
      delLoading.value = false
      fn()
      showToast('删除成功')
    } catch (error) {
      showToast('删除失败')
      delLoading.value = false
    }
  }
  return { delLoading, onDel }
}

export const useOrderDetail = (id: string) => {
  const order = ref<OrderDetail>()
  onMounted(async () => {
    const res = await getMedicalOrderDetailAPI(id)
    order.value = res.data
  })
  return { order }
}

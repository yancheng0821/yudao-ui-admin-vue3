<template>
  <Dialog
    v-model="dialogVisible"
    :max-height="500"
    :scroll="true"
    :title="t('operatelog.detail')"
    width="800"
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item :label="t('operatelog.logId')" min-width="120">
        {{ detailData.id }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.traceId')" v-if="detailData.traceId">
        {{ detailData.traceId }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.operatorId')">
        {{ detailData.userId }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.operatorName')">
        {{ detailData.userName }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.operationIp')">
        {{ detailData.userIp }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.userAgent')">
        {{ detailData.userAgent }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.module')">
        {{ detailData.type }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.operationName')">
        {{ detailData.subType }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.operationContent')">
        {{ detailData.action }}
      </el-descriptions-item>
      <el-descriptions-item v-if="detailData.extra" :label="t('operatelog.extraParams')">
        {{ detailData.extra }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.requestUrl')">
        {{ detailData.requestMethod }} {{ detailData.requestUrl }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.operationTime')">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('operatelog.bizId')">
        {{ detailData.bizId }}
      </el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import * as OperateLogApi from '@/api/system/operatelog'

defineOptions({ name: 'SystemOperateLogDetail' })

const { t } = useI18n() // 国际化

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const detailData = ref({} as OperateLogApi.OperateLogVO) // 详情数据

/** 打开弹窗 */
const open = async (data: OperateLogApi.OperateLogVO) => {
  dialogVisible.value = true
  // 设置数据
  detailLoading.value = true
  try {
    detailData.value = data
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<template>
  <doc-alert :title="t('sms.logTitle')" url="https://doc.iocoder.cn/sms/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item :label="t('sms.mobile')" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          :placeholder="t('sms.pleaseInputMobile')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item :label="t('sms.channel')" prop="channelId">
        <el-select
          v-model="queryParams.channelId"
          :placeholder="t('sms.pleaseSelectChannel')"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="channel in channelList"
            :key="channel.id"
            :value="channel.id"
            :label="
              channel.signature +
              `【 ${getDictLabel(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE, channel.code)}】`
            "
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('sms.templateId')" prop="templateId">
        <el-input
          v-model="queryParams.templateId"
          :placeholder="t('sms.pleaseInputTemplateId')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item :label="t('sms.sendStatus')" prop="sendStatus">
        <el-select
          v-model="queryParams.sendStatus"
          :placeholder="t('sms.pleaseSelectSendStatus')"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_SMS_SEND_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('sms.sendTime')" prop="sendTime">
        <el-date-picker
          v-model="queryParams.sendTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          :start-placeholder="t('common.startTimeText')"
          :end-placeholder="t('common.endTimeText')"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item :label="t('sms.receiveStatus')" prop="receiveStatus">
        <el-select
          v-model="queryParams.receiveStatus"
          :placeholder="t('sms.pleaseSelectReceiveStatus')"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('sms.receiveTime')" prop="receiveTime">
        <el-date-picker
          v-model="queryParams.receiveTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          :start-placeholder="t('common.startTimeText')"
          :end-placeholder="t('common.endTimeText')"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"
          ><Icon icon="ep:search" class="mr-5px" /> {{ t('common.query') }}</el-button
        >
        <el-button @click="resetQuery"
          ><Icon icon="ep:refresh" class="mr-5px" /> {{ t('common.reset') }}</el-button
        >
        <el-button
          plain
          type="info"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['system:sms-log:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> {{ t('common.export') }}
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column :label="t('sms.mobile')" align="center" prop="mobile" width="120" />
      <el-table-column :label="t('sms.channel')" align="center" prop="channelId" width="120">
        <template #default="scope">
          <span v-for="channel in channelList" :key="channel.id">
            <span v-if="channel.id === scope.row.channelId">
              {{ channel.signature }}
              【{{ getDictLabel(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE, channel.code) }}】
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('sms.templateId')" align="center" prop="templateId" width="80" />
      <el-table-column
        :label="t('sms.templateContent')"
        align="center"
        prop="templateContent"
        width="300"
      />
      <el-table-column :label="t('sms.sendStatus')" align="center" prop="sendStatus" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_SEND_STATUS" :value="scope.row.sendStatus" />
        </template>
      </el-table-column>
      <el-table-column :label="t('sms.sendTime')" align="center" prop="sendTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.sendTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('sms.receiveStatus')"
        align="center"
        prop="receiveStatus"
        width="180"
      >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS" :value="scope.row.receiveStatus" />
        </template>
      </el-table-column>
      <el-table-column :label="t('sms.receiveTime')" align="center" prop="receiveTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.receiveTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('sms.templateType')" align="center" prop="templateType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE" :value="scope.row.templateType" />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.action')"
        align="center"
        fixed="right"
        class-name="fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row)"
            v-hasPermi="['system:sms-log:query']"
          >
            {{ t('common.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：详情 -->
  <SmsLogDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as SmsChannelApi from '@/api/system/sms/smsChannel'
import * as SmsLogApi from '@/api/system/sms/smsLog'
import SmsLogDetail from './SmsLogDetail.vue'

defineOptions({ name: 'SystemSmsLog' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  channelId: null,
  templateId: null,
  mobile: '',
  sendStatus: null,
  receiveStatus: null,
  sendTime: [],
  receiveTime: []
})
const exportLoading = ref(false) // 导出的加载中
const channelList = ref([]) // 短信渠道列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SmsLogApi.getSmsLogPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await SmsLogApi.exportSmsLog(queryParams)
    download.excel(data, t('sms.logExportFileName'))
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: SmsLogApi.SmsLogVO) => {
  detailRef.value.open(data)
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 加载渠道列表
  channelList.value = await SmsChannelApi.getSimpleSmsChannelList()
})
</script>

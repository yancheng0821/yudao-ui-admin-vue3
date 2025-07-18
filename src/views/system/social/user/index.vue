<template>
  <doc-alert :title="t('social.userTitle')" url="https://doc.iocoder.cn/social-user/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="120px"
    >
      <el-form-item :label="t('social.socialType')" prop="type">
        <el-select
          v-model="queryParams.type"
          class="!w-240px"
          clearable
          :placeholder="t('social.pleaseSelectType')"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_SOCIAL_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('social.nickname')" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          class="!w-240px"
          clearable
          :placeholder="t('social.pleaseInputNickname')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="t('social.openid')" prop="openid">
        <el-input
          v-model="queryParams.openid"
          class="!w-240px"
          clearable
          :placeholder="t('social.pleaseInputOpenid')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="t('common.createTime')" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          :end-placeholder="t('common.endTimeText')"
          :start-placeholder="t('common.startTimeText')"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          {{ t('common.query') }}
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column :label="t('social.socialType')" align="center" prop="type" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SOCIAL_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column :label="t('social.openid')" align="center" prop="openid" width="300" />
      <el-table-column :label="t('social.token')" align="center" prop="token" width="300" />
      <el-table-column :label="t('social.nickname')" align="center" prop="nickname" width="100" />
      <el-table-column :label="t('social.avatar')" align="center" prop="avatar" width="80">
        <template #default="scope">
          <img :src="scope.row.avatar" style="width: 40px; height: 40px" />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.createTime')"
        :formatter="dateFormatter"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column
        :label="t('common.action')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row)"
            v-hasPermi="['system:social-user:query']"
          >
            {{ t('common.detail') }}
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['system:social-user:delete']"
          >
            {{ t('common.delete') }}
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
  <SocialUserDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as SocialUserApi from '@/api/system/social/user'
import SocialUserDetail from './SocialUserDetail.vue'

defineOptions({ name: 'SystemSocialUser' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: undefined,
  nickname: undefined,
  openid: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SocialUserApi.getSocialUserPage(queryParams)
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

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: SocialUserApi.SocialUserVO) => {
  detailRef.value.open(data)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SocialUserApi.deleteSocialUser(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

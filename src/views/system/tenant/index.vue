<template>
  <doc-alert :title="t('menu.tenant')" url="https://doc.iocoder.cn/saas-tenant/" />

  <!-- 搜索 -->
  <ContentWrap>
    <el-form
      :key="locale"
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item :label="t('tenant.name')" prop="name">
        <el-input
          v-model="queryParams.name"
          :placeholder="t('tenant.pleaseInput') + t('tenant.name')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item :label="t('tenant.contactName')" prop="contactName">
        <el-input
          v-model="queryParams.contactName"
          :placeholder="t('tenant.pleaseInput') + t('tenant.contactName')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item :label="t('tenant.contactMobile')" prop="contactMobile">
        <el-input
          v-model="queryParams.contactMobile"
          :placeholder="t('tenant.pleaseInput') + t('tenant.contactMobile')"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item :label="t('tenant.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="t('tenant.pleaseSelect') + t('tenant.status')"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="t('commonStatus.' + dict.value)"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('tenant.createTime')" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          :start-placeholder="t('tenant.startDate')"
          :end-placeholder="t('tenant.endDate')"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          {{ t('tenant.search') }}
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          {{ t('tenant.reset') }}
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['system:tenant:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          {{ t('tenant.create') }}
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['system:tenant:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          {{ t('tenant.export') }}
        </el-button>
        <el-button
          type="danger"
          plain
          :disabled="checkedIds.length === 0"
          @click="handleDeleteBatch"
          v-hasPermi="['system:tenant:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          {{ t('tenant.batchDelete') }}
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      :key="locale"
      v-loading="loading"
      :data="list"
      @selection-change="handleRowCheckboxChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :label="t('tenant.id')" align="center" prop="id" />
      <el-table-column :label="t('tenant.name')" align="center" prop="name" />
      <el-table-column :label="t('tenant.package')" align="center" prop="packageId">
        <template #default="scope">
          <el-tag v-if="scope.row.packageId === 0" type="danger">{{
            t('tenant.systemTenant')
          }}</el-tag>
          <template v-else v-for="item in packageList">
            <el-tag type="success" :key="item.id" v-if="item.id === scope.row.packageId">
              {{ item.name }}
            </el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="t('tenant.contactName')" align="center" prop="contactName" />
      <el-table-column :label="t('tenant.contactMobile')" align="center" prop="contactMobile" />
      <el-table-column :label="t('tenant.accountCount')" align="center" prop="accountCount">
        <template #default="scope">
          <el-tag>{{ scope.row.accountCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('tenant.expireTime')"
        align="center"
        prop="expireTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column :label="t('tenant.website')" align="center" prop="website" width="180" />
      <el-table-column :label="t('tenant.status')" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('tenant.createTime')"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column :label="t('tenant.actions')" align="center" min-width="110" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['system:tenant:update']"
          >
            {{ t('tenant.edit') }}
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['system:tenant:delete']"
          >
            {{ t('tenant.delete') }}
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

  <!-- 表单弹窗：添加/修改 -->
  <TenantForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as TenantApi from '@/api/system/tenant'
import * as TenantPackageApi from '@/api/system/tenantPackage'
import TenantForm from './TenantForm.vue'

defineOptions({ name: 'SystemTenant' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  contactName: undefined,
  contactMobile: undefined,
  status: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const packageList = ref([] as TenantPackageApi.TenantPackageVO[]) //租户套餐列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TenantApi.getTenantPage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await TenantApi.deleteTenant(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: TenantApi.TenantVO[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起批量删除
    await TenantApi.deleteTenantList(checkedIds.value)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await TenantApi.exportTenant(queryParams)
    download.excel(data, '租户列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 获取租户套餐列表
  packageList.value = await TenantPackageApi.getTenantPackageList()
})
</script>

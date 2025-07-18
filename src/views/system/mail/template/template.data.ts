import type { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { dateFormatter } from '@/utils/formatTime'
import { TableColumn } from '@/types/table'
import * as MailAccountApi from '@/api/system/mail/account'

const { t } = useI18n() // 国际化

// 邮箱账号的列表
const accountList = await MailAccountApi.getSimpleMailAccountList()

// 表单校验
export const rules = reactive({
  name: [{ required: true, message: t('mail.templateNameRequired'), trigger: 'blur' }],
  code: [{ required: true, message: t('mail.templateCodeRequired'), trigger: 'blur' }],
  accountId: [{ required: true, message: t('mail.accountIdRequired'), trigger: 'change' }],
  label: [{ required: true, message: t('mail.templateTitleRequired'), trigger: 'blur' }],
  content: [{ required: true, message: t('mail.templateContentRequired'), trigger: 'blur' }],
  params: [{ required: true, message: t('mail.templateParamsRequired'), trigger: 'blur' }],
  status: [{ required: true, message: t('mail.statusRequired'), trigger: 'change' }]
})

// CrudSchema：https://doc.iocoder.cn/vue3/crud-schema/
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: t('mail.templateCode'),
    field: 'code',
    isSearch: true,
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: t('mail.templateName'),
    field: 'name',
    isSearch: true,
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: t('mail.templateTitle'),
    field: 'title'
  },
  {
    label: t('mail.templateContent'),
    field: 'content',
    form: {
      component: 'Editor',
      componentProps: {
        valueHtml: '',
        height: 200
      }
    }
  },
  {
    label: t('mail.mailAccount'),
    field: 'accountId',
    width: '200px',
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return accountList.find((account) => account.id === cellValue)?.mail
    },
    search: {
      show: true,
      component: 'Select',
      api: () => accountList,
      componentProps: {
        optionsAlias: {
          labelField: 'mail',
          valueField: 'id'
        },
        style: {
          width: '240px'
        }
      }
    },
    form: {
      component: 'Select',
      api: () => accountList,
      componentProps: {
        optionsAlias: {
          labelField: 'mail',
          valueField: 'id'
        }
      }
    }
  },
  {
    label: t('mail.senderName'),
    field: 'nickname'
  },
  {
    label: t('mail.enableStatus'),
    field: 'status',
    isSearch: true,
    dictType: DICT_TYPE.COMMON_STATUS,
    dictClass: 'number',
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: t('common.remark'),
    field: 'remark',
    isTable: false
  },
  {
    label: t('common.createTime'),
    field: 'createTime',
    isForm: false,
    formatter: dateFormatter,
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'daterange',
        defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')],
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: t('common.action'),
    field: 'action',
    isForm: false
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)

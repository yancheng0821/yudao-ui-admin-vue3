import type { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { dateFormatter } from '@/utils/formatTime'
import * as MailAccountApi from '@/api/system/mail/account'

const { t } = useI18n() // 国际化

// 邮箱账号的列表
const accountList = await MailAccountApi.getSimpleMailAccountList()

// CrudSchema：https://doc.iocoder.cn/vue3/crud-schema/
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: t('mail.logId'),
    field: 'id'
  },
  {
    label: t('mail.sendTime'),
    field: 'sendTime',
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
    },
    detail: {
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: t('mail.toMail'),
    field: 'toMail'
  },
  {
    label: t('mail.userId'),
    field: 'userId',
    isSearch: true,
    isTable: false,
    search: {
      componentProps: {
        style: {
          width: '240px'
        }
      }
    }
  },
  {
    label: t('mail.userType'),
    field: 'userType',
    dictType: DICT_TYPE.USER_TYPE,
    dictClass: 'number',
    isSearch: true,
    isTable: false,
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
    field: 'templateTitle'
  },
  {
    label: t('mail.templateContent'),
    field: 'templateContent',
    isTable: false
  },
  {
    label: t('mail.templateParams'),
    field: 'templateParams',
    isTable: false
  },
  {
    label: t('mail.sendStatus'),
    field: 'sendStatus',
    dictType: DICT_TYPE.SYSTEM_MAIL_SEND_STATUS,
    dictClass: 'string',
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
    label: t('mail.mailAccount'),
    field: 'accountId',
    isTable: false,
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
    }
  },
  {
    label: t('mail.fromMail'),
    field: 'fromMail',
    table: {
      label: t('mail.mailAccount')
    }
  },
  {
    label: t('mail.templateId'),
    field: 'templateId',
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
    label: t('mail.templateCode'),
    field: 'templateCode',
    isTable: false
  },
  {
    label: t('mail.templateNickname'),
    field: 'templateNickname',
    isTable: false
  },
  {
    label: t('mail.sendMessageId'),
    field: 'sendMessageId',
    isTable: false
  },
  {
    label: t('mail.sendException'),
    field: 'sendException',
    isTable: false
  },
  {
    label: t('common.createTime'),
    field: 'createTime',
    isTable: false,
    formatter: dateFormatter,
    detail: {
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: t('common.action'),
    field: 'action',
    isDetail: false
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)

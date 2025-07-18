import type { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { dateFormatter } from '@/utils/formatTime'
const { t } = useI18n() // 国际化

// 表单校验
export const rules = reactive({
  mail: [
    { required: true, message: t('mail.emailRequired'), trigger: 'blur' },
    {
      type: 'email',
      message: t('profile.rules.truemail'),
      trigger: ['blur', 'change']
    }
  ],
  username: [{ required: true, message: t('mail.usernameRequired'), trigger: 'blur' }],
  password: [{ required: true, message: t('mail.passwordRequired'), trigger: 'blur' }],
  host: [{ required: true, message: t('mail.hostRequired'), trigger: 'blur' }],
  port: [{ required: true, message: t('mail.portRequired'), trigger: 'blur' }],
  sslEnable: [{ required: true, message: t('mail.sslEnableRequired'), trigger: 'change' }],
  starttlsEnable: [{ required: true, message: t('mail.starttlsEnableRequired'), trigger: 'change' }]
})

// CrudSchema：https://doc.iocoder.cn/vue3/crud-schema/
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: t('mail.email'),
    field: 'mail',
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
    label: t('mail.username'),
    field: 'username',
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
    label: t('mail.password'),
    field: 'password',
    isTable: false
  },
  {
    label: t('mail.smtpHost'),
    field: 'host'
  },
  {
    label: t('mail.smtpPort'),
    field: 'port',
    form: {
      component: 'InputNumber',
      value: 465
    }
  },
  {
    label: t('mail.sslEnable'),
    field: 'sslEnable',
    dictType: DICT_TYPE.INFRA_BOOLEAN_STRING,
    dictClass: 'boolean',
    form: {
      component: 'Radio'
    }
  },
  {
    label: t('mail.starttlsEnable'),
    field: 'starttlsEnable',
    dictType: DICT_TYPE.INFRA_BOOLEAN_STRING,
    dictClass: 'boolean',
    form: {
      component: 'Radio'
    }
  },
  {
    label: t('common.createTime'),
    field: 'createTime',
    isForm: false,
    formatter: dateFormatter,
    detail: {
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: t('common.action'),
    field: 'action',
    isForm: false,
    isDetail: false
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)

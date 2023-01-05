import createAxios from '/@/utils/axios'
import {isAdminApp, checkFileMimetype} from '/@/utils/common'
import {getUrl} from '/@/utils/axios'
import {ElNotification, UploadRawFile} from 'element-plus'
import {useSiteConfig} from '/@/stores/siteConfig'
import {state as uploadExpandState, fileUpload as uploadExpand} from '/@/components/baInput/components/baUpload'
import {i18n} from '../lang'

/*
 * 公共请求函数和Url定义
 */

// Admin模块
export const adminUploadUrl = '/admin/ajax/upload'
export const adminBuildSuffixSvgUrl = '/admin/ajax/buildSuffixSvg'
export const adminAreaUrl = '/admin/ajax/area'
export const getTablePkUrl = '/admin/ajax/getTablePk'
export const getTableFieldListUrl = '/admin/ajax/getTableFieldList'
export const clearCacheUrl = '/admin/ajax/clearCache'

// 公共
export const captchaUrl = '/sys/admin/login/captcha'
export const refreshTokenUrl = '/api/common/refreshToken'

// api模块(前台)
export const apiUploadUrl = '/api/ajax/upload'
export const apiBuildSuffixSvgUrl = '/api/ajax/buildSuffixSvg'
export const apiAreaUrl = '/api/ajax/area'
export const apiSendSms = '/api/Sms/send'
export const apiSendEms = '/api/Ems/send'

/**
 * 上传文件
 */
export function fileUpload(fd: FormData, params: anyObj = {}, forceLocal = false): ApiPromise {
    let errorMsg = ''
    const file = fd.get('file') as UploadRawFile
    const siteConfig = useSiteConfig()

    if (!file.name || typeof file.size == 'undefined') {
        errorMsg = i18n.global.t('utils.The data of the uploaded file is incomplete!')
    } else if (!checkFileMimetype(file.name, file.type)) {
        errorMsg = i18n.global.t('utils.The type of uploaded file is not allowed!')
    } else if (file.size > siteConfig.upload.maxsize) {
        errorMsg = i18n.global.t('utils.The size of the uploaded file exceeds the allowed range!')
    }
    if (errorMsg) {
        return new Promise((resolve, reject) => {
            ElNotification({
                type: 'error',
                message: errorMsg,
            })
            reject(errorMsg)
        })
    }

    if (!forceLocal && uploadExpandState() == 'enable') {
        return uploadExpand(fd, params)
    }

    return createAxios({
        url: isAdminApp() ? adminUploadUrl : apiUploadUrl,
        method: 'POST',
        data: fd,
        params: params,
    }) as ApiPromise
}

/**
 * 生成文件后缀icon的svg图片
 * @param suffix 后缀名
 * @param background 背景色,如:rgb(255,255,255)
 */
export function buildSuffixSvgUrl(suffix: string, background = '') {
    return (
        getUrl() +
        (isAdminApp() ? adminBuildSuffixSvgUrl : apiBuildSuffixSvgUrl)
    )
}

/**
 * 获取地区数据
 */
export function getArea(values: number[]) {
    const params: { province?: number; city?: number } = {}
    if (values[0]) {
        params.province = values[0]
    }
    if (values[1]) {
        params.city = values[1]
    }
    return createAxios({
        url: isAdminApp() ? adminAreaUrl : apiAreaUrl,
        method: 'GET',
        params: params,
    })
}

/**
 * 发送短信
 */
export function sendSms(mobile: string, templateCode: string) {
    return createAxios(
        {
            url: apiSendSms,
            method: 'POST',
            data: {
                mobile: mobile,
                template_code: templateCode,
            },
        },
        {
            showSuccessMessage: true,
        }
    ) as ApiPromise
}

/**
 * 发送邮件
 */
export function sendEms(email: string, event: string) {
    return createAxios(
        {
            url: apiSendEms,
            method: 'POST',
            data: {
                email: email,
                event: event,
            },
        },
        {
            showSuccessMessage: true,
        }
    ) as ApiPromise
}

/*
 * 缓存清理接口
 */
export function postClearCache(type: string) {
    return createAxios(
        {
            url: clearCacheUrl,
            method: 'POST',
            data: {
                type: type,
            },
        },
        {
            showSuccessMessage: true,
        }
    )
}


/**
 * 远程下拉框数据获取
 */
export function getSelectData(remoteUrl: string, q: string, params: {}) {
    return createAxios({
        url: remoteUrl,
        method: 'post',
        params: Object.assign(params, {
            select: true,
            quick_search: q,
        }),
    })
}

export function buildCaptchaUrl() {
    return getUrl() + captchaUrl + '?server=1'
}


export function getTablePk(table: string) {
    return createAxios({
        url: getTablePkUrl,
        method: 'get',
        params: {
            table: table,
        },
    })
}

/**
 * 获取数据表的字段
 * @param table 数据表名
 * @param clean 只要干净的字段注释（只要字段标题）
 */
export function getTableFieldList(table: string, clean = true) {
    return createAxios({
        url: getTableFieldListUrl,
        method: 'get',
        params: {
            table: table,
            clean: clean ? 1 : 0,
        },
    })
}

export function refreshToken(): ApiPromise {
    return createAxios({
        url: refreshTokenUrl,
        method: 'POST',
        data: {
            refresh_token: isAdminApp() ? "" : "",
        },
    }) as ApiPromise
}

/**
 * 生成一个控制器的：增、删、改、查、排序的操作url
 */
export class baTableApi {
    private controllerUrl
    public actionUrl

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl
        this.actionUrl = new Map([
            ['list', controllerUrl + 'list'],
            ['info', controllerUrl + 'info'],
            ['add', controllerUrl + 'store'],
            ['edit', controllerUrl + 'store'],
            ['del', controllerUrl + 'del'],
            ['status', controllerUrl + 'status'],
            ['sortable', controllerUrl + 'sortable'],
        ])
    }

    list(filter: anyObj = {}): ApiPromise<TableDefaultData> {
        return createAxios({
            url: this.actionUrl.get('list'),
            method: 'post',
            data: filter,
        }) as ApiPromise
    }

    info(data: anyObj) {
        return createAxios({
            url: this.actionUrl.get('info'),
            method: 'post',
            data: data,
        })
    }

    del(ids: string[]) {
        return createAxios(
            {
                url: this.actionUrl.get('del'),
                method: 'post',
                data: {
                    ids: ids,
                },
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    postData(action: string, data: anyObj) {
        if (!this.actionUrl.has(action)) {
            throw new Error('action does not exist')
        }
        return createAxios(
            {
                url: this.actionUrl.get(action),
                method: 'post',
                data: data,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    sortableApi(id: number, targetId: number) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                id: id,
                targetId: targetId,
            },
        })
    }
}
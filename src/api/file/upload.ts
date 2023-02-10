import createAxios from '/@/utils/axios'
import {ElNotification, UploadRawFile} from "element-plus";
import {useSiteConfig} from "/@/stores/siteConfig";
import {i18n} from "/@/lang";
import {checkFileMimetype} from "/@/utils/common";

// 路由定义
export const fileUploadUrl = 'file/upload'


export function fileUpload(fd: FormData, params: anyObj = {}): ApiPromise {
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
    return createAxios({
        url: fileUploadUrl,
        method: 'POST',
        data: fd,
        params: params,
    }) as ApiPromise
}

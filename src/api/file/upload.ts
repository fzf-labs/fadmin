import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const systemFileUpload = 'file/upload'


export function SystemFileUpload() {
    return createAxios({
        url: adminPrefix + systemFileUpload,
        method: 'post',
    })
}

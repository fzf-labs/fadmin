import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const systemStatUrl = '/system/stat'


//服务器状态
export function SystemStat() {
    return createAxios({
        url: adminPrefix + systemStatUrl,
        method: 'get',
    })
}

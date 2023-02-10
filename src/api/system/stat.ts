import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const systemStatUrl = '/system/stat'
export const systemCacheUrl = '/system/redis'


//服务器状态
export function SystemStat() {
    return createAxios({
        url: adminPrefix + systemStatUrl,
        method: 'get',
    })
}

//缓存信息
export function SystemCache() {
    return createAxios({
        url: adminPrefix + systemCacheUrl,
        method: 'get',
    })
}

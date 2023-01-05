import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const sysLogOwnListUrl = '/sys/log/ownlist'
export const sysLogListUrl = '/sys/log/list'
export const sysLogInfoUrl = '/sys/log/info'


//日志列表
export function sysLogOwnList(params: anyObj = {}) {
    return createAxios({
        url: adminPrefix + sysLogOwnListUrl,
        method: 'post',
        data: params,
    })
}
//日志列表
export function sysLogList(params: anyObj = {}) {
    return createAxios({
        url: adminPrefix + sysLogListUrl,
        method: 'post',
        data: params,
    })
}

//日志信息
export function sysLogInfo() {
    return createAxios({
        url: adminPrefix + sysLogInfoUrl,
        method: 'post',
    })
}

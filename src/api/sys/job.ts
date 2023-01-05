import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const sysJobListUrl = '/sys/job/list'
export const sysJobStoreUrl = '/sys/job/store'
export const sysJobDeleteUrl = '/sys/job/delete'


//岗位列表
export function sysJobList(params: anyObj = {}) {
    return createAxios({
        url: adminPrefix + sysJobListUrl,
        method: 'post',
        data: params
    })
}

//岗位保存
export function sysJobStore() {
    return createAxios({
        url: adminPrefix + sysJobStoreUrl,
        method: 'post',
    })
}

//岗位删除
export function sysJobDelete() {
    return createAxios({
        url: adminPrefix + sysJobDeleteUrl,
        method: 'post',
    })
}

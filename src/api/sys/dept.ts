import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const sysDeptListUrl = '/sys/dept/list'
export const sysDeptStoreUrl = '/sys/dept/store'
export const sysDeptDeleteUrl = '/sys/dept/delete'


//部门列表
export function sysDeptList() {
    return createAxios({
        url: adminPrefix + sysDeptListUrl,
        method: 'post',
    })
}

//部门保存
export function sysDeptStore() {
    return createAxios({
        url: adminPrefix + sysDeptStoreUrl,
        method: 'post',
    })
}

//部门删除
export function sysDeptDelete() {
    return createAxios({
        url: adminPrefix + sysDeptDeleteUrl,
        method: 'post',
    })
}

import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const sysPermMenuListUrl = '/sys/permmenu/list'
export const sysPermMenuStoreUrl = '/sys/permmenu/store'
export const sysPermMenuDeleteUrl = '/sys/permmenu/delete'


//权限菜单列表
export function sysPermMenuList() {
    return createAxios({
        url: adminPrefix + sysPermMenuListUrl,
        method: 'post',
    })
}

//权限菜单保存
export function sysPermMenuStore() {
    return createAxios({
        url: adminPrefix + sysPermMenuStoreUrl,
        method: 'post',
    })
}

//权限菜单删除
export function sysPermMenuDelete() {
    return createAxios({
        url: adminPrefix + sysPermMenuDeleteUrl,
        method: 'post',
    })
}

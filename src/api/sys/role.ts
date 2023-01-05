import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const sysRoleListUrl = '/sys/role/list'
export const sysRoleStoreUrl = '/sys/role/store'
export const sysRoleDeleteUrl = '/sys/role/delete'


//角色列表
export function sysRoleList() {
    return createAxios({
        url: adminPrefix + sysRoleListUrl,
        method: 'post',
    })
}
//角色保存
export function sysRoleStore() {
    return createAxios({
        url: adminPrefix + sysRoleStoreUrl,
        method: 'post',
    })
}
//角色删除
export function sysRoleDelete() {
    return createAxios({
        url: adminPrefix + sysRoleDeleteUrl,
        method: 'post',
    })
}

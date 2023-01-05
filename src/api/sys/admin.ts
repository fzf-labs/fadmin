import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const sysAdminLoginCaptchaUrl = '/sys/admin/login/captcha'
export const sysAdminLoginUrl = '/sys/admin/login'
export const sysAdminLogoutUrl = '/sys/admin/logout'
export const sysAdminPermMenuUrl = '/sys/admin/permmenu'
export const sysAdminInfoUrl = '/sys/admin/info'
export const sysAdminInfoUpdateUrl = '/sys/admin/info/update'


// 获取验证码
export function sysAdminLoginCaptcha() {
    return createAxios({
        url: adminPrefix + sysAdminLoginCaptchaUrl,
        method: 'get',
    })
}

// 登录
export function sysAdminLogin(params: anyObj = {}) {
    return createAxios({
        url: adminPrefix + sysAdminLoginUrl,
        method: 'post',
        data: params,
    })
}

// 登出
export function sysAdminLogout() {
    return createAxios({
        url: adminPrefix + sysAdminLogoutUrl,
        method: 'post',
    })
}

//管理员信息
export function sysAdminInfo() {
    return createAxios({
        url: adminPrefix + sysAdminInfoUrl,
        method: 'get',
    })
}

//权限菜单
export function sysAdminPermMenu() {
    return createAxios({
        url: adminPrefix + sysAdminPermMenuUrl,
        method: 'get',
    })
}

//更新
export function sysAdminInfoUpdate(params: anyObj = {}) {
    return createAxios({
        url: adminPrefix + sysAdminInfoUpdateUrl,
        method: 'post',
        data: params,
    })
}


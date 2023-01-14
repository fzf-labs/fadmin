import createAxios from '/@/utils/axios'
import {adminPrefix} from "/@/api";

// 路由定义
export const sensitiveCategoryListUrl = '/sensitive/category/list'


//分类列表
export function SensitiveCategoryList(params: anyObj = {}) {
    return createAxios({
        url: adminPrefix + sensitiveCategoryListUrl,
        method: 'post',
        data: params
    })
}

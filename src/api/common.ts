import createAxios from '/@/utils/axios'

/*
 * 公共请求函数和Url定义
 */

export const adminAreaUrl = '/admin/ajax/area'
export const getTableFieldListUrl = '/admin/ajax/getTableFieldList'
export const clearCacheUrl = '/admin/ajax/clearCache'


/**
 * 获取地区数据
 */
export function getArea(values: number[]) {
    const params: { province?: number; city?: number } = {}
    if (values[0]) {
        params.province = values[0]
    }
    if (values[1]) {
        params.city = values[1]
    }
    return createAxios({
        url: adminAreaUrl,
        method: 'GET',
        params: params,
    })
}

/*
 * 缓存清理接口
 */
export function postClearCache(type: string) {
    return createAxios(
        {
            url: clearCacheUrl,
            method: 'POST',
            data: {
                type: type,
            },
        },
        {
            showSuccessMessage: true,
        }
    )
}


/**
 * 远程下拉框数据获取
 */
export function getSelectData(remoteUrl: string, q: string, params: {}) {
    return createAxios({
        url: remoteUrl,
        method: 'post',
        params: Object.assign(params, {
            select: true,
            quick_search: q,
        }),
    })
}

/**
 * 获取数据表的字段
 * @param table 数据表名
 * @param clean 只要干净的字段注释（只要字段标题）
 */
export function getTableFieldList(table: string, clean = true) {
    return createAxios({
        url: getTableFieldListUrl,
        method: 'get',
        params: {
            table: table,
            clean: clean ? 1 : 0,
        },
    })
}

/**
 * 生成一个控制器的：增、删、改、查、排序的操作url
 */
export class baTableApi {
    private controllerUrl
    public actionUrl

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl
        this.actionUrl = new Map([
            ['list', controllerUrl + 'list'],
            ['info', controllerUrl + 'info'],
            ['add', controllerUrl + 'store'],
            ['edit', controllerUrl + 'store'],
            ['del', controllerUrl + 'del'],
            ['status', controllerUrl + 'status'],
            ['sortable', controllerUrl + 'sortable'],
        ])
    }

    list(filter: anyObj = {}): ApiPromise<TableDefaultData> {
        return createAxios({
            url: this.actionUrl.get('list'),
            method: 'post',
            data: filter,
        }) as ApiPromise
    }

    info(data: anyObj) {
        return createAxios({
            url: this.actionUrl.get('info'),
            method: 'post',
            data: data,
        })
    }

    del(ids: string[]) {
        return createAxios(
            {
                url: this.actionUrl.get('del'),
                method: 'post',
                data: {
                    ids: ids,
                },
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    postData(action: string, data: anyObj) {
        if (!this.actionUrl.has(action)) {
            throw new Error('action does not exist')
        }
        return createAxios(
            {
                url: this.actionUrl.get(action),
                method: 'post',
                data: data,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    sortableApi(id: number, targetId: number) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                id: id,
                targetId: targetId,
            },
        })
    }
}

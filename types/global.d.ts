interface Window {
    existLoading: boolean
    lazy: NodeJS.Timer
    unique: number
    tokenRefreshing: boolean
    requests: Function[]
    eventSource: EventSource
}

interface anyObj {
    [key: string]: any
}

interface TableDefaultData<T = any> {
    list: T
    paginator: {
        page: number
        pageSize: number
        nextPage: number
        prevPage: number
        total: number
        totalPage: number
    }
    remark: string
}

interface ApiResponse<T = any> {
    code: number
    data: T
    msg: string
    time: number
}

type ApiPromise<T = any> = Promise<ApiResponse<T>>

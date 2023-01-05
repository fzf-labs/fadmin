import createAxios from '/@/utils/axios'

export function dashboard() {
    return createAxios({
        url: '/admin/dashboard/speech',
        method: 'get',
    })
}

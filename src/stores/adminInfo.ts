import {defineStore} from 'pinia'
import {ADMIN_INFO} from '/@/stores/constant/cacheKey'
import {AdminInfo, Lock} from '/@/stores/interface'

export const useAdminInfo = defineStore('adminInfo', {
    state: (): AdminInfo => {
        return {
            id: 0,
            username: '',
            nickname: '',
            avatar: '',
            gender: 0,
            email: '',
            mobile: '',
            job_id: 0,
            dept_id: 0,
            remark: '',
            role_ids: [],
            // 是否是superAdmin，用于判定是否显示终端按钮等，不做任何权限判断
            super: false,
        }
    },
    getters: {
        getAdminInfo(): AdminInfo {
            return this;
        },
    },
    actions: {
        dataFill(state: AdminInfo) {
            this.$state = {...this.$state, ...state}
        },
        setSuper(val: boolean) {
            this.super = val
        },
    },
    persist: {
        key: ADMIN_INFO,
    },
})

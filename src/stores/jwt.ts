import {defineStore} from 'pinia'
import {JWT} from '/@/stores/constant/cacheKey'
import {Jwt} from '/@/stores/interface'

export const useJwt = defineStore('jwt', {
    state: (): Jwt => {
        return {
            token: '',
            expiredAt: 0,
            refreshAt: 0,
        }
    },
    actions: {
        dataFill(state: Jwt) {
            this.$state = {...this.$state, ...state}
        },
        removeToken() {
            this.token = ''
            this.expiredAt = 0
            this.refreshAt = 0
        },
        setToken(token: string, expiredAt: number, refreshAt: number) {
            this.token = token
            this.expiredAt = expiredAt
            this.refreshAt = refreshAt
        },
        getToken() {
            return 'Bearer ' + this.token
        },
        checkToken() {
            return this.token != "";
        },
        checkRefresh() {
            if (this.token && this.expiredAt && this.refreshAt) {
                const now = new Date().getTime();
                if (now > this.refreshAt && now < this.expiredAt) {
                    return true
                }
            }
            return false
        }
    },
    persist: {
        key: JWT,
    },
})

import { defineStore } from 'pinia'
import { SiteConfig } from '/@/stores/interface'

export const useSiteConfig = defineStore('siteConfig', {
    state: (): SiteConfig => {
        return {
            site_name: 'Fadmin',
            record_number: "",
            version: '',
            cdn_url: '',
            api_url: '',
            upload: {
                mode: 'local',
                maxsize: 10485760,
                mimetype: 'jpg,png,bmp,jpeg,gif,webp,zip,rar,xls,xlsx,doc,docx,wav,mp4,mp3,pdf,txt',
                savename: '/storage/{topic}/{year}{mon}{day}/{filesha1}{.suffix}',
            },
        }
    },
    actions: {
        dataFill(state: SiteConfig) {
            this.$state = state
        },
    },
})

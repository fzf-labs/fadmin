<template>
    <component :is="config.layout.layoutMode"></component>
</template>

<script setup lang="ts">
import { useConfig } from '/@/stores/config'
import { useNavTabs } from '/@/stores/navTabs'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useRoute } from 'vue-router'
import Default from '/@/layouts/container/default.vue'
import Streamline from '/@/layouts/container/streamline.vue'
import Classic from '/@/layouts/container/classic.vue'
import { onMounted, onBeforeMount } from 'vue'
import { Session } from '/@/utils/storage'
import { handleAdminRoute, getMenuPaths, getFirstRoute, routePush } from '/@/utils/router'
import router from '/@/router'
import { adminBaseRoute } from '/@/router/static'
import { useEventListener } from '@vueuse/core'
import { BEFORE_RESIZE_LAYOUT } from '/@/stores/constant/cacheKey'
import { isEmpty } from 'lodash-es'
import {useJwt} from "/@/stores/jwt";
import {sysAdminInfo, sysAdminPermMenu} from "/@/api/sys/admin";

const navTabs = useNavTabs()
const config = useConfig()
const route = useRoute()
const adminInfo = useAdminInfo()
const jwt = useJwt()

onMounted(() => {
    if (!jwt.token) return router.push({ name: 'adminLogin' })

    init()
    onSetNavTabsMinWidth()
    useEventListener(window, 'resize', onSetNavTabsMinWidth)
})
onBeforeMount(() => {
    onAdaptiveLayout()
    useEventListener(window, 'resize', onAdaptiveLayout)
})

const init = () => {
    sysAdminInfo().then((res)=>{
        adminInfo.dataFill(res.data.info)
    })
    sysAdminPermMenu().then((res)=>{
        if (res.data.menus){
            handleAdminRoute(res.data.menus)
            // 预跳转到上次路径
            if (route.query && route.query.url && route.query.url != adminBaseRoute.path) {
                let query = JSON.parse(route.query.query as string)
                query = !isEmpty(query) ? query : {}
                const lastRouter = router.getRoutes().find((value) => {
                    return value.path == route.query.url
                })
                if (lastRouter) {
                    routePush({ path: lastRouter.path, query: query })
                    return
                }
                // 检查路径是否有权限
                let menuPaths = getMenuPaths(navTabs.state.tabsViewRoutes)
                if (menuPaths.indexOf(route.query.url as string) !== -1) {
                    routePush({ path: route.query.url as string, query: query })
                    return
                }
            }
            // 跳转到第一个菜单
            let firstRoute = getFirstRoute(navTabs.state.tabsViewRoutes)
            if (firstRoute) routePush(firstRoute.path)
        }
    })
}

const onAdaptiveLayout = () => {
    let defaultBeforeResizeLayout = {
        layoutMode: config.layout.layoutMode,
        menuCollapse: config.layout.menuCollapse,
    }
    let beforeResizeLayout = Session.get(BEFORE_RESIZE_LAYOUT)
    if (!beforeResizeLayout) Session.set(BEFORE_RESIZE_LAYOUT, defaultBeforeResizeLayout)

    const clientWidth = document.body.clientWidth
    if (clientWidth < 1024) {
        config.setLayout('menuCollapse', true)
        config.setLayout('shrink', true)
        config.setLayoutMode('Classic')
    } else {
        let beforeResizeLayoutTemp = beforeResizeLayout || defaultBeforeResizeLayout

        config.setLayout('menuCollapse', beforeResizeLayoutTemp.menuCollapse)
        config.setLayout('shrink', false)
        config.setLayoutMode(beforeResizeLayoutTemp.layoutMode)
    }
}

// 在实例挂载后为navTabs设置一个min-width，防止宽度改变时闪现滚动条
const onSetNavTabsMinWidth = () => {
    const navTabs = document.querySelector('.nav-tabs') as HTMLElement
    if (!navTabs) {
        return
    }
    const navBar = document.querySelector('.nav-bar') as HTMLElement
    const navMenus = document.querySelector('.nav-menus') as HTMLElement
    const minWidth = navBar.offsetWidth - (navMenus.offsetWidth + 20)
    navTabs.style.width = minWidth.toString() + 'px'
}
</script>

<!-- 只有在 components 选项中的组件可以被动态组件使用-->
<script  lang="ts">
export default {
    components: { Default, Classic, Streamline },
}
</script>

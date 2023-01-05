import {createRouter, createWebHashHistory} from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {staticRoutes} from '/@/router/static'
import {loading} from '/@/utils/loading'
import {useJwt} from "/@/stores/jwt";


const router = createRouter({
    history: createWebHashHistory(),
    routes: staticRoutes,
})

router.beforeEach((to, from, next) => {
    if (to.name == 'accountCenter') {
        if (!useJwt().checkToken()) {
            next('/admin/login')
        }
    }
    NProgress.configure({showSpinner: false})
    NProgress.start()
    if (!window.existLoading) {
        loading.show()
        window.existLoading = true
    }
    next()
})

// 路由加载后
router.afterEach(() => {
    if (window.existLoading) {
        loading.hide()
    }
    NProgress.done()
})

export default router

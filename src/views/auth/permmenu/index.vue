<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
                  show-icon/>

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'unfold', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Fuzzy query Placeholder', { fields: t('auth.permmenu.title') })"
        />
        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" :pagination="false"/>

        <!-- 表单 -->
        <PopupForm/>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, provide} from 'vue'
import {sysPermMenu} from '/@/api/baTableUrl'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import {defaultOptButtons} from '/@/components/table'
import {useI18n} from 'vue-i18n'
import {baTableApi} from '/@/api/common'
import baTableClass from '/@/utils/baTable'
import {cloneDeep} from "lodash-es";

const {t} = useI18n()
const tableRef = ref()
const baTable = new baTableClass(
    new baTableApi(sysPermMenu),
    {
        expandAll: false,
        dblClickNotEditColumn: [undefined, 'keepalive', 'status'],
        column: [
            {type: 'selection', align: 'center'},
            {label: t('auth.permmenu.title'), prop: 'title', align: 'left', width: '200'},
            {
                label: t('auth.permmenu.Icon'),
                prop: 'icon',
                align: 'center',
                width: '60',
                render: 'icon',
                default: 'el-icon-Minus'
            },
            {label: t('auth.permmenu.name'), prop: 'name', align: 'center', 'show-overflow-tooltip': true},
            {
                label: t('auth.permmenu.type'),
                prop: 'type',
                align: 'center',
                render: 'tag',
                custom: {menu: 'danger', menu_dir: 'success', button: 'info'},
                replaceValue: {
                    menu: t('auth.permmenu.type menu'),
                    menu_dir: t('auth.permmenu.type menu_dir'),
                    button: t('auth.permmenu.type button')
                },
            },
            {label: t('state'), prop: 'status', align: 'center', width: '80', render: 'switch'},
            {label: t('updatedAt'), prop: 'updatedAt', align: 'center', width: '160', render: 'datetime'},
            {
                label: t('operate'),
                align: 'center',
                width: '130',
                render: 'buttons',
                buttons: defaultOptButtons(),
            },
        ],
        dragSortLimitField: 'pid',
    },
    {
        defaultItems: {
            pid: 0,
            type: 'menu',
            path:"",
            icon: 'el-icon-Minus',
            menu_type: 'tab',
            extend: 'none',
            keepalive: 0,
            url:"",
            component:"",
            remark:"",
            sort: 0,
            status: 1,
        },
    },
    {
        // 提交前
        onSubmit: ({formEl, items}) => {
            var items = cloneDeep(items)
            for (const key in items) {
                if (items[key] === null) {
                    delete items[key]
                }
            }
            // 表单验证通过后执行的api请求操作
            let submitCallback = () => {
                baTable.form.submitLoading = true
                baTable.api
                    .postData(baTable.form.operate!, items)
                    .then((res) => {
                        baTable.onTableHeaderAction('refresh', {})
                        baTable.form.submitLoading = false
                        baTable.form.operateIds?.shift()
                        if (baTable.form.operateIds!.length > 0) {
                            baTable.toggleForm('edit', baTable.form.operateIds)
                        } else {
                            baTable.toggleForm()
                        }
                        baTable.runAfter('onSubmit', {res})
                    })
                    .catch(() => {
                        baTable.form.submitLoading = false
                    })
            }

            if (formEl) {
                baTable.form.ref = formEl
                formEl.validate((valid) => {
                    if (valid) {
                        submitCallback()
                    }
                })
            } else {
                submitCallback()
            }
            return false
        },
        // 双击编辑前
        onTableDblclick: ({row}) => {

        },
    },
    {
        getList: ({res}) => {
            baTable.table.extend!['roleList'] = res.data.list
        },
    }
)

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getList()?.then(() => {
        baTable.dragSort()
    })
})
</script>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'auth/menu',
})
</script>

<style scoped lang="scss"></style>

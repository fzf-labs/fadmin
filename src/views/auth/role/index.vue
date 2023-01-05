<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
                  show-icon/>

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'unfold', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Fuzzy query Placeholder', { fields: t('auth.role.name') })"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" :pagination="false"/>

        <!-- 表单 -->
        <PopupForm ref="formRef"/>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, provide} from 'vue'
import baTableClass from '/@/utils/baTable'
import {baTableApi} from '/@/api/common'
import {sysRole} from '/@/api/baTableUrl'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import PopupForm from './popupForm.vue'
import {defaultOptButtons} from '/@/components/table'
import {useI18n} from 'vue-i18n'
import {cloneDeep} from 'lodash-es'
import {getArrayKey} from '/@/utils/common'

const formRef = ref()
const tableRef = ref()
const {t} = useI18n()

const baTable: baTableClass = new baTableClass(
    new baTableApi(sysRole),
    {
        expandAll: true,
        dblClickNotEditColumn: [undefined],
        column: [
            {type: 'selection', align: 'center'},
            {label: t('auth.role.name'), prop: 'name', align: 'left', width: '200'},
            {label: t('auth.role.remark'), prop: 'remark', align: 'center'},
            {
                label: t('status'),
                prop: 'status',
                align: 'center',
                render: 'tag',
                custom: {0: 'danger', 1: 'success'},
                replaceValue: {0: t('Disable'), 1: t('Enable')},
            },
            {label: t('updatedAt'), prop: 'updatedAt', align: 'center', width: '160', render: 'datetime'},
            {label: t('createdAt'), prop: 'createdAt', align: 'center', width: '160', render: 'datetime'},
            {
                label: t('operate'),
                align: 'center',
                width: '130',
                render: 'buttons',
                buttons: defaultOptButtons(['edit', 'delete'])
            },
        ],
    },
    {
        defaultItems: {
            pid: 0,
            status: 1,
        },
    },
    {
        // 提交前
        onSubmit: ({formEl, items}) => {
            var items = cloneDeep(items)

            items.permMenuIds = formRef.value.getCheckeds()

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
            let buttonsKey = getArrayKey(baTable.table.column, 'render', 'buttons')
            baTable.table.column[buttonsKey].buttons!.forEach((value: OptButton) => {
                value.display = (row) => {
                    return row.id !== 1
                }
            })
        },
    }
)

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getList()
})
</script>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'auth/role',
})
</script>

<style scoped lang="scss"></style>

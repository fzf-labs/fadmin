<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
                  show-icon/>

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'unfold',  'columnDisplay']"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" :pagination="false"/>

        <!-- 表单 -->
        <PopupForm/>
    </div>
</template>

<script setup lang="ts">
import {ref, provide, onMounted} from 'vue'
import baTableClass from '/@/utils/baTable'
import {defaultOptButtons} from '/@/components/table/index'
import {baTableApi} from '/@/api/common'
import {useI18n} from 'vue-i18n'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import {sysDept} from "/@/api/baTableUrl";
import {cloneDeep} from "lodash-es";
import {getArrayKey} from "/@/utils/common";

const {t} = useI18n()
const tableRef = ref()
const optButtons = defaultOptButtons(['weigh-sort', 'edit', 'delete'])
const baTable = new baTableClass(
    new baTableApi(sysDept),
    {
        pk: 'id',
        expandAll: true,
        column: [
            {type: 'selection', align: 'center', operator: false},
            {label: t('auth.dept.id'), prop: 'id', align: 'center', width: 100},
            {label: t('auth.dept.name'), prop: 'name', align: 'center', width: 200},
            {label: t('auth.dept.fullName'), prop: 'fullName', align: 'center', width: 200},
            {label: t('auth.dept.responsible'), prop: 'responsible', align: 'center'},
            {label: t('auth.dept.phone'), prop: 'phone', align: 'center', width: 130},
            {label: t('auth.dept.email'), prop: 'email', align: 'center', width: 200},
            {
                label: t('auth.dept.status'),
                prop: 'status',
                align: 'center',
                render: 'tag',
                replaceValue: {0: t('auth.dept.status 0'), 1: t('auth.dept.status 1')},
                width: 100,
            },
            {
                label: t('auth.dept.createdAt'),
                prop: 'createdAt',
                align: 'center',
                render: 'datetime',
                sortable: 'custom',
                operator: 'RANGE',
                width: 160,
            },
            {
                label: t('auth.dept.updatedAt'),
                prop: 'updatedAt',
                align: 'center',
                render: 'datetime',
                sortable: 'custom',
                operator: 'RANGE',
                width: 160,
            },
            {
                label: t('operate'),
                align: 'center',
                width: 140,
                render: 'buttons',
                buttons: optButtons,
                operator: false,
                fixed: 'right'
            },
        ],
        dblClickNotEditColumn: [undefined],
    },
    {
        defaultItems: {pid: 0, status: 1, type: 3},
    }, {
        // 提交前
        onSubmit: ({formEl, items}) => {
            var items = cloneDeep(items)
            for (const key in items) {
                if (items[key] === null) {
                    delete items[key]
                }
            }
            if (!items.pid) {
                items.pid = 0
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
            baTable.table.extend!['treeList'] = res.data.list
        },
    }
)

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getList()?.then(() => {
        baTable.afterSort()
        baTable.dragSort()
    })
})
</script>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'department/department',
})
</script>

<style scoped lang="scss"></style>

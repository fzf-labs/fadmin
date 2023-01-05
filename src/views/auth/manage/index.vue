<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
                  show-icon/>

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Fuzzy query Placeholder', { fields:  t('auth.manage.nickname') })"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table/>

        <!-- 表单 -->
        <PopupForm/>
    </div>
</template>

<script setup lang="ts">
import {provide} from 'vue'
import baTableClass from '/@/utils/baTable'
import {sysManage} from '/@/api/baTableUrl'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import {defaultOptButtons} from '/@/components/table'
import {baTableApi} from '/@/api/common'
import {useI18n} from 'vue-i18n'
import {getArrayKey} from "/@/utils/common";

const {t} = useI18n()

const baTable = new baTableClass(
    new baTableApi(sysManage),
    {
        column: [
            {type: 'selection', align: 'center', operator: false},
            {
                label: t('id'),
                prop: 'id',
                align: 'center',
                operator: '=',
                operatorPlaceholder: t('Exact match'),
                width: 70
            },
            {
                label: t('auth.manage.username'),
                prop: 'username',
                align: 'center',
                operator: '=',
                operatorPlaceholder: t('Exact match')
            },
            {
                label: t('auth.manage.nickname'),
                prop: 'nickname',
                align: 'center',
                operator: 'LIKE',
                operatorPlaceholder: t('Fuzzy query')
            },
            {label: t('auth.manage.roleNames'), prop: 'roleNames', align: 'center', operator: false, render: 'tags'},
            {
                label: t('auth.manage.deptName'),
                prop: 'deptName',
                align: 'center',
                operator: false,
                render: 'tag',
            },
            {
                label: t('auth.manage.jobName'),
                prop: 'jobName',
                align: 'center',
                operator: false,
                render: 'tag',
            },
            {label: t('auth.manage.avatar'), prop: 'avatar', align: 'center', render: 'image', operator: false},
            {
                label: t('auth.manage.mobile'),
                prop: 'mobile',
                align: 'center',
                operator: '=',
                operatorPlaceholder: t('Exact match')
            },
            {
                label: t('auth.manage.gender'),
                prop: 'gender',
                align: 'center',
                render: 'tag',
                replaceValue: {
                    0: t('auth.manage.gender 0'),
                    1: t('auth.manage.gender 1'),
                    2: t('auth.manage.gender 2')
                },
            },
            {
                label: t('auth.manage.email'),
                prop: 'email',
                align: 'center',
                operator: '=',
                operatorPlaceholder: t('Exact match')
            },
            {
                label: t('status'),
                prop: 'status',
                align: 'center',
                render: 'tag',
                custom: {0: 'danger', 1: 'success'},
                replaceValue: {0: t('Disable'), 1: t('Enable')},
            },
            {
                label: t('createdAt'),
                prop: 'createdAt',
                align: 'center',
                render: 'datetime',
                sortable: 'custom',
                operator: 'RANGE',
                width: 160
            },
            {
                label: t('operate'),
                align: 'center',
                width: '100',
                render: 'buttons',
                buttons: defaultOptButtons(['edit', 'delete']),
                operator: false,
            },
        ],
        dblClickNotEditColumn: [undefined, 'status'],
    },
    {
        defaultItems: {
            gender: 0,
            status: 1,
        }
    }, {}
    , {
        getList: ({res}) => {
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

baTable.mount()
baTable.getList()
</script>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'auth/manage',
})
</script>

<style scoped lang="scss"></style>

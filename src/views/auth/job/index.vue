<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
                  show-icon/>

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Fuzzy query Placeholder', { fields:  t('auth.job.name') })"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"/>

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
import {sysJob} from "/@/api/baTableUrl";

const {t} = useI18n()
const tableRef = ref()
const optButtons = defaultOptButtons(['edit', 'delete'])
const baTable = new baTableClass(
    new baTableApi(sysJob),
    {
        pk: 'id',
        column: [
            {type: 'selection', align: 'center', operator: false, fixed: 'left'},
            {
                label: t('auth.job.id'),
                prop: 'id',
                align: 'center',
                width: 100,
                sortable: 'custom',
                operator: '=',
                operatorPlaceholder: t('Exact match')
            },
            {
                label: t('auth.job.name'),
                prop: 'name',
                align: 'center',
                operator: 'LIKE',
                operatorPlaceholder: t('Fuzzy query')
            },
            {
                label: t('auth.job.code'),
                prop: 'code',
                align: 'center',
                operator: '=',
                operatorPlaceholder: t('Exact match')
            },
            {label: t('auth.job.remark'), prop: 'remark', align: 'center', operator: false},
            {
                label: t('auth.job.status'),
                prop: 'status',
                align: 'center',
                render: 'tag',
                replaceValue: {0: t('auth.job.status 0'), 1: t('auth.job.status 1')},
            },
            {
                label: t('auth.job.createdAt'),
                prop: 'createdAt',
                align: 'center',
                render: 'datetime',
                sortable: 'custom',
                operator: 'RANGE',
            },
            {
                label: t('auth.job.updatedAt'),
                prop: 'updatedAt',
                align: 'center',
                render: 'datetime',
                sortable: 'custom',
                operator: 'RANGE',
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
        defaultOrder: {prop: 'weigh', order: 'desc'},
    },
    {
        defaultItems: {status: 1},
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
    name: 'department/jobs',
})
</script>

<style scoped lang="scss"></style>

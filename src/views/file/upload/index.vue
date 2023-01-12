<template>
    <div class="default-main">
        <div class="ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
                      show-icon/>

            <!-- 表格顶部菜单 -->
            <TableHeader
                :buttons="['refresh', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
                :quick-search-placeholder="t('Fuzzy query Placeholder', { fields: t('file.upload.fileName') })"
            />
            <!-- 表格 -->
            <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
            <Table ref="tableRef"/>

            <Info/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, provide} from 'vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import baTableClass from '/@/utils/baTable'
import {defaultOptButtons} from '/@/components/table/index'
import {previewRenderFormatter} from './index'
import {baTableApi} from '/@/api/common'
import {useI18n} from 'vue-i18n'
import {fileUploadUrl} from "/@/api/baTableUrl";
import Info from "/@/views/file/upload/info.vue";
import {cloneDeep, concat} from "lodash-es";
import {buildJsonToElTreeData} from "/@/utils/common";

const {t} = useI18n()
const tableRef = ref()

let optButtons: OptButton[] = [
    {
        render: 'tipButton',
        name: 'info',
        title: 'info',
        text: '',
        type: 'primary',
        icon: 'fa fa-search-plus',
        class: 'table-row-edit',
        disabledTip: false,
        click: (row: TableRow) => {
            infoButtonClick(row)
        },
    },
]
optButtons = concat(optButtons, defaultOptButtons(['delete']))

const baTable = new baTableClass(new baTableApi(fileUploadUrl), {
    column: [
        {type: 'selection', align: 'center', operator: false},
        {
            label: t('id'),
            prop: 'id',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
            width: 70
        },
        {
            label: t('file.upload.fileCategory'),
            prop: 'fileCategory',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        }, {
            label: t('file.upload.originalFileName'),
            prop: 'originalFileName',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        },
        {
            label: t('file.upload.fileName'),
            prop: 'fileName',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        }, {
            label: t('file.upload.path'),
            prop: 'path',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        }, {
            label: t('file.upload.ext'),
            prop: 'ext',
            align: 'center',
            operator: false,
        }, {
            label: t('file.upload.storage'),
            prop: 'storage',
            align: 'center',
            render: 'tag',
            custom: {'local': 'success', 'ali_oss': 'success','txy_oss': 'success'},
            replaceValue: {'local': t('file.upload.local'), 'ali_oss': t('file.upload.ali_oss'),'txy_oss': t('file.upload.txy_oss')},
        },
        {
            label: t('file.upload.size'),
            prop: 'size',
            align: 'center',
            formatter: (row: TableRow, column: TableColumn, cellValue: string) => {
                const size = parseFloat(cellValue)
                const i = Math.floor(Math.log(size) / Math.log(1024))
                return (size / Math.pow(1024, i)).toFixed(i < 1 ? 0 : 2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i]
            },
            operator: 'RANGE',
            operatorPlaceholder: 'bytes',
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
            label: t('operate'),
            align: 'center',
            width: '100',
            render: 'buttons',
            buttons: optButtons,
            operator: false,
        },
    ],
    defaultOrder: {prop: 'lastuploadtime', order: 'desc'},
})

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getList()?.then(() => {
        baTable.beforeSort()
    })
})
/** 点击查看详情按钮响应 */
const infoButtonClick = (row: TableRow) => {
    if (!row) return
    // 数据来自表格数据,未重新请求api,深克隆,不然可能会影响表格
    let rowClone = cloneDeep(row)
    rowClone.data = rowClone.data ? [{
        label: '点击展开',
        children: buildJsonToElTreeData(JSON.parse(rowClone.data))
    }] : []
    baTable.form.extend!['info'] = rowClone
    baTable.form.operate = 'info'
}
</script>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'system/file',
})
</script>

<style scoped lang="scss">
.table-header-operate {
    margin-left: 12px;
}

.table-header-operate-text {
    margin-left: 6px;
}
</style>

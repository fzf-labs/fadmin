<template>
    <div class="default-main">
        <div class="ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
                      show-icon/>

            <!-- 表格顶部菜单 -->
            <TableHeader
                :buttons="['refresh', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
                :quick-search-placeholder="t('Fuzzy query Placeholder', { fields: t('file.upload.title') })"
            />
            <!-- 表格 -->
            <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
            <Table ref="tableRef"/>

            <!-- 编辑和新增表单 -->
            <PopupForm/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, provide} from 'vue'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import baTableClass from '/@/utils/baTable'
import {defaultOptButtons} from '/@/components/table/index'
import {previewRenderFormatter} from './index'
import {baTableApi} from '/@/api/common'
import {useI18n} from 'vue-i18n'
import {fileUploadUrl} from "/@/api/baTableUrl";

const {t} = useI18n()
const tableRef = ref()

const optBtn = defaultOptButtons(['edit', 'delete'])

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
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        }, {
            label: t('file.upload.storage'),
            prop: 'storage',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
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
            buttons: optBtn,
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

<template>
    <div>
        <el-dialog
            @close="emits('update:modelValue', false)"
            width="60%"
            :model-value="modelValue"
            class="ba-upload-select-dialog"
            :title="t('file.upload.selectFile')"
            :append-to-body="true"
            :destroy-on-close="true"
            top="4vh"
        >
            <TableHeader
                :buttons="['refresh', 'comSearch', 'quickSearch', 'columnDisplay']"
                :quick-search-placeholder="t('Fuzzy query Placeholder', { fields: t('file.upload.originalFileName') })"
            >
                <el-tooltip :content="t('file.upload.choice')" placement="top">
                    <el-button
                        @click="onChoice"
                        :disabled="baTable.table.selection!.length<=0"
                        v-blur
                        class="table-header-operate"
                        type="primary"
                    >
                        <Icon name="fa fa-check"/>
                        <span class="table-header-operate-text">{{ t('file.upload.choice') }}</span>
                    </el-button>
                </el-tooltip>
                <div class="ml-10" v-if="limit !== 0">
                    {{ t('file.upload.youCanAlsoSelect') }}
                    <span class="selection-count">{{ limit - baTable.table.selection!.length }}</span>
                    {{ t('file.upload.items') }}
                </div>
            </TableHeader>

            <Table ref="tableRef" @selection-change="onSelectionChange"/>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, provide, watch, nextTick} from 'vue'
import {useI18n} from 'vue-i18n'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import baTableClass from '/@/utils/baTable'
import {baTableApi, buildSuffixSvgUrl} from '/@/api/common'
import {fileUploadUrl} from "/@/api/baTableUrl";

interface Props {
    type?: 'image' | 'file'
    limit?: number
    modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'file',
    limit: 0,
    modelValue: false,
})

const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'choice', value: string[]): void
}>()

const tableRef = ref()
const {t} = useI18n()
const state = reactive({
    ready: false,
    tableSelectable: true,
})

const optBtn: OptButton[] = [
    {
        render: 'tipButton',
        name: 'choice',
        text: t('file.upload.choice'),
        type: 'primary',
        icon: 'fa fa-check',
        class: 'table-row-choice',
        disabledTip: false,
        click: (row: TableRow) => {
            const elTableRef = tableRef.value.getRef()
            elTableRef.clearSelection()
            emits('choice', row.url)
        },
    },
]
/**
 * 表格和表单中文件预览图的生成
 */
const previewRenderFormatter = (row: TableRow, column: TableColumn, cellValue: string) => {
    const imgSuffix = ['gif', 'jpg', 'jpeg', 'bmp', 'png', 'webp']
    if (imgSuffix.includes(cellValue)) {
        return row.full_url
    }
    return buildSuffixSvgUrl(cellValue)
}

const baTable = new baTableClass(new baTableApi(fileUploadUrl), {
    column: [
        {
            type: 'selection',
            selectable: (row: TableRow) => {
                if (props.limit == 0) return true
                if (baTable.table.selection) {
                    for (const key in baTable.table.selection) {
                        if (row.id == baTable.table.selection[key].id) {
                            return true
                        }
                    }
                }
                return state.tableSelectable
            },
            align: 'center',
            operator: false,
        },
        {
            label: t('id'),
            prop: 'id',
            align: 'center',
            operator: '=',
            operatorPlaceholder: t('Exact match'),
            width: 70
        },
        {
            label: t('file.upload.fileCategory'),
            prop: 'fileCategory',
            align: 'center',
            operator: '=',
            operatorPlaceholder: t('Exact match'),
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
            operator: false,
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
            operator: false,
        },
        {
            label: t('file.upload.storage'),
            prop: 'storage',
            align: 'center',
            render: 'tag',
            custom: {'local': 'success', 'ali_oss': 'success', 'txy_oss': 'success'},
            replaceValue: {
                'local': t('file.upload.local'),
                'ali_oss': t('file.upload.ali_oss'),
                'txy_oss': t('file.upload.txy_oss')
            },
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
    defaultOrder: {prop: 'id', order: 'desc'},
})

provide('baTable', baTable)

const getIndex = () => {
    baTable.table.ref = tableRef.value
    baTable.getList()?.then(() => {
        baTable.afterSort()
    })
    state.ready = true
}

const onChoice = () => {
    if (baTable.table.selection?.length) {
        let files: string[] = []
        for (const key in baTable.table.selection) {
            files.push(baTable.table.selection[key].url)
        }
        emits('choice', files)
        const elTableRef = tableRef.value.getRef()
        elTableRef.clearSelection()
    }
}

const onSelectionChange = (selection: TableRow[]) => {
    if (props.limit == 0) return
    if (selection.length > props.limit) {
        const elTableRef = tableRef.value.getRef()
        elTableRef.toggleRowSelection(selection[selection.length - 1], false)
    }
    state.tableSelectable = !(selection.length >= props.limit)
}

onMounted(() => {
    baTable.mount()
})

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && !state.ready) {
            nextTick(() => {
                getIndex()
            })
        }
    }
)
</script>

<style>
.ba-upload-select-dialog .el-dialog__body {
    padding: 10px 20px;
}

.table-header-operate-text {
    margin-left: 6px;
}

.ml-10 {
    margin-left: 10px;
}

.selection-count {
    color: var(--el-color-primary);
    font-weight: bold;
}
</style>

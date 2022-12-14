<template>
    <div>
        <slot name="neck"></slot>
        <el-table
            ref="tableRef"
            class="ba-data-table w100"
            header-cell-class-name="table-header-cell"
            :default-expand-all="baTable.table.expandAll"
            :data="baTable.table.data"
            :row-key="baTable.table.pk"
            :border="true"
            v-loading="baTable.table.loading"
            stripe
            @select-all="onSelectAll"
            @select="onSelect"
            @selection-change="onSelectionChange"
            @sort-change="onSortChange"
            @row-dblclick="baTable.onTableDblclick"
            v-bind="$attrs"
        >
            <slot name="columnPrepend"></slot>
            <template v-for="(item, key) in baTable.table.column">
                <Column v-if="item.show !== false" :attr="item" :key="key + '-column'">
                    <template v-if="item.render" #default="scope">
                        <FieldRender
                            :field="item"
                            :row="scope.row"
                            :column="scope.column"
                            :index="scope.$index"
                            :key="item.render == 'switch' ? 'sw-' + item.prop + '-' + key + '-' + scope.row[item.prop!] : key"
                        />
                    </template>
                </Column>
            </template>
            <slot name="columnAppend"></slot>
        </el-table>
        <div v-if="props.pagination" class="table-pagination">
            <el-pagination
                :currentPage="baTable.table.filter!.page"
                :page-size="baTable.table.filter!.limit"
                :page-sizes="pageSizes"
                background
                :layout="config.layout.shrink ? 'prev, next, jumper' : 'sizes,total, ->, prev, pager, next, jumper'"
                :total="baTable.table.total"
                @size-change="onTableSizeChange"
                @current-change="onTableCurrentChange"
            ></el-pagination>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, inject, computed } from 'vue'
import type { ElTable } from 'element-plus'
import Column from '/@/components/table/column/index.vue'
import FieldRender from '/@/components/table/fieldRender/index.vue'
import { useConfig } from '/@/stores/config'
import type baTableClass from '/@/utils/baTable'

const config = useConfig()
const tableRef = ref<InstanceType<typeof ElTable>>()
const baTable = inject('baTable') as baTableClass

interface Props extends Partial<InstanceType<typeof ElTable>> {
    pagination?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    pagination: true,
})

const onTableSizeChange = (val: number) => {
    baTable.onTableAction('page-size-change', { pageSize: val })
}

const onTableCurrentChange = (val: number) => {
    baTable.onTableAction('current-page-change', { page: val })
}

const onSortChange = ({ order, prop }: { order: string; prop: string }) => {
    baTable.onTableAction('sort-change', { prop: prop, order: order ? (order == 'ascending' ? 'asc' : 'desc') : '' })
}

const pageSizes = computed(() => {
    let defaultSizes = [10, 20, 50, 100]
    if (baTable.table.filter!.limit) {
        if (!defaultSizes.includes(baTable.table.filter!.limit)) {
            defaultSizes.push(baTable.table.filter!.limit)
        }
    }
    return defaultSizes
})

/*
 * ?????????????????????
 * ???????????????????????????????????????
 */
const onSelectAll = (selection: TableRow[]) => {
    if (isSelectAll(selection.map((row: TableRow) => row[baTable.table.pk!].toString()))) {
        selection.map((row: TableRow) => {
            if (row.children) {
                selectChildren(row.children, true)
            }
        })
    } else {
        tableRef.value?.clearSelection()
    }
}

/*
 * ?????????????????????
 * ???????????????????????????????????????
 * ????????????selectIds??????????????????id
 * ??????????????????selectIds?????????????????????id
 */
const isSelectAll = (selectIds: string[]) => {
    let data = baTable.table.data as TableRow[]
    for (const key in data) {
        return selectIds.includes(data[key][baTable.table.pk!].toString())
    }
    return false
}

/*
 * ????????????-??????
 */
const selectChildren = (children: TableRow[], type: boolean) => {
    children.map((j: TableRow) => {
        toggleSelection(j, type)
        if (j.children) {
            selectChildren(j.children, type)
        }
    })
}

/*
 * ??????????????????
 */
const toggleSelection = (row: TableRow, type: boolean) => {
    if (row) {
        nextTick(() => {
            tableRef.value?.toggleRowSelection(row, type)
        })
    }
}

/*
 * ????????????????????????????????????
 */
const onSelect = (selection: TableRow[], row: TableRow) => {
    if (
        selection.some((item: TableRow) => {
            return row[baTable.table.pk!] === item[baTable.table.pk!]
        })
    ) {
        if (row.children) {
            selectChildren(row.children, true)
        }
    } else {
        if (row.children) {
            selectChildren(row.children, false)
        }
    }
}

/*
 * ??????????????????
 */
const onSelectionChange = (selection: TableRow[]) => {
    baTable.onTableAction('selection-change', selection)
}

/*
 * ??????????????????-??????
 */
const setUnFoldAll = (children: TableRow[], unfold: boolean) => {
    for (const key in children) {
        tableRef.value?.toggleRowExpansion(children[key], unfold)
        if (children[key].children) {
            setUnFoldAll(children[key].children!, unfold)
        }
    }
}

/*
 * ????????????
 */
const unFoldAll = (unfold: boolean) => {
    setUnFoldAll(baTable.table.data!, unfold)
}

const getRef = () => {
    return tableRef.value
}

defineExpose({
    unFoldAll,
    getRef,
})
</script>

<style scoped lang="scss">
.ba-data-table :deep(.el-button + .el-button) {
    margin-left: 6px;
}
.ba-data-table :deep(.table-header-cell) .cell {
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.table-pagination {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    background-color: var(--ba-bg-color-overlay);
    padding: 13px 15px;
}
</style>

<template>
    <!-- 查看详情 -->
    <el-dialog class="ba-operate-dialog" :close-on-click-modal="false"
               :model-value="baTable.form.operate ? true : false" @close="baTable.toggleForm">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ t('info') }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'">
                <el-descriptions :column="2" border>
                    <el-descriptions-item :span="2" :label="t('id')">
                        {{ baTable.form.extend!.info.id }}
                    </el-descriptions-item>
                    <el-descriptions-item :span="2" :label="t('file.upload.fileCategory')">
                        {{ baTable.form.extend!.info.fileCategory }}
                    </el-descriptions-item>
                    <el-descriptions-item :span="2" :label="t('file.upload.fileName')">
                        {{ baTable.form.extend!.info.fileName }}
                    </el-descriptions-item>
                    <el-descriptions-item :span="2" :label="t('file.upload.originalFileName')">
                        {{ baTable.form.extend!.info.originalFileName }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('file.upload.storage')">
                        {{ baTable.form.extend!.info.storage }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('file.upload.path')">
                        {{ baTable.form.extend!.info.path }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('file.upload.url')">
                        {{ baTable.form.extend!.info.url }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('file.upload.ext')">
                        {{ baTable.form.extend!.info.ext }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('file.upload.size')">
                        {{ previewSizeFormatter(baTable.form.extend!.info.size)}}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('createdAt')">
                        {{ baTable.form.extend!.info.createdAt }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('updatedAt')">
                        {{ baTable.form.extend!.info.updatedAt }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>

<script setup lang="ts">
import {inject} from 'vue'
import {useI18n} from 'vue-i18n'
import type BaTable from '/@/utils/baTable'
import {previewSizeFormatter} from "/@/views/file/upload/index";

const baTable = inject('baTable') as BaTable

const {t} = useI18n()
</script>

<style scoped lang="scss">
.table-el-tree {
    :deep(.el-tree-node) {
        white-space: unset;
    }

    :deep(.el-tree-node__content) {
        display: block;
        align-items: unset;
        height: unset;
    }
}
</style>

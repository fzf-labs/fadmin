<template>
    <!-- 查看详情 -->
    <el-dialog class="ba-operate-dialog" :close-on-click-modal="false" :model-value="baTable.form.operate ? true : false" @close="baTable.toggleForm">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">{{ t('info') }}</div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div class="ba-operate-form" :class="'ba-' + baTable.form.operate + '-form'">
                <el-descriptions :column="2" border>
                    <el-descriptions-item :label="t('id')">
                        {{ baTable.form.extend!.info.id }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="t('system.adminLog.username')">
                        {{ baTable.form.extend!.info.username }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="t('system.adminLog.uri')">
                        {{ baTable.form.extend!.info.uri }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="t('system.adminLog.uriDesc')">
                        {{ baTable.form.extend!.info.uriDesc }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('system.adminLog.ip')">
                        {{ baTable.form.extend!.info.ip }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('system.adminLog.useragent')">
                        {{ baTable.form.extend!.info.useragent }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('system.adminLog.req')">
                        {{ baTable.form.extend!.info.req }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('system.adminLog.resp')">
                        {{ baTable.form.extend!.info.resp }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="120" :span="2" :label="t('createdAt')">
                        {{ baTable.form.extend!.info.createdAt }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import type BaTable from '/@/utils/baTable'

const baTable = inject('baTable') as BaTable

const { t } = useI18n()
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

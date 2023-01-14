<template>
    <!-- 对话框表单 -->
    <el-dialog class="ba-operate-dialog" :close-on-click-modal="false"
               :model-value="baTable.form.operate ? true : false" @close="baTable.toggleForm">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    v-if="!baTable.form.loading"
                    ref="formRef"
                    @keyup.enter="baTable.onSubmit(formRef)"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                >
                    <FormItem
                        :label="t('sensitive.word.categoryName')"
                        v-model.number="baTable.form.items!.categoryId"
                        type="select"
                        prop="categoryId"
                        :data="{ content: state.categoryList }"
                        :placeholder="t('Please input field', { field: t('sensitive.word.categoryName') })"
                    />
                    <FormItem
                        :label="t('sensitive.word.text')"
                        type="string"
                        v-model="baTable.form.items!.text"
                        prop="text"
                        :input-attr="{ placeholder: t('Please input field', { field: t('sensitive.word.text') }) }"
                    />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm('')">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)"
                           type="primary">
                    {{
                        baTable.form.operateIds && baTable.form.operateIds.length > 1 ? t('Save and edit next item') : t('Save')
                    }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref, inject} from 'vue'
import {useI18n} from 'vue-i18n'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type {ElForm, FormItemRule} from 'element-plus'
import {buildValidatorData} from '/@/utils/validate'
import {SensitiveCategoryList} from "/@/api/sensitive/category";

const formRef = ref<InstanceType<typeof ElForm>>()
const baTable = inject('baTable') as baTableClass

const {t} = useI18n()
const state: {
    categoryList: anyObj
} = reactive({
    categoryList: {}
})

SensitiveCategoryList({page: 1, pageSize: 1000}).then((res) => {
    const fieldSelect: anyObj = {}
    for (const key in res.data.list) {
        fieldSelect[res.data.list[key].id] = res.data.list[key].name
    }
    state.categoryList = fieldSelect
})

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    categoryId: [buildValidatorData({name: 'required', title: t('sensitive.word.categoryName')})],
    text: [buildValidatorData({name: 'required', title: t('sensitive.word.text')})],
})
</script>

<style scoped lang="scss"></style>

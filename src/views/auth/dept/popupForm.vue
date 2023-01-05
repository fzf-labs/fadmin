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
                    <el-form-item prop="pid" :label="t('resource.category.pid')">
                        <el-cascader v-model="baTable.form.items!.pid" :options="baTable.table.extend['treeList']"
                                     :props="pidProps" clearable/>
                    </el-form-item>

                    <FormItem
                        :label="t('auth.dept.name')"
                        type="string"
                        v-model="baTable.form.items!.name"
                        prop="name"
                        :input-attr="{ placeholder: t('Please input field', { field: t('auth.dept.name') }) }"
                    />
                    <FormItem
                        :label="t('auth.dept.fullName')"
                        type="string"
                        v-model="baTable.form.items!.fullName"
                        prop="fullName"
                        :input-attr="{ placeholder: t('Please input field', { field: t('auth.dept.fullName') }) }"
                    />
                    <FormItem
                        :label="t('auth.dept.responsible')"
                        type="string"
                        v-model="baTable.form.items!.responsible"
                        prop="responsible"
                        :input-attr="{ placeholder: t('Please input field', { field: t('auth.dept.responsible') }) }"
                    />
                    <FormItem
                        :label="t('auth.dept.phone')"
                        type="string"
                        v-model="baTable.form.items!.phone"
                        prop="phone"
                        :input-attr="{ placeholder: t('Please input field', { field: t('auth.dept.phone') }) }"
                    />
                    <FormItem
                        :label="t('auth.dept.email')"
                        type="string"
                        v-model="baTable.form.items!.email"
                        prop="email"
                        :input-attr="{ placeholder: t('Please input field', { field: t('auth.dept.email') }) }"
                    />
                    <FormItem
                        :label="t('auth.dept.type')"
                        type="select"
                        v-model="baTable.form.items!.type"
                        prop="type"
                        :data="{ content: { 1: t('auth.dept.type 1'), 2: t('auth.dept.type 2'), 3: t('auth.dept.type 3') } }"
                        :input-attr="{ placeholder: t('Please select field', { field: t('auth.dept.type') }) }"
                    />
                    <FormItem
                        :label="t('auth.dept.status')"
                        type="radio"
                        v-model.number="baTable.form.items!.status"
                        prop="status"
                        :data="{ content: { 0: t('auth.dept.status 0'), 1: t('auth.dept.status 1') } }"
                        :input-attr="{ placeholder: t('Please select field', { field: t('auth.dept.status') }) }"
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

const formRef = ref<InstanceType<typeof ElForm>>()
const baTable = inject('baTable') as baTableClass

const {t} = useI18n()

const pidProps = {
    checkStrictly: true,
    emitPath: false,
    label: "name",
    value: "id",
}
const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    pid: [buildValidatorData({name: 'required', title: t('auth.dept.pid')})],
    name: [buildValidatorData({name: 'required', title: t('auth.dept.name')})],
    fullName: [buildValidatorData({name: 'required', title: t('auth.dept.fullName')})],
    status: [buildValidatorData({name: 'required', title: t('auth.dept.status')})],
})
</script>

<style scoped lang="scss"></style>

<template>
    <!-- 对话框表单 -->
    <el-dialog class="ba-operate-dialog" :close-on-click-modal="false"
               :model-value="!!baTable.form.operate" @close="baTable.toggleForm">
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
                    ref="formRef"
                    @keyup.enter="baTable.onSubmit(formRef)"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <FormItem
                        :label="t('auth.manage.username')"
                        v-model="baTable.form.items!.username"
                        type="string"
                        prop="username"
                        :placeholder="t('auth.manage.Administrator login')"
                    />
                    <FormItem
                        :label="t('auth.manage.nickname')"
                        v-model="baTable.form.items!.nickname"
                        type="string"
                        prop="nickname"
                        :placeholder="t('Please input field', { field: t('auth.manage.nickname') })"
                    />
                    <FormItem
                        :label="t('auth.manage.password')"
                        prop="password"
                        v-model="baTable.form.items!.password"
                        type="password"
                        :placeholder="
                            baTable.form.operate === 'add'
                                ? t('Please input field', { field: t('auth.manage.password') })
                                : t('auth.manage.Please leave blank if not modified')
                        "
                    />
                    <el-form-item prop="roleIds" :label="t('auth.manage.roleIds')">
                        <el-cascader v-model="baTable.form.items!.roleIds" :options="state.roleList"
                                     :props="roleProps" clearable/>
                    </el-form-item>
                    <el-form-item prop="deptId" :label="t('auth.manage.deptName')">
                        <el-cascader v-model="baTable.form.items!.deptId" :options="state.deptList"
                                     :props="pidProps" clearable/>
                    </el-form-item>
                    <FormItem
                        :label="t('auth.manage.jobName')"
                        v-model.number="baTable.form.items!.jobId"
                        type="select"
                        prop="jobId"
                        :data="{ content: state.jobList }"
                        :placeholder="t('Please input field', { field: t('auth.manage.jobName') })"
                    />

                    <FormItem :label="t('auth.manage.avatar')" type="image" v-model="baTable.form.items!.avatar"/>
                    <FormItem
                        :label="t('auth.manage.gender')"
                        v-model.number="baTable.form.items!.gender"
                        type="select"
                        :data="{ content: { 0: t('auth.manage.gender 0'), 1: t('auth.manage.gender 1') , 2: t('auth.manage.gender 2') }}"
                        :placeholder="t('Please input field', { field: t('auth.manage.gender') })"
                    />
                    <FormItem
                        :label="t('auth.manage.email')"
                        prop="email"
                        v-model="baTable.form.items!.email"
                        type="string"
                        :placeholder="t('Please input field', { field: t('auth.manage.email') })"
                    />
                    <FormItem
                        :label="t('auth.manage.mobile')"
                        prop="mobile"
                        v-model="baTable.form.items!.mobile"
                        type="string"
                        :placeholder="t('Please input field', { field: t('auth.manage.mobile') })"
                    />

                    <el-form-item prop="motto" :label="t('auth.manage.Personal signature')">
                        <el-input
                            @keyup.enter.stop=""
                            @keyup.ctrl.enter="baTable.onSubmit(formRef)"
                            v-model="baTable.form.items!.motto"
                            type="textarea"
                            :placeholder="t('Please input field', { field: t('auth.manage.Personal signature') })"
                        ></el-input>
                    </el-form-item>
                    <FormItem
                        :label="t('state')"
                        v-model="baTable.form.items!.status"
                        type="radio"
                        :data="{ content: { '0': t('Disable'), '1': t('Enable') }, childrenAttr: { border: true } }"
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
import {ref, reactive, inject, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import type baTableClass from '/@/utils/baTable'
import {regularPassword, buildValidatorData} from '/@/utils/validate'
import type {ElForm, FormItemRule} from 'element-plus'
import FormItem from '/@/components/formItem/index.vue'
import {sysJobList} from "/@/api/sys/job";
import {uuid} from "/@/utils/random";
import {sysDeptList} from "/@/api/sys/dept";
import {sysRoleList} from "/@/api/sys/role";

const formRef = ref<InstanceType<typeof ElForm>>()
const baTable = inject('baTable') as baTableClass

const {t} = useI18n()
const pidProps = {
    checkStrictly: true,
    emitPath: false,
    label: "name",
    value: "id",
}

const roleProps = {
    checkStrictly: true,
    emitPath: false,
    label: "name",
    value: "id",
    multiple: true,
}

const state: {
    treeKey: string
    deptList: []
    roleList: []
    jobList: anyObj
} = reactive({
    treeKey: uuid(),
    deptList: [],
    roleList: [],
    jobList: {}
})
const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    username: [
        buildValidatorData({name: 'required', title: t('auth.manage.username')}),
        buildValidatorData({
            name: 'account',
            message: t('Please enter the correct field', {field: t('auth.manage.username')})
        }),
    ],
    nickname: [buildValidatorData({name: 'required', title: t('auth.manage.nickname')})],
    roleIds: [buildValidatorData({
        name: 'required',
        message: t('Please select field', {field: t('auth.manage.grouping')})
    })],
    email: [buildValidatorData({
        name: 'email',
        message: t('Please enter the correct field', {field: t('auth.manage.mailbox')})
    })],
    mobile: [buildValidatorData({
        name: 'mobile',
        message: t('Please enter the correct field', {field: t('auth.manage.mobile')})
    })],
    password: [
        {
            validator: (rule: any, val: string, callback: Function) => {
                if (baTable.form.operate == 'add') {
                    if (!val) {
                        return callback(new Error(t('Please input field', {field: t('auth.manage.Password')})))
                    }
                } else {
                    if (!val) {
                        return callback()
                    }
                }
                if (!regularPassword(val)) {
                    return callback(new Error(t('Please enter the correct field', {field: t('auth.manage.Password')})))
                }
                return callback()
            },
            trigger: 'blur',
        },
    ],
})

sysRoleList().then((res) => {
    state.roleList = res.data.list
})

sysDeptList().then((res) => {
    state.deptList = res.data.list
})
sysJobList({page: 1, pageSize: 1000}).then((res) => {
    const fieldSelect: anyObj = {}
    for (const key in res.data.list) {
        fieldSelect[res.data.list[key].id] = res.data.list[key].name
    }
    state.jobList = fieldSelect
})
watch(
    () => baTable.form.operate,
    (newVal) => {
        rules.password![0].required = newVal == 'add'
    }
)
</script>

<style scoped lang="scss">
.avatar-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: var(--el-border-radius-small);
    box-shadow: var(--el-box-shadow-light);
    border: 1px dashed var(--el-border-color);
    cursor: pointer;
    overflow: hidden;
    width: 110px;
    height: 110px;
}

.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}

.avatar {
    width: 110px;
    height: 110px;
    display: block;
}

.image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>

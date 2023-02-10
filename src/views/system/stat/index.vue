<template>
    <div class="default-main">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>CPU</span>
                </div>
            </template>
            <div class="text item">
                <el-table :data="[state.cpu]" size="large">
                    <el-table-column prop="vendorId" label="CPU制造商"/>
                    <el-table-column prop="cpuModel" label="CPU型号"/>
                    <el-table-column prop="coreNum" label="核心数"/>
                    <el-table-column prop="percent" label="使用率"/>
                </el-table>
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>内存</span>
                </div>
            </template>
            <div class="text item">
                <el-table :data="[state.memory]" size="large">
                    <el-table-column prop="total" label="总内存"/>
                    <el-table-column prop="used" label="已用内存"/>
                    <el-table-column prop="free" label="剩余内存"/>
                    <el-table-column prop="usage" label="使用率"/>
                </el-table>
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>服务器信息</span>
                </div>
            </template>
            <div class="text item">
                <el-table :data="[state.sys]">
                    <el-table-column prop="computerName" label="服务器名称" min-width="150"/>
                    <el-table-column prop="localIp" label="内网IP" min-width="120"/>
                    <el-table-column prop="publicIp" label="公网IP" min-width="120"/>
                    <el-table-column prop="os" label="操作系统" min-width="100"/>
                    <el-table-column prop="arch" label="系统架构" min-width="100"/>
                    <el-table-column prop="goVersion" label="Go版本" min-width="100"/>
                    <el-table-column prop="npmVersion" label="NPM版本" min-width="100"/>
                    <el-table-column prop="nodeVersion" label="Node版本" min-width="100"/>
                    <el-table-column prop="projectPath" label="项目地址" min-width="250"/>
                    <el-table-column prop="projectStartTime" label="项目启动时间" min-width="100"/>
                    <el-table-column prop="projectRunTime" label="项目运行时间" min-width="100"/>
                </el-table>
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>硬盘状态</span>
                </div>
            </template>
            <div class="text item">
                <el-table :data="state.disk" size="large">
                    <el-table-column prop="dirName" label="盘符路径" min-width="100"/>
                    <el-table-column prop="sysTypeName" label="文件系统" min-width="100"/>
                    <el-table-column prop="typeName" label="盘符类型" min-width="100"/>
                    <el-table-column prop="total" label="总大小" min-width="100"/>
                    <el-table-column prop="free" label="可用大小" min-width="100"/>
                    <el-table-column prop="used" label="已用大小" min-width="100"/>
                    <el-table-column prop="usage" label="已用百分比" min-width="100"/>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount} from "vue";
import {SystemStat} from "/@/api/system/stat";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const state = ref({
    cpu: {} as any,
    disk: [],
    memory: {} as any,
    sys: {} as any,
});
const getSystemStat = () => {
    SystemStat().then((res) => {
        state.value = res.data
    })
}
getSystemStat()
let workTimer: NodeJS.Timer
onMounted(() => {
    workTimer = setInterval(getSystemStat, 10000);
});
onBeforeUnmount(() => {
    clearInterval(workTimer);
});
</script>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'

export default defineComponent({
    name: 'system/stat',
})
</script>

<style scoped lang="scss">
.default-main {
    column-count: 1;
    column-gap: 10px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    margin-top: 10px;
}
</style>

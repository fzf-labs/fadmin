<template>
    <div class="default-main">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>{{ t('system.stat.runtime') }}</span>
                </div>
            </template>
            <el-descriptions
                class="margin-top"
                :column="1"
                border
            >
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.runtime os') }}
                        </div>
                    </template>
                    {{ state.runtime.os }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.runtime arch') }}
                        </div>
                    </template>
                    {{ state.runtime.arch }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.runtime goVersion') }}
                        </div>
                    </template>
                    {{ state.runtime.goVersion }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.runtime npmVersion') }}
                        </div>
                    </template>
                    {{ state.runtime.npmVersion }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.runtime nodeVersion') }}
                        </div>
                    </template>
                    {{ state.runtime.nodeVersion }}
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>{{ t('system.stat.cpu') }}</span>
                </div>
            </template>
            <el-descriptions
                class="margin-top"
                :column="1"
                border
            >
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.cpu vendorId') }}
                        </div>
                    </template>
                    {{ state.cpu.vendorId }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.cpu modelName') }}
                        </div>
                    </template>
                    {{ state.cpu.modelName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.cpu cores') }}
                        </div>
                    </template>
                    {{ state.cpu.cores }}
                </el-descriptions-item>
                <el-descriptions-item v-for="(item, idx) in state.cpu.coresLoad" :key="idx">
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.cpu core') }}:{{ idx }}
                        </div>
                    </template>
                    {{ item }}
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>{{ t('system.stat.disk') }}</span>
                </div>
            </template>
            <el-descriptions
                class="margin-top"
                :column="1"
                border
            >
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.disk total') }}
                        </div>
                    </template>
                    {{ state.disk.total }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.disk available') }}
                        </div>
                    </template>
                    {{ state.disk.available }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.disk used') }}
                        </div>
                    </template>
                    {{ state.disk.used }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.disk usedPercent') }}
                        </div>
                    </template>
                    {{ state.disk.usedPercent }}
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>{{ t('system.stat.memory') }}</span>
                </div>
            </template>
            <el-descriptions
                class="margin-top"
                :column="1"
                border
            >
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.memory total') }}
                        </div>
                    </template>
                    {{ state.memory.total }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.memory available') }}
                        </div>
                    </template>
                    {{ state.memory.available }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.memory used') }}
                        </div>
                    </template>
                    {{ state.memory.used }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            {{ t('system.stat.memory usedPercent') }}
                        </div>
                    </template>
                    {{ state.memory.usedPercent }}
                </el-descriptions-item>
            </el-descriptions>
        </el-card>

    </div>
</template>

<script setup lang="ts">
import {reactive, onMounted, onBeforeUnmount} from "vue";
import {SystemStat} from "/@/api/system/stat";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const state: {
    cpu: {
        vendorId: string,
        modelName: string,
        cores: string,
        coresLoad: number[]
    },
    disk: {
        total: string,
        available: string,
        used: string,
        usedPercent: string
    },
    memory: {
        total: string,
        available: string,
        used: string,
        usedPercent: string
    },
    runtime: {
        goVersion: string,
        npmVersion: string,
        nodeVersion: string,
        os: string,
        arch: string
    }
} = reactive({
    cpu: {
        vendorId: "",
        modelName: "",
        cores: "",
        coresLoad: []
    },
    disk: {
        total: "",
        available: "",
        used: "",
        usedPercent: ""
    },
    memory: {
        total: "",
        available: "",
        used: "",
        usedPercent: ""
    },
    runtime: {
        goVersion: "",
        npmVersion: "",
        nodeVersion: "",
        os: "",
        arch: ""
    }
})
const getSystemStat = () => {
    SystemStat().then((res) => {
        state.cpu = res.data.cpu
        state.disk = res.data.disk
        state.memory = res.data.memory
        state.runtime = res.data.runtime
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
import {defineComponent, onMounted} from 'vue'

export default defineComponent({
    name: 'system/stat',
})
</script>

<style scoped lang="scss">
.default-main {
    column-count: 2;
    column-gap: 10px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.box-card {
    margin-bottom: 10px;
    break-inside: avoid;
    transform: translateZ(0);
}
</style>

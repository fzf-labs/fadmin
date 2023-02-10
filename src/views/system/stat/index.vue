<template>
    <div class="system-environment">
        <div class="lg:flex">
            <el-card class="!border-none flex-1 mb-4 lg:mr-4" shadow="never">
                <div>CPU</div>
                <div class="mt-4">
                    <div class="flex flex-wrap">
                        <div class="sm:flex-1 w-1/2 mb-4">
                            <div class="text-4xl mb-3">
                                {{ state.cpu.vendorId }}
                            </div>
                            <div class="text-tx-regular">
                                CPU制造商
                            </div>
                        </div>

                        <div class="sm:flex-1 w-1/2 mb-4">
                            <div class="text-4xl mb-3">
                                {{ state.cpu.CpuModel }}
                            </div>
                            <div class="text-tx-regular">
                                CPU型号
                            </div>
                        </div>

                        <div class="sm:flex-1 w-1/2 mb-4">
                            <div class="text-4xl mb-3">
                                {{ state.cpu.CoreNum }}
                            </div>
                            <div class="text-tx-regular">核心数</div>
                        </div>

                        <div class="sm:flex-1 w-1/2 mb-4">
                            <div class="text-4xl mb-3">
                                {{ state.cpu.Percent }}
                            </div>
                            <div class="text-tx-regular">使用率</div>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="!border-none flex-1 mb-4" shadow="never">
                <div>内存</div>
                <div class="mt-4">
                    <div class="flex flex-wrap">
                        <div class="sm:flex-1 w-1/2 mb-4">
                            <div class="text-4xl mb-3">
                                {{ state.memory.total }}
                            </div>
                            <div class="text-tx-regular">
                                总内存
                            </div>
                        </div>

                        <div class="sm:flex-1 w-1/2 mb-4">
                            <div class="text-4xl mb-3">
                                {{ state.memory.Used }}
                            </div>
                            <div class="text-tx-regular">已用内存</div>
                        </div>

                        <div class="sm:flex-1 w-1/2 mb-4">
                            <div class="text-4xl mb-3">
                                {{ state.memory.Free }}
                            </div>
                            <div class="text-tx-regular">剩余内存</div>
                        </div>

                        <div class="sm:flex-1 w-1/2 mb-4">
                            <div class="text-4xl mb-3">
                                {{ state.memory.Usage }}
                            </div>
                            <div class="text-tx-regular">使用率</div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <el-card shadow="never" class="!border-none mt-4">
            <div>硬盘状态</div>
            <div class="mt-4">
                <el-table :data="state.disk" size="large">
                    <el-table-column prop="dirName" label="盘符路径" min-width="100"/>
                    <el-table-column
                        prop="sysTypeName"
                        label="文件系统"
                        min-width="100"
                    />
                    <el-table-column prop="typeName" label="盘符类型" min-width="100"/>
                    <el-table-column prop="total" label="总大小" min-width="100"/>
                    <el-table-column prop="free" label="可用大小" min-width="100"/>
                    <el-table-column prop="used" label="已用大小" min-width="100"/>
                    <el-table-column prop="usage" label="已用百分比" min-width="100">
                        <template #default="{ row }"> {{ row.usage }}%</template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card class="!border-none" shadow="never">
            <div>服务器信息</div>
            <div class="mt-4">
                <el-table :data="[state.sys]" size="large">
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
    column-count: 2;
    column-gap: 10px;
}

</style>

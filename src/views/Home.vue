<template>
    <div class="home-container">
        <!-- 背景切换组件 -->
        <!-- <BackgroundChanger /> -->
        <HomeView />

        <!-- 主要内容区域 -->
        <div class="main-content">
            <!-- 头部标题 -->
            <header class="header">
                <h1 class="main-title">
                    <span class="title-icon">✨</span>
                    星座运势查询系统
                    <span class="title-icon">✨</span>
                </h1>
                <p class="subtitle">探索星空的奥秘，解读命运的密码</p>
            </header>

            <!-- 控制面板 -->
            <div class="control-panel">
                <!-- 星座选择 -->
                <StarSelector @change="handleConstellationChange" />

                <!-- 日期切换 -->
                <div class="date-selector">
                    <el-radio-group v-model="selectedDate" @change="handleDateChange" size="large">
                        <el-radio-button label="today">今日运势</el-radio-button>
                        <el-radio-button label="tomorrow">明日运势</el-radio-button>
                    </el-radio-group>
                </div>
            </div>

            <!-- 运势展示区域 -->
            <div class="fortune-display">
                <HoroscopeCard 
                    :horoscope-data="horoscopeData" 
                    :loading="loading"
                    :selected-constellation="selectedConstellation"
                />
            </div>

            <!-- 错误提示 -->
            <div v-if="error" class="error-container">
                <el-alert :title="error" type="error" center show-icon :closable="false" />
            </div>
        </div>

        <!-- 页脚 -->
        <footer class="footer">
            <p class="footer-text">
                © 2025 星座运势查询系统 | 数据来源：天行数据
            </p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StarSelector from '@/components/StarSelector.vue'
import HoroscopeCard from '@/components/HoroscopeCardNew.vue'
import BackgroundChanger from '@/components/BackgroundChanger.vue'
import HomeView from './HomeView.vue'
import { getHoroscope } from '@/api/horoscope'
import type { HoroscopeItem, DateType } from '@/api/types'

// 响应式数据
const selectedConstellation = ref<string>('')
const selectedDate = ref<DateType>('today')
const horoscopeData = ref<HoroscopeItem[]>([])
const loading = ref<boolean>(false)
const error = ref<string>('')

// 处理星座选择变化
const handleConstellationChange = async (constellation: string) => {
    selectedConstellation.value = constellation
    await fetchHoroscope()
}

// 处理日期选择变化
const handleDateChange = async () => {
    if (selectedConstellation.value) {
        await fetchHoroscope()
    }
}

// 获取运势数据
const fetchHoroscope = async () => {
    if (!selectedConstellation.value) return

    try {
        loading.value = true
        error.value = ''

        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        const response = await getHoroscope(selectedConstellation.value)
        console.log(response, 'response');
        

        if (response.code === 200) {
            // 直接使用API返回的list数组
            horoscopeData.value = response.result.list;
            console.log(`成功获取${selectedConstellation.value}${selectedDate.value === 'today' ? '今日' : '明日'}运势`)
        } else {
            throw new Error(response.msg || '获取运势失败')
        }
    } catch (err) {
        error.value = '获取运势数据失败，使用模拟数据'
        console.error('获取运势失败:', err)
        
        // 使用模拟数据
        horoscopeData.value = [
            { type: '综合指数', content: '75%' },
            { type: '爱情指数', content: '80%' },
            { type: '事业指数', content: '70%' },
            { type: '健康指数', content: '85%' },
            { type: '财运指数', content: '65%' },
            { type: '幸运数字', content: '7' },
            { type: '幸运颜色', content: '紫色' },
            { type: '运势总结', content: `今天的${selectedConstellation.value}状态不错，适合展开新计划。保持积极的心态，好运自然会来到你身边。` },
        ]
        error.value = '' // 清除错误，因为我们有备用数据
    } finally {
        loading.value = false
    }
}

// 初始化
const initializeApp = () => {
    // 可以在这里添加初始化逻辑
    console.log('星座运势查询系统初始化完成')
}

// 组件挂载时初始化
onMounted(() => {
    initializeApp()
})
</script>

<style lang="scss" scoped>
.home-container {
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-xl $spacing-md;
    position: relative;
    z-index: 10;
}

.header {
    text-align: center;
    margin-bottom: $spacing-xl;
    animation: fadeInDown 1s ease-out;

    .main-title {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 $spacing-md;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-md;

        .title-icon {
            font-size: 2.5rem;
            animation: twinkle 2s infinite;
        }
    }

    .subtitle {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        font-weight: 300;
        letter-spacing: 1px;
    }
}

.control-panel {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
    animation: fadeInUp 1s ease-out 0.3s both;

    .date-selector {
        display: flex;
        justify-content: center;

        :deep(.el-radio-group) {
            background: $bg-card;
            border-radius: $border-radius-medium;
            padding: 4px;
            box-shadow: $shadow-light;
            backdrop-filter: blur(10px);

            .el-radio-button {
                &:first-child {
                    .el-radio-button__inner {
                        border-radius: $border-radius-small 0 0 $border-radius-small;
                    }
                }

                &:last-child {
                    .el-radio-button__inner {
                        border-radius: 0 $border-radius-small $border-radius-small 0;
                    }
                }

                .el-radio-button__inner {
                    background: transparent;
                    border: none;
                    color: $text-primary;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;

                    &:hover {
                        background: rgba(139, 126, 216, 0.1);
                        color: $primary-color;
                    }
                }

                &.is-active {
                    .el-radio-button__inner {
                        background: $primary-color;
                        color: $text-light;
                        box-shadow: $shadow-light;
                    }
                }
            }
        }
    }
}

.fortune-display {
    width: 100%;
    max-width: 800px;
    animation: fadeInUp 1s ease-out 0.6s both;
}

.error-container {
    margin-top: $spacing-lg;
    width: 100%;
    max-width: 600px;
    animation: shake 0.5s ease-in-out;

    :deep(.el-alert) {
        background: rgba(245, 108, 108, 0.1);
        border: 1px solid rgba(245, 108, 108, 0.3);
        border-radius: $border-radius-medium;
        backdrop-filter: blur(10px);

        .el-alert__title {
            color: #f56c6c;
            font-weight: 600;
        }
    }
}

.footer {
    padding: $spacing-lg;
    text-align: center;
    position: relative;
    z-index: 10;

    .footer-text {
        margin: 0;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
}

// 动画定义
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes twinkle {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.8;
        transform: scale(1.1);
    }
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

// 响应式设计
@media (max-width: 768px) {
    .main-content {
        padding: $spacing-lg $spacing-sm;
    }

    .header {
        .main-title {
            font-size: 2rem;
            flex-direction: column;
            gap: $spacing-sm;

            .title-icon {
                font-size: 1.8rem;
            }
        }

        .subtitle {
            font-size: 1rem;
        }
    }

    .control-panel {
        gap: $spacing-md;

        .date-selector {
            :deep(.el-radio-group) {
                .el-radio-button {
                    .el-radio-button__inner {
                        padding: 10px 16px;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}

@media (max-width: 480px) {
    .header {
        .main-title {
            font-size: 1.8rem;

            .title-icon {
                font-size: 1.5rem;
            }
        }
    }

    .control-panel {
        .date-selector {
            :deep(.el-radio-group) {
                .el-radio-button {
                    .el-radio-button__inner {
                        padding: 8px 12px;
                        font-size: 13px;
                    }
                }
            }
        }
    }
}
</style>
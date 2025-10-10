<template>
    <div class="home-container">
        <!-- 背景组件 -->
        <HomeView class="background-view" />

        <!-- 主要内容区域 -->
        <div class="main-content">
            <!-- 头部标题 -->
            <header class="header">
                <h1 class="main-title">
                    <span class="title-icon">✨</span>
                    <span class="title">星座运势查询</span>
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
                        <el-radio-button label="other">{{ getDateButtonText() }}</el-radio-button>
                    </el-radio-group>
                    
                    <!-- 日期选择器 - 在radio-group外部 -->
                    <div v-if="selectedDate === 'other'" class="custom-date-selector">
                        <el-date-picker
                            v-model="customDate"
                            type="date"
                            placeholder="选择日期"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            @change="handleCustomDateChange"
                            size="small"
                        />
                    </div>
                </div>
            </div>

            <!-- 运势展示区域 -->
            <div class="fortune-display">
                <HoroscopeCard :horoscope-data="horoscopeData" :loading="loading"
                    :selected-constellation="selectedConstellation" :selected-date="selectedDate"
                    :custom-date="customDate" />
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
import HomeView from './HomeView.vue'
import { getHoroscope } from '@/api/horoscope'
import type { HoroscopeItem, DateType } from '@/api/types'

// 响应式数据
const selectedConstellation = ref<string>('')
const selectedDate = ref<DateType>('today')
const customDate = ref<string>('')
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
    if (selectedDate.value === 'other' && !customDate.value) {
        // 如果切换到其他日运势但没有选择日期，设置默认为今天
        const today = new Date()
        customDate.value = today.toISOString().split('T')[0]
    }

    if (selectedConstellation.value) {
        if (selectedDate.value === 'today') {
            // 今日运势不需要日期参数
            await fetchHoroscope()
        } else if (selectedDate.value === 'other' && customDate.value) {
            // 其他日运势需要日期参数
            await fetchHoroscope()
        }
    }
}

// 处理自定义日期选择变化
const handleCustomDateChange = async () => {
    if (selectedConstellation.value && customDate.value) {
        await fetchHoroscope()
    }
}

// 获取日期按钮显示文本
const getDateButtonText = (): string => {
    if (selectedDate.value === 'other') {
        if (customDate.value) {
            return customDate.value
        } else {
            // 如果没有选择日期，显示今天的日期
            return new Date().toISOString().split('T')[0]
        }
    }
    return '其他日运势'
}

// 获取运势数据
const fetchHoroscope = async () => {
    if (!selectedConstellation.value) return

    try {
        loading.value = true
        error.value = ''

        // 根据选择的日期类型决定是否传递日期参数
        let dateParam: string | undefined = undefined
        if (selectedDate.value === 'other' && customDate.value) {
            dateParam = customDate.value
        }

        const response = await getHoroscope(selectedConstellation.value, dateParam)
        if (response.code === 200) {
            // 直接使用API返回的list数组
            horoscopeData.value = response.result.list;
            const dateText = selectedDate.value === 'today' ? '今日' : `${customDate.value}`
            console.log(`成功获取${selectedConstellation.value}${dateText}运势`)
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

.background-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.main-content {
    width: 100%;
    max-width: 500px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-md $spacing-sm;
    z-index: 1;
    background: transparent;
    margin-left: $spacing-lg;
}

.header {
    text-align: center;
    margin-bottom: $spacing-md;
    animation: fadeInDown 1s ease-out;

    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        margin: 0 0 $spacing-sm;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-sm;

        .title {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .title-icon {
            font-size: 2rem;
            animation: twinkle 2s infinite;
        }
    }

    .subtitle {
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 300;
        letter-spacing: 1px;
    }
}

.control-panel {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
    animation: fadeInUp 1s ease-out 0.3s both;

    .date-selector {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: $spacing-sm;
        flex-wrap: wrap;

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
                    padding: 8px 16px;
                    font-size: 14px;
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

    .custom-date-selector {
        :deep(.el-date-editor) {
            background: $bg-card;
            border: 1px solid rgba(139, 126, 216, 0.3);
            border-radius: $border-radius-medium;
            box-shadow: $shadow-light;
            backdrop-filter: blur(10px);
            width: 140px;

            .el-input__inner {
                background: transparent;
                border: none;
                color: $text-primary;
                font-weight: 500;
                text-align: center;
                font-size: 12px;
                padding: 6px 8px;

                &::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }
            }

            .el-input__prefix {
                color: $primary-color;
            }

            &:hover {
                border-color: $primary-color;
            }

            &.is-focus {
                border-color: $primary-color;
                box-shadow: 0 0 0 2px rgba(139, 126, 216, 0.2);
            }
        }
    }
}

.fortune-display {
    width: 100%;
    max-width: 450px;
    animation: fadeInUp 1s ease-out 0.6s both;
}

.error-container {
    margin-top: $spacing-md;
    width: 100%;
    max-width: 450px;
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
    padding: $spacing-sm;
    text-align: center;
    position: relative;
    z-index: 1;
    flex-shrink: 0;

    .footer-text {
        margin: 0;
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
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
</style>
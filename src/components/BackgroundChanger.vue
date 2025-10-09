<template>
    <div class="background-changer">
        <div class="control-panel">
            <el-button-group>
                <el-button type="primary" @click="changeBackground" size="small">
                    🔄 换背景
                </el-button>
                <el-button :type="musicPlaying ? 'success' : 'info'" @click="toggleMusic" size="small">
                    {{ musicPlaying ? '⏸️ 暂停' : '▶️ 播放' }}音乐
                </el-button>
            </el-button-group>
        </div>

        <!-- 背景图片 -->
        <div class="background-image" :style="{ backgroundImage: `url(${currentBackground})` }"></div>

        <!-- 音乐播放器 -->
        <audio ref="audioPlayer" :src="currentMusic" loop preload="auto" @ended="handleMusicEnd"></audio>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentBackground = ref<string>('')
const currentMusic = ref<string>('')
const musicPlaying = ref<boolean>(false)
const audioPlayer = ref<HTMLAudioElement>()

// 背景图片列表（可以是在线图片或本地图片）
const backgroundImages = [
    'https://picsum.photos/1920/1080?random=1',
    'https://picsum.photos/1920/1080?random=2',
    'https://picsum.photos/1920/1080?random=3',
    'https://picsum.photos/1920/1080?random=4',
    'https://picsum.photos/1920/1080?random=5',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
]

// 背景音乐列表（示例，需要替换为实际的音乐文件）
const musicList = [
    // 这里应该是实际的音乐文件路径
    // '/src/assets/music/bg-music-1.mp3',
    // '/src/assets/music/bg-music-2.mp3',
    // 由于是示例，我们使用空字符串
    '',
]

// 切换背景图片
const changeBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length)
    currentBackground.value = backgroundImages[randomIndex]

    // 添加切换动画效果
    const bgElement = document.querySelector('.background-image') as HTMLElement
    if (bgElement) {
        bgElement.style.opacity = '0'
        setTimeout(() => {
            bgElement.style.opacity = '1'
        }, 300)
    }
}

// 切换音乐播放状态
const toggleMusic = () => {
    if (!audioPlayer.value) return

    if (musicPlaying.value) {
        audioPlayer.value.pause()
        musicPlaying.value = false
    } else {
        // 如果没有音乐文件，显示提示
        if (!currentMusic.value) {
            // 可以在这里添加提示消息
            console.log('暂无背景音乐文件')
            return
        }
        audioPlayer.value.play()
        musicPlaying.value = true
    }
}

// 处理音乐结束事件
const handleMusicEnd = () => {
    musicPlaying.value = false
}

// 初始化背景和音乐
const initializeBackground = () => {
    // 设置初始背景
    changeBackground()

    // 设置初始音乐（如果有的话）
    if (musicList.length > 0) {
        const randomMusicIndex = Math.floor(Math.random() * musicList.length)
        currentMusic.value = musicList[randomMusicIndex]
    }
}

// 生命周期钩子
onMounted(() => {
    initializeBackground()

    // 每30秒自动切换背景（可选）
    const backgroundInterval = setInterval(() => {
        changeBackground()
    }, 30000)

    // 清理定时器
    onUnmounted(() => {
        clearInterval(backgroundInterval)
        if (audioPlayer.value) {
            audioPlayer.value.pause()
        }
    })
})
</script>

<style lang="scss" scoped>
.background-changer {
    position: relative;

    .control-panel {
        position: fixed;
        top: $spacing-lg;
        right: $spacing-lg;
        z-index: 1000;

        :deep(.el-button-group) {
            .el-button {
                background: $bg-card;
                border: none;
                color: $text-primary;
                font-weight: 500;
                backdrop-filter: blur(10px);
                box-shadow: $shadow-light;
                transition: all 0.3s ease;

                &:hover {
                    background: rgba(139, 126, 216, 0.8);
                    color: $text-light;
                    transform: translateY(-2px);
                    box-shadow: $shadow-medium;
                }

                &.is-active {
                    background: $primary-color;
                    color: $text-light;
                }

                &--success {
                    background: rgba(103, 194, 58, 0.8);
                    color: $text-light;

                    &:hover {
                        background: rgba(103, 194, 58, 1);
                    }
                }
            }
        }
    }

    .background-image {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
        z-index: -1;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 1;
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg,
                    rgba(139, 126, 216, 0.2) 0%,
                    rgba(168, 218, 220, 0.2) 50%,
                    rgba(255, 182, 193, 0.2) 100%);
            z-index: 2;
        }
    }
}

// 移动端适配
@media (max-width: 768px) {
    .background-changer {
        .control-panel {
            top: $spacing-md;
            right: $spacing-md;

            :deep(.el-button-group) {
                .el-button {
                    padding: 8px 12px;
                    font-size: 12px;
                }
            }
        }
    }
}

// 动画效果
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.background-image {
    animation: fadeIn 0.5s ease-in-out;
}
</style>
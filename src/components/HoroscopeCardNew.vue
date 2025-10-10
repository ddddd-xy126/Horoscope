<template>
  <div class="horoscope-card" v-if="horoscopeData && horoscopeData.length > 0">
    <el-card class="fortune-card" shadow="hover">
      <!-- 头部信息 -->
      <template #header>
        <div class="card-header">
          <h2 class="constellation-title">
            <span class="constellation-icon">{{ getConstellationIcon(selectedConstellation || '') }}</span>
            {{ selectedConstellation }}
          </h2>
          <p class="date-info">{{ getCurrentDate() }}</p>
        </div>
      </template>

      <!-- 运势数据展示 -->
      <div class="fortune-list">
        <div 
          v-for="(item, index) in horoscopeData" 
          :key="index" 
          class="fortune-item"
          :class="getItemClass(item?.type)"
          v-if="item && item.type"
        >
          <div class="fortune-icon">{{ getIconByType(item.type) }}</div>
          <div class="fortune-info">
            <span class="fortune-label">{{ item.type }}</span>
            <div class="fortune-content">
              <div v-if="item.content && isPercentage(item.content)" class="fortune-bar">
                <el-progress
                  :percentage="parseInt(item.content)"
                  :color="getScoreColor(parseInt(item.content))"
                  :stroke-width="6"
                  :show-text="false"
                />
                <span class="fortune-value">{{ item.content }}</span>
              </div>
              <span v-else-if="item.content" class="fortune-text">{{ item.content }}</span>
              <span v-else class="fortune-text">暂无数据</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合评分（如果有综合指数） -->
      <div v-if="getOverallScore()" class="overall-fortune">
        <h3 class="section-title">综合运势</h3>
        <div class="fortune-score">
          <el-progress
            type="circle"
            :percentage="getOverallScore()"
            :color="getScoreColor(getOverallScore())"
            :width="80"
            :stroke-width="6"
          >
            <template #default="{ percentage }">
              <span class="score-text">{{ percentage }}%</span>
            </template>
          </el-progress>
        </div>
      </div>

      <!-- 详细运势网格 -->
      <div v-if="getLoveScore() || getWorkScore() || getHealthScore() || getMoneyScore()" class="detailed-fortune">
        <h3 class="section-title">详细运势</h3>
        <div class="fortune-grid">
          <!-- 爱情运势 -->
          <div v-if="getLoveScore()" class="fortune-item love">
            <div class="fortune-icon">💕</div>
            <div class="fortune-info">
              <span class="fortune-label">爱情运势</span>
              <div class="fortune-bar">
                <el-progress 
                  :percentage="getLoveScore()"
                  :color="getScoreColor(getLoveScore())" 
                  :stroke-width="6"
                  :show-text="false" 
                />
                <span class="fortune-value">{{ getLoveScore() }}%</span>
              </div>
            </div>
          </div>

          <!-- 事业运势 -->
          <div v-if="getWorkScore()" class="fortune-item work">
            <div class="fortune-icon">💼</div>
            <div class="fortune-info">
              <span class="fortune-label">事业运势</span>
              <div class="fortune-bar">
                <el-progress 
                  :percentage="getWorkScore()"
                  :color="getScoreColor(getWorkScore())" 
                  :stroke-width="6"
                  :show-text="false" 
                />
                <span class="fortune-value">{{ getWorkScore() }}%</span>
              </div>
            </div>
          </div>

          <!-- 健康运势 -->
          <div v-if="getHealthScore()" class="fortune-item health">
            <div class="fortune-icon">🌿</div>
            <div class="fortune-info">
              <span class="fortune-label">健康运势</span>
              <div class="fortune-bar">
                <el-progress 
                  :percentage="getHealthScore()"
                  :color="getScoreColor(getHealthScore())" 
                  :stroke-width="6"
                  :show-text="false" 
                />
                <span class="fortune-value">{{ getHealthScore() }}%</span>
              </div>
            </div>
          </div>

          <!-- 财运 -->
          <div v-if="getMoneyScore()" class="fortune-item money">
            <div class="fortune-icon">💰</div>
            <div class="fortune-info">
              <span class="fortune-label">财运</span>
              <div class="fortune-bar">
                <el-progress 
                  :percentage="getMoneyScore()"
                  :color="getScoreColor(getMoneyScore())" 
                  :stroke-width="6"
                  :show-text="false" 
                />
                <span class="fortune-value">{{ getMoneyScore() }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 幸运信息 -->
      <div v-if="getLuckyNumber() || getLuckyColor()" class="lucky-info">
        <h3 class="section-title">幸运信息</h3>
        <div class="lucky-grid">
          <div v-if="getLuckyNumber()" class="lucky-item">
            <span class="lucky-label">🍀 幸运数字</span>
            <span class="lucky-value number">{{ getLuckyNumber() }}</span>
          </div>
          <div v-if="getLuckyColor()" class="lucky-item">
            <span class="lucky-label">🎨 幸运颜色</span>
            <span class="lucky-value color" :style="{ color: getColorValue(getLuckyColor()) }">
              {{ getLuckyColor() }}
            </span>
          </div>
        </div>
      </div>

      <!-- 运势总结 -->
      <div v-if="getSummary()" class="fortune-summary">
        <h3 class="section-title">今日运势</h3>
        <p class="summary-text">{{ getSummary() }}</p>
      </div>
    </el-card>
  </div>
  
  <!-- 加载状态 -->
  <div v-else-if="loading" class="loading-container">
    <el-card class="loading-card">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在获取运势信息...</p>
      </div>
    </el-card>
  </div>

  <!-- 空状态 -->
  <div v-else class="empty-container">
    <el-card class="empty-card">
      <div class="empty-content">
        <div class="empty-icon">🌟</div>
        <p class="empty-text">请选择星座查看运势</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { HoroscopeItem } from '@/api/types'

// 定义 props
const props = defineProps<{
  horoscopeData?: HoroscopeItem[]
  loading?: boolean
  selectedConstellation?: string
  selectedDate?: string
  customDate?: string
}>()

// 获取星座图标
const getConstellationIcon = (constellation: string): string => {
  if (!constellation || typeof constellation !== 'string') return '✨'
  
  const iconMap: Record<string, string> = {
    '白羊座': '♈',
    '金牛座': '♉',
    '双子座': '♊',
    '巨蟹座': '♋',
    '狮子座': '♌',
    '处女座': '♍',
    '天秤座': '♎',
    '天蝎座': '♏',
    '射手座': '♐',
    '摩羯座': '♑',
    '水瓶座': '♒',
    '双鱼座': '♓',
  }
  return iconMap[constellation] || '✨'
}

// 根据类型获取图标
const getIconByType = (type: string): string => {
  if (!type || typeof type !== 'string') return '✨'
  
  const iconMap: Record<string, string> = {
    '综合指数': '⭐',
    '爱情指数': '💕',
    '爱情运势': '💕',
    '事业指数': '💼',
    '事业运势': '💼',
    '工作运势': '💼',
    '健康指数': '🌿',
    '健康运势': '🌿',
    '财运指数': '💰',
    '财运': '💰',
    '财运运势': '💰',
    '幸运数字': '🍀',
    '幸运颜色': '🎨',
    '总结': '📝',
    '运势总结': '📝',
  }
  
  // 模糊匹配
  for (const [key, icon] of Object.entries(iconMap)) {
    if (type.includes(key) || key.includes(type)) {
      return icon
    }
  }
  
  return '✨'
}

// 获取项目样式类
const getItemClass = (type: string): string => {
  if (!type || typeof type !== 'string') return 'default'
  
  if (type.includes('爱情')) return 'love'
  if (type.includes('事业') || type.includes('工作')) return 'work'
  if (type.includes('健康')) return 'health'
  if (type.includes('财')) return 'money'
  if (type.includes('综合')) return 'overall'
  return 'default'
}

// 判断是否为百分比
const isPercentage = (content: string): boolean => {
  if (!content || typeof content !== 'string') return false
  return content.includes('%') && !isNaN(parseInt(content))
}

// 根据分数获取颜色
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#f56c6c'
  return '#909399'
}

// 获取当前日期
const getCurrentDate = (): string => {
  if (props.selectedDate === 'other' && props.customDate) {
    // 如果是其他日运势且已选择日期，显示选择的日期
    return new Date(props.customDate).toLocaleDateString('zh-CN')
  }
  // 默认显示今天的日期
  return new Date().toLocaleDateString('zh-CN')
}

// 获取综合评分
const getOverallScore = (): number => {
  if (!props.horoscopeData || !Array.isArray(props.horoscopeData)) return 0
  
  const overallItem = props.horoscopeData.find(item => 
    item && item.type && item.content && 
    item.type.includes('综合') && isPercentage(item.content)
  )
  
  return overallItem && overallItem.content ? parseInt(overallItem.content) : 0
}

// 根据类型获取运势数据
const getFortuneByType = (type: string): string => {
  if (!props.horoscopeData || !Array.isArray(props.horoscopeData)) return ''
  
  const item = props.horoscopeData.find(item => 
    item && item.type && item.type.includes(type)
  )
  
  return item && item.content ? item.content : ''
}

// 获取爱情运势
const getLoveScore = (): number => {
  const loveData = getFortuneByType('爱情')
  return loveData && isPercentage(loveData) ? parseInt(loveData) : 0
}

// 获取事业运势
const getWorkScore = (): number => {
  const workData = getFortuneByType('事业') || getFortuneByType('工作')
  return workData && isPercentage(workData) ? parseInt(workData) : 0
}

// 获取健康运势
const getHealthScore = (): number => {
  const healthData = getFortuneByType('健康')
  return healthData && isPercentage(healthData) ? parseInt(healthData) : 0
}

// 获取财运
const getMoneyScore = (): number => {
  const moneyData = getFortuneByType('财运') || getFortuneByType('财')
  return moneyData && isPercentage(moneyData) ? parseInt(moneyData) : 0
}

// 获取幸运数字
const getLuckyNumber = (): string => {
  return getFortuneByType('幸运数字') || getFortuneByType('数字') || ''
}

// 获取幸运颜色
const getLuckyColor = (): string => {
  return getFortuneByType('幸运颜色') || getFortuneByType('颜色') || ''
}

// 获取运势总结
const getSummary = (): string => {
  return getFortuneByType('总结') || getFortuneByType('运势') || ''
}

// 获取颜色值（用于样式）
const getColorValue = (colorName: string): string => {
  if (!colorName || typeof colorName !== 'string') return '#666'
  
  const colorMap: Record<string, string> = {
    '红色': '#ff4757',
    '红': '#ff4757',
    '蓝色': '#3742fa',
    '蓝': '#3742fa',
    '绿色': '#2ed573',
    '绿': '#2ed573',
    '黄色': '#ffa502',
    '黄': '#ffa502',
    '紫色': '#8b7ed8',
    '紫': '#8b7ed8',
    '粉色': '#ff6b9d',
    '粉': '#ff6b9d',
    '橙色': '#ff7f50',
    '橙': '#ff7f50',
    '白色': '#ffffff',
    '白': '#ffffff',
    '黑色': '#2c2c54',
    '黑': '#2c2c54',
    '银色': '#c0c0c0',
    '银': '#c0c0c0',
    '金色': '#ffd700',
    '金': '#ffd700',
  }
  
  // 模糊匹配颜色
  for (const [key, value] of Object.entries(colorMap)) {
    if (colorName.includes(key) || key.includes(colorName)) {
      return value
    }
  }
  
  return '#666'
}
</script>

<style lang="scss" scoped>
.horoscope-card {
  max-width: 450px;
  margin: 0 auto;

  .fortune-card {
    background: $bg-card;
    border: none;
    border-radius: $border-radius-medium;
    box-shadow: $shadow-medium;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: $shadow-heavy;
    }

    :deep(.el-card__header) {
      background: linear-gradient(135deg, $primary-color, $secondary-color);
      border-bottom: none;
      border-radius: $border-radius-medium $border-radius-medium 0 0;
      padding: $spacing-md;
    }

    :deep(.el-card__body) {
      padding: $spacing-md;
    }
  }

  .card-header {
    text-align: center;
    color: $text-light;

    .constellation-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-xs;

      .constellation-icon {
        font-size: 22px;
      }
    }

    .date-info {
      font-size: 12px;
      opacity: 0.9;
      margin-top: $spacing-xs;
    }
  }

  .fortune-list {
    margin-bottom: $spacing-md;

    .fortune-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm;
      margin-bottom: $spacing-xs;
      background: rgba(255, 255, 255, 0.5);
      border-radius: $border-radius-small;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.8);
        transform: translateY(-1px);
      }

      &.love {
        border-left: 4px solid #ff69b4;
      }

      &.work {
        border-left: 4px solid #1890ff;
      }

      &.health {
        border-left: 4px solid #52c41a;
      }

      &.money {
        border-left: 4px solid #faad14;
      }

      &.overall {
        border-left: 4px solid $primary-color;
      }

      .fortune-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .fortune-info {
        flex: 1;

        .fortune-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: $text-primary;
          margin-bottom: $spacing-xs;
        }

        .fortune-content {
          .fortune-bar {
            display: flex;
            align-items: center;
            gap: $spacing-xs;

            :deep(.el-progress) {
              flex: 1;
              
              .el-progress-bar__outer {
                height: 4px !important;
              }
            }

            .fortune-value {
              font-size: 13px;
              font-weight: 600;
              color: $text-primary;
              min-width: 35px;
            }
          }

          .fortune-text {
            font-size: 13px;
            color: $text-secondary;
            line-height: 1.4;
            display: block;
          }
        }
      }
    }
  }

  .overall-fortune {
    text-align: center;
    margin-bottom: $spacing-md;
    padding: $spacing-md;
    background: rgba(139, 126, 216, 0.1);
    border-radius: $border-radius-small;

    .section-title {
      margin: 0 0 $spacing-md;
      font-size: 16px;
      color: $text-primary;
      font-weight: 600;
    }

    .fortune-score {
      :deep(.el-progress-circle) {
        width: 80px !important;
        height: 80px !important;
      }

      .score-text {
        font-size: 14px;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  .detailed-fortune {
    margin-bottom: $spacing-md;

    .section-title {
      margin: 0 0 $spacing-sm;
      font-size: 16px;
      color: $text-primary;
      font-weight: 600;
    }

    .fortune-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: $spacing-sm;

      .fortune-item {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-sm;
        background: rgba(255, 255, 255, 0.5);
        border-radius: $border-radius-small;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-1px);
        }

        &.love {
          border-left: 4px solid #ff69b4;
        }

        &.work {
          border-left: 4px solid #1890ff;
        }

        &.health {
          border-left: 4px solid #52c41a;
        }

        &.money {
          border-left: 4px solid #faad14;
        }

        .fortune-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .fortune-info {
          flex: 1;

          .fortune-label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: $text-primary;
            margin-bottom: $spacing-xs;
          }

          .fortune-bar {
            display: flex;
            align-items: center;
            gap: $spacing-xs;

            :deep(.el-progress) {
              flex: 1;
              
              .el-progress-bar__outer {
                height: 3px !important;
              }
            }

            .fortune-value {
              font-size: 11px;
              font-weight: 600;
              color: $text-primary;
              min-width: 30px;
            }
          }
        }
      }
    }
  }

  .lucky-info {
    margin-bottom: $spacing-md;

    .section-title {
      margin: 0 0 $spacing-sm;
      font-size: 16px;
      color: $text-primary;
      font-weight: 600;
    }

    .lucky-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: $spacing-sm;

      .lucky-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-sm;
        background: rgba(255, 255, 255, 0.5);
        border-radius: $border-radius-small;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-1px);
        }

        .lucky-label {
          font-size: 13px;
          font-weight: 600;
          color: $text-primary;
        }

        .lucky-value {
          font-size: 13px;
          font-weight: 600;

          &.number {
            color: #faad14;
            background: rgba(250, 173, 20, 0.1);
            padding: 2px 6px;
            border-radius: 3px;
          }

          &.color {
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }

  .fortune-summary {
    .section-title {
      margin: 0 0 $spacing-sm;
      font-size: 16px;
      color: $text-primary;
      font-weight: 600;
    }

    .summary-text {
      margin: 0;
      font-size: 13px;
      color: $text-secondary;
      line-height: 1.5;
      padding: $spacing-sm;
      background: rgba(255, 255, 255, 0.3);
      border-radius: $border-radius-small;
      border-left: 3px solid $primary-color;
    }
  }
}

.loading-container,
.empty-container {
  max-width: 600px;
  margin: 0 auto;

  .loading-card,
  .empty-card {
    background: $bg-card;
    border: none;
    border-radius: $border-radius-large;
    box-shadow: $shadow-light;
    backdrop-filter: blur(20px);

    :deep(.el-card__body) {
      padding: $spacing-xl;
    }
  }

  .loading-content,
  .empty-content {
    text-align: center;

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(139, 126, 216, 0.3);
      border-top: 4px solid #8b7ed8;
      border-radius: 50%;
      margin: 0 auto $spacing-md;
      animation: spin 1s linear infinite;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: $spacing-md;
    }

    .loading-text,
    .empty-text {
      margin: 0;
      font-size: 16px;
      color: $text-secondary;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .horoscope-card {
    margin: 0 $spacing-md;

    .fortune-list {
      .fortune-item {
        flex-direction: column;
        text-align: center;
        gap: $spacing-sm;

        .fortune-info {
          .fortune-content {
            .fortune-bar {
              flex-direction: column;
              gap: $spacing-xs;
            }
          }
        }
      }
    }

    .detailed-fortune {
      .fortune-grid {
        grid-template-columns: 1fr;
        
        .fortune-item {
          flex-direction: column;
          text-align: center;
          gap: $spacing-sm;

          .fortune-info {
            .fortune-bar {
              flex-direction: column;
              gap: $spacing-xs;
            }
          }
        }
      }
    }

    .lucky-info {
      .lucky-grid {
        grid-template-columns: 1fr;
        
        .lucky-item {
          flex-direction: column;
          text-align: center;
          gap: $spacing-sm;
        }
      }
    }
  }
}
</style>
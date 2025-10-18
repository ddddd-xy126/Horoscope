<template>
  <div class="horoscope-card" v-if="horoscopeData && horoscopeData.length > 0">
    <el-card class="fortune-card" shadow="hover">
      <!-- 头部信息 -->
      <template #header>
        <div class="card-header">
          <h2 class="constellation-title">
            <span class="constellation-icon">{{
              getConstellationIcon(selectedConstellation || "")
            }}</span>
            {{ selectedConstellation }}
          </h2>
          <p class="date-info">{{ getCurrentDate() }}</p>
        </div>
      </template>

      <!-- 运势数据展示 -->
      <div class="fortune-content">
        <!-- 综合评分 -->
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

        <!-- 详细运势 -->
        <div class="detailed-fortune">
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
              <span
                class="lucky-value color"
                :style="{ color: getColorValue(getLuckyColor()) }"
              >
                {{ getLuckyColor() }}
              </span>
            </div>
          </div>
        </div>
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
import { defineProps, withDefaults } from "vue";
import type { HoroscopeItem } from "@/api/types";

// 定义 props
const props = withDefaults(
  defineProps<{
    horoscopeData?: HoroscopeItem[];
    loading?: boolean;
    selectedConstellation?: string;
    selectedDate?: string;
    customDate?: string;
  }>(),
  {
    horoscopeData: () => [],
    loading: false,
    selectedConstellation: "",
    selectedDate: "today",
    customDate: "",
  }
);

// 获取星座图标
const getConstellationIcon = (constellation: string): string => {
  if (!constellation || typeof constellation !== "string") return "✨";

  const iconMap: Record<string, string> = {
    白羊座: "♈",
    金牛座: "♉",
    双子座: "♊",
    巨蟹座: "♋",
    狮子座: "♌",
    处女座: "♍",
    天秤座: "♎",
    天蝎座: "♏",
    射手座: "♐",
    摩羯座: "♑",
    水瓶座: "♒",
    双鱼座: "♓",
  };
  return iconMap[constellation] || "✨";
};

// 获取运势总结
const getSummary = (): string => {
  return (
    getFortuneByType("总结") ||
    getFortuneByType("运势") ||
    getFortuneByType("今日概述") ||
    ""
  );
};

// 获取贵人星座
const getNoblePerson = (): string => {
  return getFortuneByType("贵人星座") || getFortuneByType("贵人") || "";
};

// 获取颜色值（用于样式）
const getColorValue = (colorName: string): string => {
  if (!colorName || typeof colorName !== "string") return "#666";

  const colorMap: Record<string, string> = {
    红色: "#ff4757",
    红: "#ff4757",
    蓝色: "#3742fa",
    蓝: "#3742fa",
    绿色: "#2ed573",
    绿: "#2ed573",
    黄色: "#ffa502",
    黄: "#ffa502",
    紫色: "#8b7ed8",
    紫: "#8b7ed8",
    粉色: "#ff6b9d",
    粉: "#ff6b9d",
    橙色: "#ff7f50",
    橙: "#ff7f50",
    白色: "#ffffff",
    白: "#ffffff",
    黑色: "#2c2c54",
    黑: "#2c2c54",
    银色: "#c0c0c0",
    银: "#c0c0c0",
    金色: "#ffd700",
    金: "#ffd700",
  };

  // 模糊匹配颜色
  for (const [key, value] of Object.entries(colorMap)) {
    if (colorName.includes(key) || key.includes(colorName)) {
      return value;
    }
  }

  return "#666";
};

// 判断是否为百分比
const isPercentage = (content: string): boolean => {
  if (!content || typeof content !== "string") return false;
  return content.includes("%") && !isNaN(parseInt(content));
};

// 根据分数获取颜色
const getScoreColor = (score: number): string => {
  if (score >= 80) return "#67c23a";
  if (score >= 60) return "#e6a23c";
  if (score >= 40) return "#f56c6c";
  return "#909399";
};

// 获取当前日期
const getCurrentDate = (): string => {
  if (props.selectedDate === "other" && props.customDate) {
    return new Date(props.customDate).toLocaleDateString("zh-CN");
  }
  return new Date().toLocaleDateString("zh-CN");
};

// 根据类型获取运势数据
const getFortuneByType = (type: string): string => {
  if (!props.horoscopeData || !Array.isArray(props.horoscopeData)) return "";

  const item = props.horoscopeData.find(
    (item) => item && item.type && item.type.includes(type)
  );

  return item && item.content ? item.content : "";
};

// 获取综合评分
const getOverallScore = (): number => {
  if (!props.horoscopeData || !Array.isArray(props.horoscopeData)) return 0;

  const overallItem = props.horoscopeData.find(
    (item) =>
      item &&
      item.type &&
      item.content &&
      item.type.includes("综合") &&
      isPercentage(item.content)
  );

  return overallItem && overallItem.content ? parseInt(overallItem.content) : 0;
};

// 获取爱情运势
const getLoveScore = (): number => {
  const loveData = getFortuneByType("爱情");
  return loveData && isPercentage(loveData) ? parseInt(loveData) : 0;
};

// 获取事业运势
const getWorkScore = (): number => {
  const workData = getFortuneByType("事业") || getFortuneByType("工作");
  return workData && isPercentage(workData) ? parseInt(workData) : 0;
};

// 获取健康运势
const getHealthScore = (): number => {
  const healthData = getFortuneByType("健康");
  return healthData && isPercentage(healthData) ? parseInt(healthData) : 0;
};

// 获取财运
const getMoneyScore = (): number => {
  const moneyData = getFortuneByType("财运") || getFortuneByType("财");
  return moneyData && isPercentage(moneyData) ? parseInt(moneyData) : 0;
};

// 获取幸运数字
const getLuckyNumber = (): string => {
  return getFortuneByType("幸运数字") || getFortuneByType("数字") || "";
};

// 获取幸运颜色
const getLuckyColor = (): string => {
  return getFortuneByType("幸运颜色") || getFortuneByType("颜色") || "";
};

// 导出数据供父组件使用
defineExpose({
  getSummary,
  getNoblePerson,
});
</script>

<style lang="scss" scoped>
.horoscope-card {
  max-width: 500px;
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
    }
  }

  .fortune-content {
    display: flex;
    flex-direction: column;
  }

  .overall-fortune {
    text-align: center;
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
    background: rgba(255, 255, 255, 0.2);
    border-radius: $border-radius-small;
    padding: $spacing-md;

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
    background: rgba(255, 255, 255, 0.2);
    border-radius: $border-radius-small;
    padding: $spacing-md;

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

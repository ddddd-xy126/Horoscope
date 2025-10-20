<template>
  <div class="home-container">
    <!-- 背景组件 -->
    <StarField class="background-view" />

    <!-- 主要内容区域 - 左右布局 -->
    <div class="main-content">
      <!-- 左右布局容器 -->
      <div class="content-layout">
        <!-- 左侧面板：头部、控制面板和运势卡片 -->
        <div class="left-panel">
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
              <el-radio-group
                v-model="selectedDate"
                @change="handleDateChange"
                size="large"
              >
                <el-radio-button label="today">今日运势</el-radio-button>
                <el-radio-button label="other">{{
                  getDateButtonText()
                }}</el-radio-button>
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
            <HoroscopeCard
              ref="horoscopeCardRef"
              :horoscope-data="horoscopeData"
              :loading="loading"
              :selected-constellation="selectedConstellation"
              :selected-date="selectedDate"
              :custom-date="customDate"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="error-container">
            <el-alert
              :title="error"
              type="error"
              center
              show-icon
              :closable="false"
            />
          </div>
        </div>

        <!-- 右侧面板：详细解读（仅在有数据时显示） -->
        <div
          v-if="selectedConstellation && horoscopeData.length > 0 && !loading"
          class="right-panel"
        >
          <div class="summary-panel">
            <div class="panel-header">
              <h2 class="panel-title">
                <span class="panel-icon">🔮</span>
                星座详细解读
              </h2>
              <p class="panel-subtitle">深度解析您的运势密码</p>
            </div>

            <!-- 今日概述 -->
            <div v-if="getSummaryFromCard()" class="fortune-summary">
              <h3 class="section-title">
                <span class="section-icon">📝</span>
                今日概述
              </h3>
              <div class="summary-content">
                <p class="summary-text">{{ getSummaryFromCard() }}</p>
              </div>
            </div>

            <!-- 贵人星座 -->
            <div v-if="getNoblePersonFromCard()" class="noble-person">
              <h3 class="section-title">
                <span class="section-icon">⭐</span>
                贵人星座
              </h3>
              <div class="noble-content">
                <span class="noble-text">{{ getNoblePersonFromCard() }}</span>
              </div>
            </div>

            <!-- 运势建议 -->
            <div class="fortune-advice">
              <h3 class="section-title">
                <span class="section-icon">💡</span>
                运势建议
              </h3>
              <div class="advice-content">
                <div class="advice-item positive">
                  <span class="advice-label">✅ 适宜：</span>
                  <span class="advice-text">{{ getPositiveAdvice() }}</span>
                </div>
                <div class="advice-item negative">
                  <span class="advice-label">⚠️ 避免：</span>
                  <span class="advice-text">{{ getNegativeAdvice() }}</span>
                </div>
              </div>
            </div>

            <!-- 幸运提醒 -->
            <div class="lucky-reminder">
              <h3 class="section-title">
                <span class="section-icon">🍀</span>
                幸运提醒
              </h3>
              <div class="reminder-content">
                <div class="reminder-grid">
                  <div class="reminder-item">
                    <span class="reminder-icon">🔢</span>
                    <span class="reminder-text"
                      >关注数字 {{ getLuckyNumberFromData() }}</span
                    >
                  </div>
                  <div class="reminder-item">
                    <span class="reminder-icon">🎨</span>
                    <span class="reminder-text"
                      >多用{{ getLuckyColorFromData() }}色系</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p class="footer-text">© 2025 星座运势查询系统 | 数据来源：天行数据</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import StarSelector from "@/components/StarSelector.vue";
import HoroscopeCard from "@/components/HoroscopeCardNew.vue";
import StarField from "@/components/StarField.vue"
import { getHoroscope } from "@/api/horoscope";
import type { HoroscopeItem, DateType } from "@/api/types";

// 响应式数据
const selectedConstellation = ref<string>("");
const selectedDate = ref<DateType>("today");
const customDate = ref<string>("");
const horoscopeData = ref<HoroscopeItem[]>([]);
const loading = ref<boolean>(false);
const error = ref<string>("");

// 运势卡片组件引用
const horoscopeCardRef = ref<InstanceType<typeof HoroscopeCard> | null>(null);

// 从卡片组件获取概述信息
const getSummaryFromCard = (): string => {
  // 调用子组件的方法获取概述信息
  if (
    horoscopeCardRef.value &&
    typeof horoscopeCardRef.value.getSummary === "function"
  ) {
    return horoscopeCardRef.value.getSummary();
  }
  // 备用方案：直接从数据中获取
  const summaryItem = horoscopeData.value.find(
    (item) =>
      item?.type?.includes("总结") ||
      item?.type?.includes("概述") ||
      item?.type?.includes("运势")
  );
  return summaryItem?.content || "";
};

// 从卡片组件获取贵人星座信息
const getNoblePersonFromCard = (): string => {
  if (
    horoscopeCardRef.value &&
    typeof horoscopeCardRef.value.getNoblePerson === "function"
  ) {
    return horoscopeCardRef.value.getNoblePerson();
  }
  // 备用方案：直接从数据中获取
  const nobleItem = horoscopeData.value.find(
    (item) => item?.type?.includes("贵人") || item?.type?.includes("贵人星座")
  );
  return nobleItem?.content || "";
};

// 获取积极建议
const getPositiveAdvice = (): string => {
  const adviceMap: Record<string, string> = {
    白羊座: "主动出击，把握机会",
    金牛座: "稳扎稳打，积累财富",
    双子座: "多元发展，拓展人脉",
    巨蟹座: "关爱家人，情感投资",
    狮子座: "展现魅力，争取表现",
    处女座: "注重细节，提升效率",
    天秤座: "寻求平衡，和谐相处",
    天蝎座: "深度思考，挖掘真相",
    射手座: "勇于探索，扩展视野",
    摩羯座: "目标明确，坚持不懈",
    水瓶座: "创新思维，独特见解",
    双鱼座: "发挥直觉，艺术创作",
  };
  return (
    adviceMap[selectedConstellation.value] || "保持积极心态，关注身边的机会"
  );
};

// 获取消极建议
const getNegativeAdvice = (): string => {
  const adviceMap: Record<string, string> = {
    白羊座: "避免冲动行事，三思而后行",
    金牛座: "不要过于固执，适度变通",
    双子座: "避免三心二意，专注目标",
    巨蟹座: "不要过度敏感，放宽心态",
    狮子座: "避免自大傲慢，谦虚待人",
    处女座: "不要过分挑剔，宽容他人",
    天秤座: "避免犹豫不决，果断行动",
    天蝎座: "不要过于偏激，保持理性",
    射手座: "避免冒险激进，量力而行",
    摩羯座: "不要过于严苛，适度放松",
    水瓶座: "避免过于叛逆，考虑他人",
    双鱼座: "不要过度幻想，脚踏实地",
  };
  return (
    adviceMap[selectedConstellation.value] || "避免冲动决策，多听取他人意见"
  );
};

// 获取幸运数字
const getLuckyNumberFromData = (): string => {
  const luckyItem = horoscopeData.value.find(
    (item) => item?.type?.includes("幸运数字") || item?.type?.includes("数字")
  );
  return luckyItem?.content || "7";
};

// 获取幸运颜色
const getLuckyColorFromData = (): string => {
  const colorItem = horoscopeData.value.find(
    (item) => item?.type?.includes("幸运颜色") || item?.type?.includes("颜色")
  );
  return colorItem?.content || "紫";
};

// 处理星座选择变化
const handleConstellationChange = async (constellation: string) => {
  selectedConstellation.value = constellation;
  await fetchHoroscope();
};

// 处理日期选择变化
const handleDateChange = async () => {
  if (selectedDate.value === "other" && !customDate.value) {
    // 如果切换到其他日运势但没有选择日期，设置默认为今天
    const today = new Date();
    customDate.value = today.toISOString().split("T")[0];
  }

  if (selectedConstellation.value) {
    if (selectedDate.value === "today") {
      // 今日运势不需要日期参数
      await fetchHoroscope();
    } else if (selectedDate.value === "other" && customDate.value) {
      // 其他日运势需要日期参数
      await fetchHoroscope();
    }
  }
};

// 处理自定义日期选择变化
const handleCustomDateChange = async () => {
  if (selectedConstellation.value && customDate.value) {
    await fetchHoroscope();
  }
};

// 获取日期按钮显示文本
const getDateButtonText = (): string => {
  if (selectedDate.value === "other") {
    if (customDate.value) {
      return customDate.value;
    } else {
      // 如果没有选择日期，显示今天的日期
      return new Date().toISOString().split("T")[0];
    }
  }
  return "其他日运势";
};

// 获取运势数据
const fetchHoroscope = async () => {
  if (!selectedConstellation.value) return;

  try {
    loading.value = true;
    error.value = "";

    // 根据选择的日期类型决定是否传递日期参数
    let dateParam: string | undefined = undefined;
    if (selectedDate.value === "other" && customDate.value) {
      dateParam = customDate.value;
    }

    const response = await getHoroscope(selectedConstellation.value, dateParam);
    if (response.code === 200) {
      // 直接使用API返回的list数组
      horoscopeData.value = response.result.list;
      const dateText =
        selectedDate.value === "today" ? "今日" : `${customDate.value}`;
      console.log(`成功获取${selectedConstellation.value}${dateText}运势`);
    } else {
      throw new Error(response.msg || "获取运势失败");
    }
  } catch (err) {
    error.value = "获取运势数据失败，使用模拟数据";
    console.error("获取运势失败:", err);

    // 使用模拟数据
    horoscopeData.value = [
      { type: "综合指数", content: "75%" },
      { type: "爱情指数", content: "80%" },
      { type: "事业指数", content: "70%" },
      { type: "健康指数", content: "85%" },
      { type: "财运指数", content: "65%" },
      { type: "幸运数字", content: "7" },
      { type: "幸运颜色", content: "紫色" },
      {
        type: "运势总结",
        content: `今天的${selectedConstellation.value}状态不错，适合展开新计划。保持积极的心态，好运自然会来到你身边。`,
      },
    ];
    error.value = ""; // 清除错误，因为我们有备用数据
  } finally {
    loading.value = false;
  }
};

// 初始化
const initializeApp = () => {
  // 可以在这里添加初始化逻辑
  console.log("星座运势查询系统初始化完成");
};

// 组件挂载时初始化
onMounted(() => {
  initializeApp();
});
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
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  z-index: 1;
  background: transparent;
}

.header {
  text-align: center;
  margin-bottom: $spacing-md;
  animation: fadeInDown 1s ease-out;
  width: 50%;

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
  margin-bottom: $spacing-lg;
  animation: fadeInUp 1s ease-out 0.3s both;
  width: 50%;
  align-items: center;

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

// 左右布局容器
.content-layout {
  display: grid;
  grid-template-columns: 1fr 500px;
  gap: $spacing-lg;
  width: 100%;
  min-height: 100vh;
  padding: $spacing-md $spacing-sm;
  box-sizing: border-box;
  align-items: start;
  animation: fadeInUp 1s ease-out 0.6s both;
}

// 左侧面板
.left-panel {
  display: flex;
  flex-direction: column;

  .fortune-display {
    width: 50%;
  }

  .error-container {
    width: 100%;
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
}

// 右侧面板
.right-panel {
  margin-right: 50px;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  position: sticky;
  top: 50px;

  .summary-panel {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    border-radius: $border-radius-large;
    box-shadow: $shadow-medium;
    backdrop-filter: blur(5px);
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: $shadow-heavy;
    }
  }

  .panel-header {
    text-align: center;
    margin-bottom: $spacing-md;

    .panel-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 $spacing-xs;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      color: $text-primary;

      .panel-icon {
        font-size: 1.3rem;
      }
    }

    .panel-subtitle {
      font-size: 0.9rem;
      color: $text-secondary;
      margin: 0;
      opacity: 0.8;
    }
  }

  .fortune-summary,
  .noble-person,
  .fortune-advice,
  .lucky-reminder,
  .additional-info {
    background: rgba(255, 255, 255, 0.95);
    border-radius: $border-radius-medium;
    box-shadow: $shadow-medium;
    backdrop-filter: blur(20px);
    padding: $spacing-md;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-heavy;
    }

    .section-title {
      margin: 0 0 $spacing-sm;
      font-size: 16px;
      color: $text-primary;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      .section-icon {
        font-size: 18px;
      }
    }
  }

  .fortune-summary {
    border-left: 4px solid $primary-color;

    .summary-content {
      .summary-text {
        margin: 0;
        font-size: 14px;
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }

  .noble-person {
    border-left: 4px solid #ffd700;

    .noble-content {
      .noble-text {
        font-size: 14px;
        color: $text-primary;
        font-weight: 600;
      }
    }
  }

  .additional-info {
    border-left: 4px solid #ff69b4;

    .info-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      .info-item {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: $text-primary;
        }

        .info-text {
          font-size: 13px;
          color: $text-secondary;
          line-height: 1.4;
        }
      }
    }
  }

  .fortune-advice {
    border-left: 4px solid #4caf50;

    .advice-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      .advice-item {
        display: flex;
        align-items: flex-start;
        gap: $spacing-xs;
        padding: $spacing-xs;
        border-radius: $border-radius-small;

        &.positive {
          background: rgba(76, 175, 80, 0.1);
        }

        &.negative {
          background: rgba(255, 152, 0, 0.1);
        }

        .advice-label {
          font-size: 13px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .advice-text {
          font-size: 13px;
          color: $text-secondary;
          line-height: 1.4;
        }
      }
    }
  }

  .lucky-reminder {
    border-left: 4px solid #9c27b0;

    .reminder-content {
      .reminder-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: $spacing-sm;

        .reminder-item {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          padding: $spacing-xs;
          background: rgba(156, 39, 176, 0.1);
          border-radius: $border-radius-small;

          .reminder-icon {
            font-size: 16px;
            flex-shrink: 0;
          }

          .reminder-text {
            font-size: 13px;
            color: $text-secondary;
            line-height: 1.4;
          }
        }
      }
    }
  }

  .empty-panel {
    background: $bg-card;
    border-radius: $border-radius-medium;
    box-shadow: $shadow-light;
    backdrop-filter: blur(20px);
    padding: $spacing-xl;
    text-align: center;

    .empty-content {
      .empty-icon {
        font-size: 48px;
        margin-bottom: $spacing-md;
      }

      .empty-text {
        margin: 0;
        font-size: 14px;
        color: $text-secondary;
      }
    }
  }
}

.footer {
  padding: $spacing-sm;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 42%;
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

// 响应式设计
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr 320px;
    gap: $spacing-md;
    padding: $spacing-md;
  }

  .right-panel {
    .fortune-summary,
    .noble-person,
    .fortune-advice,
    .lucky-reminder,
    .additional-info {
      padding: $spacing-sm;

      .section-title {
        font-size: 14px;
      }
    }

    .panel-header {
      .panel-title {
        font-size: 1.3rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: $spacing-md;
    padding: $spacing-sm;
  }

  .header {
    .main-title {
      font-size: 1.8rem;
      flex-direction: column;
      gap: $spacing-xs;

      .title-icon {
        font-size: 1.5rem;
      }
    }

    .subtitle {
      font-size: 0.85rem;
    }
  }

  .right-panel {
    position: relative;
    top: auto;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-left: 0;
    padding-top: $spacing-md;

    .summary-panel {
      gap: $spacing-sm;
    }

    .fortune-summary,
    .noble-person,
    .fortune-advice,
    .lucky-reminder,
    .additional-info {
      padding: $spacing-sm;

      .section-title {
        font-size: 14px;
      }
    }

    .reminder-grid {
      grid-template-columns: 1fr;
      gap: $spacing-sm;
    }
  }
}
</style>

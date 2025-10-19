<template>
  <div class="star-selector">
    <el-select
      v-model="selectedConstellation"
      placeholder="请选择星座"
      size="large"
      @change="handleChange"
      class="constellation-select"
    >
      <el-option
        v-for="item in constellations"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        class="constellation-option"
      >
        <span class="option-content">
          <span class="constellation-icon">{{ item.icon }}</span>
          <span class="constellation-name">{{ item.label }}</span>
        </span>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import type { ConstellationOption } from '@/api/types'

// 定义 emits
const emit = defineEmits<{
  change: [constellation: string]
}>()

// 响应式选择状态
const selectedConstellation = ref<string>('')

// 星座数据
const constellations: ConstellationOption[] = [
  { label: '白羊座', value: '白羊座', icon: '♈' },
  { label: '金牛座', value: '金牛座', icon: '♉' },
  { label: '双子座', value: '双子座', icon: '♊' },
  { label: '巨蟹座', value: '巨蟹座', icon: '♋' },
  { label: '狮子座', value: '狮子座', icon: '♌' },
  { label: '处女座', value: '处女座', icon: '♍' },
  { label: '天秤座', value: '天秤座', icon: '♎' },
  { label: '天蝎座', value: '天蝎座', icon: '♏' },
  { label: '射手座', value: '射手座', icon: '♐' },
  { label: '摩羯座', value: '摩羯座', icon: '♑' },
  { label: '水瓶座', value: '水瓶座', icon: '♒' },
  { label: '双鱼座', value: '双鱼座', icon: '♓' },
]

// 处理选择变化
const handleChange = (value: string) => {
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.star-selector {
  display: flex;
  justify-content: center;
  margin: $spacing-lg 0;

  .constellation-select {
    width: 280px;
    
    :deep(.el-input) {
      .el-input__wrapper {
        background: $bg-card;
        border: 2px solid transparent;
        border-radius: $border-radius-medium;
        box-shadow: $shadow-light;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;

        &:hover {
          border-color: $primary-color;
          box-shadow: $shadow-medium;
        }

        &.is-focus {
          border-color: $primary-color;
          box-shadow: 0 0 0 2px rgba(139, 126, 216, 0.2);
        }

        .el-input__inner {
          font-size: 16px;
          font-weight: 500;
          color: $text-primary;
        }
      }
    }
  }
}

.option-content {
  display: flex;
  align-items: center;
  padding: $spacing-sm 0;

  .constellation-icon {
    font-size: 18px;
    margin-right: $spacing-sm;
    color: $primary-color;
  }

  .constellation-name {
    font-size: 15px;
    font-weight: 500;
    color: $text-primary;
  }
}

:deep(.el-select-dropdown) {
  background: $bg-card;
  border: none;
  border-radius: $border-radius-medium;
  box-shadow: $shadow-heavy;
  backdrop-filter: blur(20px);

  .el-select-dropdown__item {
    border-radius: $border-radius-small;
    margin: 2px $spacing-xs;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(139, 126, 216, 0.1);
      color: $primary-color;
    }

    &.selected {
      background: $primary-color;
      color: $text-light;

      .constellation-icon {
        color: $text-light;
      }
    }
  }
}
</style>
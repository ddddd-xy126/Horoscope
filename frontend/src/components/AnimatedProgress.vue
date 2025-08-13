<template>
  <div class="progress">
    <div class="fill" :style="{ width: percentage + '%' }" />
  </div>
  <div class="label">{{ Math.round(percentage) }}%</div>
  <el-slider v-model="percentage" :min="0" :max="100" />
  <div class="tip">液体填充示意（可替换为更复杂的 SVG/Canvas 动画）</div>
  </template>

<script setup>
import { ref } from 'vue';
const percentage = ref(30);
</script>

<style scoped>
.progress {
  height: 16px;
  width: 100%;
  background: #f1f2f5;
  border-radius: 8px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, #67C23A, #409EFF);
  transition: width .4s ease;
}
.label { margin: 6px 0; }
.tip { color: #999; font-size: 12px; }
</style>


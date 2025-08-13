<template>
  <div class="card">
    <div class="q">{{ question }}</div>
    <el-radio-group v-model="value">
      <el-radio v-for="(opt, idx) in options" :key="idx" :label="opt">{{ opt }}</el-radio>
    </el-radio-group>
    <div class="actions">
      <el-button type="primary" @click="$emit('submit', value)">提交</el-button>
    </div>
  </div>
  </template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  question: { type: String, required: true },
  options: { type: Array, default: () => [] }
});
const value = ref('');
</script>

<style scoped>
.card {
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}
.q { font-weight: 600; margin-bottom: 12px; }
.actions { margin-top: 12px; }
</style>


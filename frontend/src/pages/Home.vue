<template>
  <div class="wrap">
    <h2>智能问卷分析系统</h2>
    <div class="grid">
      <el-card>
        <h3>游戏化问卷体验</h3>
        <AnimatedProgress />
      </el-card>
      <el-card>
        <h3>快速开始</h3>
        <p>前往问卷列表开始答题，或到个人中心查看成就与报告。</p>
        <div class="btns">
          <el-button type="primary" @click="$router.push('/questionnaires')">问卷列表</el-button>
          <el-button @click="$router.push('/profile')">个人中心</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import AnimatedProgress from '../components/AnimatedProgress.vue';
</script>

<style scoped>
.wrap { padding: 16px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>


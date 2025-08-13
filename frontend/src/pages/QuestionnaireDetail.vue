<template>
  <div class="wrap" v-loading="submitting">
    <el-page-header @back="$router.back()" content="问卷详情" />
    <h2 class="title">{{ detail?.title || '问卷' }}</h2>
    <p class="desc">{{ detail?.description }}</p>

    <el-steps :active="step" finish-status="success" align-center class="mb">
      <el-step v-for="(q, idx) in questions" :key="q.id" :title="'第' + (idx+1) + '题'" />
    </el-steps>

    <GamifiedQuestion
      v-if="current"
      :question="current.content"
      :options="current.options || []"
      @submit="onSubmitAnswer"
    />

    <div class="mt">
      <el-button @click="prev" :disabled="step===0">上一步</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../services/api';
import GamifiedQuestion from '../components/GamifiedQuestion.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const detail = ref(null);
const questions = ref([]);
const step = ref(0);
const submitting = ref(false);

const current = computed(() => questions.value[step.value]);

function prev() { if (step.value > 0) step.value -= 1; }
function next() { if (step.value < questions.value.length - 1) step.value += 1; }

async function fetchDetail() {
  try {
    const res = await api.get(`/questionnaires/${id}`);
    detail.value = res.data || {};
    questions.value = res.data?.questions || [];
  } catch (e) {
    detail.value = { id, title: '示例问卷', description: '本地示例数据' };
    questions.value = [
      { id: 'q1', content: '你更偏向哪类职业？', options: ['技术', '设计', '产品', '运营'] },
      { id: 'q2', content: '你更擅长的学习方式？', options: ['阅读', '视频', '动手实践', '讨论'] }
    ];
  }
}

async function onSubmitAnswer(val) {
  if (!current.value) return;
  // 可缓存到本地 answers，演示先忽略
  if (step.value === questions.value.length - 1) {
    submitting.value = true;
    try {
      await api.post(`/questionnaires/${id}/responses`, { answers: [] });
      router.push('/reports');
    } catch (e) {
      router.push('/reports');
    } finally {
      submitting.value = false;
    }
  } else {
    next();
  }
}

onMounted(fetchDetail);
</script>

<style scoped>
.wrap { padding: 16px; }
.title { margin: 10px 0; }
.desc { color: #666; }
.mb { margin-bottom: 16px; }
.mt { margin-top: 16px; }
</style>


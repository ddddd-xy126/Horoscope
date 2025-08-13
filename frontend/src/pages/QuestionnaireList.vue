<template>
  <div class="wrap">
    <el-input v-model="keyword" placeholder="搜索问卷" style="max-width: 360px" clearable />
    <el-button class="ml" type="primary" @click="fetchList">搜索</el-button>
    <el-divider />
    <el-skeleton v-if="loading" animated :rows="4" />
    <el-empty v-else-if="list.length === 0" description="暂无问卷" />
    <el-row v-else :gutter="16">
      <el-col v-for="item in list" :key="item.id" :xs="24" :sm="12" :md="8">
        <el-card class="mb">
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.description }}</div>
          <div class="meta">
            <span>分类：{{ item.category || '通用' }}</span>
            <span>参与：{{ item.participants || 0 }}</span>
          </div>
          <div class="actions">
            <el-button type="primary" @click="$router.push('/questionnaires/' + item.id)">开始答题</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

const list = ref([]);
const loading = ref(false);
const keyword = ref('');

async function fetchList() {
  loading.value = true;
  try {
    const res = await api.get('/questionnaires', { params: { q: keyword.value || undefined } });
    list.value = res.data?.items || [];
  } catch (e) {
    list.value = [
      { id: 1, title: '职业倾向测评', description: '基于兴趣与能力的职业画像分析', category: '职业', participants: 1200 },
      { id: 2, title: '学习能力评估', description: '多维度学习风格与能力测评', category: '学习', participants: 930 }
    ];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchList);
</script>

<style scoped>
.wrap { padding: 16px; }
.ml { margin-left: 8px; }
.mb { margin-bottom: 16px; }
.title { font-weight: 600; margin-bottom: 6px; }
.desc { color: #666; margin-bottom: 8px; }
.meta { display: flex; gap: 16px; color: #999; font-size: 12px; }
.actions { margin-top: 10px; }
</style>


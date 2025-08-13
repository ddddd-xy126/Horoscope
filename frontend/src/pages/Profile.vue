<template>
  <div class="wrap">
    <el-card>
      <template #header>个人中心</template>
      <el-form label-width="96px" :model="form">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { api } from '../services/api';

const form = reactive({ nickname: '访客', email: '' });

async function save() {
  try {
    await api.put('/users/me', form);
  } catch (e) {
    // 本地演示
  }
}
</script>

<style scoped>
.wrap { padding: 16px; }
</style>


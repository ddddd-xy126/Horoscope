<template>
  <div class="wrap">
    <el-card>
      <template #header>个性化分析报告</template>
      <div ref="chartRef" style="height:320px"></div>
      <div class="mt">
        <el-button type="primary" @click="download">下载报告（PDF）</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const chartRef = ref(null);

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: {},
    radar: {
      indicator: [
        { name: '职业倾向', max: 100 },
        { name: '学习能力', max: 100 },
        { name: '心理稳定', max: 100 },
        { name: '合作沟通', max: 100 },
        { name: '创新探索', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [ { value: [80, 72, 66, 75, 70], name: '分析结果' } ]
    }]
  });
});

async function download() {
  const el = document.querySelector('.wrap');
  const canvas = await html2canvas(el);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const imgWidth = canvas.width * ratio;
  const imgHeight = canvas.height * ratio;
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save('report.pdf');
}
</script>

<style scoped>
.wrap { padding: 16px; }
.mt { margin-top: 12px; }
</style>


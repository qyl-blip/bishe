<template>
  <a-spin :spinning="showSpin">
    <div class="main page-surface page-view--overview">
      <a-card title="最近一周访问量" class="overview-card">
        <div class="chart-box" ref="visitChartDiv"></div>
      </a-card>

      <a-row :gutter="[20, 20]">
        <a-col :sm="24" :md="24" :lg="12">
          <a-card title="热门家政排名" class="overview-card">
            <div class="chart-box" ref="barChartDiv"></div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="24" :lg="12">
          <a-card title="热门分类比例" class="overview-card">
            <div class="chart-box" ref="pieChartDiv"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import * as echarts from 'echarts';
import { listApi } from '/@/api/overview';

let showSpin = ref(true);

const visitChartDiv = ref();
const barChartDiv = ref();
const pieChartDiv = ref();

let visitChart: any;
let barChart: any;
let pieChart: any;

const tdata = reactive({
  data: {} as any,
});

onMounted(() => {
  list();
  window.onresize = function () {
    if (visitChart) visitChart.resize();
    if (barChart) barChart.resize();
    if (pieChart) pieChart.resize();
  };
});

const list = () => {
  listApi({})
    .then((res) => {
      tdata.data = res.data || {};
      initCharts();
      initBarChart();
      initPieChart();
      showSpin.value = false;
    })
    .catch(() => {
      showSpin.value = false;
    });
};

const initCharts = () => {
  const visitList = tdata.data?.visitList || [];
  const xData: string[] = [];
  const uvData: number[] = [];
  const pvData: number[] = [];
  visitList.forEach((item: any) => {
    xData.push(item.day);
    uvData.push(item.uv);
    pvData.push(item.pv);
  });
  visitChart = echarts.init(visitChartDiv.value);
  visitChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['IP', '访问量'],
      top: '90%',
      left: 'center',
      textStyle: { color: '#2E7D32' },
    },
    grid: {
      top: '30px',
      left: '20px',
      right: '20px',
      bottom: '40px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisLabel: { color: '#2E7D32' },
      axisLine: { lineStyle: { color: 'rgba(129, 199, 132, 0.4)' } },
      data: xData,
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(129, 199, 132, 0.12)',
          width: 1,
          type: 'solid',
        },
      },
      axisLabel: { color: '#2E7D32' },
    },
    series: [
      {
        name: 'IP',
        type: 'line',
        smooth: true,
        data: uvData,
        lineStyle: { width: 3, color: '#66BB6A' },
        itemStyle: { color: '#66BB6A' },
        areaStyle: { color: 'rgba(102, 187, 106, 0.18)' },
      },
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        data: pvData,
        lineStyle: { width: 3, color: '#FFA726' },
        itemStyle: { color: '#FFA726' },
        areaStyle: { color: 'rgba(255, 167, 38, 0.14)' },
      },
    ],
  });
};

const initBarChart = () => {
  const popularThings = tdata.data?.popularThings || [];
  const xData: string[] = [];
  const yData: number[] = [];
  popularThings.forEach((item: any) => {
    xData.push(item.title);
    yData.push(item.count);
  });
  barChart = echarts.init(barChartDiv.value);
  barChart.setOption({
    grid: {
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    xAxis: {
      data: xData,
      type: 'category',
      axisLabel: {
        rotate: 30,
        color: '#2E7D32',
      },
      axisLine: {
        lineStyle: { color: 'rgba(129, 199, 132, 0.4)' },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#2E7D32' },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(129, 199, 132, 0.12)',
          width: 1,
          type: 'solid',
        },
      },
    },
    series: [
      {
        data: yData,
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#66BB6A' },
            { offset: 1, color: '#4DB6AC' },
          ]),
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  });
};

const initPieChart = () => {
  const popularClassification = tdata.data?.popularClassification || [];
  const pieData = popularClassification.map((item: any) => ({
    name: item.title,
    value: item.count,
  }));
  pieChart = echarts.init(pieChartDiv.value);
  pieChart.setOption({
    tooltip: { trigger: 'item' },
    legend: {
      top: '90%',
      left: 'center',
      textStyle: { color: '#2E7D32' },
    },
    series: [
      {
        name: '分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold', color: '#2E7D32' },
        },
        labelLine: { show: false },
        data: pieData,
        itemStyle: {
          color: (params: any) => {
            const colorList = ['#66BB6A', '#FFA726', '#4DB6AC', '#FFB74D', '#81C784'];
            const index = params.dataIndex % colorList.length;
            return colorList[index];
          },
        },
      },
    ],
  });
};
</script>

<style lang="less" scoped>
@import '/@/styles/theme.less';

.main {
  height: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.overview-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(129, 199, 132, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(129, 199, 132, 0.15);
}

:deep(.overview-card .ant-card-head) {
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF9E6 100%);
  border-bottom: 2px solid #C8E6C9;
  border-radius: 16px 16px 0 0;
}

:deep(.overview-card .ant-card-head-title) {
  color: #2E7D32;
  font-weight: 600;
  font-size: 16px;
}

:deep(.overview-card .ant-card-body) {
  padding: 24px;
}

.chart-box {
  height: 300px;
  border-radius: 12px;
}

/* 页面切换动画 */
.page-surface {
  animation: pageSlide 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes pageSlide {
  0% {
    opacity: 0;
    transform: translateX(30px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
</style>


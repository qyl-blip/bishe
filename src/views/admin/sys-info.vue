<template>
  <div class="page-surface">
    <div class="page-view page-view--sysinfo">
      <a-spin :spinning="loading">
        <a-descriptions 
          title="系统信息" 
          :bordered="true" 
          :column="{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }"
          class="sys-info-desc"
        >
          <a-descriptions-item label="系统名称">
            {{ data.sysName || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="版本信息">
            {{ data.versionName || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="操作系统">
            {{ data.osName || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="系统平台">
            {{ data.pf || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="CPU核心数">
            {{ data.cpuCount || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="处理器型号">
            {{ data.processor || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="CPU使用率">
            <a-progress 
              :percent="parseFloat(data.cpuLoad || 0)" 
              :stroke-color="{
                '0%': '#66BB6A',
                '100%': '#4DB6AC',
              }"
              :format="percent => `${percent}%`"
            />
          </a-descriptions-item>
          <a-descriptions-item label="系统内存">
            {{ data.memory || '--' }}G
          </a-descriptions-item>
          <a-descriptions-item label="内存使用">
            {{ data.usedMemory || '--' }}G
          </a-descriptions-item>
          <a-descriptions-item label="内存使用率">
            <a-progress 
              :percent="parseFloat(data.percentMemory || 0)" 
              :stroke-color="{
                '0%': '#FFA726',
                '100%': '#FF7043',
              }"
              :format="percent => `${percent}%`"
            />
          </a-descriptions-item>
          <a-descriptions-item label="系统语言">
            {{ data.sysLan || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="Java版本">
            {{ data.jvmVersion || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="系统时区">
            {{ data.sysZone || '--' }}
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { sysInfoApi } from '/@/api/overview';

export default {
  data() {
    return {
      loading: false,
      data: {},
    };
  },
  methods: {
    getSysInfo() {
      this.loading = true;
      sysInfoApi()
        .then((res) => {
          this.loading = false;
          const payload = res?.data ?? res?.result ?? res;
          this.data = payload || {};
        })
        .catch((err) => {
          this.loading = false;
          console.error(err);
        });
    },
  },
  mounted() {
    this.getSysInfo();
  },
};
</script>

<style lang="less" scoped>
@import '/@/styles/theme.less';

.page-view {
  min-height: 100%;
  background: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  color: @text-primary;
}

:deep(.sys-info-desc.ant-descriptions-bordered .ant-descriptions-view) {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-descriptions-title) {
  color: #2E7D32;
  font-family: @font-family-display;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #E8F5E9;
}

:deep(.ant-descriptions-item-label) {
  color: #2E7D32;
  font-weight: 600;
  font-size: 14px;
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF9E6 100%) !important;
  padding: 16px !important;
  border: 1px solid #E8F5E9 !important;
  min-width: 140px;
}

:deep(.ant-descriptions-item-content) {
  color: #374151;
  font-size: 14px;
  padding: 16px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid #F5F5F5 !important;
}

:deep(.ant-descriptions-row) {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.ant-descriptions-row:hover) {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%);
}

:deep(.ant-progress) {
  margin: 0;
}

:deep(.ant-progress-text) {
  color: #2E7D32;
  font-weight: 600;
}

:deep(.ant-spin-container) {
  width: 100%;
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


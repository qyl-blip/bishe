<template>
  <div class="page-view page-surface page-view--sysinfo">
    <a-spin v-bind:spinning="loading">
      <a-descriptions title="&#x7CFB;&#x7EDF;&#x4FE1;&#x606F;" :bordered="false" :column="{ lg: 3, md: 2, sm: 1 }">
        <a-descriptions-item label="&#x7CFB;&#x7EDF;&#x540D;&#x79F0;">
          {{ data.sysName }}
        </a-descriptions-item>
        <a-descriptions-item label="&#x7248;&#x672C;&#x4FE1;&#x606F;">
          {{ data.versionName }}
        </a-descriptions-item>
        <a-descriptions-item label="&#x64CD;&#x4F5C;&#x7CFB;&#x7EDF;">
          {{ data.osName }}
        </a-descriptions-item>
        <a-descriptions-item label="&#x7CFB;&#x7EDF;&#x5E73;&#x53F0;">
          {{ data.pf }}
        </a-descriptions-item>
        <a-descriptions-item label="&#x0043;&#x0050;&#x0055;&#x6838;&#x5FC3;&#x6570;">
          {{ data.cpuCount }}
        </a-descriptions-item>
        <a-descriptions-item label="&#x5904;&#x7406;&#x5668;&#x578B;&#x53F7;">
          {{ data.processor }}
        </a-descriptions-item>
        <a-descriptions-item label="&#x0043;&#x0050;&#x0055;&#x4F7F;&#x7528;&#x7387;">
          {{ data.cpuLoad }}%
        </a-descriptions-item>
        <a-descriptions-item label="&#x7CFB;&#x7EDF;&#x5185;&#x5B58;">
          {{ data.memory }}G
        </a-descriptions-item>
        <a-descriptions-item label="&#x5185;&#x5B58;&#x4F7F;&#x7528;">
          {{ data.usedMemory }}G
        </a-descriptions-item>
        <a-descriptions-item label="&#x5185;&#x5B58;&#x4F7F;&#x7528;&#x7387;">
          {{ data.percentMemory }}%
        </a-descriptions-item>
        <a-descriptions-item label="&#x7CFB;&#x7EDF;&#x8BED;&#x8A00;">
          {{ data.sysLan }}
        </a-descriptions-item>
        <a-descriptions-item label="&#x004A;&#x0061;&#x0076;&#x0061;&#x7248;&#x672C;">
          {{ data.jvmVersion }}
        </a-descriptions-item>
        <a-descriptions-item label="&#x7CFB;&#x7EDF;&#x65F6;&#x533A;">
          {{ data.sysZone }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
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
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(129, 199, 132, 0.2);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  color: @text-primary;
  position: relative;
  overflow: hidden;
}

.page-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #66BB6A 0%, #FFA726 50%, #4DB6AC 100%);
  border-radius: 16px 16px 0 0;
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
  background: linear-gradient(135deg, #F1F8E9 0%, #FFF9E6 100%);
  padding: 12px 16px !important;
  border-radius: 8px 0 0 8px;
}

:deep(.ant-descriptions-item-content) {
  color: #374151;
  font-size: 14px;
  padding: 12px 16px !important;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0 8px 8px 0;
}

:deep(.ant-descriptions-row) {
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.ant-descriptions-row:hover) {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.15);
}

:deep(.ant-spin-container) {
  width: 100%;
}
</style>


<template>
  <a-config-provider :locale="zhCN" :theme="themeConfig">
    <router-view v-slot="{ Component }">
      <transition name="mac-page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <a-back-top :visibilityHeight="240">
      <div class="backtop-btn">TOP</div>
    </a-back-top>
  </a-config-provider>
</template>
<script setup lang="ts">

import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { onMounted } from 'vue';
import { getAntdThemeConfig, initializeTheme } from '/@/utils/theme';

const themeConfig = getAntdThemeConfig();

onMounted(() => {
  initializeTheme();
});

</script>

<style>

  #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 100vh;
}

.backtop-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1677ff, #0958d9);
  color: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 0.6px;
  box-shadow: 0 12px 24px rgba(20, 26, 42, 0.18);
  border: 1px solid rgba(22, 119, 255, 0.25);
}
</style>

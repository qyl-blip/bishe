<template>
  <div class="local-container page-surface" v-loading="loading">
    <!-- 统一顶部栏 -->
    <TopBar @city-change="handleCityChange" @refresh-data="fetchServices({ silent: false, force: true })" />

    <transition name="fade-slide" mode="out-in">
      <div class="main-body" key="main-content">
        <el-row :gutter="30">
          <!-- 左侧：主列表 -->
          <el-col :span="17">
            <div class="section-head">
              <h2 class="title">本地家政精选</h2>
              <div class="sub-title">根据所选城市与定位信息智能推荐</div>
            </div>

            <div class="service-grid">
            <el-row :gutter="20" class="grid-row">
              <el-col :span="6" v-for="item in serviceList" :key="item.id" class="card-col">
                <div class="m-card" @click="goDetail(item)">
                  <div class="m-card-cover">
                    <img :src="'https://picsum.photos/400/300?random=' + item.id" alt="">
                    <div class="badge-price">￥{{ item.price }}<span>/h</span></div>
                    <div class="badge-dist">1.5km</div>
                  </div>
                  <div class="m-card-body">
                    <div class="m-title">{{ item.title }}</div>
                    <div class="m-tags">
                      <span class="t-item">准时上门</span>
                      <span class="t-item">专业工具</span>
                    </div>
                    <div class="m-footer">
                      <!-- AI 分数转化为星级-->
                      <div class="m-stars" v-if="item.score > 0">
                        <i class="el-icon-star-on" v-for="i in 5" :key="i" :style="{color: i <= 4 ? '#ff9900' : '#dbdbdb'}"></i>
                        <span class="score-num">{{ item.score.toFixed(1) }}</span>
                      </div>
                      <div class="m-reason" v-if="item.score > 290">
                        <i class="el-icon-sunny"></i> 智能首选
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div v-if="serviceList.length === 0" class="empty-state">
              <div class="empty-title">暂无本地数据</div>
              <div class="empty-subtitle">请稍后再试</div>
            </div>
          </div>
        </el-col>

        <!-- 右侧：侧边排行与保障 -->
        <el-col :span="7">
          <div class="side-sticky">
            <!-- 热门榜单 -->
            <div class="side-card">
              <div class="s-card-title"><i class="el-icon-medal-1"></i> 本地人气榜单</div>
              <div class="s-list">
                <div class="s-item" v-for="(rank, idx) in serviceList.slice(0,5)" :key="idx">
                  <div class="s-idx" :class="'top'+(idx+1)">{{ idx+1 }}</div>
                  <div class="s-info">
                    <div class="s-name">{{ rank.title }}</div>
                    <div class="s-ext">近期 {{ 100 + idx*5 }} 人咨询</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 服务保障 -->
            <div class="side-card safe-box">
              <div class="s-card-title">服务安全保障</div>
              <div class="safe-list">
                <div class="safe-item"><i class="el-icon-circle-check"></i> 实名认证保洁员</div>
                <div class="safe-item"><i class="el-icon-circle-check"></i> 平台统一标准定价</div>
                <div class="safe-item"><i class="el-icon-circle-check"></i> 售后无忧不满意退</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '/@/store/constants';
import TopBar from '/@/views/index/components/TopBar.vue';

export default {
  components: {
    TopBar
  },
  data() {
    return {
      currentCity: '北京',
      serviceList: [],
      loading: false
    };
  },
  mounted() {
    // 从localStorage读取城市
    const savedCity = localStorage.getItem('currentCity');
    if (savedCity) {
      this.currentCity = savedCity;
    }
    this.fetchServices({ silent: true });
  },
  methods: {
    handleCityChange(city) {
      this.currentCity = city;
      this.fetchServices({ silent: false });
    },
    normalizeList(payload) {
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.data)) return payload.data;
      if (payload && Array.isArray(payload.list)) return payload.list;
      return [];
    },
    async fetchServices(options = {}) {
      if (this.loading) return;
      const { silent = false } = options;
      const host = window.location.hostname;
      const localBase = host === 'localhost' || host === '127.0.0.1' ? 'http://127.0.0.1:9200' : `http://${host}:9200`;
      const apiUrl = `${localBase}/api/local/list`;
      this.loading = true;
      const city = (this.currentCity || '').trim();
      let services = [];
      let usedFallback = false;
      try {
        const res = await axios.get(apiUrl, {
          params: { city: city, lat: this.lat, lng: this.lng },
          timeout: 1500
        });
        // 保守处理响应结构
        services = this.normalizeList(res.data);
      } catch (err) {
        console.warn('fetchServices error', err);
        this.locStatus = '获取数据失败（可手动刷新）';
        if (!silent) {
          this.$message && this.$message.warning && this.$message.warning('获取数据失败，请稍后再试');
        }
      }
      if (!services || services.length === 0) {
        usedFallback = true;
        try {
          const res = await axios.get(`${BASE_URL}/api/thing/list`, { params: {}, timeout: 3000 });
          const raw = this.normalizeList(res.data);
          services = raw.filter((item) => {
            const value = (item.city || item.location || '').trim();
            return value === city;
          });
        } catch (err) {
          console.warn('fallback list error', err);
        }
      }
      services = (services || []).map((item) => ({
        ...item,
        score: Number(item.score) || 0
      }));
      this.serviceList = services;
      this.loading = false;
    },
    goDetail(item) {
      // 假设原系统详情页路径/index/detail?id=xxx
      this.$router.push({ path: '/index/detail', query: { id: item.id } });
    }
  }
};
</script>

<style scoped>
/* 页面过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.98);
}

/* 整体变量 - 使用CSS自定义属性替代LESS变量 */
.local-container {
  --primary: #66BB6A;
  --primary-dark: #4DB6AC;
  --bg: transparent;
  --text: #1f2937;
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #E0F2F1 100%);
  min-height: 100vh;
  padding-top: 0;
}

/* 顶部工具栏 */
.page-top-bar {
  background: linear-gradient(135deg, rgba(232, 245, 233, 0.95) 0%, rgba(255, 249, 230, 0.95) 100%);
  border-bottom: 2px solid rgba(129, 199, 132, 0.2);
  padding: 14px 0;
  box-shadow: 0 4px 16px rgba(77, 182, 172, 0.12);
  position: sticky;
  top: 64px; /* 避开顶部 Header */
  z-index: 20;
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.page-top-bar:hover {
  box-shadow: 0 6px 20px rgba(77, 182, 172, 0.18);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.loc-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
  color: #2E7D32;
  font-weight: 500;
}

.loc-box i {
  color: #66BB6A;
  margin-right: 6px;
  font-size: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.loc-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.loc-right .tip {
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
}

/* 优化刷新按钮样式 */
.loc-right :deep(.el-button--primary) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
  border: none !important;
  border-radius: 20px !important;
  padding: 8px 20px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25) !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.loc-right :deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%) !important;
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35) !important;
  transform: translateY(-2px) !important;
}

.loc-right :deep(.el-button--primary:active) {
  transform: translateY(0) scale(0.98) !important;
}

.loc-right :deep(.el-button .el-icon-refresh) {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.loc-right :deep(.el-button:hover .el-icon-refresh) {
  transform: rotate(180deg) !important;
}

.city-value {
  font-weight: 700;
  color: #2E7D32;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(129, 199, 132, 0.3);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.city-value:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
}

.city-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.city-tab {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  border: 2px solid #E0F2F1;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-weight: 500;
}

.city-tab:hover {
  border-color: #66BB6A;
  color: #2E7D32;
  background: linear-gradient(135deg, #F1F8E9 0%, #FFF9E6 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
}

.city-tab.active {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  border-color: #66BB6A;
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
  transform: translateY(-2px);
}

.loc-btn {
  margin-left: 10px;
}

.loc-status {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.tip {
  font-size: 12px;
  color: #606266;
}

/* 主体布局 */
.main-body {
  max-width: 1600px !important;
  margin: 30px auto !important;
  padding: 0 60px 50px !important;
  animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-head {
  margin-bottom: 25px;
}

.section-head .title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text);
  margin-bottom: 6px;
}

.section-head .sub-title {
  color: #909399;
  font-size: 14px;
}

.service-grid {
  width: 100%;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.card-col {
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.card-col) {
  animation: cardFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards !important;
}

:deep(.card-col:nth-child(1)) { animation-delay: 0.1s !important; }
:deep(.card-col:nth-child(2)) { animation-delay: 0.15s !important; }
:deep(.card-col:nth-child(3)) { animation-delay: 0.2s !important; }
:deep(.card-col:nth-child(4)) { animation-delay: 0.25s !important; }
:deep(.card-col:nth-child(5)) { animation-delay: 0.3s !important; }
:deep(.card-col:nth-child(6)) { animation-delay: 0.35s !important; }
:deep(.card-col:nth-child(7)) { animation-delay: 0.4s !important; }
:deep(.card-col:nth-child(8)) { animation-delay: 0.45s !important; }

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 卡片样式 */
.m-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  border: 2px solid #F1F8E9;
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.06);
}

.m-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(77, 182, 172, 0.2);
  border-color: #66BB6A;
}

.m-card-cover {
  height: auto;
  aspect-ratio: 4 / 3;
  min-height: 140px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #F1F8E9 0%, #FFF9E6 100%);
}

.m-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.m-card:hover .m-card-cover img {
  transform: scale(1.1) rotate(2deg);
}

.m-card-cover .badge-price {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #fff;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.3);
}

.m-card-cover .badge-price span {
  font-size: 11px;
  font-weight: normal;
}

.m-card-cover .badge-dist {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(46, 125, 50, 0.85);
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

.m-card-body {
  padding: 15px;
}

.m-card-body .m-title {
  font-weight: bold;
  font-size: 16px;
  color: var(--text);
  margin-bottom: 10px;
}

.m-card-body .m-tags {
  margin-bottom: 12px;
}

.m-card-body .m-tags .t-item {
  font-size: 11px;
  color: #2E7D32;
  background: #E8F5E9;
  padding: 2px 6px;
  border-radius: 6px;
  margin-right: 6px;
}

.m-card-body .m-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #F1F8E9;
  padding-top: 10px;
}

.m-card-body .m-footer .score-num {
  font-weight: bold;
  margin-left: 5px;
  color: #66BB6A;
}

.m-card-body .m-footer .m-reason {
  font-size: 12px;
  color: #2E7D32;
  background: #E8F5E9;
  padding: 2px 6px;
  border-radius: 6px;
}

.m-stars {
  display: flex;
  align-items: center;
}

.m-stars i {
  font-size: 14px;
  margin-right: 2px;
  color: #66BB6A;
}

.m-stars i:last-of-type {
  color: #dbdbdb;
}

/* 侧边栏 */
.side-sticky {
  position: sticky;
  top: 140px;
}

.side-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #E0F2F1;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.side-card:hover {
  box-shadow: 0 8px 24px rgba(77, 182, 172, 0.15);
}

.side-card .s-card-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E0F2F1;
  padding-bottom: 10px;
  color: #2E7D32;
}

.s-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.s-item .s-idx {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 6px;
  background: #E8F5E9;
  margin-right: 12px;
  font-size: 12px;
  font-weight: bold;
  color: #66BB6A;
}

.s-item .top1 {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #fff;
}

.s-item .top2 {
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  color: #fff;
}

.s-item .top3 {
  background: linear-gradient(135deg, #A5D6A7 0%, #81C784 100%);
  color: #fff;
}

.s-item .s-name {
  font-size: 14px;
  font-weight: 500;
}

.s-item .s-ext {
  font-size: 12px;
  color: rgba(28, 34, 51, 0.6);
  margin-top: 2px;
}

.safe-box {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #fff;
  box-shadow: 0 8px 24px rgba(77, 182, 172, 0.25);
}

.safe-box .s-card-title {
  border-bottom-color: rgba(255,255,255,0.2);
  color: #fff;
}

.safe-box .safe-item {
  margin-bottom: 10px;
  font-size: 13px;
}

.safe-box .safe-item i {
  margin-right: 8px;
}
</style>














/* 主体内容区域优化 */
.main-body {
  max-width: 1600px !important;
  margin: 30px auto !important;
  padding: 0 60px 50px !important;
  animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片动画 */
.card-col {
  animation: cardFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards !important;
}

.card-col:nth-child(1) { animation-delay: 0.1s !important; }
.card-col:nth-child(2) { animation-delay: 0.15s !important; }
.card-col:nth-child(3) { animation-delay: 0.2s !important; }
.card-col:nth-child(4) { animation-delay: 0.25s !important; }
.card-col:nth-child(5) { animation-delay: 0.3s !important; }
.card-col:nth-child(6) { animation-delay: 0.35s !important; }
.card-col:nth-child(7) { animation-delay: 0.4s !important; }
.card-col:nth-child(8) { animation-delay: 0.45s !important; }

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

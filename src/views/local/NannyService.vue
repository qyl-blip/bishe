<template>
  <div class="nanny-container page-surface" v-loading="loading">
    <!-- 统一顶部栏 -->
    <TopBar @city-change="handleCityChange" @refresh-data="fetchServices({ silent: false, force: true })" />

    <transition name="fade-slide" mode="out-in">
      <div class="main-body" key="main-content">
        <!-- 标题区域 -->
        <div class="section-head">
          <h2 class="title">金牌月嫂精选</h2>
          <div class="sub-title">专业母婴护理服务 · 持证上岗 · 经验丰富</div>
        </div>

        <!-- 服务卡片网格 - 铺满屏幕 -->
        <div class="service-grid-full">
          <div class="m-card" v-for="item in serviceList" :key="item.id" @click="goDetail(item)">
            <div class="m-card-cover">
              <img :src="item.cover || 'https://picsum.photos/400/300?random=' + (item.id + 100)" alt="">
              <div class="badge-price">￥{{ item.price }}<span>/天</span></div>
            </div>
            <div class="m-card-body">
              <div class="m-title">{{ item.title }}</div>
              <div class="m-tags">
                <span class="t-item">持证上岗</span>
                <span class="t-item">专业培训</span>
                <span class="t-item">经验丰富</span>
              </div>
              <div class="m-footer">
                <div class="m-stars" v-if="item.score > 0">
                  <i class="el-icon-star-on" v-for="i in 5" :key="i" :style="{color: i <= Math.floor(item.score) ? '#ff9900' : '#dbdbdb'}"></i>
                  <span class="score-num">{{ parseFloat(item.score).toFixed(1) }}</span>
                </div>
                <div class="m-reason" v-if="parseFloat(item.score) >= 4.8">
                  <i class="el-icon-medal"></i> 金牌推荐
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="serviceList.length === 0 && !loading" class="empty-state">
          <i class="el-icon-folder-opened"></i>
          <div class="empty-text">暂无月嫂服务数据</div>
          <div class="empty-tip">请稍后再试或联系客服</div>
        </div>
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
    async fetchServices(opts = {}) {
      const { silent = false, force = false } = opts;
      if (!silent) this.loading = true;

      try {
        const apiUrl = `${BASE_URL}/api/thing/list`;
        const res = await axios.get(apiUrl, {
          params: {
            city: this.currentCity,
            c: 3,  // 3 = 月嫂服务
            sort: 'recommend'
          }
        });
        const list = this.normalizeList(res.data);
        // 处理图片URL
        list.forEach((item) => {
          if (item.cover) {
            item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover;
          }
        });
        this.serviceList = list;
      } catch (err) {
        console.error('获取月嫂列表失败:', err);
        this.$message.error('获取服务列表失败');
      } finally {
        this.loading = false;
      }
    },
    goDetail(item) {
      this.$router.push({ path: '/index/detail', query: { id: item.id } });
    },
  },
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

/* 整体变量 */
.nanny-container {
  --primary: #66BB6A;
  --primary-dark: #4DB6AC;
  --bg: transparent;
  --text: #1f2937;
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #E0F2F1 100%);
  min-height: 100vh;
  padding-top: 0;
}

/* 主体内容 */
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
  margin-bottom: 30px;
  text-align: center;
  animation: fadeInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-head .title {
  font-size: 32px;
  font-weight: 700;
  color: #2E7D32;
  margin: 0 0 12px 0;
}

.section-head .sub-title {
  font-size: 16px;
  color: #6b7280;
}

/* 服务网格 - 铺满屏幕 */
.service-grid-full {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
}

:deep(.service-grid-full .m-card) {
  animation: cardFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards !important;
}

:deep(.service-grid-full .m-card:nth-child(1)) { animation-delay: 0.1s !important; }
:deep(.service-grid-full .m-card:nth-child(2)) { animation-delay: 0.15s !important; }
:deep(.service-grid-full .m-card:nth-child(3)) { animation-delay: 0.2s !important; }
:deep(.service-grid-full .m-card:nth-child(4)) { animation-delay: 0.25s !important; }
:deep(.service-grid-full .m-card:nth-child(5)) { animation-delay: 0.3s !important; }
:deep(.service-grid-full .m-card:nth-child(6)) { animation-delay: 0.35s !important; }
:deep(.service-grid-full .m-card:nth-child(7)) { animation-delay: 0.4s !important; }
:deep(.service-grid-full .m-card:nth-child(8)) { animation-delay: 0.45s !important; }

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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.m-card:nth-child(1) { animation-delay: 0.1s; }
.m-card:nth-child(2) { animation-delay: 0.15s; }
.m-card:nth-child(3) { animation-delay: 0.2s; }
.m-card:nth-child(4) { animation-delay: 0.25s; }
.m-card:nth-child(5) { animation-delay: 0.3s; }
.m-card:nth-child(6) { animation-delay: 0.35s; }

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

.m-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(77, 182, 172, 0.2);
  border-color: #66BB6A;
}

.m-card-cover {
  height: 220px;
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

.badge-price {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.3);
}

.badge-price span {
  font-size: 13px;
  font-weight: 500;
}

.m-card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.m-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.t-item {
  font-size: 12px;
  padding: 5px 12px;
  background: #F1F8E9;
  color: #2E7D32;
  border-radius: 12px;
  font-weight: 500;
}

.m-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #F1F8E9;
}

.m-stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.m-stars i {
  font-size: 16px;
}

.score-num {
  font-size: 14px;
  color: #6b7280;
  margin-left: 6px;
  font-weight: 600;
}

.m-reason {
  font-size: 13px;
  color: #FFA726;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.m-reason i {
  font-size: 16px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #9ca3af;
}

.empty-state i {
  font-size: 80px;
  color: #d1d5db;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 8px;
}

.empty-tip {
  font-size: 14px;
  color: #9ca3af;
}
</style>

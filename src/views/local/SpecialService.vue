<template>
  <div class="special-container page-surface">
    <!-- 统一顶部栏 -->
    <TopBar @city-change="handleCityChange" @refresh-data="fetchServices" />
    
    <div class="main-content">
      <el-row :gutter="30">
        <el-col :span="18">
          <div class="section-title">特惠家政服务</div>
          <el-row :gutter="20" class="grid-row">
            <el-col :span="6" v-for="item in serviceList" :key="item.id" class="card-col">
              <el-card class="service-card" shadow="hover" @click.native="goDetail(item)">
                <div class="sale-badge">特惠</div>
                <div class="card-img-box">
                  <img :src="'https://picsum.photos/400/300?random=' + (item.id + 200)" class="card-img">
                  <div class="price-tag">￥{{ item.price }}<small>/次</small></div>
                </div>
                <div class="card-body">
                  <div class="card-title">{{ item.title }}</div>
                  <div class="card-sub">
                    <i class="el-icon-time"></i> 限时特价 | 
                    <i class="el-icon-discount"></i> 原价￥{{ (item.price * 2).toFixed(0) }}
                  </div>
                  <div class="card-footer">
                    <div>
                      <el-rate v-model="item.score" disabled></el-rate>
                      <span class="score">{{ item.score }}</span>
                    </div>
                    <el-button type="success" size="mini" round>立即抢购</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div class="sidebar">
            <div class="side-card">
              <h3><i class="el-icon-warning-outline"></i> 活动说明</h3>
              <ul class="feature-list">
                <li><i class="el-icon-circle-check"></i> 活动时间：即日起至本月底</li>
                <li><i class="el-icon-circle-check"></i> 服务范围：全城覆盖</li>
                <li><i class="el-icon-circle-check"></i> 质量保证：不满意免费重做</li>
                <li><i class="el-icon-circle-check"></i> 快速响应：2小时内上门</li>
              </ul>
            </div>
            <div class="side-card">
              <h3><i class="el-icon-service"></i> 客服咨询</h3>
              <div class="hotline">
                <div class="phone">400-666-8888</div>
                <div class="work-time">24小时在线服务</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import TopBar from '/@/views/index/components/TopBar.vue';
import Footer from '/@/views/index/components/footer.vue';

export default {
  components: {
    TopBar,
    Footer
  },
  data() { 
    return { 
      currentCity: '北京', 
      serviceList: [] 
    }; 
  },
  mounted() {
    // 从localStorage读取城市
    const savedCity = localStorage.getItem('currentCity');
    if (savedCity) {
      this.currentCity = savedCity;
    }
    this.fetchServices(); 
  },
  methods: {
    handleCityChange(city) {
      this.currentCity = city;
      this.fetchServices();
    },
    async fetchServices() {
      const apiUrl = `http://192.168.110.238:9200/api/local/list`;
      const res = await axios.get(apiUrl, { params: { city: this.currentCity, classificationId: 4 } });
      this.serviceList = res.data;
    },
    goDetail(item) { 
      this.$router.push({ path: '/index/detail', query: { id: item.id } }); 
    }
  }
};
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.special-container {
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #E0F2F1 100%);
  min-height: 100vh;
  padding-top: 0;
}

.main-content {
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

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #2E7D32;
  margin-bottom: 25px;
  padding-left: 15px;
  border-left: 4px solid #66BB6A;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #66BB6A, #4DB6AC);
  border-radius: 2px;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.grid-row .el-col {
  width: 100% !important;
  max-width: 100% !important;
  flex: none !important;
}

.service-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #E0F2F1;
  position: relative;
}

:deep(.service-card) {
  animation: cardFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards !important;
}

:deep(.service-card:nth-child(1)) { animation-delay: 0.1s !important; }
:deep(.service-card:nth-child(2)) { animation-delay: 0.15s !important; }
:deep(.service-card:nth-child(3)) { animation-delay: 0.2s !important; }
:deep(.service-card:nth-child(4)) { animation-delay: 0.25s !important; }
:deep(.service-card:nth-child(5)) { animation-delay: 0.3s !important; }
:deep(.service-card:nth-child(6)) { animation-delay: 0.35s !important; }

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

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(77, 182, 172, 0.2);
  border-color: #81C784;
}

.sale-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.4);
}

.card-img-box {
  position: relative;
  height: auto;
  aspect-ratio: 4 / 3;
  min-height: 140px;
  overflow: hidden;
  background: #F1F8E9;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover .card-img {
  transform: scale(1.08);
}

.price-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.3);
}

.price-tag small {
  font-size: 12px;
  font-weight: normal;
}

.card-body {
  padding: 16px;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
  color: #1f2937;
}

.card-sub {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 12px;
}

.card-sub i {
  color: #66BB6A;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score {
  color: #66BB6A;
  font-weight: 600;
  margin-left: 5px;
}

.sidebar {
  position: sticky;
  top: 100px;
}

.side-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(77, 182, 172, 0.12);
  border: 1px solid #E0F2F1;
  backdrop-filter: blur(10px);
}

.side-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2E7D32;
  border-bottom: 2px solid #E0F2F1;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.side-card h3 i {
  color: #66BB6A;
  font-size: 20px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  margin-bottom: 12px;
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-list li i {
  color: #66BB6A;
  font-size: 16px;
}

.hotline {
  text-align: center;
  padding: 20px 0;
}

.phone {
  font-size: 28px;
  font-weight: 600;
  color: #66BB6A;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.work-time {
  color: #6b7280;
  font-size: 13px;
}
</style>
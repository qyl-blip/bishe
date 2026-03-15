<template>
  <div class="special-container page-surface">
    <!-- 统一顶部栏 -->
    <TopBar @city-change="handleCityChange" @refresh-data="fetchServices" />
    
    <div class="main-content">
      <div class="content-row">
        <div class="main-section">
          <div class="section-title">特惠家政服务</div>
          <div class="service-grid">
            <div v-for="item in serviceList" :key="item.id" class="service-card" @click="goDetail(item)">
              <div class="sale-badge">特惠</div>
              <div class="card-img-box">
                <img :src="item.cover || 'https://picsum.photos/400/300?random=' + (item.id + 200)" class="card-img">
                <div class="price-tag">￥{{ item.price }}<small>/次</small></div>
              </div>
              <div class="card-body">
                <div class="card-title">{{ item.title }}</div>
                <div class="card-sub">
                  <i class="icon-time"></i> 限时特价 | 
                  <i class="icon-discount"></i> 现价优惠
                </div>
                <div class="card-footer">
                  <div class="service-info">
                    <span class="location-text">{{ item.location }}</span>
                  </div>
                  <button class="buy-btn">立即抢购</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 如果没有数据显示提示 -->
          <div v-if="serviceList.length === 0" class="empty-state">
            <div class="empty-title">暂无特惠服务</div>
            <div class="empty-subtitle">请稍后再试或联系客服</div>
          </div>
        </div>
        
        <div class="sidebar">
          <div class="side-card">
            <h3><i class="icon-warning"></i> 活动说明</h3>
            <ul class="feature-list">
              <li><i class="icon-check"></i> 活动时间：即日起至本月底</li>
              <li><i class="icon-check"></i> 服务范围：全城覆盖</li>
              <li><i class="icon-check"></i> 质量保证：不满意免费重做</li>
              <li><i class="icon-check"></i> 快速响应：2小时内上门</li>
            </ul>
          </div>
          <div class="side-card">
            <h3><i class="icon-service"></i> 客服咨询</h3>
            <div class="hotline">
              <div class="phone">400-666-8888</div>
              <div class="work-time">24小时在线服务</div>
            </div>
          </div>
        </div>
      </div>
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
      console.log('开始获取特惠服务数据，城市：', this.currentCity);
      
      // 改为调用主服务API，和首页保持一致
      const apiUrl = `http://localhost:9100/api/thing/list`;
      
      try {
        const res = await axios.get(apiUrl, { 
          params: { 
            c: 6  // 查询分类ID=6的服务
          } 
        });
        
        console.log('API请求参数：', { c: 6 });
        console.log('API原始响应：', res.data);
        
        // 修复：使用 res.data.data 而不是 res.data
        const list = res.data.data || [];
        console.log('所有服务数量：', list.length);
        
        // 打印所有服务的分类信息
        list.forEach(item => {
          console.log(`服务 ${item.title}: 分类ID=${item.classificationId}, 城市=${item.city}, 状态=${item.status}`);
        });
        
        // 只显示北京地区的特惠服务（分类ID=6且状态=0）
        const filteredList = list.filter(item => {
          // 改进城市匹配：支持北京的各个区
          const cityText = item.city || '';
          const locationText = item.location || '';
          const isBeijingArea = cityText.includes('北京') || 
                               locationText.includes('北京') ||
                               ['朝阳区', '海淀区', '丰台区', '西城区', '东城区', '石景山区'].some(district => 
                                 cityText.includes(district) || locationText.includes(district)
                               );
          
          const isRightCategory = item.classificationId === 6;
          const isActive = item.status === '0';
          
          console.log(`${item.title}: 北京地区匹配=${isBeijingArea}, 分类匹配=${isRightCategory}, 状态匹配=${isActive}`);
          
          return isBeijingArea && isRightCategory && isActive;
        });
        
        console.log('筛选后的特惠服务数量：', filteredList.length);
        console.log('筛选后的服务列表：', filteredList.map(item => ({
          id: item.id,
          title: item.title,
          city: item.city,
          location: item.location
        })));
        
        // 处理图片URL
        filteredList.forEach((item) => {
          if (item.cover) {
            item.cover = 'http://localhost:9100/api/staticfiles/image/' + item.cover;
          }
        });
        
        this.serviceList = filteredList;
        console.log('最终赋值给serviceList的数据：', this.serviceList.length, this.serviceList);
        
      } catch (error) {
        console.error('获取特惠服务失败：', error);
        this.serviceList = [];
      }
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

.content-row {
  display: flex;
  gap: 30px;
}

.main-section {
  flex: 1;
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

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.service-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #E0F2F1;
  position: relative;
  background: white;
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.1);
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

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.location-text {
  color: #6b7280;
  font-size: 13px;
}

.buy-btn {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.3);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 14px;
}

.sidebar {
  width: 300px;
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

/* 图标样式 */
.icon-warning::before { content: '⚠️'; }
.icon-check::before { content: '✅'; }
.icon-service::before { content: '🎧'; }
.icon-time::before { content: '⏰'; }
.icon-discount::before { content: '💰'; }
</style>
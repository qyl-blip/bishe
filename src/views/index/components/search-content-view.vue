<template>
  <div class="search-result-view">
    <div class="search-header">
      <h1 class="search-title">搜索结果</h1>
      <div class="search-info">
        <span class="keyword-highlight">{{ tData.keyword }}</span>
        <span class="result-count">找到 {{ tData.total }} 个结果</span>
      </div>
    </div>

    <a-spin :spinning="tData.loading" style="min-height: 400px;">
      <div class="result-grid">
        <div class="result-card" v-for="item in tData.pageData" :key="item.id" @click="handleDetail(item)">
          <div class="card-image">
            <img :src="item.cover" :alt="item.title">
            <div class="price-badge">¥{{ item.price }}<span>/时</span></div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ item.title }}</h3>
            <div class="card-meta">
              <span class="location">
                <i class="el-icon-location"></i>
                {{ item.location }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tData.pageData.length === 0 && !tData.loading" class="empty-state">
        <i class="el-icon-search"></i>
        <div class="empty-text">未找到相关结果</div>
        <div class="empty-tip">试试其他关键词吧</div>
      </div>
    </a-spin>

    <div class="pagination-wrapper" v-if="tData.total > 0">
      <a-pagination 
        v-model:value="tData.page" 
        :total="tData.total" 
        :pageSize="tData.pageSize"
        :showSizeChanger="false"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script setup>
import {listApi as listThingList} from '/@/api/thing'
import {BASE_URL} from "/@/store/constants";
import {useUserStore} from "/@/store";

const userStore = useUserStore()
const router = useRouter();
const route = useRoute();

const tData = reactive({
  loading: false,
  keyword: '',
  thingData: [],
  pageData: [],

  page: 1,
  total: 0,
  pageSize: 20,
})

onMounted(() => {
  search()
})

// ����query����
watch(() => route.query, (newPath, oldPath) => {
  search()
}, {immediate: false});


const search = () => {
  tData.keyword = route.query.keyword.trim()
  getThingList({'keyword': tData.keyword})
}

// 分页事件
const changePage = (page) => {
  tData.page = page
  let start = (tData.page - 1) * tData.pageSize
  tData.pageData = tData.thingData.slice(start, start + tData.pageSize)
  console.log('分页: ' + tData.page)
}
const handleDetail = (item) => {
  router.push({ name: 'detail', query: { id: item.id } })
}
const getThingList = (data) => {
  tData.loading = true
  listThingList(data).then(res => {
    res.data.forEach((item, index) => {
      if (item.cover) {
        item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover
      }
    })
    // 只显示已上架的服务 (status='0')
    tData.thingData = res.data.filter(item => item.status === '0')
    tData.total = tData.thingData.length
    changePage(1)
    tData.loading = false
  }).catch(err => {
    console.log('分页: ' + tData.page)
    tData.loading = false
  })
}

</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.search-result-view {
  padding: 0;
}

.search-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid rgba(102, 187, 106, 0.2);
}

.search-title {
  font-size: 28px;
  font-weight: 700;
  color: #2E7D32;
  margin: 0 0 16px 0;
}

.search-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.keyword-highlight {
  font-size: 18px;
  font-weight: 600;
  color: #66BB6A;
  padding: 6px 16px;
  background: linear-gradient(135deg, rgba(102, 187, 106, 0.1) 0%, rgba(77, 182, 172, 0.1) 100%);
  border-radius: 20px;
  border: 1px solid rgba(102, 187, 106, 0.3);
}

.result-count {
  font-size: 14px;
  color: #6b7280;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.result-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 2px solid #F1F8E9;
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.08);
  animation: cardFadeIn 0.5s ease-out backwards;
}

.result-card:nth-child(1) { animation-delay: 0.05s; }
.result-card:nth-child(2) { animation-delay: 0.1s; }
.result-card:nth-child(3) { animation-delay: 0.15s; }
.result-card:nth-child(4) { animation-delay: 0.2s; }
.result-card:nth-child(5) { animation-delay: 0.25s; }
.result-card:nth-child(6) { animation-delay: 0.3s; }

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-card:hover {
  transform: translateY(-8px);
  border-color: #66BB6A;
  box-shadow: 0 12px 32px rgba(77, 182, 172, 0.2);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #F1F8E9;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-card:hover .card-image img {
  transform: scale(1.1);
}

.price-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.3);
}

.price-badge span {
  font-size: 12px;
  font-weight: 500;
}

.card-body {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6b7280;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
}

.location i {
  color: #66BB6A;
  font-size: 16px;
}

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
  font-weight: 600;
}

.empty-tip {
  font-size: 14px;
  color: #9ca3af;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(102, 187, 106, 0.1);
}

:deep(.ant-pagination-item) {
  border-radius: 8px;
  border-color: rgba(102, 187, 106, 0.3);
  transition: all 0.3s ease;
}

:deep(.ant-pagination-item:hover) {
  border-color: #66BB6A;
  transform: translateY(-2px);
}

:deep(.ant-pagination-item-active) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  border-color: #66BB6A;
}

:deep(.ant-pagination-item-active a) {
  color: #ffffff;
}

:deep(.ant-pagination-prev),
:deep(.ant-pagination-next) {
  border-radius: 8px;
  border-color: rgba(102, 187, 106, 0.3);
}

:deep(.ant-pagination-prev:hover),
:deep(.ant-pagination-next:hover) {
  border-color: #66BB6A;
}
</style>
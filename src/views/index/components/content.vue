<template>
  <div class="content page-surface">
    <div class="content-left">
      <div class="left-search-item">
        <h4>服务分类</h4>
        <a-tree :tree-data="contentData.cData" :selected-keys="contentData.selectedKeys" @select="onSelect"
                style="min-height: 220px;">
        </a-tree>
      </div>
      <div class="left-search-item"><h4>热门标签</h4>
        <div class="tag-view tag-flex-view">
            <span class="tag" :class="{'tag-select': contentData.selectTagId===item.id}"
                  v-for="item in contentData.tagData" :key="item.id"
                  @click="clickTag(item.id)">{{ item.title }}</span>
        </div>
      </div>
    </div>
    <div class="content-right">
      <div class="top-select-view flex-view">
        <div class="order-view">
          <span class="title"></span>
          <span 
                :ref="el => { if (el) tabRefs[index] = el }"
                class="tab"
                :class="contentData.selectTabIndex===index? 'tab-select':''"
                v-for="(item,index) in contentData.tabData"
                :key="index"
                @click="selectTab(index)">
            {{ item }}
          </span>
          <span :style="{left: contentData.tabUnderLeft + 'px', width: contentData.tabUnderWidth + 'px'}" class="tab-underline"></span>
        </div>
      </div>
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">关键词</span>
          <input v-model="contentData.localKeyword" class="filter-input" placeholder="标题/地点" @keyup.enter="applyLocalFilter" />
        </div>
        <div class="filter-group">
          <span class="filter-label">价格区间</span>
          <input v-model="contentData.priceMin" class="filter-input short" placeholder="最低价" @keyup.enter="applyLocalFilter" />
          <span class="filter-split">-</span>
          <input v-model="contentData.priceMax" class="filter-input short" placeholder="最高价" @keyup.enter="applyLocalFilter" />
        </div>
        <div class="filter-actions">
          <button class="filter-btn" @click="applyLocalFilter">筛选</button>
          <button class="filter-btn ghost" @click="resetLocalFilter">重置</button>
        </div>
      </div>
      <a-spin :spinning="contentData.loading" style="min-height: 200px;">
        <div class="pc-thing-list flex-view">
          <template v-if="contentData.loading">
            <div v-for="i in 6" :key="i" class="thing-item skeleton-card">
              <div class="img-view"></div>
              <div class="info-view">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line"></div>
              </div>
            </div>
          </template>
          <template v-else>
            <div v-for="item in contentData.pageData" :key="item.id" @click="handleDetail(item)"
                 class="thing-item item-column-3"><!---->
              <div class="img-view">
                <img :src="item.cover"></div>
              <div class="info-view">
                <h3 class="thing-name">{{ item.title.substring(0, 12) }}</h3>
                <span>
                  <span class="a-price-symbol"></span>
                  <span class="a-price">{{ item.price }}元/时</span>&nbsp;
                  <span class="a-price">{{ item.location }}</span>
                </span>
              </div>
            </div>
            <div v-if="contentData.pageData.length <= 0" class="empty-state">
              <div class="empty-title">暂无内容</div>
              <div class="empty-subtitle">请使用筛选条件试一试</div>
            </div>
          </template>
        </div>
      </a-spin>
      <div class="page-view" style="">
        <a-pagination v-model="contentData.page" size="small" @change="changePage" :hideOnSinglePage="true"
                      :defaultPageSize="contentData.pageSize" :total="contentData.total" :showSizeChanger="false"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {listApi as listClassificationList} from '/@/api/classification'
import {listApi as listTagList} from '/@/api/tag'
import {listApi as listThingList} from '/@/api/thing'
import {BASE_URL} from "/@/store/constants";
import {useUserStore} from "/@/store";

const userStore = useUserStore()
const router = useRouter();
const tabRefs = ref([]);

const contentData = reactive({
  selectX: 0,
  selectTagId: -1,
  cData: [],
  selectedKeys: [],
  tagData: [],
  loading: false,
  localKeyword: '',
  priceMin: '',
  priceMax: '',

  tabData: ['最新', '最热', '推荐'],
  selectTabIndex: 0,
  tabUnderLeft: 0,
  tabUnderWidth: 0,

  thingData: [],
  filteredData: [],
  pageData: [],

  page: 1,
  total: 0,
  pageSize: 12,
  
  isFirstLoad: true, // 标记是否首次加载
})

onMounted(() => {
  initSider()
  getThingList({})
  // 初始化下划线位置
  nextTick(() => {
    updateUnderlinePosition(0)
  })
})

const updateUnderlinePosition = (index) => {
  if (tabRefs.value && tabRefs.value[index]) {
    const tab = tabRefs.value[index]
    contentData.tabUnderLeft = tab.offsetLeft
    contentData.tabUnderWidth = tab.offsetWidth
  }
}

const initSider = () => {
  contentData.cData.push({key:'-1', title:'全部'})
  listClassificationList().then(res => {
    res.data.forEach(item=>{
      item.key = item.id
      contentData.cData.push(item)
    })
  })
  listTagList().then(res => {
    contentData.tagData = res.data
  })
}

const getSelectedKey = () => {
  if (contentData.selectedKeys.length > 0) {
    return contentData.selectedKeys[0]
  } else {
    return -1
  }
}
const onSelect = (selectedKeys) => {
  contentData.selectedKeys = selectedKeys
  console.log(contentData.selectedKeys[0])
  if (contentData.selectedKeys.length > 0) {
    getThingList({c: getSelectedKey()})
  }
  contentData.selectTagId = -1
}
const clickTag = (index) => {
  contentData.selectedKeys = []
  contentData.selectTagId = index
  getThingList({tag: contentData.selectTagId})
}

// 最新|最热|推荐
const selectTab = (index) => {
  contentData.selectTabIndex = index
  updateUnderlinePosition(index)
  console.log(contentData.selectTabIndex)
  let sort = (index === 0 ? 'recent' : index === 1 ? 'hot' : 'recommend')
  const data = {sort: sort}
  if (contentData.selectTagId !== -1) {
    data['tag'] = contentData.selectTagId
  } else {
    data['c'] = getSelectedKey()
  }
  getThingList(data)
}
const handleDetail = (item) => {
  const text = router.resolve({name: 'detail', query: {id: item.id}})
  window.open(text.href, '_blank')
}
// 分页事件
const changePage = (page) => {
  contentData.page = page
  let start = (contentData.page - 1) * contentData.pageSize
  contentData.pageData = contentData.filteredData.slice(start, start + contentData.pageSize)
  console.log('第' + contentData.page + '页')
}

const applyLocalFilter = () => {
  const keyword = contentData.localKeyword.trim()
  const min = Number(contentData.priceMin)
  const max = Number(contentData.priceMax)
  const hasMin = contentData.priceMin !== '' && !Number.isNaN(min)
  const hasMax = contentData.priceMax !== '' && !Number.isNaN(max)

  contentData.filteredData = contentData.thingData.filter((item) => {
    const text = `${item.title || ''}${item.location || ''}`
    const hitKeyword = keyword ? text.includes(keyword) : true
    const price = Number(item.price)
    const hitMin = hasMin ? price >= min : true
    const hitMax = hasMax ? price <= max : true
    return hitKeyword && hitMin && hitMax
  })

  contentData.total = contentData.filteredData.length
  changePage(1)
}

const resetLocalFilter = () => {
  contentData.localKeyword = ''
  contentData.priceMin = ''
  contentData.priceMax = ''
  contentData.filteredData = [...contentData.thingData]
  contentData.total = contentData.filteredData.length
  changePage(1)
}
const getThingList = (data) => {
  contentData.loading = true
  listThingList(data).then(res => {
    contentData.loading = false
    res.data.forEach((item, index) => {
      if (item.cover) {
        item.cover = BASE_URL + '/api/staticfiles/image/' +  item.cover
      }
    })
    console.log(res)
    // 只显示已上架的服务 (status='0')
    contentData.thingData = res.data.filter(item => item.status === '0')
    contentData.filteredData = [...contentData.thingData]
    applyLocalFilter()
  }).catch(err => {
    console.log(err)
    contentData.loading = false
  })
}


</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.content {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  max-width: 1600px !important;
  width: 92vw;
  margin: 84px auto 64px !important;
  padding: 0 60px !important;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.left-search-item {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #E0F2F1;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.left-search-item:hover {
  box-shadow: 0 8px 24px rgba(77, 182, 172, 0.15);
  transform: translateY(-2px);
}

.left-search-item :deep(.ant-tree) {
  background: transparent;
}

.left-search-item :deep(.ant-tree-list-holder) {
  background: transparent;
  border: none;
  padding: 6px 0;
}

.left-search-item :deep(.ant-tree-treenode) {
  color: #374151;
  padding: 4px 0;
  align-items: center;
}

.left-search-item :deep(.ant-tree-title) {
  color: #374151;
}

.left-search-item :deep(.ant-tree-node-content-wrapper) {
  border-radius: 10px;
  transition: all 0.2s ease;
  color: #374151;
  padding: 8px 12px;
  border: 1px solid #E0F2F1;
  background: #ffffff;
  cursor: pointer;
  min-height: 36px;
  line-height: 1.5;
}

.left-search-item :deep(.ant-tree-node-content-wrapper:hover) {
  background: #F1F8E9 !important;
  color: #2E7D32;
  border-color: #81C784;
  transform: translateX(2px);
}

.left-search-item :deep(.ant-tree-node-selected .ant-tree-node-content-wrapper) {
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%) !important;
  color: #2E7D32 !important;
  border-color: #81C784 !important;
  font-weight: 600;
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(129, 199, 132, 0.15);
}

.left-search-item :deep(.ant-tree-switcher) {
  color: #81C784;
  width: 24px;
  height: 24px;
  line-height: 24px;
  margin-right: 4px;
}

.left-search-item :deep(.ant-tree-indent) {
  display: inline-block;
}

.left-search-item h4 {
  color: #2E7D32;
  font-family: @font-family-display;
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 16px 0;
  letter-spacing: 0.3px;
  position: relative;
  padding-bottom: 12px;
  cursor: default;
  user-select: none;
}

.left-search-item h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #66BB6A, #4DB6AC);
  border-radius: 2px;
}

.tag-view {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: #ffffff;
  border: 1px solid #E0F2F1;
  border-radius: 10px;
  height: 36px;
  line-height: 34px;
  padding: 0 16px;
  cursor: pointer;
  font-size: 13px;
  color: #6b7280;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  user-select: none;
}

.tag:hover {
  color: #2E7D32;
  background: #F1F8E9;
  border-color: #E0F2F1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.15);
}

.tag-select {
  color: #2E7D32 !important;
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%) !important;
  border-color: #81C784 !important;
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.2) !important;
  transform: translateY(-2px);
  font-weight: 600;
}

.content-right {
  padding-top: 8px;
  animation: slideInRight 0.5s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.top-select-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 4px;
}

.filter-bar {
  margin: 16px 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #E0F2F1;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.filter-bar:hover {
  box-shadow: 0 8px 24px rgba(77, 182, 172, 0.15);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.filter-input {
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #E0F2F1;
  background: #ffffff;
  color: #1f2937;
  font-size: 13px;
  min-width: 140px;
  transition: all 0.2s ease;
}

.filter-input:hover {
  border-color: #80CBC4;
}

.filter-input:focus {
  outline: none;
  border-color: #4DB6AC;
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.1);
}

.filter-input.short {
  min-width: 90px;
}

.filter-split {
  color: #B2DFDB;
  font-weight: 500;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.filter-btn {
  height: 36px;
  padding: 0 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-btn:hover {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35);
  transform: translateY(-2px);
}

.filter-btn:active {
  transform: translateY(0);
}

.filter-btn.ghost {
  background: transparent;
  border: 1px solid #E0F2F1;
  color: #66BB6A;
  box-shadow: none;
}

.filter-btn.ghost:hover {
  background: #F1F8E9;
  border-color: #81C784;
  color: #4DB6AC;
  box-shadow: none;
  transform: translateY(-2px);
}

.order-view {
  position: relative;
  color: #6b7280;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-view .tab {
  color: #6b7280;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 8px;
  font-weight: 500;
  user-select: none;
}

.order-view .tab:hover {
  color: #4DB6AC;
  background: #F1F8E9;
}

.order-view .tab-select {
  color: #4DB6AC;
  font-weight: 600;
  background: #E8F5E9;
}

.order-view .tab-underline {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 32px;
  height: 3px;
  background: linear-gradient(90deg, #66BB6A, #4DB6AC);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pc-thing-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 24px;
}

.pc-thing-list .thing-item {
  background: #ffffff;
  border: 1px solid #F1F8E9;
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.06);
  overflow: hidden;
}

:deep(.pc-thing-list .thing-item:nth-child(1)) { animation: fadeInScale 0.4s ease-out 0.05s backwards !important; }
:deep(.pc-thing-list .thing-item:nth-child(2)) { animation: fadeInScale 0.4s ease-out 0.1s backwards !important; }
:deep(.pc-thing-list .thing-item:nth-child(3)) { animation: fadeInScale 0.4s ease-out 0.15s backwards !important; }
:deep(.pc-thing-list .thing-item:nth-child(4)) { animation: fadeInScale 0.4s ease-out 0.2s backwards !important; }
:deep(.pc-thing-list .thing-item:nth-child(5)) { animation: fadeInScale 0.4s ease-out 0.25s backwards !important; }
:deep(.pc-thing-list .thing-item:nth-child(6)) { animation: fadeInScale 0.4s ease-out 0.3s backwards !important; }
:deep(.pc-thing-list .thing-item:nth-child(7)) { animation: fadeInScale 0.4s ease-out 0.35s backwards !important; }
:deep(.pc-thing-list .thing-item:nth-child(8)) { animation: fadeInScale 0.4s ease-out 0.4s backwards !important; }
:deep(.pc-thing-list .thing-item:nth-child(9)) { animation: fadeInScale 0.4s ease-out 0.45s backwards !important; }

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.pc-thing-list .thing-item:hover {
  transform: translateY(-8px);
  border-color: #E0F2F1;
  box-shadow: 0 12px 32px rgba(77, 182, 172, 0.15);
}

.pc-thing-list .img-view {
  height: 200px;
  border-radius: 0;
  overflow: hidden;
  background: #F1F8E9;
  position: relative;
}

.pc-thing-list .img-view::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(46, 125, 50, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pc-thing-list .thing-item:hover .img-view::after {
  opacity: 1;
}

.pc-thing-list img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.pc-thing-list .thing-item:hover img {
  transform: scale(1.08);
}

.pc-thing-list .info-view {
  padding: 16px;
}

.pc-thing-list .info-view span {
  color: #6b7280;
}

.pc-thing-list .thing-name {
  margin: 0 0 8px 0;
  color: #1f2937 !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  line-height: 1.4 !important;
  transition: color 0.2s ease;
}

.pc-thing-list .thing-item:hover .thing-name {
  color: #4DB6AC !important;
}

.pc-thing-list .a-price {
  color: #66BB6A;
  font-size: 15px;
  font-weight: 600;
}

.pc-thing-list .a-price-symbol {
  color: #66BB6A;
}

.skeleton-card {
  pointer-events: none;
}

.skeleton-card .img-view,
.skeleton-card .skeleton-line {
  background: linear-gradient(90deg, #F1F8E9 25%, #E0F2F1 50%, #F1F8E9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-card .img-view {
  height: 200px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  margin-top: 10px;
}

.skeleton-line.title {
  height: 16px;
  width: 70%;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #A5D6A7;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #81C784;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 14px;
  color: #A5D6A7;
}

.page-view {
  min-height: auto;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #E0F2F1;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.08);
  color: #374151;
  margin-top: 32px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.page-view:hover {
  box-shadow: 0 8px 24px rgba(77, 182, 172, 0.15);
}

.page-view :deep(.ant-pagination) {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.page-view :deep(.ant-pagination-item),
.page-view :deep(.ant-pagination-prev),
.page-view :deep(.ant-pagination-next) {
  margin: 0 !important;
  border-radius: 8px !important;
  border-color: #E0F2F1 !important;
  transition: all 0.2s ease !important;
}

.page-view :deep(.ant-pagination-item:hover),
.page-view :deep(.ant-pagination-prev:hover),
.page-view :deep(.ant-pagination-next:hover) {
  border-color: #4DB6AC !important;
  transform: translateY(-2px);
}

.page-view :deep(.ant-pagination-item-active) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
  border-color: #66BB6A !important;
}

.page-view :deep(.ant-pagination-item-active a) {
  color: #ffffff !important;
}
</style>











/* 首页卡片动画 */
.thing-item {
  animation: cardFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards !important;
}

.thing-item:nth-child(1) { animation-delay: 0.1s !important; }
.thing-item:nth-child(2) { animation-delay: 0.15s !important; }
.thing-item:nth-child(3) { animation-delay: 0.2s !important; }
.thing-item:nth-child(4) { animation-delay: 0.25s !important; }
.thing-item:nth-child(5) { animation-delay: 0.3s !important; }
.thing-item:nth-child(6) { animation-delay: 0.35s !important; }
.thing-item:nth-child(7) { animation-delay: 0.4s !important; }
.thing-item:nth-child(8) { animation-delay: 0.45s !important; }
.thing-item:nth-child(9) { animation-delay: 0.5s !important; }

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

/* 内容区域宽度优化 */
.content {
  max-width: 1600px !important;
  margin: 0 auto !important;
  padding: 30px 20px !important;
}

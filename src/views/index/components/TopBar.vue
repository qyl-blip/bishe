<template>
  <div class="top-bar-wrapper">
    <!-- 主导航栏 -->
    <div class="main-bar-view page-surface">
      <div class="logo">
        <img :src="logoImage" class="logo-icon" @click="$router.push({name:'portal'})">
        <span class="logo-text" @click="$router.push({name:'portal'})">家政服务平台</span>
      </div>
      
      <div class="search-entry" @click.stop>
        <img :src="SearchIcon" class="search-icon" @click="search">
        <input
          placeholder="输入关键词"
          ref="keywordRef"
          v-model="keyword"
          @keyup.enter="search"
          @keydown.esc="clearSearch"
          @focus="showHistory = true"
        />
        <button class="clear-btn" v-show="keyword" type="button" @click="clearSearch">×</button>
        <div class="search-history" v-show="showHistory && historyList.length">
          <div class="history-head">
            <span>搜索历史</span>
            <button type="button" class="history-clear" @click="clearHistory">清空</button>
          </div>
          <div class="history-list">
            <button
              v-for="(item, index) in historyList"
              :key="item + index"
              class="history-item"
              @click="applyHistory(item)"
            >
              <span>{{ item }}</span>
              <i class="remove" @click.stop="removeHistory(item)">×</i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="modern-nav">
        <div class="nav-item" :class="{ active: $route.path === '/index/local' }" @click="$router.push('/index/local')" ref="navLocal">
          <i class="el-icon-position"></i>
          <span>附近家政</span>
        </div>
        <div class="nav-item" :class="{ active: $route.path === '/index/nanny' }" @click="$router.push('/index/nanny')" ref="navNanny">
          <i class="el-icon-medal"></i>
          <span>金牌月嫂</span>
        </div>
        <div class="nav-item" :class="{ active: $route.path === '/index/special' }" @click="$router.push('/index/special')" ref="navSpecial">
          <i class="el-icon-refrigerator"></i>
          <span>特惠服务</span>
          <span class="sale-tag">SALE</span>
        </div>
        <div class="nav-underline" :style="{ left: underlineLeft + 'px', width: underlineWidth + 'px' }"></div>
      </div>
      
      <div class="right-view">
        <a-button type="link" @click="handleAdmin()">后台入口</a-button>
        <a-button type="link" @click="handleJoin()">家政入驻</a-button>
        <template v-if="userStore.user_token">
          <div class="user-menu-wrapper" @click.stop>
            <button class="avatar-btn" type="button" @click="userMenuVisible = !userMenuVisible">
              <img :src="userAvatar" class="self-img" :class="{ 'menu-open': userMenuVisible }">
            </button>
            <div v-show="userMenuVisible" class="user-menu-panel">
              <button class="user-menu-item" type="button" @click="handleUserMenu('userInfoEditView')">个人设置</button>
              <button class="user-menu-item" type="button" @click="handleUserMenu('quit')">退出</button>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="login btn" @click="goLogin()">登录</button>
        </template>

        <div class="right-icon" @click="msgVisible=true">
          <img :src="MessageIcon">
          <span class="msg-point"></span>
        </div>
        <div>
          <a-drawer title="我的消息" placement="right" :closable="true" :maskClosable="true" :visible="msgVisible"
            @close="onClose">
            <a-spin :spinning="loading" style="min-height: 200px;">
              <div class="list-content">
                <div class="notification-view">
                  <div class="list">
                    <div class="notification-item flex-view" v-for="item in msgData" :key="item.id">
                      <div class="content-box">
                        <div class="header">
                          <span class="title-txt">{{item.title}}</span>
                          <br />
                          <span class="time">{{ item.create_time }}</span>
                        </div>
                        <div class="content">
                          <p>{{ item.content }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-spin>
          </a-drawer>
        </div>
      </div>
    </div>

    <!-- 第二行：定位城市栏 - 首页不显示 -->
    <div class="location-bar" v-if="$route.path !== '/index/portal' && $route.path !== '/'">
      <div class="location-content">
        <div class="location-info">
          <i class="el-icon-location"></i>
          <span class="label">当前服务城市：</span>
          <span class="city-name">{{ currentCity || '北京' }}</span>
        </div>
        <div class="location-tip">
          <i class="el-icon-info"></i>
          <span>已为您筛选本地优质服务</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { listApi } from '/@/api/notice'
  import { useUserStore } from "/@/store";
  import logoImage from '/@/assets/images/logo.png';
  import SearchIcon from '/@/assets/images/search-icon.svg';
  import AvatarIcon from '/@/assets/images/avatar.jpg';
  import MessageIcon from '/@/assets/images/message-icon.svg';
  import { message } from 'ant-design-vue';
  import { detailApi } from '/@/api/user';
  import { BASE_URL } from '/@/store/constants';

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  const keywordRef = ref(null)
  const keyword = ref(localStorage.getItem('hk_last_keyword') || '')
  const showHistory = ref(false)
  const historyList = ref<string[]>(JSON.parse(localStorage.getItem('hk_search_history') || '[]'))
  const currentCity = ref('北京')

  // 导航下划线
  const navLocal = ref(null)
  const navNanny = ref(null)
  const navSpecial = ref(null)
  const underlineLeft = ref(0)
  const underlineWidth = ref(0)

  const updateUnderline = () => {
    nextTick(() => {
      let activeNav = null
      if (route.path === '/index/local') {
        activeNav = navLocal.value
      } else if (route.path === '/index/nanny') {
        activeNav = navNanny.value
      } else if (route.path === '/index/special') {
        activeNav = navSpecial.value
      }
      
      if (activeNav) {
        underlineLeft.value = activeNav.offsetLeft
        underlineWidth.value = activeNav.offsetWidth
      } else {
        // 如果没有匹配的路由，隐藏下划线
        underlineWidth.value = 0
      }
    })
  }

  watch(() => route.path, () => {
    setTimeout(() => {
      updateUnderline()
    }, 50)
  })

  let loading = ref(false)
  let msgVisible = ref(false)
  let msgData = ref([])
  const userMenuVisible = ref(false)
  const userAvatar = ref(AvatarIcon)

  const handleGlobalKeydown = (event) => {
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      event.preventDefault()
      keywordRef.value?.focus()
    }
  }

  onMounted(() => {
    // 读取城市
    const savedCity = localStorage.getItem('currentCity');
    if (savedCity) {
      currentCity.value = savedCity;
    }
    
    getMessageList()
    getUserAvatar()
    // 延迟更新下划线位置，确保DOM完全渲染
    setTimeout(() => {
      updateUnderline()
    }, 100)
    window.addEventListener('keydown', handleGlobalKeydown)
    window.addEventListener('click', handleGlobalClick)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleGlobalKeydown)
    window.removeEventListener('click', handleGlobalClick)
  })

  const getMessageList = () => {
    loading.value = true
    listApi({}).then(res => {
      msgData.value = res.data
      loading.value = false
    }).catch(err => {
      console.log(err)
      loading.value = false
    })
  }
  
  const getUserAvatar = () => {
    if (!userStore.user_id) return
    detailApi({ userId: userStore.user_id }).then(res => {
      if (res.data && res.data.avatar) {
        userAvatar.value = BASE_URL + '/api/staticfiles/avatar/' + res.data.avatar
      }
    }).catch(err => {
      console.log(err)
    })
  }
  
  const search = () => {
    const text = keyword.value.trim()
    if (!text) return
    localStorage.setItem('hk_last_keyword', text)
    saveHistory(text)
    // 始终在当前页面跳转，不打开新窗口
    router.push({ name: 'search', query: { keyword: text } })
  }

  const clearSearch = () => {
    keyword.value = ''
    localStorage.removeItem('hk_last_keyword')
    keywordRef.value?.focus()
  }

  const saveHistory = (text) => {
    if (!text) return
    const next = [text, ...historyList.value.filter((item) => item !== text)].slice(0, 8)
    historyList.value = next
    localStorage.setItem('hk_search_history', JSON.stringify(next))
  }

  const applyHistory = (text) => {
    keyword.value = text
    showHistory.value = false
    search()
  }

  const removeHistory = (text) => {
    const next = historyList.value.filter((item) => item !== text)
    historyList.value = next
    localStorage.setItem('hk_search_history', JSON.stringify(next))
  }

  const clearHistory = () => {
    historyList.value = []
    localStorage.removeItem('hk_search_history')
  }

  const handleGlobalClick = () => {
    showHistory.value = false
    userMenuVisible.value = false
  }
  
  const goLogin = () => {
    router.push({ name: 'login' })
  }

  const goUserCenter = (menuName) => {
    router.push({ name: menuName })
  }
  
  const handleUserMenu = (menuName) => {
    userMenuVisible.value = false
    if (menuName === 'quit') {
      quit()
      return
    }
    goUserCenter(menuName)
  }
  
  const quit = () => {
    userStore.logout().then(res => {
      router.push({ name: 'portal' })
    })
  }
  
  const onClose = () => {
    msgVisible.value = false;
  }
  
  const handleJoin = () => {
    let userId = userStore.user_id;
    if (userId) {
      router.push({ name: 'jiajiaoEditView' })
    } else {
      message.warn("请先登录");
    }
  }
  
  const handleAdmin = () => {
    router.push({ name: 'admin' })
  }
</script>

<style scoped lang="less">
  @import '/@/styles/theme.less';
  
  .top-bar-wrapper {
    position: sticky;
    top: 0;
    z-index: 999;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(14px);
    width: 100vw;
    margin-left: calc(50% - 50vw);
  }
  
  .main-bar-view {
    height: 68px;
    width: 100%;
    background: transparent;
    border-bottom: none;
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 0 60px;
    z-index: 1000;
    position: relative;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }
  
  .logo .logo-icon {
    width: 36px;
    height: 36px;
    filter: drop-shadow(0 8px 20px rgba(212, 175, 55, 0.25));
  }
  
  .logo .logo-text {
    font-size: 20px;
    font-weight: 700;
    color: #2E7D32;
  }

  .search-entry {
    position: relative;
    width: 420px;
    min-width: 220px;
    height: 38px;
    background: #ffffff;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid rgba(15, 17, 25, 0.12);
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .search-entry:hover {
    border-color: rgba(102, 187, 106, 0.5);
    box-shadow: 0 10px 24px rgba(20, 26, 42, 0.1), 0 0 0 2px rgba(102, 187, 106, 0.12);
  }

  .search-entry:focus-within {
    border-color: rgba(102, 187, 106, 0.7);
    box-shadow: 0 10px 24px rgba(20, 26, 42, 0.12), 0 0 0 3px rgba(102, 187, 106, 0.2);
  }

  .search-entry .search-icon {
    width: 18px;
    margin: 10px 8px 0 0;
    opacity: 0.7;
    cursor: pointer;
  }

  .search-entry input {
    position: absolute;
    top: 6px;
    width: 85%;
    height: 24px;
    border: 0;
    color: #1c2233;
    background: transparent;
    font-size: 14px;
  }

  .search-entry .clear-btn {
    position: absolute;
    right: 10px;
    top: 6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(102, 187, 106, 0.25);
    background: rgba(15, 17, 25, 0.75);
    color: rgba(246, 244, 238, 0.8);
    font-size: 16px;
    line-height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .search-entry .clear-btn:hover {
    border-color: rgba(102, 187, 106, 0.6);
    color: #f6f4ee;
  }

  .search-history {
    position: absolute;
    left: 0;
    right: 0;
    top: 46px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(15, 17, 25, 0.12);
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 18px 40px rgba(20, 26, 42, 0.12);
    z-index: 1000;
  }

  .history-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(28, 34, 51, 0.7);
    font-size: 12px;
    margin-bottom: 8px;
  }

  .history-clear {
    background: transparent;
    border: 1px solid rgba(102, 187, 106, 0.35);
    color: #66BB6A;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
    cursor: pointer;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .history-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 1px solid rgba(15, 17, 25, 0.12);
    color: rgba(28, 34, 51, 0.85);
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .history-item:hover {
    border-color: rgba(102, 187, 106, 0.6);
    background: #F1F8E9;
  }

  .history-item .remove {
    font-style: normal;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgba(102, 187, 106, 0.3);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(102, 187, 106, 0.7);
  }

  .modern-nav {
    display: flex;
    align-items: center;
    gap: 28px;
    flex: 1;
    position: relative;
  }

  .modern-nav .nav-item {
    position: relative;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    color: rgba(28, 34, 51, 0.7);
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    padding-bottom: 4px;
  }

  .modern-nav .nav-item i {
    font-size: 16px;
    color: #66BB6A;
  }

  .modern-nav .nav-item:hover {
    color: #1c2233;
  }

  .modern-nav .nav-item.active {
    color: #2E7D32;
    font-weight: 600;
  }

  .nav-underline {
    position: absolute;
    bottom: -22px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #66BB6A 25%, #66BB6A 75%, transparent);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
    z-index: 10;
  }

  .sale-tag {
    position: absolute;
    top: -10px;
    right: -22px;
    background: #FFA726;
    color: #ffffff;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 6px;
    box-shadow: 0 8px 20px rgba(255, 167, 38, 0.25);
  }

  .right-view {
    padding-right: 12px;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: flex-end;
    flex: none !important;
    position: relative;
  }

  .right-view :deep(.ant-btn-link) {
    color: #374151 !important;
    background: transparent !important;
    border: 1px solid rgba(102, 187, 106, 0.3) !important;
    border-radius: 20px !important;
    padding: 6px 18px !important;
    height: 36px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    box-shadow: 0 2px 8px rgba(102, 187, 106, 0.1) !important;
  }

  .right-view :deep(.ant-btn-link:hover) {
    color: #ffffff !important;
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
    border-color: #66BB6A !important;
    box-shadow: 0 4px 16px rgba(102, 187, 106, 0.3) !important;
    transform: translateY(-2px) !important;
  }

  .right-view :deep(.ant-btn-link:active) {
    transform: translateY(0) scale(0.98) !important;
  }

  .right-view .login {
    color: #ffffff !important;
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
    border: none !important;
    border-radius: 20px !important;
    padding: 8px 24px !important;
    height: 38px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3) !important;
  }

  .right-view .login:hover {
    background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%) !important;
    box-shadow: 0 6px 20px rgba(102, 187, 106, 0.4) !important;
    transform: translateY(-2px) !important;
  }

  .right-view .login:active {
    transform: translateY(0) scale(0.98) !important;
  }

  .right-view .right-icon {
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(102, 187, 106, 0.1) 0%, rgba(77, 182, 172, 0.1) 100%);
    border: 1px solid rgba(102, 187, 106, 0.2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
  }

  .right-view .right-icon:hover {
    background: linear-gradient(135deg, rgba(102, 187, 106, 0.15) 0%, rgba(77, 182, 172, 0.15) 100%);
    border-color: rgba(102, 187, 106, 0.4);
    box-shadow: 0 4px 16px rgba(102, 187, 106, 0.2);
    transform: translateY(-2px);
  }

  .right-view .right-icon:active {
    transform: translateY(0) scale(0.95);
  }

  .right-view .right-icon img {
    width: 20px;
    height: 20px;
  }

  .right-view .right-icon .msg-point {
    position: absolute;
    right: 4px;
    top: 4px;
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 0 12px rgba(255, 82, 82, 0.6);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  .right-view .self-img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid rgba(102, 187, 106, 0.3);
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
  }

  .right-view .self-img:hover {
    border-color: rgba(102, 187, 106, 0.6);
    box-shadow: 0 6px 20px rgba(102, 187, 106, 0.35);
    transform: translateY(-2px) scale(1.05);
  }

  .right-view .self-img:active {
    transform: translateY(0) scale(1);
  }

  .right-view .self-img.menu-open {
    border-color: #66BB6A;
    box-shadow: 0 0 0 3px rgba(102, 187, 106, 0.2);
  }

  .user-menu-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    z-index: 10001;
  }

  .avatar-btn {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    line-height: 0;
  }

  .user-menu-panel {
    position: absolute;
    top: 46px;
    right: 0;
    min-width: 160px;
    background: #ffffff;
    border: 1px solid rgba(102, 187, 106, 0.2);
    border-radius: 16px;
    padding: 8px;
    box-shadow: 0 12px 40px rgba(102, 187, 106, 0.15), 0 0 0 1px rgba(102, 187, 106, 0.1);
    z-index: 10002;
    animation: menuFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes menuFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .user-menu-item {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-menu-item:hover {
    background: linear-gradient(135deg, rgba(102, 187, 106, 0.1) 0%, rgba(77, 182, 172, 0.1) 100%);
    color: #2E7D32;
    transform: translateX(4px);
  }

  .user-menu-item:active {
    transform: translateX(2px) scale(0.98);
  }

  .user-menu-item:first-child {
    margin-bottom: 4px;
  }

  .user-menu-item:last-child {
    color: #EF4444;
  }

  .user-menu-item:last-child:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
    color: #DC2626;
  }
  
  /* 定位城市栏 */
  .location-bar {
    background: linear-gradient(135deg, rgba(232, 245, 233, 0.95) 0%, rgba(255, 249, 230, 0.95) 100%);
    backdrop-filter: blur(10px);
    z-index: 998;
    border-top: 1px solid rgba(129, 199, 132, 0.2);
    padding: 10px 60px;
  }
  
  .location-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .location-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .location-info i {
    color: #66BB6A;
    font-size: 18px;
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

  .location-info .label {
    color: #2E7D32;
    font-weight: 500;
  }

  .city-name {
    font-weight: 700;
    color: #2E7D32;
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(129, 199, 132, 0.3);
  }

  .location-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b7280;
  }

  .location-tip i {
    color: #FFA726;
  }
</style>

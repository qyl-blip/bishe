<template>
  <div class="main-bar-view page-surface">
    <div class="logo" @click="$router.push({name:'portal'})">
      <img :src="logoImage" class="logo-img" />
      <span class="logo-text">家政服务平台</span>
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
  <div class="nav-item" :class="{ active: $route.path === '/index/local' }" @click="$router.push('/index/local')">
    <i class="el-icon-position"></i>
    <span>附近家政</span>
    <span class="hot-dot"></span>
  </div>
 <!-- 金牌月嫂 -->
  <div class="nav-item" :class="{ active: $route.path === '/index/nanny' }" @click="$router.push('/index/nanny')">
    <i class="el-icon-medal"></i>
    <span>金牌月嫂</span>
  </div>
  
  <!-- 保洁特惠 -->
  <div class="nav-item" :class="{ active: $route.path === '/index/special' }" @click="$router.push('/index/special')">
    <i class="el-icon-refrigerator"></i>
    <span>保洁特惠</span>
    <span class="sale-tag">SALE</span>
  </div>
</div>
    <div class="right-view">
      <a-button type="link" @click="handleAdmin()">后台入口</a-button>
      <a-button type="link" @click="handleJoin()">家政入驻</a-button>
      <template v-if="userStore.user_token">
        <div class="user-menu-wrapper" @click.stop>
          <button class="avatar-btn" type="button" @click="userMenuVisible = !userMenuVisible">
            <img :src="AvatarIcon" class="self-img" :class="{ 'menu-open': userMenuVisible }">
          </button>
          <div v-show="userMenuVisible" class="user-menu-panel">
            <button class="user-menu-item" type="button" @click="handleUserMenu('userInfoEditView')">个人设置</button>
            <button class="user-menu-item" type="button" @click="handleUserMenu('quit')">退出</button>
          </div>
        </div>
        <!--        <div class="right-icon">-->
        <!--          <img src="@/assets/cart-icon.svg">-->
        <!--          <span>3</span>-->
        <!--        </div>-->
      </template>
      <template v-else>
        <button class="login btn hidden-sm" @click="goLogin()">登录</button>
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
                  <div class="notification-item flex-view" v-for="item in msgData">
                    <!---->
                    <div class="content-box">
                      <div class="header">
                        <span class="title-txt">{{item.title}}</span>
                        <br />
                        <span class="time">{{ item.create_time }}</span>
                      </div>
                      <div class="head-text">
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
</template>

<script setup lang="ts">
  import { listApi } from '/@/api/notice'
  import { useUserStore } from "/@/store";
  import logoImage from '/@/assets/images/logo.png';
  import SearchIcon from '/@/assets/images/search-icon.svg';
  import AvatarIcon from '/@/assets/images/avatar.jpg';
  import MessageIcon from '/@/assets/images/message-icon.svg';

  import { message } from 'ant-design-vue';

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  const keywordRef = ref(null)
  const keyword = ref(localStorage.getItem('hk_last_keyword') || '')
  const showHistory = ref(false)
  const historyList = ref<string[]>(JSON.parse(localStorage.getItem('hk_search_history') || '[]'))

  let loading = ref(false)
  let msgVisible = ref(false)
  let msgData = ref([])
  const userMenuVisible = ref(false)

  const handleGlobalKeydown = (event) => {
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      event.preventDefault()
      keywordRef.value?.focus()
    }
  }

  onMounted(() => {
    getMessageList()
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
  const search = () => {
    const text = keyword.value.trim()
    localStorage.setItem('hk_last_keyword', text)
    saveHistory(text)
    if (route.name === 'search') {
      router.push({ name: 'search', query: { keyword: text } })
    } else {
      let link = router.resolve({ name: 'search', query: { keyword: text } })
      window.open(link.href, '_blank')
    }
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
  .main-bar-view {
    position: fixed;
    top: 0;
    left: 0;
    height: 68px;
    width: 100%;
    padding: 0 40px;
    z-index: 16;
    display: flex;
    align-items: center;
    gap: 24px;
    background: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(15, 17, 25, 0.08);
    backdrop-filter: blur(14px);
    box-shadow: 0 12px 28px rgba(20, 26, 42, 0.08);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .logo-img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
    transition: all 0.3s ease;
  }

  .logo:hover .logo-img {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(102, 187, 106, 0.4);
  }

  .logo-text {
    font-size: 16px;
    font-weight: 600;
    color: #2E7D32;
    letter-spacing: 0.5px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
    transition: all 0.3s ease;
  }

  .logo:hover .logo-icon {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(102, 187, 106, 0.4);
  }

  .logo img {
    width: 36px;
    height: 36px;
    cursor: pointer;
    filter: drop-shadow(0 8px 20px rgba(212, 175, 55, 0.25));
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
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 0 10px 24px rgba(20, 26, 42, 0.1), 0 0 0 2px rgba(212, 175, 55, 0.12);
  }

  .search-entry:focus-within {
    border-color: rgba(212, 175, 55, 0.7);
    box-shadow: 0 10px 24px rgba(20, 26, 42, 0.12), 0 0 0 3px rgba(212, 175, 55, 0.2);
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
    border: 1px solid rgba(212, 175, 55, 0.25);
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
    border-color: rgba(212, 175, 55, 0.6);
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
    z-index: 30;
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
    border: 1px solid rgba(212, 175, 55, 0.35);
    color: #d4af37;
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
    border-color: rgba(212, 175, 55, 0.6);
    color: #f6f4ee;
  }

  .history-item .remove {
    font-style: normal;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgba(212, 175, 55, 0.3);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(246, 244, 238, 0.7);
  }

  .modern-nav {
    display: flex;
    align-items: center;
    gap: 28px;
    flex: 1;
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
  }

  .modern-nav .nav-item i {
    font-size: 16px;
    color: rgba(184, 134, 11, 0.85);
  }

  .modern-nav .nav-item:hover {
    color: #1c2233;
  }

  .modern-nav .nav-item.active {
    color: #1c2233;
    font-weight: 600;
  }

  .modern-nav .nav-item.active::after {
    content: '';
    position: absolute;
    bottom: -22px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37 25%, #d4af37 75%, transparent);
  }

  .sale-tag {
    position: absolute;
    top: -10px;
    right: -22px;
    background: #d4af37;
    color: #1a1f33;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 6px;
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.25);
  }

  .right-view {
    padding-right: 12px;
    display: flex;
    gap: 14px;
    align-items: center;
    justify-content: flex-end;
    flex: none !important;
    position: relative;
  }

  .right-view button {
    color: #1c2233;
    background: transparent;
    border: 1px solid rgba(15, 17, 25, 0.15);
    border-radius: 999px;
    padding: 6px 16px;
    transition: all 0.25s ease;
  }

  .right-view button:hover {
    border-color: rgba(212, 175, 55, 0.7);
    box-shadow: 0 10px 24px rgba(20, 26, 42, 0.1);
    transform: translateY(-1px);
  }

  .right-view .right-icon {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid rgba(15, 17, 25, 0.12);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
  }

  .right-view .right-icon:hover {
    border-color: rgba(212, 175, 55, 0.6);
    box-shadow: 0 10px 20px rgba(20, 26, 42, 0.12);
  }

  .right-view .right-icon img {
    width: 18px;
    height: 18px;
  }

  .right-view .right-icon .msg-point {
    position: absolute;
    right: -2px;
    top: -2px;
    width: 8px;
    height: 8px;
    background: #ef4e5b;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(239, 78, 91, 0.6);
  }

  .right-view .self-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid rgba(212, 175, 55, 0.4);
    box-shadow: 0 8px 20px rgba(20, 26, 42, 0.12);
    transition: all 0.25s ease;
  }

  .right-view .self-img:hover {
    border-color: rgba(212, 175, 55, 0.8);
  }

  .right-view .self-img.menu-open {
    transform: none !important;
  }

  .user-menu-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
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
    min-width: 140px;
    background: #ffffff;
    border: 1px solid rgba(15, 17, 25, 0.1);
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 18px 36px rgba(20, 26, 42, 0.16);
    z-index: 40;
  }

  .user-menu-item {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 13px;
    color: #1c2233;
    cursor: pointer;
  }

  .user-menu-item:hover {
    background: rgba(212, 175, 55, 0.12);
  }
</style>







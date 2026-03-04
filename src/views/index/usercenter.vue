<template>
  <a-layout id="user-center-layout">
    <a-layout-sider class="user-sider">
      <div class="user-profile-card">
        <img :src="userAvatar" class="user-avatar" />
        <h2 class="user-name">{{ userStore.user_name }}</h2>
        <div class="user-stats">
          <div class="stat-item" @click="clickMenu('collectThingView')">
            <div class="stat-num">{{ collectCount }}</div>
            <div class="stat-label">收藏</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" @click="clickMenu('wishThingView')">
            <div class="stat-num">{{ wishCount }}</div>
            <div class="stat-label">心愿单</div>
          </div>
        </div>
      </div>
      
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="user-menu"
      >
        <a-menu-item key="jiajiaoEditView" @click="clickMenu('jiajiaoEditView')">
          <home-outlined />
          <span>发布新服务</span>
        </a-menu-item>
        <a-menu-item key="myServicesView" @click="clickMenu('myServicesView')">
          <appstore-outlined />
          <span>我的服务</span>
        </a-menu-item>
        <a-menu-item key="orderView" @click="clickMenu('orderView')">
          <calendar-outlined />
          <span>我的预约</span>
        </a-menu-item>
        <a-menu-item key="receivedOrdersView" @click="clickMenu('receivedOrdersView')">
          <inbox-outlined />
          <span>收到的预约</span>
        </a-menu-item>
        <a-menu-item key="userInfoEditView" @click="clickMenu('userInfoEditView')">
          <user-outlined />
          <span>编辑资料</span>
        </a-menu-item>
        <a-menu-item key="securityView" @click="clickMenu('securityView')">
          <safety-outlined />
          <span>账号安全</span>
        </a-menu-item>
        <a-menu-item key="collectThingView" @click="clickMenu('collectThingView')">
          <heart-outlined />
          <span>我的收藏</span>
        </a-menu-item>
        <a-menu-item key="wishThingView" @click="clickMenu('wishThingView')">
          <star-outlined />
          <span>心愿单</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    
    <a-layout class="user-right-layout">
      <a-layout-header class="user-header">
        <div class="header-left">
          <span class="page-title">{{ getPageTitle(route.name) }}</span>
        </div>
        <div class="header-right">
          <a-button type="link" @click="goHome">返回首页</a-button>
          <a class="header-quit" @click="handleLogout">退出登录</a>
        </div>
      </a-layout-header>
      
      <a-layout-content class="user-content">
        <router-view :key="route.fullPath" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
  import { 
    HomeOutlined, 
    CalendarOutlined, 
    UserOutlined, 
    SafetyOutlined, 
    HeartOutlined,
    StarOutlined,
    InboxOutlined,
    AppstoreOutlined
  } from '@ant-design/icons-vue';
  import AvatarImg from '/@/assets/images/avatar.jpg';
  import { userCollectListApi } from '/@/api/thingCollect';
  import { userWishListApi } from '/@/api/thingWish';
  import { detailApi } from '/@/api/user';
  import { useUserStore } from '/@/store';
  import { BASE_URL } from '/@/store/constants';
  
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  let collectCount = ref(0);
  let wishCount = ref(0);
  const userAvatar = ref(AvatarImg);
  const selectedKeys = ref<any[]>([]);

  onMounted(() => {
    getCollectThingList();
    getWishThingList();
    getUserAvatar();
    selectedKeys.value = [route.name];
  });
  
  watch(() => route.name, (newName) => {
    selectedKeys.value = [newName];
  });
  
  const getUserAvatar = () => {
    if (!userStore.user_id) return;
    detailApi({ userId: userStore.user_id }).then(res => {
      if (res.data && res.data.avatar) {
        userAvatar.value = BASE_URL + '/api/staticfiles/avatar/' + res.data.avatar;
      }
    }).catch(err => {
      console.log(err);
    });
  };

  const clickMenu = (name) => {
    router.push({ name: name });
  };
  
  const getCollectThingList = () => {
    let userId = userStore.user_id;
    userCollectListApi({ userId: userId })
      .then((res) => {
        collectCount.value = res.data.length;
      })
      .catch((err) => {
        console.log(err.msg);
      });
  };

  const getWishThingList = () => {
    let userId = userStore.user_id;
    userWishListApi({ userId: userId })
      .then((res) => {
        wishCount.value = res.data.length;
      })
      .catch((err) => {
        console.log(err.msg);
      });
  };
  
  const getPageTitle = (name) => {
    const titleMap: Record<string, string> = {
      jiajiaoEditView: '发布新服务',
      myServicesView: '我的服务',
      editServiceView: '编辑服务',
      orderView: '我的预约',
      receivedOrdersView: '收到的预约',
      userInfoEditView: '编辑资料',
      securityView: '账号安全',
      collectThingView: '我的收藏',
      wishThingView: '心愿单',
    };
    return titleMap[name as string] || '个人中心';
  };
  
  const goHome = () => {
    router.push({ name: 'portal' });
  };
  
  const handleLogout = () => {
    userStore.logout().then(() => {
      router.push({ name: 'portal' });
    });
  };
</script>
<style scoped lang="less">
@import '/@/styles/theme.less';

#user-center-layout {
  height: 100vh;
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #E0F2F1 100%);
  display: flex;
  flex-direction: row;
  padding: 12px;
  gap: 16px;
  overflow: hidden;
}

.user-right-layout {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  height: calc(100vh - 24px); /* Ensure it has a fixed height relative to parent padding */
}

.user-sider {
  background: linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #E8F5E9 100%) !important;
  box-shadow: 4px 0 24px rgba(129, 199, 132, 0.15) !important;
  z-index: 100;
  border-right: 1px solid rgba(129, 199, 132, 0.2) !important;
  flex: 0 0 280px !important;
  max-width: 280px !important;
  min-width: 280px !important;
  width: 280px !important;
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  height: calc(100vh - 24px);
  overflow-y: auto;
}

.user-sider::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, rgba(200, 230, 201, 0.8), transparent);
  pointer-events: none;
  border-radius: 0 0 24px 24px;
}

:deep(.user-sider .ant-layout-sider-children) {
  background: transparent !important;
}

.user-profile-card {
  padding: 32px 24px;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(129, 199, 132, 0.2);
  border-radius: 24px 24px 0 0;
  backdrop-filter: blur(10px);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(102, 187, 106, 0.3);
  box-shadow: 0 8px 24px rgba(102, 187, 106, 0.3);
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.user-avatar:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 12px 32px rgba(102, 187, 106, 0.4);
}

.user-name {
  color: #2E7D32;
  font-weight: 700;
  font-size: 20px;
  margin: 0 0 20px 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
}

.user-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.stat-item {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 8px 16px;
  border-radius: 12px;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #66BB6A;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(129, 199, 132, 0.3);
}

:deep(.user-menu.ant-menu) {
  background: transparent;
  padding: 12px 0;
  border: none;
}

:deep(.user-menu .ant-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 4px 16px;
  width: calc(100% - 32px);
  border-radius: 16px;
  padding-left: 20px !important;
  padding-right: 16px !important;
  display: flex;
  align-items: center;
  color: #2E7D32 !important;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: visible;
  white-space: nowrap;
}

:deep(.user-menu .ant-menu-item span) {
  color: #2E7D32 !important;
  white-space: nowrap;
  overflow: visible;
}

:deep(.user-menu .ant-menu-item .anticon) {
  font-size: 18px;
  color: #66BB6A;
  margin-right: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.user-menu .ant-menu-item:hover) {
  color: #1B5E20 !important;
  background: rgba(255, 255, 255, 0.6) !important;
  transform: translateX(4px);
}

:deep(.user-menu .ant-menu-item:hover span) {
  color: #1B5E20 !important;
}

:deep(.user-menu .ant-menu-item:hover .anticon) {
  color: #FFA726;
  transform: scale(1.1) rotate(5deg);
}

:deep(.user-menu .ant-menu-item-selected) {
  color: #2E7D32 !important;
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%) !important;
  font-weight: 600;
  border-left: 4px solid #FFA726;
  padding-left: 16px !important;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
  transform: translateX(4px);
}

:deep(.user-menu .ant-menu-item-selected span) {
  color: #2E7D32 !important;
}

:deep(.user-menu .ant-menu-item-selected .anticon) {
  color: #FFA726 !important;
  transform: scale(1.15);
}

.user-header {
  background: transparent;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(129, 199, 132, 0.2);
  box-shadow: none;
  backdrop-filter: none;
  border-radius: 0;
  margin: 0;
  height: 72px;
}

.user-content {
  margin: 0;
  flex: 1;
  padding: 0;
  background: transparent;
  overflow-y: auto;
}

.header-left {
  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #2E7D32;
    font-family: @font-family-display;
    letter-spacing: 0.5px;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;

  .header-quit {
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    font-size: 14px;
    font-weight: 500;
    padding: 0 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
    border: none;
    box-shadow: 0 2px 8px rgba(244, 81, 30, 0.25);
    height: 40px;
    line-height: 40px;
    display: inline-block;

    &:hover {
      background: linear-gradient(135deg, #F4511E 0%, #E64A19 100%);
      box-shadow: 0 4px 12px rgba(244, 81, 30, 0.35);
      transform: translateY(-2px);
    }
  }
}

:deep(.header-right .ant-btn-link) {
  color: #ffffff;
  font-weight: 500;
  padding: 0 20px !important;
  height: 40px !important;
  line-height: 40px !important;
  border-radius: 12px;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.25);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none !important;
}

:deep(.header-right .ant-btn-link:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.35);
  transform: translateY(-2px);
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-40px) scale(0.95);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

:deep(.user-content > div) {
  background: transparent !important;
  border-radius: 0 !important;
  padding: 32px !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  border: none !important;
  width: 100% !important;
  min-height: 100% !important;
}

/* 滚动条样式 */
.user-sider::-webkit-scrollbar,
.user-content::-webkit-scrollbar {
  width: 8px;
}

.user-sider::-webkit-scrollbar-track,
.user-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.user-sider::-webkit-scrollbar-thumb,
.user-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #66BB6A, #FFA726);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.user-sider::-webkit-scrollbar-thumb:hover,
.user-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5CB860, #FF9800);
}
</style>

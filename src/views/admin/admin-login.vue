<template>
  <div class="admin-light-container">
    <!-- 1. 背景层：流动的极光 + 3D 网格 -->
    <div class="light-grid-bg"></div>
    <div class="glow-orb top-left"></div>
    <div class="glow-orb bottom-right"></div>

    <!-- 2. 主体卡片 -->
    <div class="admin-console-card">
      
      <!-- 左侧：品牌展示区 -->
      <div class="console-left">
        <div class="left-header">
          <span class="badge">ADMIN</span>
          <h2>后台管理系统</h2>
          <p>System Management Portal</p>
        </div>
        
        <!-- 数据光环动画 -->
        <div class="data-core-illustration">
          <svg viewBox="0 0 240 240" width="100%" height="100%">
            <circle cx="120" cy="120" r="90" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2" stroke-dasharray="8 6">
              <animateTransform attributeName="transform" type="rotate" from="0 120 120" to="360 120 120" dur="20s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="120" r="70" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="40 10 10 10">
              <animateTransform attributeName="transform" type="rotate" from="360 120 120" to="0 120 120" dur="12s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="120" r="22" fill="#ffffff" />
          </svg>
        </div>
      </div>

      <!-- 右侧：表单区 -->
      <div class="console-right">
        <div class="right-header">
          <img :src="logoImage" alt="logo" class="logo-img">
          <h3 class="admin-title">管理员登录</h3>
        </div>

        <div class="admin-form">
          <div class="light-input-group">
            <UserOutlined class="input-icon" />
            <input placeholder="请输入管理员账号" v-model="data.loginForm.username" type="text" class="admin-input" @keyup.enter="handleSubmit" />
          </div>
          
          <div class="light-input-group">
            <LockOutlined class="input-icon" />
            <input placeholder="请输入管理员密码" v-model="data.loginForm.password" type="password" class="admin-input" @keyup.enter="handleSubmit" />
          </div>

          <button class="admin-btn" @click="handleSubmit" :disabled="loginBtn">
            {{ loginBtn ? '登录中...' : '登 录' }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="admin-footer">System Admin Portal v2.0 © 2024-2025</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '/@/store';
import logoImage from '/@/assets/images/logo.png';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from "ant-design-vue";

const router = useRouter();
const userStore = useUserStore();
const loginBtn = ref<boolean>(false)
const data = reactive({
  loginForm: { username: '', password: '' }
})

const handleSubmit = () => {
  if (!data.loginForm.username || !data.loginForm.password) {
    message.warn('账号和密码不能为空');
    return;
  }
  handleLogin();
}

const handleLogin = () => {
  loginBtn.value = true
  userStore.adminLogin(data.loginForm).then(res => {
    loginBtn.value = false
    if (res.code === 200) { router.push({ path: '/admin' }); message.success('登录成功'); }
    else { message.error(res.msg || '登录失败'); }
  }).catch(err => {
    loginBtn.value = false
    message.error(err.msg || '登录失败');
  })
}
</script>

<style scoped lang="less">
@primary-green: #61C17B;

.admin-light-container {
  width: 100vw; height: 100vh;
  // 极光渐变背景
  background: radial-gradient(circle at 10% 20%, rgba(200, 230, 201, 0.4) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(150, 220, 160, 0.3) 0%, transparent 40%), #F4F8F6;
  position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;
}

// 动态背景装饰
.glow-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: breathe 12s infinite alternate; }
.top-left { width: 500px; height: 500px; background: rgba(97, 193, 123, 0.15); top: -100px; left: -100px; }
.bottom-right { width: 600px; height: 600px; background: rgba(66, 185, 131, 0.1); bottom: -150px; right: -100px; }
@keyframes breathe { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.2); opacity: 0.8; } }

.light-grid-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: linear-gradient(rgba(97,193,123,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(97,193,123,0.08) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at center, black 50%, transparent 90%);
}

.admin-console-card {
  position: relative; z-index: 10; display: flex; width: 860px; height: 480px; background: #fff;
  border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.06); overflow: hidden;
}

.console-left {
  flex: 1.1; background: linear-gradient(145deg, #61C17B 0%, #4FB068 100%);
  padding: 40px; color: #fff;
}
.badge { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 4px; font-size: 12px; margin-bottom: 16px; }
.console-left h2 { color: #fff; font-size: 28px; margin-bottom: 8px; }

.console-right { flex: 1; padding: 50px 44px; display: flex; flex-direction: column; justify-content: center; }
.logo-img { width: 44px; height: 44px; margin-bottom: 16px; }
.admin-title { font-size: 22px; margin-bottom: 40px; }

.light-input-group {
  display: flex; align-items: center; padding: 12px 16px; background: #F8F9FA;
  border: 1px solid #E4E7ED; border-radius: 8px; margin-bottom: 20px;
}
.light-input-group:focus-within { border-color: @primary-green; box-shadow: 0 0 0 3px rgba(97,193,123,0.1); }
.input-icon { margin-right: 12px; color: #909399; }
.admin-input { flex: 1; border: none; background: transparent; outline: none; }

.admin-btn {
  width: 100%; height: 48px; background: @primary-green; border: none; border-radius: 8px;
  color: #fff; font-size: 16px; cursor: pointer; transition: 0.3s;
}
.admin-btn:hover { background: lighten(@primary-green, 5%); }

.admin-footer { position: absolute; bottom: 24px; color: #A3ABB6; font-size: 12px; }
</style>
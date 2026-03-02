<template>
  <div class="container page-surface">
    <div class="login-page pc-style">
      <div class="logo-section">
        <img :src="logoImage" alt="logo" class="logo-icon">
        <h2 class="page-title">管理员登录</h2>
      </div>
      <div class="mail-login" type="login">
        <div class="common-input">
          <UserOutlined class="left-icon" />
          <div class="input-view">
            <input placeholder="请输入登录账号" v-model="data.loginForm.username" type="text" class="input" @keyup.enter="handleSubmit" />
          </div>
        </div>
        <div class="common-input">
          <LockOutlined class="left-icon" />
          <div class="input-view">
            <input placeholder="请输入登录密码" v-model="data.loginForm.password" type="password" class="input" @keyup.enter="handleSubmit" />
          </div>
        </div>
        <div class="next-btn-view">
          <button class="next-btn btn-active" @click="handleSubmit" :disabled="loginBtn">
            {{ loginBtn ? '登录中...' : '登录' }}
          </button>
        </div>
      </div>
      <div class="decoration-image">
        <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 清洁用品装饰图 -->
          <ellipse cx="100" cy="110" rx="80" ry="8" fill="#E0F2F1" opacity="0.5"/>
          <!-- 喷雾瓶 -->
          <rect x="50" y="50" width="30" height="50" rx="5" fill="#4DB6AC"/>
          <rect x="62" y="40" width="6" height="15" fill="#26A69A"/>
          <path d="M 62 40 Q 68 35 74 40" stroke="#26A69A" stroke-width="2" fill="none"/>
          <!-- 海绵 -->
          <rect x="100" y="70" width="40" height="25" rx="8" fill="#80CBC4"/>
          <circle cx="110" cy="80" r="3" fill="#4DB6AC" opacity="0.5"/>
          <circle cx="125" cy="85" r="3" fill="#4DB6AC" opacity="0.5"/>
          <!-- 泡泡 -->
          <circle cx="140" cy="50" r="8" fill="#B2DFDB" opacity="0.6"/>
          <circle cx="155" cy="45" r="6" fill="#B2DFDB" opacity="0.5"/>
          <circle cx="148" cy="38" r="5" fill="#B2DFDB" opacity="0.4"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from '/@/store';
import logoImage from '/@/assets/images/logo.png';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const userStore = useUserStore();

import {message} from "ant-design-vue";

const myform = ref()

const loginBtn = ref<Boolean>(false)
const checked = ref<Boolean>(false)
const data = reactive({
  loginForm: {
    username: '',
    password: ''
  },
  rules: {
    username: [
      {required: true, message: '请输入用户名', trigger: 'blur'}
    ],
    password: [
      {required: true, message: '请输入密码', trigger: 'blur'}
    ]
  }
})

const handleSubmit = () => {
  console.log('点击登录按钮', data.loginForm)
  if (!data.loginForm.username || !data.loginForm.password) {
    message.warn('账号和密码不能为空')
    return
  }
  handleLogin()
}

const handleLogin = () => {
  console.log('开始登录', data.loginForm)
  loginBtn.value = true
  userStore.adminLogin({
    username: data.loginForm.username,
    password: data.loginForm.password
  }).then(res=>{
    console.log('登录成功', res)
    loginBtn.value = false
    if (res.code === 200) {
      loginSuccess()
    } else {
      message.error(res.msg || '登录失败')
    }
  }).catch(err=> {
    console.error('登录失败', err)
    loginBtn.value = false
    // 处理不同类型的错误
    if (err.response) {
      // 服务器返回了错误状态码
      const errorMsg = err.response.data?.msg || err.response.data?.message || '登录失败'
      message.error(errorMsg)
    } else if (err.msg) {
      message.error(err.msg)
    } else if (err.message) {
      message.error(err.message)
    } else {
      message.error('登录失败，请检查账号密码')
    }
  })
}

const loginSuccess = () => {
  router.push({ path: '/admin' })
  message.success('登录成功')
}


</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF9E6 0%, #E8F5E9 30%, #FFF3E0 60%, #E0F2F1 100%);
  position: relative;
  overflow: hidden;
}

.container::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.15) 0%, transparent 70%);
  top: -150px;
  left: -100px;
  animation: float1 10s ease-in-out infinite;
}

.container::after {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(129, 199, 132, 0.12) 0%, transparent 70%);
  bottom: -200px;
  right: -150px;
  animation: float2 12s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 60px) scale(1.1); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, -40px) scale(1.15); }
}

.login-page {
  width: 460px;
  padding: 52px 44px 44px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 32px;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.12), 
              0 0 120px rgba(255, 193, 7, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  backdrop-filter: blur(24px);
  animation: slideIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.92) rotateX(10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0);
  }
}

.logo-section {
  text-align: center;
  margin-bottom: 36px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  display: block;
  margin: 0 auto 16px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(102, 187, 106, 0.35);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.page-title {
  font-size: 30px;
  font-weight: 700;
  background: linear-gradient(135deg, #2E7D32 0%, #FFA726 50%, #66BB6A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: 1.5px;
  font-family: @font-family-display;
}

.mail-login {
  margin: 0;
}

.common-input {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #FFFEF7 100%);
  border: 2px solid #FFF3E0;
  border-radius: 20px;
  margin-bottom: 18px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.common-input::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.1), transparent);
  transition: left 0.6s ease;
}

.common-input:hover::before {
  left: 100%;
}

.common-input:hover {
  border-color: #FFE082;
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.15);
  transform: translateY(-2px);
}

.common-input:focus-within {
  border-color: #FFA726;
  box-shadow: 0 0 0 4px rgba(255, 167, 38, 0.12);
  transform: translateY(-3px) scale(1.01);
}

.common-input .left-icon {
  font-size: 22px;
  opacity: 0.6;
  transition: all 0.3s ease;
  color: #FFA726;
}

.common-input:focus-within .left-icon {
  opacity: 1;
  transform: scale(1.1) rotate(5deg);
}

.common-input .input-view {
  flex: 1;
}

.common-input .input {
  width: 100%;
  background: transparent;
  color: #2E7D32;
  font-size: 15px;
  border: none;
  outline: none;
}

.common-input .input::placeholder {
  color: #BCAAA4;
}

.next-btn-view {
  margin-top: 28px;
}

.next-btn {
  width: 100%;
  height: 54px;
  border-radius: 20px;
  background: linear-gradient(135deg, #66BB6A 0%, #FFA726 50%, #4DB6AC 100%);
  background-size: 200% 100%;
  color: #ffffff;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 1.5px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(255, 167, 38, 0.35);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.next-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.next-btn:hover::before {
  width: 300px;
  height: 300px;
}

.next-btn:hover {
  background-position: 100% 0;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 16px 36px rgba(255, 167, 38, 0.45);
}

.next-btn:active {
  transform: translateY(-2px) scale(0.98);
}

.next-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.next-btn:disabled:hover {
  transform: none !important;
  box-shadow: 0 10px 28px rgba(255, 167, 38, 0.35);
}

.decoration-image {
  margin-top: 32px;
  text-align: center;
  opacity: 0.8;
  animation: fadeIn 1s ease-out 0.3s backwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 0.8; }
}
</style>

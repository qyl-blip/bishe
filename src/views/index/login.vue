<template>
  <div class="dynamic-tech-container">
    
    <!-- 1. 动态底色层：流动的极光光斑 -->
    <div class="aurora-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- 2. 3D 透视科技地板（带来极致的纵深层次感） -->
    <div class="perspective-floor"></div>

    <!-- 3. 动态上升的粒子效果 -->
    <div class="particles-container">
      <span class="particle p1"></span>
      <span class="particle p2"></span>
      <span class="particle p3"></span>
      <span class="particle p4"></span>
      <span class="particle p5"></span>
    </div>

    <div class="main-content">
      <!-- 左侧：3D立体展示区 -->
      <div class="hero-section">
        <h1 class="hero-title">
          <span class="text-sweep">智能</span>家政入口
        </h1>
        <h2 class="hero-subtitle">企业级数字化管理服务</h2>
        <h3 class="hero-desc">高效连接 · 全局协同 · 智慧护航</h3>
        
        <div class="hero-tag">
          <span class="pulse-dot"></span> 为业务运转提速
        </div>
        
        <!-- 核心动态图：纯手工绘制的 3D 立体悬浮底座（带呼吸和上下浮动动画） -->
        <div class="tech-3d-illustration">
          <svg width="340" height="260" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 底层光晕 -->
            <ellipse cx="200" cy="240" rx="120" ry="30" fill="#42b983" opacity="0.2" filter="url(#glow)"/>
            
            <!-- 3D底座 第一层 -->
            <g class="float-base">
              <path d="M200 170 L320 230 L200 290 L80 230 Z" fill="#E8F5E9" stroke="#42b983" stroke-width="2"/>
              <path d="M80 230 L200 290 L200 270 L80 210 Z" fill="#C8E6C9"/>
              <path d="M320 230 L200 290 L200 270 L320 210 Z" fill="#A5D6A7"/>
            </g>
            
            <!-- 3D底座 第二层 -->
            <g class="float-mid">
              <path d="M200 140 L280 180 L200 220 L120 180 Z" fill="#ffffff" stroke="#42b983" stroke-width="2"/>
              <path d="M120 180 L200 220 L200 200 L120 160 Z" fill="#C8E6C9"/>
              <path d="M280 180 L200 220 L200 200 L280 160 Z" fill="#81C784"/>
              <!-- 底座上的发光线条 -->
              <path d="M140 185 L180 205" stroke="#42b983" stroke-width="3" stroke-linecap="round"/>
              <path d="M150 175 L190 195" stroke="#42b983" stroke-width="3" stroke-linecap="round"/>
            </g>

            <!-- 悬浮的核心魔方 -->
            <g class="float-cube">
              <!-- 魔方顶面 -->
              <path d="M200 60 L240 80 L200 100 L160 80 Z" fill="#E8F5E9" stroke="#42b983" stroke-width="2"/>
              <!-- 魔方左侧 -->
              <path d="M160 80 L200 100 L200 140 L160 120 Z" fill="#42b983"/>
              <!-- 魔方右侧 -->
              <path d="M240 80 L200 100 L200 140 L240 120 Z" fill="#2E8B57"/>
              <!-- 魔方上的发光符号 -->
              <path d="M175 105 L185 115 L185 125" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none"/>
              <circle cx="200" cy="80" r="4" fill="#ffffff">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
              </circle>
            </g>

            <!-- SVG滤镜定义 -->
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="15" result="blur" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      <!-- 右侧：带有极光玻璃质感的登录卡片 -->
      <div class="form-section">
        <div class="login-card glass-card">
          <div class="card-header">
            <div class="logo-box">
              <img :src="LogoIcon" alt="logo" class="logo-icon">
              <span class="logo-text">家政服务平台</span>
            </div>
            <p class="login-tab">密码登录</p>
          </div>

          <div class="mail-login" type="login">
            <div class="common-input">
              <img :src="MailIcon" class="left-icon">
              <div class="input-view">
                <input placeholder="请输入注册账号/邮箱" v-model="pageData.loginForm.username" type="text" class="input" />
              </div>
            </div>
            
            <div class="common-input">
              <img :src="PwdIcon" class="left-icon">
              <div class="input-view">
                <input placeholder="请输入密码" v-model="pageData.loginForm.password" type="password" class="input" />
              </div>
            </div>
            
            <div class="agreement-text">
              <input type="checkbox" checked class="checkbox">
              阅读并接受 <a href="#">《服务协议》</a> 和 <a href="#">《隐私政策》</a>
            </div>

            <div class="next-btn-view">
              <button class="next-btn" @click="handleLogin">
                <span class="btn-text">登 录</span>
                <div class="btn-light-sweep"></div>
              </button>
            </div>
          </div>
          
          <div class="operation">
            <a @click="handleCreateUser" class="forget-pwd">注册新账号</a>
            <span class="divider">|</span>
            <a href="#" class="forget-pwd">忘记密码</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-copyright">
      2024-2025 (c) 家政服务平台 All Rights Reserved
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '/@/store';
import { message } from "ant-design-vue";
import LogoIcon from '/@/assets/images/logo.png';
import MailIcon from '/@/assets/images/mail-icon.svg';
import PwdIcon from '/@/assets/images/pwd-icon.svg';

const router = useRouter();
const userStore = useUserStore();

const pageData = reactive({
  loginForm: {
    username: '',
    password: ''
  }
});

const handleLogin = () => {
  if (!pageData.loginForm.username || !pageData.loginForm.password) {
    message.warning('请输入账号和密码');
    return;
  }
  userStore.login({
    username: pageData.loginForm.username,
    password: pageData.loginForm.password
  }).then(res => {
    loginSuccess()
  }).catch(err => {
    message.warn(err.msg || '登录失败')
  })
};

const handleCreateUser = () => {
  router.push({name:'register'})
};

const loginSuccess = () => {
  router.push({ name: 'portal' })
  message.success('登录成功')
};
</script>

<style scoped lang="less">
/* === 核心变量定义 === */
@primary-green: #42b983;      
@primary-light: #6ad0a1;
@primary-dark: #2c8c60;
@text-dark: #1A3326;          

/* =========================================
   1. 动态底色层 (解决“没有底色”的问题)
========================================= */
.dynamic-tech-container {
  width: 100vw;
  height: 100vh;
  background-color: #f0fdf4; /* 极浅的基础绿白底色 */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 流动极光背景：用巨大的模糊圆球交替移动，形成色彩层次 */
.aurora-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow: hidden;
  z-index: 0;
  opacity: 0.6;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px); /* 极致模糊产生光晕感 */
  animation: floatOrb 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}

/* 左上角巨大薄荷绿光斑 */
.orb-1 {
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(66, 185, 131, 0.3) 0%, transparent 70%);
  top: -200px; left: -200px;
  animation-delay: -5s;
}
/* 右下角偏蓝绿的光斑，增加色彩厚度 */
.orb-2 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
  bottom: -100px; right: -100px;
  animation-duration: 25s;
}
/* 中间游走的亮色光斑 */
.orb-3 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(167, 243, 208, 0.4) 0%, transparent 60%);
  top: 20%; left: 40%;
  animation-duration: 18s;
  animation-direction: alternate-reverse;
}

@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 100px) scale(1.1); }
  100% { transform: translate(-50px, -50px) scale(0.9); }
}

/* =========================================
   2. 3D透视网格地板 (解决“没有层次感”的问题)
========================================= */
.perspective-floor {
  position: absolute;
  bottom: 0;
  left: -50%;
  width: 200%;
  height: 60%;
  /* 绘制网格线 */
  background-image: 
    linear-gradient(to right, rgba(66, 185, 131, 0.2) 1px, transparent 1px),
    linear-gradient(to top, rgba(66, 185, 131, 0.2) 1px, transparent 1px);
  background-size: 60px 60px;
  /* 开启 3D 旋转，让平面的网格变成“延伸到远方的地板” */
  transform: perspective(600px) rotateX(70deg);
  transform-origin: bottom center;
  z-index: 1;
  /* 顶部使用渐变遮罩，让网格在远处消失，融入背景 */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 80%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 80%);
}

/* =========================================
   3. 动态光粒子 (增加科技微动效)
========================================= */
.particles-container {
  position: absolute;
  width: 100%; height: 100%;
  z-index: 2;
  pointer-events: none;
}
.particle {
  position: absolute;
  bottom: -20px;
  width: 4px; height: 4px;
  background: @primary-green;
  border-radius: 50%;
  box-shadow: 0 0 10px @primary-light;
  animation: floatUp 8s infinite linear;
  opacity: 0;
}
.p1 { left: 10%; animation-duration: 7s; animation-delay: 1s; }
.p2 { left: 30%; animation-duration: 9s; animation-delay: 3s; width: 6px; height: 6px; }
.p3 { left: 60%; animation-duration: 6s; animation-delay: 0s; }
.p4 { left: 80%; animation-duration: 10s; animation-delay: 2s; width: 3px; height: 3px; }
.p5 { left: 90%; animation-duration: 8s; animation-delay: 4s; }

@keyframes floatUp {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 0.6; }
  80% { opacity: 0.6; }
  100% { transform: translateY(-800px); opacity: 0; }
}

/* =========================================
   4. 页面主体内容布局
========================================= */
.main-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 左侧文案与 3D 图形 */
.hero-section {
  flex: 1;
  padding-right: 80px;
  position: relative;
}

/* 标题扫光特效 (动态感) */
.hero-title {
  font-size: 52px;
  font-weight: 800;
  color: @text-dark;
  margin: 0 0 16px 0;
  letter-spacing: 2px;
}
.text-sweep {
  background: linear-gradient(90deg, @text-dark 0%, @primary-green 50%, @text-dark 100%);
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 3s linear infinite;
}
@keyframes shine {
  to { background-position: 200% center; }
}

.hero-subtitle {
  font-size: 34px;
  font-weight: 600;
  color: #2c503e;
  margin: 0 0 16px 0;
}

.hero-desc {
  font-size: 20px;
  font-weight: 400;
  color: #5b8770;
  margin: 0 0 40px 0;
  letter-spacing: 2px;
}

/* 标签动画 */
.hero-tag {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(66, 185, 131, 0.2);
  border-radius: 24px;
  color: @primary-dark;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 8px 24px rgba(66, 185, 131, 0.1);
}
.pulse-dot {
  width: 8px; height: 8px;
  background-color: @primary-green;
  border-radius: 50%;
  margin-right: 12px;
  box-shadow: 0 0 0 0 rgba(66, 185, 131, 0.7);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  to { box-shadow: 0 0 0 10px rgba(66, 185, 131, 0); }
}

/* 核心3D悬浮底座动画 */
.tech-3d-illustration {
  margin-top: 50px;
  /* 整体容器缓慢呼吸放大缩小 */
  animation: scaleBreath 6s ease-in-out infinite alternate;
}
@keyframes scaleBreath {
  0% { transform: scale(1); }
  100% { transform: scale(1.03); }
}
/* 第一层底座上下浮动 */
.float-base { animation: floatBox 5s ease-in-out infinite alternate; }
/* 第二层底座错开时间浮动 */
.float-mid { animation: floatBox 5s ease-in-out infinite alternate-reverse; }
/* 核心魔方快速浮动 */
.float-cube { animation: floatCore 3s ease-in-out infinite alternate; }

@keyframes floatBox {
  0% { transform: translateY(0); }
  100% { transform: translateY(-8px); }
}
@keyframes floatCore {
  0% { transform: translateY(0); }
  100% { transform: translateY(-15px); }
}

/* =========================================
   5. 右侧登录表单 (毛玻璃高级悬浮卡片)
========================================= */
.form-section {
  flex-shrink: 0;
  width: 430px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85); /* 半透明背景 */
  backdrop-filter: blur(20px); /* 毛玻璃特效，透出背后的极光 */
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 16px;
  padding: 44px 40px;
  /* 极具深度的双层弥散阴影，彻底拉开Z轴层次 */
  box-shadow: 0 30px 60px rgba(16, 185, 129, 0.12),
              0 4px 16px rgba(0, 0, 0, 0.04);
}

.card-header { margin-bottom: 30px; text-align: center; }
.logo-box { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; }
.logo-icon { width: 44px; height: 44px; border-radius: 10px; box-shadow: 0 4px 12px rgba(66,185,131,0.2); }
.logo-text { font-size: 24px; font-weight: 700; color: @text-dark; }
.login-tab { font-size: 17px; color: @text-dark; font-weight: 600; margin: 0; text-align: left; }

.common-input {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  background: #ffffff; border: 1px solid #E4E7ED; border-radius: 8px; margin-bottom: 20px;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.common-input:focus-within {
  border-color: @primary-green;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
  transform: translateY(-2px);
}
.common-input .left-icon { width: 20px; height: 20px; opacity: 0.4; filter: grayscale(100%); transition: all 0.3s; }
.common-input:focus-within .left-icon { opacity: 1; filter: sepia(100%) hue-rotate(90deg) saturate(300%) brightness(90%); }
.common-input .input-view { flex: 1; }
.common-input .input { width: 100%; background: transparent; color: #333; font-size: 15px; border: none; outline: none; }
.common-input .input::placeholder { color: #C0C4CC; }

.agreement-text { font-size: 13px; color: #8C939D; display: flex; align-items: center; margin-bottom: 24px; }
.checkbox { margin-right: 8px; accent-color: @primary-green; }
.agreement-text a { color: @primary-green; text-decoration: none; }

/* 按钮内发光与扫光动效 */
.next-btn-view { margin-bottom: 24px; }
.next-btn {
  width: 100%; height: 48px; border-radius: 8px;
  background: linear-gradient(90deg, @primary-green 0%, @primary-light 100%);
  color: #ffffff; font-weight: 600; font-size: 16px; letter-spacing: 8px; text-indent: 8px;
  border: none; cursor: pointer; position: relative; overflow: hidden;
  box-shadow: 0 8px 20px rgba(66, 185, 131, 0.3); transition: all 0.3s;
}
.next-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(66, 185, 131, 0.4); }
.next-btn:active { transform: translateY(1px); }

/* 按钮的扫光亮条动画 */
.btn-light-sweep {
  position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transform: skewX(-20deg);
  animation: sweepLight 3s infinite;
}
@keyframes sweepLight {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}

.operation { display: flex; justify-content: center; align-items: center; font-size: 14px; }
.forget-pwd { color: #8C939D; cursor: pointer; text-decoration: none; transition: color 0.3s; }
.forget-pwd:hover { color: @primary-green; }
.divider { margin: 0 16px; color: #E4E7ED; }

.footer-copyright { position: absolute; bottom: 30px; width: 100%; text-align: center; color: #9CA3AF; font-size: 13px; letter-spacing: 1px; }
</style>
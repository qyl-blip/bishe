<template>
  <div class="container page-surface">
    <div class="regist-card">
      <div class="regist-title">
        <span>注册新账号</span>
        <span @click="router.push({ name: 'login' })" class="to-login">我要登录</span>
      </div>

      <div class="regist-padding">
        <div class="common-input">
          <img :src="MailIcon" class="left-icon" />
          <div class="input-view">
            <input placeholder="请输入邮箱" v-model="tData.loginForm.username" type="text" class="input" />
            <p class="err-view"></p>
          </div>
        </div>
      </div>
      <div class="regist-padding">
        <div class="common-input">
          <img :src="PwdIcon" class="left-icon" />
          <div class="input-view">
            <input placeholder="请输入密码" v-model="tData.loginForm.password" type="password" class="input" />
            <p class="err-view"></p>
          </div>
        </div>
      </div>
      <div class="regist-padding">
        <div class="common-input">
          <img :src="PwdIcon" class="left-icon" />
          <div class="input-view">
            <input
              placeholder="请再次输入密码"
              v-model="tData.loginForm.repassword"
              type="password"
              class="input"
            />
            <p class="err-view"></p>
          </div>
        </div>
      </div>
      <div class="tel-login">
        <div class="next-btn-view">
          <button class="next-btn" @click="handleRegister">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userRegisterApi } from '/@/api/user';
import { message } from 'ant-design-vue';
import MailIcon from '/@/assets/images/mail-icon.svg';
import PwdIcon from '/@/assets/images/pwd-icon.svg';

const router = useRouter();

const tData = reactive({
  loginForm: {
    username: '',
    password: '',
    repassword: '',
  },
});

const handleRegister = () => {
  if (tData.loginForm.username === '' || tData.loginForm.password === '' || tData.loginForm.repassword === '') {
    message.warn('请填写完整信息');
    return;
  }

  if (tData.loginForm.password !== tData.loginForm.repassword) {
    message.warn('两次密码输入不一致');
    return;
  }

  if (tData.loginForm.password.length < 6) {
    message.warn('密码长度至少6位');
    return;
  }

  console.log('注册数据:', {
    username: tData.loginForm.username,
    password: tData.loginForm.password,
    rePassword: tData.loginForm.repassword,
  });

  userRegisterApi({
    username: tData.loginForm.username,
    password: tData.loginForm.password,
    rePassword: tData.loginForm.repassword,
  })
    .then((res) => {
      console.log('注册成功响应:', res);
      message.success('注册成功');
      router.push({ name: 'login' });
    })
    .catch((err) => {
      console.error('注册失败:', err);
      message.error(err.msg || err.message || '注册失败');
    });
};
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';
.container {
  max-width: 100%;
  background: linear-gradient(135deg, #FFF9E6 0%, #E8F5E9 30%, #FFF3E0 60%, #E0F2F1 100%);
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.container::before {
  content: '';
  position: absolute;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  top: -120px;
  left: -120px;
  animation: float 10s ease-in-out infinite;
}

.container::after {
  content: '';
  position: absolute;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(129, 199, 132, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -100px;
  right: -100px;
  animation: float 12s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(40px, 40px) scale(1.1);
  }
}

.regist-card {
  width: 460px;
  padding: 52px 44px 44px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.12), 
              0 0 120px rgba(255, 193, 7, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  position: relative;
  z-index: 1;
  animation: slideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.regist-title {
  font-size: 28px;
  background: linear-gradient(135deg, #2E7D32 0%, #FFA726 50%, #66BB6A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  height: auto;
  line-height: 1.3;
  margin-bottom: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: @font-family-display;
  letter-spacing: 2px;
  position: relative;
  padding-bottom: 16px;
}

.regist-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #FFA726, #66BB6A);
  border-radius: 2px;
}

.to-login {
  color: #FFA726;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 6px 12px;
  border-radius: 12px;
  position: relative;
}

.to-login::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFA726, #66BB6A);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.to-login:hover {
  color: #FF9800;
  background: rgba(255, 167, 38, 0.08);
  transform: translateY(-2px);
}

.to-login:hover::after {
  width: 80%;
}

.regist-padding {
  margin-bottom: 20px;
}

.common-input {
  display: flex;
  align-items: flex-start;

  .left-icon {
    margin-right: 12px;
    width: 24px;
    margin-top: 12px;
    opacity: 0.6;
    filter: hue-rotate(90deg) saturate(1.5);
  }

  .input-view {
    flex: 1;

    .input {
      font-weight: 500;
      font-size: 14px;
      color: #1f2937;
      height: 44px;
      line-height: 44px;
      padding: 12px 16px;
      display: block;
      width: 100%;
      letter-spacing: 0.5px;
      outline: none;
      background: linear-gradient(135deg, #ffffff 0%, #FFFEF7 100%);
      border: 2px solid #FFF3E0;
      border-radius: 20px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .input::placeholder {
      color: #BCAAA4;
    }

    .input:hover {
      border-color: #FFE082;
      transform: translateY(-1px);
    }

    .input:focus {
      border-color: #FFA726;
      box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.12);
      background: #FFFEF7;
      transform: translateY(-2px);
    }

    .err-view {
      margin-top: 4px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      color: @error-color;
    }
  }
}

.tel-login {
  margin-top: 24px;
}

.next-btn {
  background: linear-gradient(135deg, #66BB6A 0%, #FFA726 50%, #4DB6AC 100%);
  background-size: 200% 100%;
  border-radius: 20px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  height: 54px;
  line-height: 54px;
  text-align: center;
  width: 100%;
  outline: none;
  cursor: pointer;
  border: none;
  box-shadow: 0 10px 28px rgba(255, 167, 38, 0.35);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 1.5px;
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
  box-shadow: 0 16px 36px rgba(255, 167, 38, 0.45);
  transform: translateY(-4px) scale(1.02);
}

.next-btn:active {
  transform: translateY(-2px) scale(0.98);
}
</style>


<template>
  <div class="security-page">
    <div class="page-title">账号安全</div>
    <div class="safe-view">
      <div class="safe-info-box">
        <div class="item">
          <div class="label">账号安全等级</div>
          <div class="right-box">
            <div class="safe-text">低风险</div>
            <progress max="3" class="safe-line" value="2"></progress>
          </div>
        </div>
        <div class="item">
          <div class="label">绑定手机</div>
          <div class="right-box">
            <input class="input-dom" placeholder="请输入手机号">
            <a-button type="link" @click="handleBindMobile()">修改</a-button>
          </div>
        </div>
      </div>
      <div class="edit-pwd-box">
        <div class="pwd-edit">
          <div class="item">
            <div class="label">当前密码</div>
            <div class="right-box">
              <a-input-password placeholder="输入当前密码" v-model:value="password"/>
            </div>
          </div>
          <div class="item">
            <div class="label">新密码</div>
            <div class="right-box">
              <a-input-password placeholder="输入新密码" v-model:value="newPassword1"/>
            </div>
          </div>
          <div class="item">
            <div class="label">确认新密码</div>
            <div class="right-box">
              <a-input-password placeholder="重复输入密码" v-model:value="newPassword2"/>
            </div>
          </div>
          <div class="button-row">
            <button class="save-btn" @click="handleUpdatePwd()">修改密码</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {message} from "ant-design-vue";

import {updateUserPwdApi} from '/@/api/user'
import {useUserStore} from "/@/store";

const router = useRouter();
const userStore = useUserStore();

let password = ref('')
let newPassword1 = ref('')
let newPassword2 = ref('')

const handleBindMobile = () => {
  message.info('功能开发中')
}

const handleUpdatePwd = () => {
  if (!password.value || !newPassword1.value || !newPassword2.value) {
    message.warn('请填写完整信息')
    return
  }
  if (newPassword1.value !== newPassword2.value) {
    message.warn('两次密码不一致')
    return
  }

  let userId = userStore.user_id
  updateUserPwdApi({
    userId:  userId,
    password: password.value,
    newPassword: newPassword1.value,
  }).then(res => {
    message.success('修改成功')
    password.value = ''
    newPassword1.value = ''
    newPassword2.value = ''
  }).catch(err => {
    message.error(err.msg)
  })
}

</script>
<style scoped lang="less">
@import '/@/styles/theme.less';

.security-page {
  width: 100%;

  .page-title {
    color: #2E7D32;
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 3px solid transparent;
    background: linear-gradient(90deg, #66BB6A 0%, #FFA726 50%, transparent 100%) bottom / 100% 3px no-repeat;
  }
}

.safe-view {
  .safe-info-box {
    margin-bottom: 32px;
  }

  .edit-pwd-box {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba(129, 199, 132, 0.2);
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.08);
  }

  .item {
    display: flex;
    align-items: center;
    margin: 20px 0;
    padding: 20px 24px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(232, 245, 233, 0.3) 100%);
    border-radius: 16px;
    border: 1px solid rgba(129, 199, 132, 0.2);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
      border-color: rgba(102, 187, 106, 0.3);
      box-shadow: 0 4px 16px rgba(102, 187, 106, 0.08);
    }

    .label {
      width: 120px;
      color: #2E7D32;
      font-weight: 700;
      font-size: 15px;
      position: relative;
      padding-left: 12px;
      flex-shrink: 0;
    }
    
    .label::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 16px;
      background: linear-gradient(135deg, #66BB6A 0%, #FFA726 100%);
      border-radius: 2px;
    }

    .right-box {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .safe-text {
      color: #FFA726;
      font-weight: 700;
      font-size: 15px;
      padding: 4px 12px;
      background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%);
      border-radius: 8px;
      border: 1px solid rgba(255, 167, 38, 0.3);
    }

    .safe-line {
      background: #E0E0E0;
      border-radius: 8px;
      width: 280px;
      height: 8px;
      overflow: hidden;
      border: none;
    }
    
    .safe-line::-webkit-progress-bar {
      background: #E0E0E0;
      border-radius: 8px;
    }
    
    .safe-line::-webkit-progress-value {
      background: linear-gradient(90deg, #FFA726 0%, #FF9800 100%);
      border-radius: 8px;
    }

    .input-dom {
      background: linear-gradient(135deg, #ffffff 0%, #F1F8E9 100%);
      border: 2px solid rgba(129, 199, 132, 0.2);
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: #1c2233;
      padding: 0 16px;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 2px 8px rgba(102, 187, 106, 0.05);
    }
    
    .input-dom:hover {
      border-color: rgba(102, 187, 106, 0.4);
      box-shadow: 0 4px 12px rgba(102, 187, 106, 0.1);
    }
    
    .input-dom:focus {
      border-color: #66BB6A;
      box-shadow: 0 0 0 4px rgba(102, 187, 106, 0.15), 0 4px 16px rgba(102, 187, 106, 0.2);
      background: #ffffff;
      transform: translateY(-2px);
      outline: none;
    }
  }
}

:deep(.ant-input-password) {
  background: linear-gradient(135deg, #ffffff 0%, #F1F8E9 100%);
  border: 2px solid rgba(129, 199, 132, 0.2);
  border-radius: 12px;
  height: 44px;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(102, 187, 106, 0.05);
}

:deep(.ant-input-password:hover) {
  border-color: rgba(102, 187, 106, 0.4);
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.1);
}

:deep(.ant-input-password:focus),
:deep(.ant-input-password-focused) {
  border-color: #66BB6A !important;
  box-shadow: 0 0 0 4px rgba(102, 187, 106, 0.15), 0 4px 16px rgba(102, 187, 106, 0.2) !important;
  background: #ffffff;
}

:deep(.ant-input-password input) {
  background: transparent;
  height: 40px;
  line-height: 40px;
}

:deep(.ant-input-password .ant-input-suffix) {
  color: #66BB6A;
}

:deep(.ant-btn-link) {
  color: #66BB6A !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.ant-btn-link:hover) {
  color: #2E7D32 !important;
}

.save-btn {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 50%, #FFA726 100%);
  border-radius: 32px;
  width: 120px;
  height: 44px;
  line-height: 44px;
  font-size: 15px;
  color: #ffffff;
  border: none;
  outline: none;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 20px rgba(102, 187, 106, 0.4);
  position: relative;
  overflow: hidden;
}

.save-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.save-btn:hover::before {
  left: 100%;
}

.save-btn:hover {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 50%, #FF9800 100%);
  box-shadow: 0 8px 28px rgba(102, 187, 106, 0.5), 0 0 0 4px rgba(255, 167, 38, 0.2);
  transform: translateY(-3px) scale(1.02);
}

.save-btn:active {
  transform: translateY(-1px) scale(0.98);
}

.button-row {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 40px;
}
</style>

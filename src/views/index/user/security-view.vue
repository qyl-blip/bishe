<template>
  <div class="security-page">
    <div class="page-title">账号安全</div>
    
    <div class="safe-view">
      <!-- 账号安全等级卡片 -->
      <div class="item-card">
        <div class="label">账号安全等级</div>
        <div class="right-box">
          <div class="safe-text">低风险</div>
          <progress max="3" class="safe-line" value="2"></progress>
        </div>
      </div>

      <!-- 绑定手机卡片 (保持原样，不加修改按钮) -->
      <div class="item-card">
        <div class="label">绑定手机</div>
        <div class="right-box">
          <input class="input-dom readonly" placeholder="请输入手机号" v-model="tData.form.mobile" readonly>
        </div>
      </div>

      <!-- 当前密码卡片 -->
      <div class="item-card">
        <div class="label">当前密码</div>
        <div class="right-box">
          <a-input-password class="custom-pwd-input" placeholder="输入当前密码" v-model:value="password"/>
        </div>
      </div>

      <!-- 新密码卡片 -->
      <div class="item-card">
        <div class="label">新密码</div>
        <div class="right-box flex-col">
          <a-input-password class="custom-pwd-input" placeholder="输入新密码" v-model:value="newPassword1"/>
          <div class="tip-text">支持英文、数字，长度不少于 6 个字符</div>
        </div>
      </div>

      <!-- 确认新密码卡片 -->
      <div class="item-card">
        <div class="label">确认新密码</div>
        <div class="right-box">
          <a-input-password class="custom-pwd-input" placeholder="重复输入密码" v-model:value="newPassword2"/>
        </div>
      </div>

      <div class="button-row">
        <button class="save-btn" @click="handleUpdatePwd">修改密码</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from "ant-design-vue";
// 替换为你的真实路径
import { updateUserPwdApi, detailApi } from '/@/api/user'
import { useUserStore } from "/@/store";

const router = useRouter();
const userStore = useUserStore();

let password = ref('')
let newPassword1 = ref('')
let newPassword2 = ref('')
let tData = reactive({
  form: {
    mobile: ''
  }
})

onMounted(() => {
  getUserInfo()
})

const getUserInfo = () => {
  if (!userStore.user_id) return
  detailApi({ userId: userStore.user_id }).then(res => {
    if (res.data && res.data.mobile) {
      tData.form.mobile = res.data.mobile
    }
  }).catch(err => {
    console.log(err)
  })
}

const handleUpdatePwd = () => {
  if (!password.value || !newPassword1.value || !newPassword2.value) {
    message.warn('请填写完整的密码信息')
    return
  }
  if (newPassword1.value !== newPassword2.value) {
    message.warn('两次输入的新密码不一致')
    return
  }
  if (newPassword1.value.length < 6) {
    message.warn('新密码长度不能少于6位')
    return
  }

  let userId = userStore.user_id
  updateUserPwdApi({
    userId: userId,
    password: password.value,
    newPassword: newPassword1.value,
  }).then(res => {
    message.success('密码修改成功')
    password.value = ''
    newPassword1.value = ''
    newPassword2.value = ''
  }).catch(err => {
    message.error(err.msg || '修改失败，请重试')
  })
}
</script>

<style scoped lang="less">
.security-page {
  width: 100%;
  padding-bottom: 40px;

  /* 顶部标题栏 */
  .page-title {
    color: #2E7D32;
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #66BB6A; /* 纯净的绿色底线，去掉之前的花哨渐变 */
  }
}

.safe-view {
  max-width: 900px; /* 限制最大宽度，整体居中或靠左都可以 */

  /* 独立行卡片样式（完美复刻截图） */
  .item-card {
    background: #ffffff;
    border: 1px solid rgba(129, 199, 132, 0.3);
    border-radius: 12px;
    padding: 24px 32px;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start; /* 适应多行情况 */
    box-shadow: 0 2px 8px rgba(102, 187, 106, 0.02);
    transition: all 0.3s;

    &:hover {
      border-color: rgba(102, 187, 106, 0.5);
      box-shadow: 0 4px 12px rgba(102, 187, 106, 0.08);
    }
  }

  /* 左侧 Label */
  .label {
    width: 130px;
    color: #2E7D32;
    font-weight: 700;
    font-size: 15px;
    position: relative;
    padding-left: 14px;
    line-height: 44px; /* 和输入框高度对齐 */
    flex-shrink: 0;

    &::before {
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
  }

  /* 右侧内容区 */
  .right-box {
    flex: 1;
    display: flex;
    align-items: center;
    
    &.flex-col {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  /* 风险等级文字与进度条 */
  .safe-text {
    color: #FFA726;
    font-weight: 700;
    font-size: 14px;
    padding: 4px 12px;
    background: #FFF9E6;
    border-radius: 6px;
    border: 1px solid rgba(255, 167, 38, 0.3);
    margin-right: 16px;
  }

  .safe-line {
    background: #E0E0E0;
    border-radius: 8px;
    width: 240px;
    height: 8px;
    border: none;
    &::-webkit-progress-bar {
      background: #E0E0E0;
      border-radius: 8px;
    }
    &::-webkit-progress-value {
      background: linear-gradient(90deg, #FFA726 0%, #FF9800 100%);
      border-radius: 8px;
    }
  }

  /* 基础输入框 */
  .input-dom {
    background: #F1F8E9;
    border: 1px solid rgba(129, 199, 132, 0.2);
    border-radius: 8px;
    width: 460px; /* 适当加宽适配截图比例 */
    height: 44px;
    padding: 0 16px;
    font-size: 14px;
    color: #333;
    outline: none;
    transition: all 0.3s;

    &:focus {
      border-color: #66BB6A;
      background: #ffffff;
      box-shadow: 0 0 0 2px rgba(102, 187, 106, 0.1);
    }
    
    /* 只读状态 */
    &.readonly {
      background: #fafafa;
      color: #999;
      cursor: not-allowed;
      border-color: #eee;
      &:focus {
        box-shadow: none;
        border-color: #eee;
      }
    }
  }

  /* 提示文字 */
  .tip-text {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
    padding-left: 2px;
  }

  /* 底部保存按钮 */
  .button-row {
    margin-top: 32px;
    display: flex;
    justify-content: center;
  }

  .save-btn {
    background: #66BB6A;
    border-radius: 24px;
    width: 140px;
    height: 44px;
    color: #ffffff;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);

    &:hover {
      background: #5CB860;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 187, 106, 0.4);
    }
    &:active {
      transform: translateY(0);
    }
  }
}

/* Ant Design Password 输入框深度覆盖，完美适配浅绿色主题 */
:deep(.ant-input-affix-wrapper),
:deep(.ant-input-password) {
  width: 460px !important;
  height: 44px !important;
  background: #F1F8E9 !important;
  border: 1px solid rgba(129, 199, 132, 0.2) !important;
  border-radius: 8px !important;
  padding: 0 16px !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center !important;
  transition: all 0.3s;

  &.ant-input-affix-wrapper-focused,
  &:focus,
  &:hover {
    border-color: #66BB6A !important;
    background: #ffffff !important;
  }

  /* 核心修复：添加 flex: 1 让输入框撑满剩余空间，把小眼睛挤到最右侧 */
  input, .ant-input {
    flex: 1 !important;          /* <--- 这里是修复小眼睛居中的关键 */
    width: 100% !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    height: 100% !important;
    padding: 0 !important;
    color: #333 !important;
  }
  
  /* 确保后缀容器(小眼睛所在的容器)显示正常 */
  .ant-input-suffix {
    margin-left: 8px !important;
    display: flex !important;
    align-items: center !important;
  }

  /* 小眼睛图标的颜色 */
  .anticon {
    color: #66BB6A !important;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
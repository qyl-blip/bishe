<template>
  <div class="push-page">
    <div class="page-title">邮件推送设置</div>
    <div class="push-view">
        <div class="item flex-view">
          <div class="label">推送邮箱</div>
          <div class="right-box">
            <input type="text" class="input-dom" placeholder="请输入邮箱" v-model="pushEmail">
          </div>
        </div>
        <div class="item flex-view">
          <div class="label">接收邮件消息</div>
          <div class="right-box">
            <a-switch v-model:checked="pushSwitch"/>
          </div>
        </div>
        <div class="button-row">
          <button class="save" @click="handleSave()">保存</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import {message} from "ant-design-vue";
import {detailApi, updateUserInfoApi} from '/@/api/user'
import {useUserStore} from "/@/store";

const router = useRouter();
const userStore = useUserStore();

let pushEmail = ref('')
let pushSwitch = ref(false)

onMounted(()=>{
  getUserInfo()

})

const getUserInfo =()=> {
  let userId = userStore.user_id

  detailApi({userId: userId}).then(res => {
    if (res.data) {
      pushEmail.value = res.data.pushEmail
      if(res.data.pushSwitch === '1'){
        pushSwitch.value = true
      }
    }
  }).catch(err => {
    console.log(err)
  })
}

const handleSave =()=> {
  const reg = /^[a-zA-Z0-9][a-zA-Z0-9_]+\\@[a-zA-Z0-9]+\\.[a-zA-Z]{2,5}(\\.[a-zA-Z]{2,5})*$/i

  if (!pushEmail.value.match(reg)) {
    message.warn('请输入正确的邮箱格式')
    return
  }

  let userId = userStore.user_id
  const formData = new FormData()
  formData.append("id", userId)
  if (pushEmail.value) {
    formData.append('pushEmail', pushEmail.value)
  }
  formData.append('pushSwitch', pushSwitch.value? '1':'0')
  updateUserInfoApi(formData).then(res => {
    getUserInfo()
    message.success('保存成功')
  }).catch(err => {
    console.log(err)
  })
}

</script>
<style scoped lang="less">
@import '/@/styles/theme.less';
progress {
  vertical-align: baseline;
}

.flex-view {
  display: flex;
}

input, textarea {
  outline: none;
  border-style: none;
}

button {
  padding: 0;
}

.push-page {
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

.push-view {
  .item {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 24px 0;
    padding: 20px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(232, 245, 233, 0.3) 100%);
    border-radius: 16px;
    border: 1px solid rgba(129, 199, 132, 0.2);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    .label {
      width: 120px;
      color: #2E7D32;
      font-weight: 700;
      font-size: 15px;
      position: relative;
      padding-left: 12px;
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

    .input-dom {
      background: linear-gradient(135deg, #ffffff 0%, #F1F8E9 100%);
      border: 2px solid rgba(129, 199, 132, 0.2);
      border-radius: 12px;
      width: 400px;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: @text-primary;
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
    }
  }

  .button-row {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    margin-bottom: 40px;
  }

  .save {
    cursor: pointer;
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 50%, #FFA726 100%);
    border-radius: 32px;
    width: 96px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #fff;
    border: none;
    outline: none;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
  }
  
  .save:hover {
    background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
    box-shadow: 0 6px 20px rgba(102, 187, 106, 0.4);
    transform: translateY(-2px);
  }
  
  .save:active {
    transform: translateY(0) scale(0.98);
  }
}

.switch-view {
  position: relative;
  background: #a1adc5;
  border-radius: 32px;
  width: 48px;
  height: 28px;
  cursor: pointer;

  .circle {
    position: absolute;
    margin-left: 4px;
    top: 4px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
  }

  .selected {
    right: 4px;
  }
}

.selected {
  background: #58b251;
}
</style>

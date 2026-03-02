<template>
  <div class="user-info-page">
    <div class="page-title">设置</div>
    <a-spin :spinning="loading" style="min-height: 200px;">
      <div class="edit-view">
        <div class="item flex-view">
          <div class="label">头像</div>
          <div class="right-box avatar-box flex-view">
            <img v-if="tData.form && tData.form.avatar" :src="tData.form.avatar" class="avatar">
            <img v-else :src="AvatarIcon" class="avatar">
            <div class="change-tips flex-view">
                <a-upload
                  name="file"
                  accept="image/*"
                  :multiple="false"
                  :before-upload="beforeUpload"
                >
                  <label>点击更换头像</label>
                </a-upload>
              <p class="tip">图片格式支持 GIF、PNG、JPEG，尺寸不小于 200px，大小不超过 4MB</p>
            </div>
          </div>
        </div>
        <div class="item flex-view">
          <div class="label">昵称</div>
          <div class="right-box">
            <input type="text" v-model="tData.form.nickname" placeholder="请输入昵称" maxlength="20" class="input-dom">
            <p class="tip">支持中英文，长度不超过 20 个字符</p>
          </div>
        </div>
        <div class="item flex-view">
          <div class="label">手机号</div>
          <div class="right-box">
            <input type="text" v-model="tData.form.mobile" placeholder="请输入手机号" maxlength="100" class="input-dom web-input">
          </div>
        </div>
        <div class="item flex-view">
          <div class="label">邮箱</div>
          <div class="right-box">
            <input type="text" v-model="tData.form.email" placeholder="请输入邮箱" maxlength="100" class="input-dom web-input">
          </div>
        </div>
        <div class="item flex-view">
          <div class="label">个人简介</div>
          <div class="right-box">
          <textarea v-model="tData.form.description" placeholder="请输入个人简介" maxlength="200" class="intro">
          </textarea>
            <p class="tip">限制 200 字以内</p>
          </div>
        </div>
        <div class="button-row">
          <button class="save" @click="submit()">保存</button>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import {message} from "ant-design-vue";
import {detailApi, updateUserInfoApi} from '/@/api/user'
import {BASE_URL} from "/@/store/constants";
import {useUserStore} from "/@/store";
import AvatarIcon from '/@/assets/images/avatar.jpg'

const router = useRouter();
const userStore = useUserStore();

let loading = ref(false)
let tData = reactive({
  form:{
    avatar: undefined,
    avatarFile: undefined,
    nickname: undefined,
    email: undefined,
    mobile: undefined,
    description: undefined,
  }
})

onMounted(()=>{
  getUserInfo()
})

const beforeUpload =(file)=> {
  // 改文件名
  const fileName = new Date().getTime().toString() + '.' + file.type.substring(6)
  const copyFile = new File([file], fileName)
  console.log(copyFile)
  tData.form.avatarFile = copyFile
  return false
}

const getUserInfo =()=> {
  loading.value = true
  let userId = userStore.user_id
  detailApi({userId: userId}).then(res => {
    tData.form = res.data
    if (tData.form.avatar) {
      tData.form.avatar = BASE_URL + '/api/staticfiles/avatar/' + tData.form.avatar
    }
    loading.value = false
  }).catch(err => {
    console.log(err)
    loading.value = false
  })
}
const submit =()=> {
  let formData = new FormData()
  let userId = userStore.user_id
  formData.append('id', userId)
  if (tData.form.avatarFile) {
    formData.append('avatarFile', tData.form.avatarFile)
  }
  if (tData.form.nickname) {
    formData.append('nickname', tData.form.nickname)
  }
  if (tData.form.email) {
    formData.append('email', tData.form.email)
  }
  if (tData.form.mobile) {
    formData.append('mobile', tData.form.mobile)
  }
  if (tData.form.description) {
    formData.append('description', tData.form.description)
  }
  updateUserInfoApi(formData).then(res => {
    message.success('保存成功')
    getUserInfo()
  }).catch(err => {
    console.log(err)
  })
}

</script>

<style scoped lang="less">

  @import '/@/styles/theme.less';

input, textarea {
  border-style: none;
  outline: none;
  margin: 0;
  padding: 0;
}

.flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.user-info-page {
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

  .edit-view {
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
      position: relative;
      overflow: hidden;

      .label {
        width: 100px;
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

      .right-box {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        margin-right: 16px;
        border: 2px solid rgba(102, 187, 106, 0.3);
        box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
      }

      .change-tips {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      label {
        color: #66BB6A;
        font-size: 14px;
        line-height: 22px;
        height: 22px;
        cursor: pointer;
        width: 100px;
        display: block;
        font-weight: 500;
        transition: all 0.3s ease;
      }
      
      label:hover {
        color: #2E7D32;
      }

      .tip {
        color: #6b7280;
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        margin: 0;
        width: 100%;
      }

      .right-box {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .input-dom {
        width: 400px;
      }

      .input-dom {
        background: linear-gradient(135deg, #ffffff 0%, #F1F8E9 100%);
        border: 2px solid rgba(129, 199, 132, 0.2);
        border-radius: 12px;
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
      }

      .tip {
        font-size: 12px;
        line-height: 16px;
        color: #6b7280;
        height: 16px;
        margin-top: 4px;
      }

      .intro {
        resize: none;
        background: linear-gradient(135deg, #ffffff 0%, #F1F8E9 100%);
        border: 2px solid rgba(129, 199, 132, 0.2);
        border-radius: 12px;
        width: 100%;
        padding: 12px 16px;
        height: 100px;
        line-height: 22px;
        font-size: 14px;
        color: #1c2233;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 2px 8px rgba(102, 187, 106, 0.05);
      }
      
      .intro:hover {
        border-color: rgba(102, 187, 106, 0.4);
        box-shadow: 0 4px 12px rgba(102, 187, 106, 0.1);
      }
      
      .intro:focus {
        border-color: #66BB6A;
        box-shadow: 0 0 0 4px rgba(102, 187, 106, 0.15), 0 4px 16px rgba(102, 187, 106, 0.2);
        background: #ffffff;
      }
    }

    .save {
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
      box-shadow: 0 6px 20px rgba(102, 187, 106, 0.4), 0 0 0 0 rgba(255, 167, 38, 0.4);
      position: relative;
      overflow: hidden;
    }
    
    .save::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
    
    .save:hover::before {
      left: 100%;
    }
    
    .save:hover {
      background: linear-gradient(135deg, #5CB860 0%, #45A89E 50%, #FF9800 100%);
      box-shadow: 0 8px 28px rgba(102, 187, 106, 0.5), 0 0 0 4px rgba(255, 167, 38, 0.2);
      transform: translateY(-3px) scale(1.02);
    }
    
    .save:active {
      transform: translateY(-1px) scale(0.98);
      box-shadow: 0 4px 16px rgba(102, 187, 106, 0.4);
    }

    .button-row {
      display: flex;
      justify-content: center;
      margin-top: 32px;
      margin-bottom: 40px;
    }
  }
}
</style>





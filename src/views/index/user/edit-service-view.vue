<template>
  <div class="jiajiao-page">
    <div class="page-title">编辑服务</div>
    <div class="edit-view" v-loading="loading">
        <div class="item">
          <div class="label">头像</div>
          <div class="right-box">
            <div class="avatar-box">
              <img v-if="tData.form && tData.form.avatar" :src="tData.form.avatar" class="avatar">
              <img v-else :src="AvatarIcon" class="avatar">
              <div class="change-tips">
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
        </div>
        <div class="item">
          <div class="label">姓名</div>
          <div class="right-box">
            <input type="text" v-model="tData.form.title" placeholder="请输入姓名" maxlength="20" class="input-dom">
            <p class="tip">支持中英文，长度不超过 20 个字符</p>
          </div>
        </div>
        <div class="item">
          <div class="label">性别</div>
          <div class="right-box">
            <input type="text" v-model="tData.form.sex" placeholder="请输入性别" maxlength="100" class="input-dom">
          </div>
        </div>
        <div class="item">
          <div class="label">年龄</div>
          <div class="right-box">
            <input type="number" v-model="tData.form.age" placeholder="请输入年龄" maxlength="100" class="input-dom">
          </div>
        </div>
        <div class="item">
          <div class="label">地区</div>
          <div class="right-box">
            <input type="text" v-model="tData.form.location" placeholder="请输入地区" maxlength="100" class="input-dom">
          </div>
        </div>
        <div class="item">
          <div class="label">小时价格</div>
          <div class="right-box">
            <input type="number" v-model="tData.form.price" placeholder="请输入价格" maxlength="100" class="input-dom">
          </div>
        </div>
        <div class="item">
          <div class="label">手机号</div>
          <div class="right-box">
            <input type="number" v-model="tData.form.mobile" placeholder="请输入手机号" maxlength="100" class="input-dom">
          </div>
        </div>
        <div class="item">
          <div class="label">服务</div>
          <div class="right-box">
            <a-select placeholder="请选择服务类型"
                      allowClear
                      :options="cData"
                      :field-names="{ label: 'title', value: 'id',}"
                      v-model:value="tData.form.classificationId">
            </a-select>
          </div>
        </div>
        <div class="item">
          <div class="label">个人简介</div>
          <div class="right-box">
            <textarea v-model="tData.form.description" placeholder="请输入服务介绍" maxlength="200" class="intro"></textarea>
            <p class="tip">限制 200 字以内</p>
          </div>
        </div>
        <div class="button-row">
          <button class="save" @click="submit()">保存</button>
          <button class="cancel" @click="goBack()">取消</button>
        </div>
      </div>
  </div>
</template>

<script setup>
import {message} from "ant-design-vue";
import {detailApi, userUpdateApi} from '/@/api/thing'
import {listApi as listClassificationApi} from '/@/api/classification'
import {BASE_URL} from "/@/store/constants";
import {useUserStore} from "/@/store";
import AvatarIcon from '/@/assets/images/avatar.jpg'

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

let loading = ref(false)
let tData = reactive({
  form:{
    id: undefined,
    avatar: undefined,
    avatarFile: undefined,
    title: undefined,
    age: undefined,
    sex: undefined,
    price: undefined,
    mobile: undefined,
    location: undefined,
    description: undefined,
    classificationId: undefined,
  }
})

let cData = ref([])

onMounted(()=>{
  getCDataList()
  loadService()
})

const beforeUpload =(file)=> {
  const fileName = new Date().getTime().toString() + '.' + file.type.substring(6)
  const copyFile = new File([file], fileName)
  console.log(copyFile)
  tData.form.avatarFile = copyFile
  return false
}

const getCDataList = () => {
  listClassificationApi({}).then(res => {
    cData.value = res.data
  })
}

const loadService =()=> {
  const serviceId = route.query.id
  if (!serviceId) {
    message.error('服务ID不存在')
    router.push({ name: 'myServicesView' })
    return
  }
  
  loading.value = true
  detailApi({id: serviceId}).then(res => {
    if(res.data){
      tData.form = res.data
      if (tData.form.cover) {
        tData.form.avatar = BASE_URL + '/api/staticfiles/image/'  + tData.form.cover
      }
    }
    loading.value = false
  }).catch(err => {
    console.log(err)
    message.error('加载服务失败')
    loading.value = false
  })
}

const submit =()=> {
  let formData = new FormData()
  let userId = userStore.user_id
  
  if (!tData.form.id) {
    message.error('服务ID不存在')
    return
  }
  
  formData.append('id', tData.form.id)
  formData.append('userId', userId)
  
  if (tData.form.avatarFile) {
    formData.append('imageFile', tData.form.avatarFile)
  }
  if (tData.form.title) {
    formData.append('title', tData.form.title)
  } else {
    message.warn("标题不能为空")
    return
  }
  if (tData.form.classificationId) {
    formData.append('classificationId', tData.form.classificationId)
  }
  if (tData.form.sex) {
    formData.append('sex', tData.form.sex)
  } else {
    message.warn("性别不能为空")
    return
  }
  if (tData.form.age) {
    formData.append('age', tData.form.age)
  } else {
    message.warn("年龄不能为空")
    return
  }
  if (tData.form.mobile) {
    formData.append('mobile', tData.form.mobile)
  }else {
    message.warn("手机号不能为空")
    return
  }
  if (tData.form.location) {
    formData.append('location', tData.form.location)
  }else {
    message.warn("地区不能为空")
    return
  }
  if (tData.form.price) {
    formData.append('price', tData.form.price)
  }else {
    message.warn("价格不能为空")
    return
  }
  if (tData.form.description) {
    formData.append('description', tData.form.description)
  }else {
    message.warn("简介不能为空")
    return
  }
  formData.append('status', '1')

  userUpdateApi(formData).then(res => {
    message.success('更新成功，等待审核')
    router.push({ name: 'myServicesView' })
  }).catch(err => {
    message.error(err.msg || '操作失败')
    console.log(err)
  })
}

const goBack = () => {
  router.push({ name: 'myServicesView' })
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
  display: flex;
}

.jiajiao-page {
  width: 100%;
  box-sizing: border-box;

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
    width: 100%;
    
    .item {
      margin: 16px 0;
      padding: 20px 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(232, 245, 233, 0.3) 100%);
      border-radius: 16px;
      border: 1px solid rgba(129, 199, 132, 0.2);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      align-items: flex-start;

      .label {
        width: 90px;
        color: #2E7D32;
        font-weight: 700;
        font-size: 14px;
        position: relative;
        padding-left: 12px;
        padding-top: 12px;
        flex-shrink: 0;
      }
      
      .label::before {
        content: '';
        position: absolute;
        left: 0;
        top: 14px;
        width: 4px;
        height: 16px;
        background: linear-gradient(135deg, #66BB6A 0%, #FFA726 100%);
        border-radius: 2px;
      }

      .right-box {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .avatar-box {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 3px solid rgba(102, 187, 106, 0.3);
        box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
        flex-shrink: 0;
      }

      .change-tips {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      label {
        color: #66BB6A;
        font-size: 14px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        padding: 6px 16px;
        background: rgba(102, 187, 106, 0.1);
        border-radius: 8px;
        display: inline-block;
        width: fit-content;
      }
      
      label:hover {
        color: #ffffff;
        background: #66BB6A;
      }

      .tip {
        color: #6b7280;
        font-size: 12px;
        line-height: 1.5;
        margin: 0;
      }

      .input-dom {
        width: 100%;
        max-width: 500px;
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

      .intro {
        resize: none;
        background: linear-gradient(135deg, #ffffff 0%, #F1F8E9 100%);
        border: 2px solid rgba(129, 199, 132, 0.2);
        border-radius: 12px;
        width: 100%;
        max-width: 600px;
        padding: 12px 16px;
        height: 120px;
        line-height: 1.6;
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
    
    .item:hover {
      border-color: rgba(102, 187, 106, 0.3);
      box-shadow: 0 4px 16px rgba(102, 187, 106, 0.08);
    }

    .save, .cancel {
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
    }
    
    .cancel {
      background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
      box-shadow: 0 4px 12px rgba(158, 158, 158, 0.3);
    }
    
    .save:hover {
      background: linear-gradient(135deg, #5CB860 0%, #45A89E 50%, #FF9800 100%);
      box-shadow: 0 8px 28px rgba(102, 187, 106, 0.5);
      transform: translateY(-3px) scale(1.02);
    }
    
    .cancel:hover {
      background: linear-gradient(135deg, #757575 0%, #616161 100%);
      box-shadow: 0 6px 16px rgba(158, 158, 158, 0.4);
      transform: translateY(-2px);
    }
  }
  
  .button-row {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 40px;
  }
}

:deep(.ant-select) {
  width: 100% !important;
  max-width: 300px;
}

:deep(.ant-select .ant-select-selector) {
  background: linear-gradient(135deg, #ffffff 0%, #F1F8E9 100%) !important;
  border: 2px solid rgba(129, 199, 132, 0.2) !important;
  border-radius: 12px !important;
  height: 44px !important;
  padding: 0 16px !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  box-shadow: 0 2px 8px rgba(102, 187, 106, 0.05) !important;
}

:deep(.ant-select .ant-select-selector .ant-select-selection-item),
:deep(.ant-select .ant-select-selector .ant-select-selection-placeholder) {
  line-height: 40px !important;
}

:deep(.ant-select:hover .ant-select-selector) {
  border-color: rgba(102, 187, 106, 0.4) !important;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.1) !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #66BB6A !important;
  box-shadow: 0 0 0 4px rgba(102, 187, 106, 0.15), 0 4px 16px rgba(102, 187, 106, 0.2) !important;
  background: #ffffff !important;
}

:deep(.ant-spin-container) {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

:deep(.ant-spin-nested-loading) {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

:deep(.ant-spin-blur) {
  width: 100%;
}
</style>

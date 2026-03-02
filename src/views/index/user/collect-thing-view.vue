<template>
  <div class="collect-page">
    <div class="page-title">我的收藏</div>
    <div class="thing-list" v-if="pageData.collectData.length">
      <div class="thing-item" v-for="(item,index) in pageData.collectData" :key="index">
        <div class="remove-btn" @click="handleRemove(item)">移出</div>
        <div class="img-view" @click="handleClickItem(item)">
          <img :src="item.cover">
        </div>
        <div class="info-view">
          <h3 class="thing-name">{{item.title}}</h3>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <div class="empty-title">暂无收藏</div>
      <div class="empty-subtitle">去首页挑选喜欢的服务吧</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {message} from 'ant-design-vue';
import {userCollectListApi, unCollectApi} from '/@/api/thingCollect'
import {BASE_URL} from "/@/store/constants";
import {useUserStore} from "/@/store";

const router = useRouter();
const userStore = useUserStore();

const pageData = reactive({
  collectData: []
})

onMounted(()=>{
  getCollectThingList()
})

const handleClickItem =(record) =>{
  let text = router.resolve({name: 'detail', query: {id: record.thing_id}})
  window.open(text.href, '_blank')
}
const handleRemove =(record)=> {
  let username = userStore.user_name
  unCollectApi({id: record.id}).then(res => {
    message.success('移除成功')
    getCollectThingList()
  }).catch(err => {
    console.log(err)
  })
}
const getCollectThingList =()=> {
  let userId = userStore.user_id
  userCollectListApi({userId: userId}).then(res => {
    res.data.forEach(item => {
      item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover
    })
    console.log(res.data)
    pageData.collectData = res.data
  }).catch(err => {
    console.log(err.msg)
  })
}

</script>
<style scoped lang="less">
@import '/@/styles/theme.less';

.collect-page {
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

.thing-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
  gap: 20px;
}

.thing-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
  border: 2px solid rgba(129, 199, 132, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.1);

  .remove-btn {
    position: absolute;
    right: 12px;
    top: 12px;
    width: 56px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
    border-radius: 32px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(244, 81, 30, 0.3);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .remove-btn:hover {
    background: linear-gradient(135deg, #F4511E 0%, #E64A19 100%);
    box-shadow: 0 6px 16px rgba(244, 81, 30, 0.4);
    transform: translateY(-2px) scale(1.05);
  }

  .img-view {
    background: linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%);
    font-size: 0;
    text-align: center;
    height: 180px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
      display: block;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  .info-view {
    background: rgba(255, 255, 255, 0.95);
    text-align: center;
    padding: 16px;
    min-height: 80px;

    h3 {
      color: #2E7D32;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin: 0;
    }
  }
}

.thing-item:hover {
  border-color: rgba(102, 187, 106, 0.5);
  box-shadow: 0 8px 24px rgba(102, 187, 106, 0.2);
  transform: translateY(-4px);
  
  .img-view img {
    transform: scale(1.05);
  }
}

.empty-state {
  margin-top: 48px;
  padding: 64px 24px;
  text-align: center;
  color: #6b7487;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
  border: 2px dashed rgba(129, 199, 132, 0.3);
  border-radius: 20px;
}

.empty-state::before {
  content: '💚';
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #2E7D32;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 14px;
  color: #6b7280;
}
</style>

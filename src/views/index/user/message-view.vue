<template>
  <div class="message-page">
    <div class="page-title">消息管理</div>
    <div class="list-content">
      <div class="notification-item" v-for="(item, index) in messageData" :key="index">
        <div class="header">
          <div class="info">
            <span class="dot"></span>
            <span class="type">{{ item.title }}</span>
            <span class="time">{{ item.createTime }}</span>
          </div>
        </div>
        <div class="content-box">
          <p class="content">{{ item.content }}</p>
        </div>
      </div>
      <div v-if="messageData.length === 0" class="empty-state">
        暂无消息通知
      </div>
    </div>
  </div>
</template>

<script setup>
import {listApi} from '/@/api/notice'
import {useUserStore} from "/@/store";

const userStore = useUserStore();
const messageData = ref([])

onMounted(() => {
  getMessageList()
})

const getMessageList = () => {
  listApi({userId: userStore.user_id}).then(res => {
    messageData.value = res.data
  }).catch(err => {
    console.log(err)
  })
}
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.message-page {
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

  .notification-item {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.2) 100%);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    border: 1px solid rgba(129, 199, 132, 0.2);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    &:hover {
      background: #ffffff;
      border-color: rgba(102, 187, 106, 0.4);
      box-shadow: 0 8px 24px rgba(102, 187, 106, 0.12);
      transform: translateY(-2px);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .info {
        display: flex;
        align-items: center;

        .dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #66BB6A 0%, #FFA726 100%);
          border-radius: 50%;
          margin-right: 12px;
          box-shadow: 0 0 8px rgba(102, 187, 106, 0.4);
        }

        .type {
          font-weight: 700;
          color: #2E7D32;
          font-size: 16px;
          margin-right: 16px;
        }

        .time {
          color: rgba(28, 34, 51, 0.4);
          font-size: 13px;
        }
      }
    }

    .content-box {
      padding-left: 20px;
      
      .content {
        color: #4b5563;
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 60px 0;
    color: rgba(28, 34, 51, 0.4);
    font-size: 15px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    border: 2px dashed rgba(129, 199, 132, 0.2);
  }
}
</style>

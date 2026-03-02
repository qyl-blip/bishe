<template>
  <div class="order-page">
    <div class="page-title">我的预约</div>
    <div class="order-list" v-if="orderData.length">
      <div class="order-item-view" v-for="(item, index) in orderData" :key="index">
        <div class="header flex-view">
          <div class="left">
            <span class="text">预约编号</span>
            <span class="num mg-4">#</span>
            <span class="num">{{ item.appointmentNumber }}</span>
            <span class="time">{{ getFormatTime(item.createTime, true) }}</span>
          </div>
          <div class="right">
            <span :class="['state', getStatusClass(item.status)]">{{ getStatusText(item.status) }}</span>
          </div>
        </div>
        <div class="content flex-view">
          <div class="left-list">
            <div class="list-item flex-view" @click="handleDetail(item.thingId)">
              <img :src="item.cover" class="thing-img" />
              <div class="detail flex-between flex-view">
                <div class="flex-between flex-top flex-view">
                  <h2 class="name">{{ item.thingTitle }}</h2>
                </div>
                <div class="flex-between flex-center flex-view">
                  <span class="type">预约时间</span>
                  <span class="time-info">{{ item.appointmentDate }} {{ item.slotTime }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="right-info">
            <div class="mg">
              <span class="title">接收人：</span>
              <span class="name">{{ item.receiverName }}</span>
            </div>
            <div class="mg">
              <span class="title">联系电话：</span>
              <span class="text">{{ item.receiverPhone }}</span>
            </div>
            <div class="mg">
              <span class="title">服务地址：</span>
              <span class="text">{{ item.receiverAddress }}</span>
            </div>
            <div v-if="item.remark" class="mg">
              <span class="title">备注：</span>
              <span class="text">{{ item.remark }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <div class="empty-title">暂无预约</div>
      <div class="empty-subtitle">去首页挑选服务吧</div>
    </div>
  </div>
</template>

<script setup>
  import { message } from 'ant-design-vue';
  import { getFormatTime } from '/@/utils/';
  import { getUserAppointments } from '/@/api/appointment';
  import { BASE_URL } from '/@/store/constants';
  import { useUserStore } from '/@/store';

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  const loading = ref(false);
  const orderData = ref([]);

  onMounted(() => {
    getAppointmentList();
  });

  const getAppointmentList = () => {
    loading.value = true;
    getUserAppointments()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        list.forEach((item) => {
          if (item.cover) {
            item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover;
          }
        });
        orderData.value = list;
        loading.value = false;
      })
      .catch((err) => {
        console.log(err);
        loading.value = false;
      });
  };
  
  const handleDetail = (thingId) => {
    let text = router.resolve({ name: 'detail', query: { id: thingId } });
    window.open(text.href, '_blank');
  };
  
  const getStatusText = (status) => {
    const statusMap = {
      '0': '待确认',
      '1': '已接受',
      '2': '已完成',
      '3': '已拒绝'
    };
    return statusMap[status] || '未知';
  };
  
  const getStatusClass = (status) => {
    const classMap = {
      '0': 'status-pending',
      '1': 'status-accepted',
      '2': 'status-completed',
      '3': 'status-rejected'
    };
    return classMap[status] || '';
  };
</script>
<style scoped lang="less">
  @import '/@/styles/theme.less';
.flex-view {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }

  .order-page {
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

    .order-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-item-view {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 245, 233, 0.3) 100%);
      border-radius: 16px;
      padding: 20px;
      margin-top: 16px;
      border: 2px solid rgba(129, 199, 132, 0.2);
      box-shadow: 0 4px 16px rgba(102, 187, 106, 0.1);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;

      .header {
        border-bottom: 2px solid rgba(129, 199, 132, 0.3);
        padding-bottom: 16px;
        justify-content: space-between;
        font-size: 14px;
        background: linear-gradient(90deg, rgba(102, 187, 106, 0.05) 0%, transparent 100%);
        padding: 12px 16px;
        margin: -20px -20px 16px -20px;
        border-radius: 16px 16px 0 0;

        .text {
          color: rgba(28, 34, 51, 0.6);
        }

        .mg-4 {
          margin-left: 4px;
        }

        .num {
          font-weight: 500;
          color: #1c2233;
        }

        .time {
          margin-left: 16px;
          color: rgba(28, 34, 51, 0.55);
        }

        .state {
          color: #FFA726;
          font-weight: 700;
          margin-left: 10px;
          padding: 4px 12px;
          background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%);
          border-radius: 8px;
          border: 1px solid rgba(255, 167, 38, 0.3);
        }
        
        .status-pending {
          color: #1890ff;
          background: linear-gradient(135deg, #E3F2FD 0%, #F0F9FF 100%);
          border-color: rgba(24, 144, 255, 0.3);
        }
        
        .status-accepted {
          color: #52c41a;
          background: linear-gradient(135deg, #F1F8E9 0%, #F9FFF9 100%);
          border-color: rgba(82, 196, 26, 0.3);
        }
        
        .status-completed {
          color: #13c2c2;
          background: linear-gradient(135deg, #E6FFFB 0%, #F0FFFF 100%);
          border-color: rgba(19, 194, 194, 0.3);
        }
        
        .status-cancelled {
          color: #999;
          background: linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%);
          border-color: rgba(153, 153, 153, 0.3);
        }
        
        .status-rejected {
          color: #ff4d4f;
          background: linear-gradient(135deg, #FFF1F0 0%, #FFEDED 100%);
          border-color: rgba(255, 77, 79, 0.3);
        }
      }

      .content {
        padding: 12px 0;
        overflow: hidden;

        .left-list {
          overflow: hidden;
          height: 132px;
          flex: 2;
          padding-right: 16px;

          .list-item {
            height: 60px;
            margin-bottom: 12px;
            overflow: hidden;
            cursor: pointer;
            padding: 8px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(129, 199, 132, 0.2);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .list-item:hover {
            background: rgba(255, 255, 255, 0.9);
            border-color: rgba(102, 187, 106, 0.4);
            box-shadow: 0 4px 12px rgba(102, 187, 106, 0.15);
            transform: translateX(4px);
          }

          .thing-img {
            width: 48px;
            height: 100%;
            margin-right: 12px;
          }

          .detail {
            flex: 1;
            flex-direction: column;
          }

          .flex-between {
            justify-content: space-between;
          }

          .flex-top {
            align-items: flex-start;
          }

          .name {
            color: #1c2233;
            font-weight: 600;
            font-size: 14px;
            line-height: 18px;
          }

          .flex-center {
            align-items: center;
          }

          .type {
            color: rgba(28, 34, 51, 0.6);
            font-size: 12px;
            margin-right: 8px;
          }
          
          .time-info {
            color: #1890ff;
            font-weight: 500;
            font-size: 13px;
          }
        }

        .right-info {
          flex: 1;
          border-left: 1px solid rgba(129, 199, 132, 0.2);
          padding-left: 12px;
          line-height: 22px;
          font-size: 14px;

          .title {
            color: rgba(28, 34, 51, 0.6);
          }

          .name {
            color: #1c2233;
          }

          .text {
            color: rgba(28, 34, 51, 0.7);
          }

          .mg {
            margin-bottom: 4px;
          }
        }
      }
    }

    .empty-state {
      margin-top: 24px;
      padding: 48px 24px;
      text-align: center;
      color: #6b7487;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
      border: 2px dashed rgba(129, 199, 132, 0.3);
      border-radius: 20px;
      position: relative;
      overflow: hidden;
    }
    
    .empty-state::before {
      content: '📋';
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
      margin-top: 6px;
      font-size: 14px;
      color: #6b7280;
    }
  }
</style>

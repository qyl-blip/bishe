<template>
  <div class="received-orders-page">
    <div class="page-title">收到的预约</div>
    <div class="subtitle">作为服务提供者，这里显示客户预约您服务的订单</div>
    
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
            <div class="list-item flex-view">
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
              <span class="title">客户姓名：</span>
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
              <span class="title">客户备注：</span>
              <span class="text">{{ item.remark }}</span>
            </div>
          </div>
        </div>
        <div class="action-bar">
          <a-button v-if="item.status === '0'" type="primary" @click="handleAccept(item)">接受预约</a-button>
          <a-button v-if="item.status === '0'" danger @click="handleReject(item)">拒绝预约</a-button>
          <a-button v-if="item.status === '0'" @click="handleContact(item)">联系客户</a-button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-title">暂无收到的预约</div>
      <div class="empty-subtitle">完善您的家政资料，让更多客户找到您</div>
    </div>
  </div>
</template>

<script setup>
  import { message } from 'ant-design-vue';
  import { getFormatTime } from '/@/utils/';
  import { BASE_URL } from '/@/store/constants';
  import { useUserStore } from '/@/store';
  import { getReceivedAppointments, updateAppointmentStatus } from '/@/api/appointment';

  const router = useRouter();
  const userStore = useUserStore();

  const loading = ref(false);
  const orderData = ref([]);

  onMounted(() => {
    loadReceivedAppointments();
  });

  const loadReceivedAppointments = () => {
    loading.value = true;
    getReceivedAppointments()
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
        message.error(err.msg || '获取预约列表失败');
        loading.value = false;
      });
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
  
  const handleAccept = (item) => {
    // 状态改为已接受/待服务(1)
    updateAppointmentStatus(item.id, '1')
      .then(() => {
        message.success('已接受预约：' + item.appointmentNumber);
        loadReceivedAppointments(); // 刷新列表
      })
      .catch((err) => {
        message.error(err.msg || '操作失败');
      });
  };
  
  const handleReject = (item) => {
    // 状态改为已拒绝(3)
    updateAppointmentStatus(item.id, '3')
      .then(() => {
        message.warning('已拒绝预约：' + item.appointmentNumber);
        loadReceivedAppointments(); // 刷新列表
      })
      .catch((err) => {
        message.error(err.msg || '操作失败');
      });
  };
  
  const handleContact = (item) => {
    message.info('客户电话：' + item.receiverPhone);
  };
</script>

<style scoped lang="less">
  @import '/@/styles/theme.less';

.flex-view {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }

  .received-orders-page {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 255, 248, 0.95) 100%);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    min-height: calc(100vh - 120px);

    .page-title {
      color: #2E7D32;
      font-weight: 700;
      font-size: 24px;
      margin-bottom: 8px;
      padding-bottom: 16px;
      border-bottom: 3px solid transparent;
      background: linear-gradient(90deg, #66BB6A 0%, #FFA726 50%, transparent 100%) bottom / 100% 3px no-repeat;
    }
    
    .subtitle {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 24px;
    }
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
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
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
        -webkit-box-flex: 2;
        -ms-flex: 2;
        flex: 2;
        padding-right: 16px;

        .list-item {
          height: 60px;
          margin-bottom: 12px;
          overflow: hidden;
          padding: 8px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(129, 199, 132, 0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .thing-img {
          width: 48px;
          height: 100%;
          margin-right: 12px;
        }

        .detail {
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
        }

        .flex-between {
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
        }

        .flex-top {
          -webkit-box-align: start;
          -ms-flex-align: start;
          align-items: flex-start;
        }

        .name {
          color: #1c2233;
          font-weight: 600;
          font-size: 14px;
          line-height: 18px;
        }

        .flex-center {
          -webkit-box-align: center;
          -ms-flex-align: center;
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
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        border-left: 1px solid @border-subtle;
        padding-left: 12px;
        line-height: 22px;
        font-size: 14px;

        .title {
          color: rgba(28, 34, 51, 0.6);
        }

        .name {
          color: #1c2233;
          font-weight: 600;
        }

        .text {
          color: rgba(28, 34, 51, 0.7);
        }

        .mg {
          margin-bottom: 4px;
        }
      }
    }
    
    .action-bar {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(129, 199, 132, 0.2);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
  }

  .order-item-view:first-child {
    margin-top: 16px;
  }

  .empty-state {
    margin-top: 24px;
    padding: 60px 24px;
    text-align: center;
    color: #6b7487;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
    border: 2px dashed rgba(129, 199, 132, 0.3);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
  }
  
  .empty-icon {
    font-size: 64px;
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
</style>

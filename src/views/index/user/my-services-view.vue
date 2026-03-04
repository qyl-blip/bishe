<template>
  <div class="my-services-page">
    <div class="page-title">我的服务</div>
    
    <div class="services-list" v-loading="loading">
      <div v-if="servicesList.length === 0" class="empty-state">
        <p>暂无发布的服务</p>
        <a-button type="primary" @click="goToEdit">立即发布服务</a-button>
      </div>
      
      <div v-else class="service-cards">
        <div v-for="service in servicesList" :key="service.id" class="service-card">
          <div class="card-cover">
            <img v-if="service.cover" :src="BASE_URL + '/api/staticfiles/image/' + service.cover" alt="服务封面" />
            <img v-else :src="DefaultCover" alt="默认封面" />
            <div class="status-badge" :class="service.status === '0' ? 'status-active' : 'status-pending'">
              {{ service.status === '0' ? '已上架' : '待审核' }}
            </div>
          </div>
          
          <div class="card-content">
            <h3 class="service-title">{{ service.title }}</h3>
            <div class="service-info">
              <div class="info-item">
                <span class="label">服务类型：</span>
                <span class="value">{{ getClassificationName(service.classificationId) }}</span>
              </div>
              <div class="info-item">
                <span class="label">价格：</span>
                <span class="value price">¥{{ service.price }}/小时</span>
              </div>
              <div class="info-item">
                <span class="label">地区：</span>
                <span class="value">{{ service.location }}</span>
              </div>
              <div class="info-item">
                <span class="label">联系电话：</span>
                <span class="value">{{ service.mobile }}</span>
              </div>
            </div>
            
            <div class="service-stats">
              <span class="stat-item">
                <eye-outlined />
                浏览 {{ service.pv || 0 }}
              </span>
              <span class="stat-item">
                <heart-outlined />
                收藏 {{ service.collectCount || 0 }}
              </span>
              <span class="stat-item">
                <star-outlined />
                心愿 {{ service.wishCount || 0 }}
              </span>
            </div>
            
            <div class="card-actions">
              <a-button type="primary" size="small" @click="editService(service)">编辑</a-button>
              <a-button size="small" @click="viewDetail(service.id)">查看详情</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { listUserThingApi } from '/@/api/thing';
import { listApi as listClassificationApi } from '/@/api/classification';
import { BASE_URL } from '/@/store/constants';
import { useUserStore } from '/@/store';
import { EyeOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons-vue';
import DefaultCover from '/@/assets/images/avatar.jpg';

const router = useRouter();
const userStore = useUserStore();

let loading = ref(false);
let servicesList = ref([]);
let classificationList = ref([]);

onMounted(() => {
  getClassificationList();
  getServicesList();
});

const getClassificationList = () => {
  listClassificationApi({}).then(res => {
    classificationList.value = res.data || [];
  }).catch(err => {
    console.log(err);
  });
};

const getServicesList = () => {
  loading.value = true;
  let userId = userStore.user_id;
  
  listUserThingApi({ userId: userId }).then(res => {
    servicesList.value = res.data || [];
    loading.value = false;
  }).catch(err => {
    console.log(err);
    message.error('获取服务列表失败');
    loading.value = false;
  });
};

const getClassificationName = (classificationId) => {
  const classification = classificationList.value.find(c => c.id === classificationId);
  return classification ? classification.title : '未分类';
};

const goToEdit = () => {
  router.push({ name: 'jiajiaoEditView' });
};

const editService = (service) => {
  // 跳转到编辑页面，传递服务ID
  router.push({ name: 'editServiceView', query: { id: service.id } });
};

const viewDetail = (serviceId) => {
  router.push({ name: 'detail', query: { id: serviceId } });
};
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.my-services-page {
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

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    
    p {
      color: #6b7280;
      font-size: 16px;
      margin-bottom: 24px;
    }
    
    .ant-btn-primary {
      background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
      border: none;
      border-radius: 20px;
      padding: 0 32px;
      height: 40px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
        box-shadow: 0 6px 16px rgba(102, 187, 106, 0.4);
        transform: translateY(-2px);
      }
    }
  }

  .service-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  .service-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 245, 233, 0.4) 100%);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(129, 199, 132, 0.2);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 8px rgba(102, 187, 106, 0.1);
    
    &:hover {
      border-color: rgba(102, 187, 106, 0.4);
      box-shadow: 0 8px 24px rgba(102, 187, 106, 0.2);
      transform: translateY(-4px);
    }

    .card-cover {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f5f5f5;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
      
      .status-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        backdrop-filter: blur(10px);
        
        &.status-active {
          background: rgba(76, 175, 80, 0.9);
          color: #ffffff;
        }
        
        &.status-pending {
          background: rgba(255, 167, 38, 0.9);
          color: #ffffff;
        }
      }
    }

    .card-content {
      padding: 20px;
      
      .service-title {
        font-size: 18px;
        font-weight: 700;
        color: #2E7D32;
        margin-bottom: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .service-info {
        margin-bottom: 16px;
        
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          
          .label {
            color: #6b7280;
            min-width: 80px;
          }
          
          .value {
            color: #1f2937;
            font-weight: 500;
            
            &.price {
              color: #FF6B35;
              font-size: 16px;
              font-weight: 700;
            }
          }
        }
      }
      
      .service-stats {
        display: flex;
        gap: 16px;
        padding: 12px 0;
        border-top: 1px solid rgba(129, 199, 132, 0.2);
        border-bottom: 1px solid rgba(129, 199, 132, 0.2);
        margin-bottom: 16px;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #6b7280;
          
          .anticon {
            font-size: 14px;
          }
        }
      }
      
      .card-actions {
        display: flex;
        gap: 12px;
        
        .ant-btn {
          flex: 1;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .ant-btn-primary {
          background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
          border: none;
          box-shadow: 0 2px 8px rgba(102, 187, 106, 0.25);
          
          &:hover {
            background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
            box-shadow: 0 4px 12px rgba(102, 187, 106, 0.35);
            transform: translateY(-2px);
          }
        }
        
        .ant-btn:not(.ant-btn-primary) {
          border: 2px solid rgba(102, 187, 106, 0.3);
          color: #66BB6A;
          
          &:hover {
            border-color: #66BB6A;
            color: #5CB860;
            background: rgba(102, 187, 106, 0.05);
          }
        }
      }
    }
  }
}

:deep(.ant-spin-nested-loading),
:deep(.ant-spin-container) {
  width: 100%;
}
</style>

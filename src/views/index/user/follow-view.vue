<template>
  <div class="follow-page">
    <div class="page-title">我的关注</div>
    <div class="follow-list flex-view" v-if="followData.length">
      <div class="follow-item-view flex-view" v-for="item in followData">
        <img src="" alt="">
        <div class="infos flex-view">
          <h3 class="name">Python_C</h3>
          <button>取消关注</button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <div class="empty-title">暂无关注</div>
      <div class="empty-subtitle">去发现感兴趣的内容吧</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FollowView',
  data () {
    return {
      followData: ['','','','','',]
    }
  }
}
</script>
<style scoped lang="less">
@import '/@/styles/theme.less';

.follow-page {
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

.flex-view {
  display: flex;
}

.follow-list {
  flex-wrap: wrap;
  gap: 20px;

  .follow-item-view {
    width: calc(33.33% - 14px);
    padding: 16px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
    border: 2px solid rgba(129, 199, 132, 0.2);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 12px;
      border: 2px solid rgba(102, 187, 106, 0.3);
    }

    .infos {
      flex: 1;
      flex-wrap: wrap;
      align-items: center;

      h3 {
        color: #2E7D32;
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        height: 22px;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        margin: 0;
      }

      button {
        cursor: pointer;
        margin-top: 4px;
        border: none;
        outline: none;
        background: transparent;
        color: #FF7043;
        font-size: 13px;
        line-height: 22px;
        height: 22px;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      button:hover {
        color: #F4511E;
      }
    }
  }

  .follow-item-view:hover {
    border-color: rgba(102, 187, 106, 0.5);
    box-shadow: 0 6px 20px rgba(102, 187, 106, 0.15);
    transform: translateY(-2px);
  }
}

.empty-state {
  margin-top: 48px;
  padding: 64px 24px;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
  border: 2px dashed rgba(129, 199, 132, 0.3);
  border-radius: 20px;

  &::before {
    content: '👥';
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
}
</style>






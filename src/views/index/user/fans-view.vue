<template>
  <div class="fans-page">
    <div class="page-title">我的粉丝</div>
    <div class="fans-list flex-view" v-if="fansData.length">
      <div class="fans-item-view flex-view" v-for="item in fansData">
        <img src="" alt="">
        <div class="infos flex-view">
          <h3 class="name">Python_C</h3>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <div class="empty-title">暂无粉丝</div>
      <div class="empty-subtitle">分享更多精彩内容吧</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FansView',
  data () {
    return {
      fansData: ['','','','','',]
    }
  }
}
</script>
<style scoped lang="less">
@import '/@/styles/theme.less';

.fans-page {
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

.fans-list {
  flex-wrap: wrap;
  gap: 20px;

  .fans-item-view {
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
    }
  }

  .fans-item-view:hover {
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
    content: '🌟';
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






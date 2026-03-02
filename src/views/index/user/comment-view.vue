<template>
  <div class="comment-page">
    <div class="page-title">我的评论</div>
    <a-spin :spinning="loading" style="min-height: 200px;">
      <div class="comment-list" v-if="commentData.length">
        <div class="comment-item flex-view" v-for="item in commentData">
          <img :src="item.cover" class="avatar">
          <div class="infos">
            <div class="name flex-view">
              <h3></h3>
              <h3 @click="handleClickTitle(item)">《{{ item.title }}》</h3>
            </div>
            <div class="time">{{ getFormatTime(item.commentTime, true)}}</div>
            <div class="content">{{item.content}}</div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-title">暂无评论</div>
        <div class="empty-subtitle">去分享你的想法吧</div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import {useUserStore} from "/@/store";

const router = useRouter();
const userStore = useUserStore();

import {listUserCommentsApi} from '/@/api/comment'
import {BASE_URL} from "/@/store/constants";
import {getFormatTime} from '/@/utils'

const loading = ref(false)

const commentData = ref([])

onMounted(()=>{
  getCommentList()
})

const handleClickTitle =(record)=> {
  let text = router.resolve({name: 'detail', query: {id: record.thingId}})
  window.open(text.href, '_blank')
}

const getCommentList =()=> {
  loading.value = true
  let userId = userStore.user_id
  listUserCommentsApi({userId: userId}).then(res => {
    res.data.forEach(item => {
      item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover
    })
    commentData.value = res.data
    loading.value = false
  }).catch(err => {
    message.error(err.msg || '网络异常')
    loading.value = false
  })
}

</script>
<style scoped lang="less">
@import '/@/styles/theme.less';

.comment-page {
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

.comment-list {
  .comment-item {
    padding: 20px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
    border: 2px solid rgba(129, 199, 132, 0.2);
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 16px;
      border: 2px solid rgba(102, 187, 106, 0.3);
      box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
    }

    .infos {
      flex: 1;

      .name {
        align-items: center;
        cursor: pointer;
        margin-bottom: 8px;

        h3 {
          color: #2E7D32;
          font-weight: 600;
          font-size: 15px;
          margin: 0;
          transition: all 0.3s ease;
        }

        h3:hover {
          color: #66BB6A;
        }
      }

      .time {
        color: #6b7280;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 8px;
      }

      .content {
        color: #1c2233;
        font-size: 14px;
        line-height: 1.6;
      }
    }
  }

  .comment-item:hover {
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
    content: '💬';
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

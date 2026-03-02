<template>
  <div class="score-page">
    <div class="page-title">我的积分</div>
    <div class="score-content">
      <div class="score-card">
        <div class="score-label">积分余额</div>
        <div class="score-value">{{ score }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {detailApi} from '/@/api/user'
import {useUserStore} from "/@/store";

const router = useRouter();
const userStore = useUserStore();

let score = ref(0)

onMounted(()=>{
  getUserInfo()
})

const getUserInfo =()=> {
  let userId = userStore.user_id
  detailApi({userId: userId}).then(res => {
    if (res.data) {
      score.value = res.data.score
    }
  }).catch(err => {
    console.log(err)
  })
}

</script>
<style scoped lang="less">
@import '/@/styles/theme.less';

.score-page {
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

.score-content {
  .score-card {
    padding: 40px;
    text-align: center;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 249, 230, 0.3) 100%);
    border: 2px solid rgba(255, 193, 7, 0.2);
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(255, 167, 38, 0.15);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    .score-label {
      color: #6b7280;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .score-value {
      color: #FFA726;
      font-size: 48px;
      font-weight: 700;
      font-family: @font-family-display;
      text-shadow: 0 2px 8px rgba(255, 167, 38, 0.2);
    }
  }

  .score-card:hover {
    border-color: rgba(255, 167, 38, 0.5);
    box-shadow: 0 12px 32px rgba(255, 167, 38, 0.25);
    transform: translateY(-4px);
  }
}
</style>






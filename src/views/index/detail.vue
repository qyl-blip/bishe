<template>
  <div class="detail page-surface">
    <TopBar/>

    <div class="detail-content">
      <div class="detail-content-top">
        <div style="position: relative;">
          <div class="thing-infos-view">
            <div class="thing-infos">
              <div class="thing-img-box">
                <img :src="detailData.cover" @error="useFallback"/>
              </div>
              <div class="thing-info-box">
                <div class="thing-state">
                  <span class="state hidden-sm">服务状态</span>
                  <span>有效</span>
                </div>
                <h1 class="thing-name">{{ detailData.title }}</h1>
                <span>
                  <span class="a-price-symbol"></span>
                  <span class="a-price" style="font-size: 20px;">{{ detailData.price }}元/时</span>
                </span>
                <div class="translators flex-view" style="">
                  <span>服务分类</span>
                  <span class="name">{{ detailData.classification_title }}</span>
                </div>
                <div class="translators flex-view" style="">
                  <span>性别</span>
                  <span class="name">{{ detailData.sex }}</span>
                </div>
                <div class="translators flex-view" style="">
                  <span>年龄</span>
                  <span class="name">{{ detailData.age }}岁</span>
                </div>
                <div class="translators flex-view" style="">
                  <span>地区</span>
                  <span class="name">{{ detailData.location }}</span>
                </div>
                <button class="buy-btn" @click="handleOrder(detailData)">
                  <img :src="AddIcon" />
                  <span>立即预约</span>
                </button>
              </div>

            </div>
            <div class="thing-counts hidden-sm">
              <div class="count-item flex-view pointer" :class="{ active: isWished }" @click="addToWish()">
                <div class="count-img">
                  <img :src="WantIcon">
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">心愿</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text">{{ detailData.wishCount }}</span>
                  </div>
                </div>
              </div>
              <div class="count-item flex-view pointer" :class="{ active: isCollected }" @click="collect()">
                <div class="count-img">
                  <img :src="RecommendIcon">
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">收藏</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text">{{ detailData.collectCount }}</span>
                  </div>
                </div>
              </div>
              <div class="count-item flex-view" @click="share()">
                <div class="count-img">
                  <img :src="ShareIcon">
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">分享</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text"></span>
                    <img :src="WeiboShareIcon" class="mg-l">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-content-bottom">
        <div class="thing-content-view">
          <div class="main-content">
            <div class="order-view main-tab">
          <span class="tab"
                :class="selectTabIndex===index? 'tab-select':''"
                v-for="(item,index) in tabData"
                :key="index"
                @click="selectTab(index)">
            {{ item }}
          </span>
              <span :style="{left: tabUnderLeft + 'px'}" class="tab-underline"></span>
            </div>

            <!--简介-->
            <div class="thing-intro" :class="selectTabIndex <= 0? '':'hide'">
              <p class="text" style="">{{ detailData.description || '暂无介绍' }}</p>
            </div>

            <!--评论--->
            <div class="thing-comment" :class="selectTabIndex > 0? '':'hide'">
              <div class="title">发表新的评论</div>
              <div class="publish flex-view">
                <img :src="AvatarIcon" class="mine-img">
                <input placeholder="写下你的评论..." class="content-input" ref="commentRef">
                <button class="send-btn" @click="sendComment()">发送</button>
              </div>
              <div class="tab-view flex-view">
                <div class="count-text">共{{ commentData.length }}条评论</div>
                <div class="tab-box flex-view" v-if="commentData.length > 0">
                  <span :class="sortIndex === 0? 'tab-select': ''" @click="sortCommentList('recent')">最新</span>
                  <div class="line"></div>
                  <span :class="sortIndex === 1? 'tab-select': ''" @click="sortCommentList('hot')">热门</span>
                </div>
              </div>
              <div class="comments-list">
                <div class="comment-item" v-for="item in commentData" :key="item.id">
                  <div class="flex-item flex-view">
                    <img :src="AvatarIcon" class="avator">
                    <div class="person">
                      <div class="name">{{ item.username }}</div>
                      <div class="time">{{ item.commentTime }}</div>
                    </div>
                    <div class="float-right">
                      <span @click="like(item.id)">推荐</span>
                      <span class="num">{{ item.likeCount }}</span>
                    </div>
                  </div>
                  <p class="comment-content">{{ item.content }}</p>
                </div>
                <div class="infinite-loading-container">
                  <div class="infinite-status-prompt" style="">
                    <div slot="no-results" class="no-results">
                      <div></div>
                      <p>没有更多了</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 热门推荐 - 移到评论区下方 -->
            <div class="recommend-horizontal" style="">
              <div class="title">热门推荐</div>
              <div class="things-horizontal">
                <div class="thing-item-horizontal" v-for="item in recommendData" :key="item.id" @click="handleDetail(item)">
                  <div class="img-view">
                    <img :src="item.cover" @error="useFallback"></div>
                  <div class="info-view">
                    <h3 class="thing-name">{{ item.title.substring(0, 12) }}</h3>
                    <span>
                      <span class="a-price-symbol"></span>
                      <span class="a-price">{{ item.price }}元/时</span>&nbsp;
                      <span class="a-price">{{ item.location }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- 时间选择器组件 -->
    <TimeSelector
      v-model:visible="showTimeSelector"
      :thing-id="thingId"
      @confirm="handleTimeSelection"
      @cancel="showTimeSelector = false"
    />

    <!-- 预约信息表单 -->
    <AppointmentForm
      v-model:visible="showAppointmentForm"
      :appointment-data="selectedAppointment"
      @confirm="handleAppointmentSubmit"
      @cancel="showAppointmentForm = false"
      ref="appointmentFormRef"
    />

    <!-- 预约成功提示弹窗 -->
    <div v-if="showSuccessModal" class="custom-modal-overlay" @click="showSuccessModal = false">
      <div class="custom-modal success-modal" @click.stop>
        <h2 class="modal-title">预约成功！</h2>
        <div class="modal-content">
          <div class="info-item">
            <span class="info-label">预约编号</span>
            <span class="info-value">{{ successModalData.appointmentNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预约日期</span>
            <span class="info-value">{{ successModalData.date }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预约时间</span>
            <span class="info-value">{{ successModalData.timeSlot }}</span>
          </div>
          <p class="modal-tip">请保存好您的预约编号，稍后可在"我的预约"中查看详情。</p>
        </div>
        <button class="modal-btn success-btn" @click="showSuccessModal = false">确定</button>
      </div>
    </div>

    <!-- 预约失败提示弹窗 -->
    <div v-if="showErrorModal" class="custom-modal-overlay" @click="showErrorModal = false">
      <div class="custom-modal error-modal" @click.stop>
        <h2 class="modal-title">预约失败</h2>
        <div class="modal-content">
          <p class="error-message">{{ errorMessage }}</p>
        </div>
        <button class="modal-btn error-btn" @click="showErrorModal = false">确定</button>
      </div>
    </div>

    <Footer/>
  </div>
</template>
<script setup>
import {message, Modal} from "ant-design-vue";
import TopBar from '/@/views/index/components/TopBar.vue'
import Footer from '/@/views/index/components/footer.vue'
import TimeSelector from '/@/views/index/components/TimeSelector.vue'
import AppointmentForm from '/@/views/index/components/AppointmentForm.vue'
import AddIcon from '/@/assets/images/add.svg';
import WantIcon from '/@/assets/images/want-read-hover.svg';
import RecommendIcon from '/@/assets/images/recommend-hover.svg';
import ShareIcon from '/@/assets/images/share-icon.svg';
import WeiboShareIcon from '/@/assets/images/wb-share.svg';
import AvatarIcon from '/@/assets/images/avatar.jpg';
import {
  detailApi,
  listApi as listThingList,
} from '/@/api/thing'
import {listThingCommentsApi, createApi as createCommentApi, likeApi} from '/@/api/comment'
import {wishApi, unWishApi, userWishListApi} from '/@/api/thingWish'
import {collectApi, unCollectApi, userCollectListApi} from '/@/api/thingCollect'
import {BASE_URL} from "/@/store/constants";
import {useRoute, useRouter} from "vue-router/dist/vue-router";
import {useUserStore} from "/@/store";
import {getFormatTime} from "/@/utils";
import {createApi} from "../../api/order";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore();


let thingId = ref('')
let detailData = ref({})
let tabUnderLeft = ref(6)
let tabData = ref(['详情', '评论'])
let selectTabIndex = ref(0)

let commentData = ref([])
let recommendData = ref([])
let sortIndex = ref(0)
let order = ref('recent') // 默认排序最新
let commentRef = ref()
let isWished = ref(false)
let isCollected = ref(false)
let wishRecordId = ref('')
let collectRecordId = ref('')
let wishLoading = ref(false)
let collectLoading = ref(false)
let showTimeSelector = ref(false)
let showAppointmentForm = ref(false)
let showSuccessModal = ref(false)
let showErrorModal = ref(false)
let successModalData = ref({
  appointmentNumber: '',
  date: '',
  timeSlot: ''
})
let errorMessage = ref('')
let selectedAppointment = ref({
  date: '',
  timeSlot: '',
  slotId: '',
  thingId: ''
})
let appointmentFormRef = ref(null)

onMounted(()=>{
  thingId.value = route.query.id.trim()
  getThingDetail()
  getRecommendThing()
  getCommentList()
  syncUserMarks()
})

const selectTab =(index)=> {
  selectTabIndex.value = index
  tabUnderLeft.value = 6 + 54 * index
}

const getThingDetail =()=> {
  detailApi({id: thingId.value}).then(res => {
    if (!res || !res.data) {
      message.error('暂无详情数据')
      return
    }
    detailData.value = res.data
    if (detailData.value.cover) {
      detailData.value.cover = BASE_URL + '/api/staticfiles/image/' + detailData.value.cover
    } else {
      detailData.value.cover = AvatarIcon
    }
    syncUserMarks()
  }).catch(err => {
    message.error('获取详情失败')
  })
}
const syncUserMarks = () => {
  const userId = userStore.user_id
  if (!userId) return
  userWishListApi({ userId }).then(res => {
    const found = res.data.find((item) => String(item.thing_id) === String(thingId.value))
    isWished.value = !!found
    wishRecordId.value = found ? found.id : ''
  }).catch(() => {})
  userCollectListApi({ userId }).then(res => {
    const found = res.data.find((item) => String(item.thing_id) === String(thingId.value))
    isCollected.value = !!found
    collectRecordId.value = found ? found.id : ''
  }).catch(() => {})
}

const addToWish =()=> {
  let userId = userStore.user_id
  if (userId) {
    if (wishLoading.value) return
    wishLoading.value = true
    if (isWished.value) {
      unWishApi({ id: wishRecordId.value, thingId: thingId.value, userId: userId }).then(() => {
        message.success('已取消心愿')
        if (isWished.value) {
          detailData.value.wishCount = Math.max(0, Number(detailData.value.wishCount || 0) - 1)
        }
        isWished.value = false
        wishRecordId.value = ''
        syncUserMarks()
        wishLoading.value = false
      }).catch(() => {
        message.error('取消失败')
        wishLoading.value = false
      })
    } else {
      wishApi({thingId: thingId.value, userId: userId}).then(res => {
        const msg = res && res.msg ? res.msg : '已加入心愿'
        const already = msg.indexOf('已') !== -1 && msg.indexOf('过') !== -1
        message.success(msg)
        if (!already && !isWished.value) {
          detailData.value.wishCount = Number(detailData.value.wishCount || 0) + 1
        }
        isWished.value = true
        syncUserMarks()
        wishLoading.value = false
      }).catch(() => {
        message.error('操作失败')
        wishLoading.value = false
      })
    }
  } else {    message.warn("请先登录")
  }
}
const collect =()=> {
  let userId = userStore.user_id
  if (userId) {
    if (collectLoading.value) return
    collectLoading.value = true
    if (isCollected.value) {
      unCollectApi({ id: collectRecordId.value, thingId: thingId.value, userId: userId }).then(() => {
        message.success('已取消收藏')
        if (isCollected.value) {
          detailData.value.collectCount = Math.max(0, Number(detailData.value.collectCount || 0) - 1)
        }
        isCollected.value = false
        collectRecordId.value = ''
        syncUserMarks()
        collectLoading.value = false
      }).catch(() => {
        message.error('取消失败')
        collectLoading.value = false
      })
    } else {
      collectApi({thingId: thingId.value, userId: userId}).then(res => {
        const msg = res && res.msg ? res.msg : '已收藏'
        const already = msg.indexOf('已') !== -1 && msg.indexOf('过') !== -1
        message.success(msg)
        if (!already && !isCollected.value) {
          detailData.value.collectCount = Number(detailData.value.collectCount || 0) + 1
        }
        isCollected.value = true
        syncUserMarks()
        collectLoading.value = false
      }).catch(() => {
        message.error('操作失败')
        collectLoading.value = false
      })
    }
  } else {    message.warn("请先登录")
  }
}
const share =()=> {
  let content = '分享一个非常好玩的网站 ' + window.location.href
  let shareHref = 'http://service.weibo.com/share/share.php?title=' + content
  window.open(shareHref)
}
const handleOrder =(detailData)=> {
  console.log(detailData)
  const userId = userStore.user_id

  if(userId){
    // 显示时间选择器
    showTimeSelector.value = true
  }else{
    message.warn("请先登录")
  }
}

// 处理时间选择
const handleTimeSelection = (selection) => {
  // 保存选择的时间信息
  selectedAppointment.value = {
    date: selection.date,
    timeSlot: `${selection.slot.startTime} - ${selection.slot.endTime}`,
    slotId: selection.slot.slotId,
    thingId: thingId.value
  }
  
  // 关闭时间选择器,打开预约表单
  showTimeSelector.value = false
  showAppointmentForm.value = true
}

// 处理预约提交
const handleAppointmentSubmit = async (formData) => {
  const userId = userStore.user_id
  
  if (!userId) {
    message.warn('请先登录')
    router.push({ name: 'login' })
    return
  }

  // 设置表单为提交中状态
  if (appointmentFormRef.value) {
    appointmentFormRef.value.setSubmitting(true)
  }
  
  try {
    const { createAppointment } = await import('/@/api/appointment')
    
    const requestData = {
      thingId: selectedAppointment.value.thingId,
      appointmentDate: selectedAppointment.value.date,
      slotId: selectedAppointment.value.slotId,
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      receiverAddress: formData.receiverAddress,
      remark: formData.remark || ''
    }
    
    const res = await createAppointment(requestData)
    
    if (res.code === 200) {
      // 关闭表单
      showAppointmentForm.value = false
      
      // 显示自定义成功提示
      showSuccessModal.value = true
      successModalData.value = {
        appointmentNumber: res.data.appointmentNumber,
        date: selectedAppointment.value.date,
        timeSlot: selectedAppointment.value.timeSlot
      }
      
      // 可选：刷新页面或跳转到我的预约页面
      // router.push({ name: 'myAppointments' })
    } else {
      showErrorModal.value = true
      errorMessage.value = res.msg || '预约失败，请稍后重试'
    }
  } catch (err) {
    console.error('预约失败:', err)
    
    let errorMsg = '预约失败，请稍后重试'
    
    if (err.response && err.response.data) {
      errorMsg = err.response.data.msg || err.response.data.message || errorMsg
    } else if (err.msg) {
      errorMsg = err.msg
    } else if (err.message) {
      errorMsg = err.message
    }
    
    showErrorModal.value = true
    errorMessage.value = errorMsg
  } finally {
    // 恢复表单状态
    if (appointmentFormRef.value) {
      appointmentFormRef.value.setSubmitting(false)
    }
  }
}
const getRecommendThing =()=> {
  listThingList({sort: 'recommend'}).then(res => {
    res.data.forEach((item, index) => {
      if (item.cover) {
        item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover
      }
    })
    console.log(res)
    recommendData.value = res.data.slice(0, 4)
  }).catch(err => {
    console.log(err)
  })
}
const handleDetail =(item)=> {
  const text = router.resolve({name: 'detail', query: {id: item.id}})
  window.open(text.href, '_blank')
}

const useFallback = (event) => {
  event.target.src = AvatarIcon
}
const sendComment =()=> {
  console.log(commentRef.value)
  let text = commentRef.value.value.trim()
  console.log(text)
  if (text.length <= 0) {
    return
  }
  let userId = userStore.user_id
  if (userId) {
    const commentContent = text
    createCommentApi({content: commentContent, thingId: thingId.value, userId: userId}).then(res => {
      console.log('评论提交响应:', res)
      message.success('评论发表成功')
      commentRef.value.value = ''
      
      // 直接在前端添加新评论到列表顶部
      const newComment = {
        id: Date.now(), // 临时ID
        content: commentContent,
        username: userStore.username || '当前用户',
        commentTime: getFormatTime(new Date().getTime(), true),
        likeCount: 0,
        userId: userId,
        thingId: thingId.value
      }
      
      // 如果是"最新"排序，添加到开头；如果是"热门"排序，添加到末尾
      if (sortIndex.value === 0) {
        commentData.value = [newComment, ...commentData.value]
      } else {
        commentData.value = [...commentData.value, newComment]
      }
      
      // 后台尝试刷新（如果成功会替换临时数据）
      setTimeout(() => {
        getCommentList()
      }, 3000)
    }).catch(err => {
      console.log('评论提交错误:', err)
      const errorMsg = err.msg || err.message || '评论发表失败，请稍后重试'
      message.error(errorMsg)
    })
  } else {    
    message.warn("请先登录")
    router.push({name: 'login'})
  }
}
const like =(commentId)=> {
  likeApi({id: commentId}).then(res => {
    getCommentList()
  }).catch(err => {
    console.log(err)
  })
}
const getCommentList =(retryCount = 0)=> {
  listThingCommentsApi({thingId: thingId.value, order: order.value}).then(res => {
    console.log('评论列表响应:', res)
    if (res && res.data) {
      res.data.forEach(item => {
        item.commentTime = getFormatTime(item.commentTime, true)
      })
      commentData.value = res.data
      console.log('评论数据已更新:', commentData.value)
    } else {
      console.warn('评论数据格式异常:', res)
      commentData.value = []
    }
  }).catch(err => {
    console.error('获取评论列表失败:', err)
    // 如果是系统繁忙错误，且重试次数少于1次，则自动重试一次
    if (err.code === 400 && retryCount < 1) {
      console.log(`将在3000ms后重试...`)
      setTimeout(() => {
        getCommentList(retryCount + 1)
      }, 3000)
    } else {
      // 重试失败，保持当前评论列表不变
      console.log('获取评论列表失败，保持当前列表')
    }
  })
}
const sortCommentList =(sortType)=> {
  if (sortType === 'recent') {
    sortIndex.value = 0
  } else {
    sortIndex.value = 1
  }
  order.value = sortType
  getCommentList()
}

</script>
<style scoped lang="less">

@import '/@/styles/theme.less';

.detail {
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #E0F2F1 100%);
  min-height: 100vh;
  padding-top: 0;
  position: relative;
}

.hide {
  display: none;
}

.detail-content {
  display: flex;
  flex-direction: column;
  width: 1200px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.hidden-lg {
  display: none !important;
}

.thing-infos-view {
  display: flex;
  margin: 89px 0 40px;
  overflow: hidden;

  .thing-infos {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: flex;
  }

  .mobile-share-box {
    height: 38px;
    background: transparent;
    padding: 0 16px;
    margin: 12px 0;
    font-size: 0;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    .state {
      width: 64px;
      height: 24px;
      line-height: 24px;
      background: rgba(70, 132, 226, .1);
      border-radius: 2px;
      font-weight: 500;
      font-size: 12px;
      color: @secondary-color;
      text-align: center;
    }

    .share-img {
      background: #fff;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      text-align: center;

      img {
        position: relative;
        top: 4px;
        width: 24px;
      }
    }
  }

  .thing-img-box {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 235px;
    flex: 0 0 235px;
    margin: 0 40px 0 0;

    img {
      width: 220px;
      height: 200px;
      display: block;
      background-size: cover;
      object-fit: cover;
    }
  }

  .thing-info-box {
    text-align: left;
    padding: 0;
    margin: 0;
  }

  .thing-state {
    height: 26px;
    line-height: 26px;

    .state {
      font-weight: 500;
      color: #2E7D32;
      background: #E8F5E9;
      border-radius: 6px;
      padding: 5px 8px;
      margin-right: 16px;
    }

    span {
      font-size: 14px;
      color: @text-primary;
    }
  }

  .thing-name {
    line-height: 32px;
    margin: 16px 0;
    color: #0F1111!important;
    font-size: 15px!important;
    font-weight: 400!important;
    font-style: normal!important;
    text-transform: none!important;
    text-decoration: none!important;
  }

  .translators, .authors {
    line-height: 18px;
    font-size: 14px;
    margin: 8px 0;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;

    .name {
      color: #315c9e;
      white-space: normal;
    }
  }

  .tags {
    position: absolute;
    bottom: 20px;
    margin-top: 16px;

    .category-box {
      color: @text-primary;
      font-size: 14px;

      .title {
        color: #787878;
      }
    }
  }

  .thing-counts {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 235px;
    flex: 0 0 235px;
    margin-left: 20px;
  }

  .pointer {
    cursor: pointer;
  }

  .count-item {
    height: 64px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
  }

  .count-img {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 32px;
    flex: 0 0 32px;
    margin-right: 24px;
    font-size: 0;

    img {
      width: 100%;
      display: block;
    }
  }

  .count-box {
    position: relative;
    border-bottom: 1px solid @border-subtle;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 100%;
  }

  .count-text-box {
    font-size: 0;

    .count-title {
      color: @text-primary;
      font-weight: 600;
      font-size: 16px;
      line-height: 18px;
      display: block;
      height: 18px;
    }
  }

  .count-num-box {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: @text-primary;
  }
}

.buy-btn {
  cursor: pointer;
  display: block;
  background: @secondary-color;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  width: 110px;
  outline: none;
  border: none;
  margin-top: 18px;
}

.buy-btn img {
  width: 12px;
  margin-right: 2px;
  vertical-align: middle;
}

.buy-btn span {
  vertical-align: middle;
}

.buy-way {
  overflow: hidden;

  .title {
    font-weight: 600;
    font-size: 18px;
    height: 26px;
    line-height: 26px;
    color: @text-primary;
    margin-bottom: 12px;
  }
}

.thing-content-view {
  margin-top: 40px;
  padding-bottom: 50px;
  display: block !important;
  max-width: 1200px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.main-content {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;

  .text {
    color: #484848;
    font-size: 16px;
    line-height: 26px;
    padding-left: 12px;
    margin: 11px 0;
    white-space: pre-wrap;
  }
}

.main-tab {
  border-bottom: 1px solid #E0F2F1;
}

.order-view {
  position: relative;
  color: #6c6c6c;
  font-size: 14px;
  line-height: 40px;

  .title {
    margin-right: 8px;
  }

  .tab {
    margin-right: 20px;
    cursor: pointer;
    color: #5f77a6;
    font-size: 16px;
    cursor: pointer;
  }

  .tab-select {
    color: @text-primary;
    font-weight: 600;
  }

  .tab-underline {
    position: absolute;
    bottom: 0;
    left: 84px;
    width: 16px;
    height: 4px;
    background: @secondary-color;
    -webkit-transition: left .3s;
    transition: left .3s;
  }
}

.recommend {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 235px;
  flex: 0 0 235px;
  margin-left: 0;

  .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 26px;
    color: @text-primary;
    margin-bottom: 12px;
  }

  .things {
    border-top: 1px solid #E0F2F1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 16px;

    .thing-item {
      width: 100%;
      position: relative;
      flex: 1;
      margin-right: 20px;
      height: fit-content;
      overflow: hidden;
      margin-top: 0;
      margin-bottom: 0;
      padding-bottom: 24px;
      border-bottom: 1px solid #F1F8E9;
      cursor: pointer;
      transition: all 0.3s ease;

      .img-view {
        //background: #f3f3f3;
        //text-align: center;
        height: 140px;
        width: 100%;
        //border: 1px #f3f3f3 solid;

        img {
          height: 100%;
          width: 100%;
          overflow: hidden;
          margin: 0 auto;
          background-size: contain;
          object-fit: cover;
        }
      }

      .info-view {
        //background: rgba(10, 12, 18, 0.7);
        overflow: hidden;
        padding: 0 16px;
        .thing-name {
          line-height: 32px;
          margin-top: 12px;
          color: #0F1111!important;
          font-size: 15px!important;
          font-weight: 400!important;
          font-style: normal!important;
          text-transform: none!important;
          text-decoration: none!important;
        }

        .price {
          color: #ff7b31;
          font-size: 20px;
          line-height: 20px;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .translators {
          color: #6f6f6f;
          font-size: 12px;
          line-height: 14px;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

  }
}

/* 横向推荐样式 */
.recommend-horizontal {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #E0F2F1;

  .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 26px;
    color: #2E7D32;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 12px;
  }

  .title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #66BB6A, #4DB6AC);
    border-radius: 2px;
  }

  .things-horizontal {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .thing-item-horizontal {
    background: #ffffff;
    border: 1px solid #F1F8E9;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(77, 182, 172, 0.06);

    &:hover {
      transform: translateY(-4px);
      border-color: #E0F2F1;
      box-shadow: 0 8px 20px rgba(77, 182, 172, 0.15);
    }

    .img-view {
      height: 150px;
      width: 100%;
      overflow: hidden;
      background: #F1F8E9;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }

    &:hover .img-view img {
      transform: scale(1.05);
    }

    .info-view {
      padding: 12px;

      .thing-name {
        line-height: 1.4;
        margin: 0 0 8px 0;
        color: #1f2937 !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .a-price {
        color: #66BB6A !important;
        font-size: 14px !important;
        font-weight: 600 !important;
      }

      .a-price-symbol {
        color: #66BB6A;
      }
    }
  }
}

.flex-view {
  display: flex;
}

.thing-comment {
  .title {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    height: 22px;
    color: @text-primary;
    margin: 24px 0 12px;
  }

  .publish {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .mine-img {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 40px;
      flex: 0 0 40px;
      margin-right: 12px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }

    .content-input {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      background: #ffffff;
      border: 1px solid #E0F2F1;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      color: #1f2937;
      padding: 5px 12px;
      white-space: nowrap;
      outline: none;
      border: 0px;
      transition: all 0.2s ease;
    }

    .content-input:hover {
      border-color: #80CBC4;
    }

    .content-input:focus {
      outline: none;
      border: 1px solid #4DB6AC;
      box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.1);
    }

    .send-btn {
      margin-left: 10px;
      background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
      border-radius: 4px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      outline: none;
      border: 0px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25);
    }

    .send-btn:hover {
      background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
      box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35);
      transform: translateY(-2px);
    }
  }

  .tab-view {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 24px 0;

    .count-text {
      color: #484848;
      float: left;
    }

    .tab-box {
      color: #5f77a6;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      .tab-select {
        color: #2E7D32;
        background: #E8F5E9;
        padding: 2px 8px;
        border-radius: 6px;
      }

      span {
        cursor: pointer;
      }
    }

    .line {
      width: 1px;
      height: 12px;
      margin: 0 12px;
      background: #E0F2F1;
    }
  }
}


.comments-list {
  .comment-item {
    .flex-item {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding-top: 16px;

      .avator {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 40px;
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        margin-right: 12px;
        border-radius: 50%;
        cursor: pointer;
      }

      .person {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .name {
        color: @text-primary;
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        height: 22px;
        cursor: pointer;
      }

      .time {
        color: #5f77a6;
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        margin-top: 2px;
      }

      .float-right {
        color: #4DB6AC;
        font-size: 14px;
        float: right;

        span {
          margin-left: 19px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        span:hover {
          color: #66BB6A;
        }

        .num {
          color: @text-primary;
          margin-left: 6px;
          cursor: auto;
        }
      }
    }
  }
}

.comment-content {
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
  line-height: 22px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #E0F2F1;
  margin-left: 52px;
  overflow: hidden;
  word-break: break-word;
}

.infinite-loading-container {
  clear: both;
  text-align: center;
}

.a-price-symbol {
  top: -0.5em;
  font-size: 12px;
}
.a-price {
  color: #0F1111;
  font-size:14px;
}

.detail-content {
  width: min(1200px, 92vw);
  margin: 32px auto 80px;
}

.thing-infos-view {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #E0F2F1;
  border-radius: @radius-lg;
  padding: @spacing-lg;
  box-shadow: 0 8px 24px rgba(77, 182, 172, 0.12);
  backdrop-filter: blur(10px);
}

.thing-img-box {
  background: #F1F8E9;
  border: 1px solid #E0F2F1;
  border-radius: @radius-lg;
  overflow: hidden;
}

.thing-infos {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 860px) {
  .thing-infos {
    grid-template-columns: 1fr;
  }
}

.thing-img-box img {
  border-radius: @radius-lg;
  box-shadow: @shadow-md;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.thing-name {
  color: #1f2937 !important;
  font-family: @font-family-display;
  font-size: 24px !important;
  font-weight: @font-weight-semibold !important;
}

.translators .name {
  color: #6b7280;
}

.a-price {
  color: #66BB6A !important;
  font-weight: 600;
}

.buy-btn {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  color: #ffffff;
  border-radius: @radius-pill;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.3);
  height: 40px;
  line-height: 40px;
  width: 140px;
  transition: all 0.3s ease;
  font-weight: 600;
}

.buy-btn:hover {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.4);
  transform: translateY(-2px);
}

.thing-counts .count-item {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #E0F2F1;
  border-radius: @radius-lg;
  padding: 8px 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.thing-counts .count-item:hover {
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.15);
  transform: translateY(-2px);
}

.thing-counts .count-item.active {
  border-color: #4DB6AC;
  box-shadow: 0 8px 20px rgba(77, 182, 172, 0.25);
  background: #E8F5E9;
}

.main-content,
.recommend {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #E0F2F1;
  border-radius: @radius-lg;
  padding: @spacing-lg;
  box-shadow: 0 8px 24px rgba(77, 182, 172, 0.12);
  backdrop-filter: blur(10px);
}

.order-view .tab {
  color: #6b7280;
  transition: all 0.2s ease;
}

.order-view .tab:hover {
  color: #4DB6AC;
}

.order-view .tab-select {
  color: #4DB6AC;
  font-weight: 600;
}

.order-view .tab-underline {
  height: 3px;
  background: linear-gradient(90deg, #66BB6A, #4DB6AC);
  border-radius: 2px;
}

.main-content .text,
.comment-content,
.tab-view .count-text,
.comments-list .time {
  color: #6b7280;
}

.publish .content-input {
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #E0F2F1;
  border-radius: @radius-pill;
  transition: all 0.2s ease;
}

.publish .content-input:hover {
  border-color: #80CBC4;
}

.publish .content-input:focus {
  outline: none;
  border-color: #4DB6AC;
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.1);
}

/* 横向推荐样式 */
.recommend-horizontal {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #E0F2F1;
}

.recommend-horizontal .title {
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: #2E7D32;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 12px;
}

.recommend-horizontal .title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #66BB6A, #4DB6AC);
  border-radius: 2px;
}

.recommend-horizontal .things-horizontal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.recommend-horizontal .thing-item-horizontal {
  background: #ffffff;
  border: 1px solid #F1F8E9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.06);
}

.recommend-horizontal .thing-item-horizontal:hover {
  transform: translateY(-4px);
  border-color: #E0F2F1;
  box-shadow: 0 8px 20px rgba(77, 182, 172, 0.15);
}

.recommend-horizontal .thing-item-horizontal:hover .img-view img {
  transform: scale(1.05);
}

.recommend-horizontal .thing-item-horizontal .img-view {
  height: 150px;
  width: 100%;
  overflow: hidden;
  background: #F1F8E9;
  position: relative;
}

.recommend-horizontal .thing-item-horizontal .img-view img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.recommend-horizontal .thing-item-horizontal .info-view {
  padding: 12px;
}

.recommend-horizontal .thing-item-horizontal .info-view .thing-name {
  line-height: 1.4;
  margin: 0 0 8px 0;
  color: #1f2937 !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-horizontal .thing-item-horizontal .info-view .a-price {
  color: #66BB6A !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}

.recommend-horizontal .thing-item-horizontal .info-view .a-price-symbol {
  color: #66BB6A;
}
</style>







/* 自定义提示弹窗样式 */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.custom-modal {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 32px 32px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.custom-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #66BB6A 0%, #FFA726 50%, #4DB6AC 100%);
}

.success-modal::before {
  background: linear-gradient(90deg, #66BB6A 0%, #4DB6AC 100%);
}

.error-modal::before {
  background: linear-gradient(90deg, #FF7043 0%, #F4511E 100%);
}

.modal-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 3;
  stroke: #66BB6A;
  stroke-miterlimit: 10;
  animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 3;
  stroke-miterlimit: 10;
  stroke: #66BB6A;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: #66BB6A;
  stroke-width: 3;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #E8F5E9;
  }
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 3;
  stroke: #FF7043;
  stroke-miterlimit: 10;
  animation: fill-error 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
}

.error-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 3;
  stroke-miterlimit: 10;
  stroke: #FF7043;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.error-cross {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: #FF7043;
  stroke-width: 3;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes fill-error {
  100% {
    box-shadow: inset 0px 0px 0px 30px #FFEBEE;
  }
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #2E7D32;
  text-align: center;
  margin: 0 0 24px 0;
  letter-spacing: 0.5px;
}

.error-modal .modal-title {
  color: #F4511E;
}

.modal-content {
  margin-bottom: 28px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, #F1F8E9 0%, #FFF9E6 100%);
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.15);
}

.info-label {
  font-size: 14px;
  color: #2E7D32;
  font-weight: 600;
}

.info-value {
  font-size: 15px;
  color: #374151;
  font-weight: 600;
}

.modal-tip {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(255, 249, 230, 0.6);
  border-left: 4px solid #FFA726;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0;
}

.error-message {
  text-align: center;
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
  padding: 16px;
  background: #FFF3E0;
  border-radius: 12px;
  margin: 0;
}

.modal-btn {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.modal-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.modal-btn:hover::before {
  width: 300px;
  height: 300px;
}

.success-btn {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25);
}

.success-btn:hover {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35);
  transform: translateY(-2px);
}

.success-btn:active {
  transform: translateY(0);
}

.error-btn {
  background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
  box-shadow: 0 4px 12px rgba(244, 81, 30, 0.25);
}

.error-btn:hover {
  background: linear-gradient(135deg, #F4511E 0%, #E64A19 100%);
  box-shadow: 0 6px 16px rgba(244, 81, 30, 0.35);
  transform: translateY(-2px);
}

.error-btn:active {
  transform: translateY(0);
}


<style lang="less">
/* 全局弹窗样式 - 不使用 scoped 以确保样式正确应用 */
.custom-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(4px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 99999 !important;
  animation: fadeIn 0.3s ease !important;
}

.custom-modal {
  background: #ffffff !important;
  border-radius: 20px !important;
  padding: 24px 28px 28px !important;
  max-width: 460px !important;
  width: 90% !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.custom-modal::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 6px !important;
  background: linear-gradient(90deg, #66BB6A 0%, #FFA726 50%, #4DB6AC 100%) !important;
}

.success-modal::before {
  background: linear-gradient(90deg, #66BB6A 0%, #4DB6AC 100%) !important;
}

.error-modal::before {
  background: linear-gradient(90deg, #FF7043 0%, #F4511E 100%) !important;
}

.modal-icon {
  display: flex !important;
  justify-content: center !important;
  margin-bottom: 24px !important;
}

.modal-title {
  font-size: 20px !important;
  font-weight: 700 !important;
  color: #2E7D32 !important;
  text-align: center !important;
  margin: 0 0 20px 0 !important;
  letter-spacing: 0.5px !important;
}

.error-modal .modal-title {
  color: #F4511E !important;
}

.modal-content {
  margin-bottom: 24px !important;
}

.info-item {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 12px 16px !important;
  background: linear-gradient(135deg, #F1F8E9 0%, #FFF9E6 100%) !important;
  border-radius: 10px !important;
  margin-bottom: 10px !important;
  transition: all 0.3s ease !important;
}

.info-label {
  font-size: 14px !important;
  color: #2E7D32 !important;
  font-weight: 600 !important;
}

.info-value {
  font-size: 15px !important;
  color: #374151 !important;
  font-weight: 600 !important;
}

.modal-tip {
  margin-top: 12px !important;
  padding: 10px 14px !important;
  background: rgba(255, 249, 230, 0.6) !important;
  border-left: 4px solid #FFA726 !important;
  border-radius: 8px !important;
  font-size: 12px !important;
  color: #6b7280 !important;
  line-height: 1.5 !important;
  margin-bottom: 0 !important;
}

.error-message {
  text-align: center !important;
  font-size: 15px !important;
  color: #6b7280 !important;
  line-height: 1.6 !important;
  padding: 16px !important;
  background: #FFF3E0 !important;
  border-radius: 12px !important;
  margin: 0 !important;
}

.modal-btn {
  width: 100% !important;
  height: 44px !important;
  border: none !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  color: #ffffff !important;
  position: relative !important;
  overflow: hidden !important;
}

.success-btn {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25) !important;
}

.success-btn:hover {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%) !important;
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35) !important;
  transform: translateY(-2px) !important;
}

.error-btn {
  background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%) !important;
  box-shadow: 0 4px 12px rgba(244, 81, 30, 0.25) !important;
}

.error-btn:hover {
  background: linear-gradient(135deg, #F4511E 0%, #E64A19 100%) !important;
  box-shadow: 0 6px 16px rgba(244, 81, 30, 0.35) !important;
  transform: translateY(-2px) !important;
}
</style>

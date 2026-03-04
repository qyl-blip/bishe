<template>
  <div class="mine-infos-view page-surface">
    <div class="info-box flex-view">
      <img :src="userAvatar" class="avatar-img" />
      <div class="name-box">
        <h2 class="nick">{{ userStore.user_name }}</h2>
        <div class="age">
          <span>活跃1天</span>
          <span class="give-point"></span>
        </div>
      </div>
    </div>
    <div class="counts-view">
      <div class="counts flex-view">
        <div class="fans-box flex-item" @click="clickMenu('collectThingView')">
          <div class="text">收藏</div>
          <div class="num">{{ collectCount }}</div>
        </div>
        <div class="split-line"> </div>
        <div class="follow-box flex-item" @click="clickMenu('wishThingView')">
          <div class="text">心愿单</div>
          <div class="num">{{ wishCount }}</div>
        </div>
        <!--        <div class="split-line">-->
        <!--        </div>-->
        <!--        <div class="points-box flex-item">-->
        <!--          <div class="text">积分</div>-->
        <!--          <div class="num">0</div>-->
        <!--        </div>-->
      </div>
    </div>
    <div class="setting-box">
      <div class="title">个人设置</div>
      <div class="list">
        <div class="mine-item flex-view" @click="clickMenu('jiajiaoEditView')">
          <img :src="SettingIconImage" alt="编辑资料" />
          <span>家政资料</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('orderView')">
          <img :src="SettingIconImage" alt="我的预约" />
          <span>我的预约</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('userInfoEditView')">
          <img :src="SettingIconImage" alt="编辑资料" />
          <span>编辑资料</span>
        </div>
        <div class="mine-item flex-view" @click="clickMenu('securityView')">
          <img :src="SafeIconImage" alt="账号安全" />
          <span>账号安全</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AvatarImg from '/@/assets/images/avatar.jpg';
  import MyOrderImg from '/@/assets/images/order-icon.svg';
  import CommentIconImg from '/@/assets/images/order-thing-icon.svg';
  import AddressIconImage from '/@/assets/images/order-address-icon.svg';
  import PointIconImage from '/@/assets/images/order-point-icon.svg';
  import SettingIconImage from '/@/assets/images/setting-icon.svg';
  import SafeIconImage from '/@/assets/images/setting-safe-icon.svg';

  import { userCollectListApi } from '/@/api/thingCollect';
  import { userWishListApi } from '/@/api/thingWish';
  import { detailApi } from '/@/api/user';
  import { useUserStore } from '/@/store';
  import { BASE_URL } from '/@/store/constants';
  const userStore = useUserStore();
  const router = useRouter();

  let collectCount = ref(0);
  let wishCount = ref(0);
  const userAvatar = ref(AvatarImg);

  onMounted(() => {
    getCollectThingList();
    getWishThingList();
    getUserAvatar();
  });
  
  const getUserAvatar = () => {
    if (!userStore.user_id) return;
    detailApi({ userId: userStore.user_id }).then(res => {
      if (res.data && res.data.avatar) {
        userAvatar.value = BASE_URL + '/api/staticfiles/avatar/' + res.data.avatar;
      }
    }).catch(err => {
      console.log(err);
    });
  };

  const clickMenu = (name) => {
    router.push({ name: name });
  };
  const getCollectThingList = () => {
    let userId = userStore.user_id;
    userCollectListApi({ userId: userId })
      .then((res) => {
        collectCount.value = res.data.length;
      })
      .catch((err) => {
        console.log(err.msg);
      });
  };

  const getWishThingList = () => {
    let userId = userStore.user_id;
    userWishListApi({ userId: userId })
      .then((res) => {
        wishCount.value = res.data.length;
      })
      .catch((err) => {
        console.log(err.msg);
      });
  };
</script>

<style scoped lang="less">
  @import '/@/styles/theme.less';
.flex-view {
    display: flex;
  }

  .mine-infos-view {
    width: 235px;
    margin-right: 20px;
    border: 1px solid @border-subtle;
    height: fit-content;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(102, 187, 106, 0.1);

    .info-box {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding: 16px 16px 0;
      overflow: hidden;
    }

    .avatar-img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
      border-radius: 50%;
      border: 2px solid rgba(102, 187, 106, 0.3);
      box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
    }

    .name-box {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      overflow: hidden;

      .nick {
        color: #1c2233;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        height: 24px;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
        overflow: hidden;
      }

      .age {
        font-size: 12px;
        color: rgba(28, 34, 51, 0.6);
        height: 16px;
        line-height: 16px;
        margin-top: 8px;
      }

      .give-point {
        color: #66BB6A;
        cursor: pointer;
        float: right;
      }
    }

    .counts-view {
      border: none;
      padding: 16px;
    }

    .counts {
      margin-top: 12px;
      text-align: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      .flex-item {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        cursor: pointer;
      }

      .text {
        height: 16px;
        line-height: 16px;
        color: rgba(28, 34, 51, 0.6);
      }

      .num {
        height: 18px;
        line-height: 18px;
        color: #1c2233;
        font-weight: 600;
        font-size: 14px;
        margin-top: 4px;
      }

      .split-line {
        width: 1px;
        height: 24px;
        background: #dae6f9;
      }
    }

    .intro-box {
      border-top: 1px solid @border-subtle;
      padding: 16px;

      .title {
        color: rgba(28, 34, 51, 0.6);
        font-size: 12px;
        line-height: 16px;
      }

      .intro-content {
        color: #1c2233;
        font-size: 14px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 8px 0;
      }
    }

    .create-box {
      cursor: pointer;
      border-top: 1px solid @border-subtle;
      padding: 16px;

      .title {
        position: relative;
        color: #1c2233;
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        height: 18px;
      }

      .counts {
        margin-top: 12px;
        text-align: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        .flex-item {
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .flex-item:hover {
          transform: translateY(-2px);
        }
        
        .flex-item:hover .num {
          color: #66BB6A;
        }

        .split-line {
          width: 1px;
          height: 24px;
          background: #dae6f9;
        }
      }
    }

    .order-box {
      border-top: 1px solid @border-subtle;
      padding: 16px;

      .title {
        color: #1c2233;
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        height: 18px;
        margin-bottom: 8px;
      }

      .list {
        padding-left: 16px;

        .mine-item {
          border-top: 1px dashed @border-subtle;
          cursor: pointer;
          height: 48px;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;

          img {
            width: 24px;
            margin-right: 8px;
            height: 24px;
          }

          span {
            color: #1c2233;
            font-size: 14px;
          }
        }

        .mine-item:first-child {
          border: none;
        }
      }
    }

    .setting-box {
      border-top: 1px solid @border-subtle;
      padding: 16px;

      .title {
        color: #1c2233;
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        height: 18px;
        margin-bottom: 8px;
      }

      .list {
        padding-left: 16px;
      }

      .mine-item {
        border-top: 1px dashed @border-subtle;
        cursor: pointer;
        height: 48px;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        transition: all 0.3s ease;
        border-radius: 8px;
        padding: 0 8px;
        margin: 4px 0;

        img {
          width: 24px;
          margin-right: 8px;
          height: 24px;
          filter: grayscale(100%);
          transition: all 0.3s ease;
        }

        span {
          color: #1c2233;
          font-size: 14px;
          transition: all 0.3s ease;
        }
      }
      
      .mine-item:hover {
        background: linear-gradient(135deg, rgba(102, 187, 106, 0.05) 0%, rgba(77, 182, 172, 0.05) 100%);
        border-color: rgba(102, 187, 106, 0.3);
        
        img {
          filter: grayscale(0%);
        }
        
        span {
          color: #66BB6A;
        }
      }

      .mine-item:first-child {
        border: none;
      }
    }
  }

// user-detail-polish
.content-list,
.list-content,
.data-list,
.order-list,
.comment-list,
.card-list {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 17, 25, 0.08);
  border-radius: @radius-lg;
  padding: @spacing-lg;
  box-shadow: 0 14px 30px rgba(20, 26, 42, 0.08);
}

.list-title,
.title,
.section-title {
  color: #1c2233;
  font-family: @font-family-display;
  letter-spacing: 0.4px;
}

.item,
.list-item,
.order-item,
.comment-item,
.card-item {
  background: #ffffff;
  border: 1px solid rgba(15, 17, 25, 0.08);
  border-radius: @radius-lg;
  padding: @spacing-md;
  margin-bottom: @spacing-md;
}
</style>





<template>
  <div class="footer-view page-surface">
    <div class="foot-link-box flex-view">
      <a href="/admin" class="foot-link" target="_blank">后台管理</a>
      <div class="link-split"></div>
      <a href="" class="foot-link" target="_blank">关于我们</a>
    </div>
    <div class="footer-infos">
      <span>
        <a style="color: rgb(174, 174, 174);">家政服务平台</a>
      </span>
      <span>&nbsp;&nbsp;提供专业的家政服务&nbsp;&nbsp;让生活更美好</span>
    </div>
    <div class="address">2024-2025 (c) 家政服务平台 All Rights Reserved</div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';
.flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.footer-view {
  max-width: 1108px;
  margin: 0 auto;
  padding: 8px 0 10px;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;

  .foot-link-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    overflow: hidden;
    margin: 8px auto 8px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;

    .foot-link {
      margin: 0 16px;
      color: @secondary-color;
    }

    a {
      background-color: transparent;
    }

    .link-split {
      height: 12px;
      width: 1px;
      background: @border-subtle;
    }
  }

  .footer-infos {
    text-align: center;
    color: @text-tertiary;
    font-size: 12px;
  }

  .address {
    text-align: center;
    margin-top: 6px;
    color: @text-tertiary;
    font-size: 12px;
  }
}
</style>

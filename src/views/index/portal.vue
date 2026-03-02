<template>
  <div class="portal page-surface">
    <TopBar />
    <Content />
    <Footer />
  </div>
</template>

<script>
  import TopBar from '/@/views/index/components/TopBar.vue'
  import Footer from '/@/views/index/components/footer.vue'
  import Content from '/@/views/index/components/content.vue'

  export default {
    components: {
      Footer,
      TopBar,
      Content
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.portal {
  padding-top: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #E0F2F1 100%);
}
</style>

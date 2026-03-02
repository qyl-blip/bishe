<template>
  <div class="search page-surface">
    <TopBar />
    <div class="search-content">
      <SearchContentView />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import TopBar from '/@/views/index/components/TopBar.vue'
import Footer from '/@/views/index/components/footer.vue'
import SearchContentView from '/@/views/index/components/search-content-view.vue'

</script>

<style scoped lang="less">

@import '/@/styles/theme.less';

.search {
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #E0F2F1 100%);
  min-height: 100vh;
  padding-top: 0;
}

.search-content {
  width: min(1200px, 92vw);
  margin: 32px auto 80px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid @border-subtle;
  border-radius: @radius-lg;
  padding: @spacing-lg;
  box-shadow: @shadow-md;
}
</style>






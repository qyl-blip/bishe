<template>
  <div class="page-surface">
    <div class="page-view page-view--error">
      <a-table
        size="middle"
        rowKey="id"
        :loading="data.loading"
        :columns="columns"
        :data-source="data.dataList"
        :pagination="{
          size: 'default',
          current: data.page,
          pageSize: data.pageSize,
          total: data.total,
          onChange: (current) => {
            data.page = current;
            getDataList();
          },
          showSizeChanger: false,
          showQuickJumper: false,
          hideOnSinglePage: false,
          showTotal: (total) => `共${total}条数据`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { listErrorLogListApi } from '/@/api/log';

const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
  },
  {
    title: '请求方式',
    dataIndex: 'method',
    key: 'method',
    align: 'center',
  },
  {
    title: '请求URL',
    dataIndex: 'url',
    key: 'url',
    align: 'center',
  },
  {
    title: '异常信息',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '操作IP',
    dataIndex: 'ip',
    key: 'ip',
    align: 'center',
  },
  {
    title: '操作时间',
    dataIndex: 'logTime',
    key: 'logTime',
    align: 'center',
  },
]);

const data = reactive({
  dataList: [],
  loading: false,
  keyword: '',
  selectedRowKeys: [] as any[],
  pageSize: 10,
  page: 1,
  total: 0,
});

onMounted(() => {
  getDataList();
});

const getDataList = () => {
  data.loading = true;
  listErrorLogListApi({
    keyword: data.keyword,
    page: data.page,
    pageSize: data.pageSize,
  })
    .then((res) => {
      data.loading = false;
      const rawList = res.data?.list ? res.data.list : res.data || [];
      const total = res.data?.total ?? rawList.length;
      const list = res.data?.list
        ? rawList
        : rawList.slice((data.page - 1) * data.pageSize, data.page * data.pageSize);
      list.forEach((item: any, index: any) => {
        item.index = (data.page - 1) * data.pageSize + index + 1;
      });
      data.dataList = list;
      data.total = total || 0;
    })
    .catch((err) => {
      data.loading = false;
      console.log(err);
    });
};
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.page-view {
  min-height: 100%;
  background: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  color: @text-primary;
}

:deep(.ant-table) {
  background: transparent;
  font-size: 14px;
}

:deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF9E6 100%) !important;
  color: #2E7D32 !important;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #C8E6C9 !important;
  padding: 16px 12px;
}

:deep(.ant-table-tbody > tr) {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.ant-table-tbody > tr:hover) {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%) !important;
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.1);
}

:deep(.ant-table-tbody > tr > td) {
  padding: 14px 12px;
  border-bottom: 1px solid #F1F8E9 !important;
  color: #374151;
  font-size: 14px;
}

:deep(.ant-table-tbody > tr:nth-child(even)) {
  background: rgba(248, 255, 248, 0.5);
}

:deep(.ant-tag) {
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 500;
  border: none;
}

:deep(.ant-pagination-item) {
  border-radius: 10px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
}

:deep(.ant-pagination-item:hover) {
  border-color: #FFA726;
  transform: translateY(-2px);
}

:deep(.ant-pagination-item-active) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  border-color: transparent;
}

:deep(.ant-pagination-item-active a) {
  color: #ffffff;
}

/* 页面切换动画 */
.page-surface {
  animation: pageSlide 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes pageSlide {
  0% {
    opacity: 0;
    transform: translateX(30px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* 修复分页文字显示 */
:deep(.ant-pagination) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

:deep(.ant-pagination-total-text) {
  margin-right: 8px;
  color: #2E7D32;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>


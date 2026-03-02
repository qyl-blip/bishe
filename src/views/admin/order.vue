<template>
  <div class="page-surface">
    <!-- 搜索区域 -->
    <div class="table-operations">
      <a-input-search
        addon-before="订单号"
        placeholder="请输入订单号"
        enter-button
        v-model:value="searchForm.orderNo"
        @search="handleSearch"
        style="max-width: 400px;"
      />
      <a-input-search
        addon-before="客户姓名"
        placeholder="请输入客户姓名"
        enter-button
        v-model:value="searchForm.userName"
        @search="handleSearch"
        style="max-width: 400px;"
      />
    </div>

    <!-- 表格区域 -->
    <div class="page-view">
      <a-table
        size="middle"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key === 'status'">
            <a-tag :color="text === '1' ? 'warning' : text === '2' ? 'success' : 'default'">
              {{ text === '1' ? '待处理' : text === '2' ? '已完成' : '已取消' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'operation'">
            <span class="action-space">
              <a class="operation-btn">详情</a>
              <a-popconfirm
                title="确定取消订单？"
                @confirm="confirmCancel(record)"
                ok-text="是"
                cancel-text="否"
              >
                <a class="operation-btn" v-if="record.status === '1'">取消</a>
              </a-popconfirm>
              <a-popconfirm
                title="确定删除订单？"
                @confirm="confirmDelete(record)"
                ok-text="是"
                cancel-text="否"
              >
                <a class="delete-btn">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { listApi, deleteApi, cancelApi } from '/@/api/order';

const searchForm = reactive({
  orderNo: '',
  userName: '',
});

const loading = ref(false);
const dataSource = ref([] as any[]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false,
  showQuickJumper: false,
  hideOnSinglePage: false,
  showTotal: (total: number) => `共${total}条数据`,
});

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 60,
    customRender: ({ index }: any) => index + 1 + (pagination.current - 1) * pagination.pageSize,
  },
  {
    title: '订单号',
    dataIndex: 'order_number',
    key: 'order_number',
  },
  {
    title: '客户姓名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '服务名称',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '服务人员',
    dataIndex: 'receiver_name',
    key: 'receiver_name',
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
    key: 'amount',
    customRender: ({ text }: any) => `￥${text}`,
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 180,
    align: 'center',
  },
];

onMounted(() => {
  getData();
});

const getData = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      orderNo: searchForm.orderNo,
      userName: searchForm.userName,
    };
    const res = await listApi(params);
    if (res) {
      const payload = res.data?.list ? res.data : { list: res.data || [], total: (res.data || []).length };
      dataSource.value = payload.list;
      pagination.total = payload.total || 0;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.current = 1;
  getData();
};

const handleReset = () => {
  searchForm.orderNo = '';
  searchForm.userName = '';
  handleSearch();
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  getData();
};

const confirmCancel = async (record: any) => {
  try {
    await cancelApi({ id: record.id });
    message.success('取消成功');
    getData();
  } catch (error) {
    message.error('取消失败');
  }
};

const confirmDelete = async (record: any) => {
  try {
    await deleteApi({ ids: [record.id] });
    message.success('删除成功');
    getData();
  } catch (error) {
    message.error('删除失败');
  }
};
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.search-view {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 17, 25, 0.08);
  border-radius: @radius-lg;
  padding: 16px 18px;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(20, 26, 42, 0.06);
}

.search-view :deep(.ant-form) {
  width: 100%;
}

.search-view :deep(.ant-form-item) {
  margin-bottom: 0;
  display: inline-flex;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.search-view :deep(.ant-form-item-row) {
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.search-view :deep(.ant-form-item-label > label) {
  color: #4b5563;
  font-weight: 600;
}

.search-view :deep(.ant-form-item-label) {
  flex: 0 0 76px;
  text-align: left;
}

.search-view :deep(.ant-form-item-control) {
  flex: 1 1 auto;
}

.search-view :deep(.ant-select-selection-placeholder) {
  color: #9aa4b2;
}

.search-view :deep(.ant-select-selection-item) {
  line-height: 32px;
}

.search-view :deep(.ant-form-inline) {
  width: 100%;
}

.search-view :deep(.ant-col) {
  display: flex;
}

.search-view :deep(.search-input) {
  width: 220px;
  min-width: 220px;
}

.search-view :deep(.ant-input-affix-wrapper) {
  width: 220px;
  min-width: 220px;
  box-sizing: border-box;
}

.search-view :deep(.ant-form-item-control-input),
.search-view :deep(.ant-form-item-control-input-content) {
  width: 220px;
}

.search-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.search-actions :deep(.ant-space) {
  gap: 8px;
  display: inline-flex;
  flex-direction: row;
}

.search-view :deep(.ant-col) {
  min-width: 0;
}

.search-view :deep(.ant-form-item-control) {
  min-width: 0;
}

// keep search row stable
.search-row {
  align-items: center;
}

.search-view :deep(.ant-input-affix-wrapper),
.search-view :deep(.ant-input),
.search-view :deep(.ant-select),
.search-view :deep(.ant-select-selector) {
  height: 42px !important;
  min-height: 42px !important;
  border-radius: 14px !important;
}

.search-view :deep(.ant-input-affix-wrapper),
.search-view :deep(.ant-select-selector),
.search-view :deep(.ant-input) {
  background: #ffffff !important;
  border: 1px solid #94a3b8 !important;
  color: #111827 !important;
  box-shadow: none !important;
  padding: 0 16px !important;
}

.search-view :deep(.ant-input-affix-wrapper .ant-input) {
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.search-view :deep(.ant-input),
.search-view :deep(.ant-select-selection-item),
.search-view :deep(.ant-select-selection-placeholder) {
  line-height: 40px !important;
}

.search-view :deep(.ant-select-single .ant-select-selector) {
  padding: 0 36px 0 16px !important;
  display: flex;
  align-items: center;
}

.search-view :deep(.ant-select .ant-select-arrow) {
  top: 50% !important;
  right: 12px !important;
  left: auto !important;
  transform: translateY(-50%);
}

.search-view :deep(.ant-input-affix-wrapper-focused),
.search-view :deep(.ant-input-affix-wrapper:focus),
.search-view :deep(.ant-input-affix-wrapper:focus-within),
.search-view :deep(.ant-input:focus),
.search-view :deep(.ant-input-focused) {
  box-shadow: 0 0 0 2px rgba(255, 167, 38, 0.1) !important;
  outline: none !important;
  border-color: #FFA726 !important;
}

.search-view :deep(.ant-select-focused .ant-select-selector) {
  border-color: #FFA726 !important;
  box-shadow: 0 0 0 2px rgba(255, 167, 38, 0.1) !important;
}

.search-view :deep(.ant-input::placeholder),
.search-view :deep(.ant-select-selection-placeholder) {
  color: #9aa4b2 !important;
}

.search-view :deep(.ant-btn) {
  height: 40px;
  padding: 0 24px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-view :deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
  border: none !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25);
}

.search-view :deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%) !important;
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35);
  transform: translateY(-2px);
}

.search-view :deep(.ant-btn-default) {
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  border: none;
  color: #E65100;
  box-shadow: 0 2px 8px rgba(230, 81, 0, 0.2);
}

.search-view :deep(.ant-btn-default:hover) {
  background: linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%) !important;
  color: #E65100 !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(230, 81, 0, 0.3);
  transform: translateY(-2px);
}

.search-view :deep(.ant-row) {
  row-gap: 12px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 1200px) {
  .search-view :deep(.ant-form-item) {
    width: 100%;
  }
}

// Custom column widths on large screens
@media (min-width: 1200px) {
  .search-view :deep(.ant-col) {
    flex: 0 0 auto;
    max-width: none;
  }
}

/* 表格样式 */
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
  transform: scale(1.01);
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

:deep(.ant-table-tbody > tr > td a) {
  font-weight: 500;
  margin: 0 6px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 6px 16px;
  border-radius: 8px;
  display: inline-block;
  text-decoration: none;
}

:deep(.ant-table-tbody > tr > td a.operation-btn) {
  color: #ffffff;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.25);
}

:deep(.ant-table-tbody > tr > td a.operation-btn:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.35);
  transform: translateY(-2px);
}

:deep(.ant-table-tbody > tr > td a.delete-btn) {
  color: #ffffff;
  background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
  box-shadow: 0 2px 8px rgba(244, 81, 30, 0.25);
}

:deep(.ant-table-tbody > tr > td a.delete-btn:hover) {
  background: linear-gradient(135deg, #F4511E 0%, #E64A19 100%);
  box-shadow: 0 4px 12px rgba(244, 81, 30, 0.35);
  transform: translateY(-2px);
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

.page-view {
  min-height: 100%;
  background: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* 滚动条样式 */
:deep(*::-webkit-scrollbar) {
  width: 8px !important;
  height: 8px !important;
}

:deep(*::-webkit-scrollbar-track) {
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 4px !important;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: linear-gradient(135deg, #66BB6A, #FFA726) !important;
  border-radius: 4px !important;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: linear-gradient(135deg, #5CB860, #FF9800) !important;
}
</style>

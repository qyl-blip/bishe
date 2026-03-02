<template>
  <div class="page-surface">
    <div class="page-view page-view--comment">
      <div class="table-operations">
        <a-space>
          <a-button type="primary" @click="handleAdd">模拟新增</a-button>
          <a-button @click="handleBatchDelete">批量删除</a-button>
        </a-space>
      </div>
      <a-table
        size="middle"
        rowKey="id"
        :loading="data.loading"
        :columns="columns"
        :data-source="data.list"
        :scroll="{ x: 'max-content' }"
        :row-selection="rowSelection"
        :pagination="{
          size: 'default',
          current: data.page,
          pageSize: data.pageSize,
          total: data.total,
          onChange: (current) => {
            data.page = current;
            getList();
          },
          showSizeChanger: false,
          showQuickJumper: false,
          hideOnSinglePage: false,
          showTotal: (total) => `共${total}条数据`,
        }"
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.key === 'operation'">
            <span class="action-space">
              <a-popconfirm title="确定删除?" ok-text="是" cancel-text="否" @confirm="confirmDelete(record)">
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
import { createApi, listApi, deleteApi } from '/@/api/comment';
import { BASE_URL } from '/@/store/constants';
import { getFormatTime } from '/@/utils';

const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
  },
  {
    title: '用户',
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },
  {
    title: '家政名称',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
  },
  {
    title: '评论内容',
    dataIndex: 'content',
    key: 'content',
    align: 'center',
  },
  {
    title: '评论时间',
    dataIndex: 'commentTime',
    key: 'commentTime',
    align: 'center',
    customRender: ({ text }) => getFormatTime(text, true),
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'operation',
    align: 'center',
    fixed: 'right',
    width: 140,
  },
]);

const data = reactive({
  list: [],
  loading: false,
  currentAdminUserName: '',
  keyword: '',
  selectedRowKeys: [] as any[],
  pageSize: 10,
  page: 1,
  total: 0,
});

const modal = reactive({
  visile: false,
  editFlag: false,
  title: '',
  form: {
    id: undefined,
    image: undefined,
    link: undefined,
  },
  rules: {
    link: [{ required: true, message: '请输入内容', trigger: 'change' }],
  },
});

onMounted(() => {
  getList();
});

const getList = () => {
  data.loading = true;
  listApi({
    keyword: data.keyword,
    page: data.page,
    pageSize: data.pageSize,
  })
    .then((res) => {
      data.loading = false;
      const payload = res.data?.list ? res.data : { list: res.data || [], total: (res.data || []).length };
      payload.list.forEach((item: any, index: any) => {
        item.index = (data.page - 1) * data.pageSize + index + 1;
        if (item.image) {
          item.image = BASE_URL + item.image;
        }
      });
      data.list = payload.list;
      data.total = payload.total || 0;
    })
    .catch((err) => {
      data.loading = false;
      console.log(err);
    });
};

const rowSelection = ref({
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    data.selectedRowKeys = selectedRowKeys;
  },
});

const handleAdd = () => {
  // 预留模拟新增
};

const confirmDelete = (record: any) => {
  deleteApi({ ids: record.id })
    .then(() => {
      getList();
    })
    .catch((err) => {
      message.error(err.msg || '操作失败');
    });
};

const handleBatchDelete = () => {
  if (data.selectedRowKeys.length <= 0) {
    message.warn('请勾选删除项');
    return;
  }
  deleteApi({ ids: data.selectedRowKeys.join(',') })
    .then(() => {
      message.success('删除成功');
      data.selectedRowKeys = [];
      getList();
    })
    .catch((err) => {
      message.error(err.msg || '操作失败');
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

.table-operations {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: none;
}

.table-operations :deep(.ant-space) {
  gap: 12px !important;
}

.table-operations :deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 500 !important;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25) !important;
  height: 40px !important;
  padding: 0 24px !important;
  font-size: 14px !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  color: #ffffff !important;
}

.table-operations :deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%) !important;
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35) !important;
  transform: translateY(-2px) !important;
  border: none !important;
}

.table-operations :deep(.ant-btn:not(.ant-btn-primary)) {
  border-radius: 12px !important;
  border: none !important;
  height: 40px !important;
  padding: 0 24px !important;
  font-size: 14px !important;
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%) !important;
  color: #E65100 !important;
  font-weight: 500 !important;
  box-shadow: 0 2px 8px rgba(230, 81, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.table-operations :deep(.ant-btn:not(.ant-btn-primary):hover) {
  background: linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%) !important;
  color: #E65100 !important;
  box-shadow: 0 4px 12px rgba(230, 81, 0, 0.3) !important;
  transform: translateY(-2px) !important;
  border: none !important;
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

:deep(.ant-table-tbody > tr:hover > td) {
  background: transparent !important;
  border-bottom: 1px solid #F1F8E9 !important;
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
  color: #ffffff;
  background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
  box-shadow: 0 2px 8px rgba(244, 81, 30, 0.25);
}

:deep(.ant-table-tbody > tr > td a:hover) {
  background: linear-gradient(135deg, #F4511E 0%, #E64A19 100%);
  box-shadow: 0 4px 12px rgba(244, 81, 30, 0.35);
  transform: translateY(-2px);
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
:deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background: rgba(255, 249, 230, 0.5) !important;
  border-bottom: 1px solid #F1F8E9 !important;
}

:deep(.ant-table-tbody > tr.ant-table-row-selected:hover > td) {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%) !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused),
:deep(.ant-input-number:focus),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: #FFA726 !important;
  box-shadow: 0 0 0 2px rgba(255, 167, 38, 0.1) !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #66BB6A !important;
  border-color: #66BB6A !important;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
:deep(.ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #66BB6A !important;
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



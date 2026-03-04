<template>
  <div class="page-surface">
    <div class="page-view">
      <div class="table-operations">
        <a-space>
          <a-button type="primary" @click="handleAdd">新增</a-button>
          <a-button @click="handleBatchDelete">批量删除</a-button>
        </a-space>
      </div>
      <a-table
        size="middle"
        rowKey="id"
        :loading="data.loading"
        :columns="columns"
        :data-source="data.list"
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
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key === 'imageUrl'">
            <img :src="text" class="ad-image" />
          </template>
          <template v-else-if="column.key === 'operation'">
            <span class="action-space">
              <a class="operation-btn" @click="handleEdit(record)">编辑</a>
              <a-popconfirm title="确定删除?" ok-text="是" cancel-text="否" @confirm="confirmDelete(record)">
                <a class="delete-btn">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal
      :visible="modal.visile"
      :forceRender="true"
      :title="modal.title"
      ok-text="确认"
      cancel-text="取消"
      width="520px"
      centered
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form ref="myform" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :model="modal.form" :rules="modal.rules">
        <a-form-item label="广告图">
          <a-upload-dragger
            name="file"
            accept="image/*"
            :multiple="false"
            :before-upload="beforeUpload"
          >
            <p class="ant-upload-text">点击或拖拽上传图片</p>
          </a-upload-dragger>
        </a-form-item>
        <a-form-item label="跳转链接" name="link">
          <a-input placeholder="请输入跳转链接" v-model:value="modal.form.link" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { FormInstance, message } from 'ant-design-vue';
import { createApi, listApi, updateApi, deleteApi } from '/@/api/ad';
import { BASE_URL } from '/@/store/constants';

const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
  },
  {
    title: '图片',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    align: 'center',
  },
  {
    title: '跳转链接',
    dataIndex: 'link',
    key: 'link',
    align: 'center',
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

const beforeUpload = (file: File) => {
  const fileName = new Date().getTime().toString() + '.' + file.type.substring(6);
  const copyFile = new File([file], fileName);
  modal.form.imageFile = copyFile;
  return false;
};

const data = reactive({
  list: [] as any[],
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
    id: undefined as any,
    image: undefined as any,
    imageFile: undefined as any,
    imageUrl: undefined as any,
    link: undefined as any,
  },
  rules: {
    link: [{ required: true, message: '请输入跳转链接', trigger: 'change' }],
  },
});

const myform = ref<FormInstance>();

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
      payload.list.forEach((item: any, index: number) => {
        item.index = (data.page - 1) * data.pageSize + index + 1;
        if (item.image) {
          item.imageUrl = BASE_URL + '/api/staticfiles/image/' + item.image;
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
  onChange: (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    data.selectedRowKeys = selectedRowKeys;
  },
});

const handleAdd = () => {
  resetModal();
  modal.visile = true;
  modal.editFlag = false;
  modal.title = '新增';
  for (const key in modal.form) {
    modal.form[key] = undefined as any;
  }
  modal.form.image = undefined;
};

const handleEdit = (record: any) => {
  resetModal();
  modal.visile = true;
  modal.editFlag = true;
  modal.title = '编辑';
  for (const key in modal.form) {
    modal.form[key] = undefined as any;
  }
  for (const key in record) {
    modal.form[key] = record[key];
  }
  modal.form.image = undefined;
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

const handleOk = () => {
  myform.value?.validate()
    .then(() => {
      const formData = new FormData();
      if (modal.form.id) {
        formData.append('id', modal.form.id);
      }
      if (modal.form.link) {
        formData.append('link', modal.form.link);
      }
      if (modal.form.imageFile) {
        formData.append('imageFile', modal.form.imageFile);
      }
      if (modal.editFlag) {
        updateApi(formData)
          .then(() => {
            hideModal();
            getList();
          })
          .catch((err) => {
            console.log(err);
            message.error(err.msg || '操作失败');
          });
      } else {
        createApi(formData)
          .then(() => {
            hideModal();
            getList();
          })
          .catch((err) => {
            console.log(err);
            message.error(err.msg || '操作失败');
          });
      }
    })
    .catch(() => {
      console.log('不能为空');
    });
};

const handleCancel = () => {
  hideModal();
};

const resetModal = () => {
  myform.value?.resetFields();
};

const hideModal = () => {
  modal.visile = false;
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
  border-radius: 12px;
  border: none;
  height: 40px;
  padding: 0 24px;
  font-size: 14px;
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  color: #E65100;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(230, 81, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.table-operations :deep(.ant-btn:not(.ant-btn-primary):hover) {
  background: linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%);
  color: #E65100;
  box-shadow: 0 4px 12px rgba(230, 81, 0, 0.3);
  transform: translateY(-2px);
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

:deep(.ant-table-tbody > tr > td a:first-child) {
  color: #ffffff;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
  box-shadow: 0 2px 8px rgba(77, 182, 172, 0.25);
}

:deep(.ant-table-tbody > tr > td a:first-child:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.35);
  transform: translateY(-2px);
}

:deep(.ant-table-tbody > tr > td a:last-child) {
  color: #ffffff;
  background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
  box-shadow: 0 2px 8px rgba(244, 81, 30, 0.25);
}

:deep(.ant-table-tbody > tr > td a:last-child:hover) {
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

:deep(.ant-input:focus),
:deep(.ant-input-focused),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: #FFA726 !important;
  box-shadow: 0 0 0 2px rgba(255, 167, 38, 0.1) !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #66BB6A !important;
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

.ad-image {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
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



/* 模态框样式优化 */
:deep(.ant-modal-header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-modal-title) {
  font-size: 18px;
  font-weight: 600;
  color: #2E7D32;
}

:deep(.ant-modal-body) {
  padding: 24px !important;
}

:deep(.ant-modal-footer) {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

:deep(.ant-input),
:deep(.ant-input-affix-wrapper),
:deep(.ant-select-selector) {
  height: 40px !important;
  border-radius: 8px !important;
  font-size: 14px !important;
}

:deep(.ant-upload-dragger) {
  border-radius: 8px !important;
}

:deep(.ant-btn) {
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 500;
}

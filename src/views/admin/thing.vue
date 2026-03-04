<template>
  <div class="page-surface">
    <div class="page-view page-view--thing">
      <div class="table-operations">
        <a-space>
          <a-button type="primary" @click="handleAdd">新增</a-button>
          <a-button @click="handleBatchDelete">批量删除</a-button>
        </a-space>
        <a-input-search
          addon-before="服务名称"
          placeholder="请输入服务名称"
          enter-button
          @search="onSearch"
          @change="onSearchChange"
        />
      </div>
      <a-table
        size="middle"
        rowKey="id"
        :loading="data.loading"
        :columns="columns"
        :data-source="data.dataList"
        :scroll="{ x: 1200 }"
        :row-selection="rowSelection"
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
          showTotal: (total) => `共${total} 条数据`,
        }"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key === 'status'">
            <a-tag :color="text === '0' ? 'success' : 'default'">{{ text === '0' ? '上架' : '下架' }}</a-tag>
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
  </div>

  <teleport to="body">
    <a-modal
      v-model:visible="modal.visible"
      :forceRender="true"
      :title="modal.title"
      ok-text="确认"
      cancel-text="取消"
      width="520px"
      :maskClosable="true"
      :keyboard="true"
      :destroyOnClose="false"
      wrapClassName="thing-modal-wrap"
      :bodyStyle="{ maxHeight: '55vh', overflowY: 'auto', padding: '20px' }"
      centered
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form ref="myform" :label-col="{ style: { width: '80px' } }" :model="modal.form" :rules="modal.rules">
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item label="服务名称" name="title">
              <a-input placeholder="请输入服务名称" v-model:value="modal.form.title" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="分类" name="classificationId">
              <a-select placeholder="请选择分类" allowClear v-model:value="modal.form.classificationId">
                <a-select-option v-for="item in modal.cData" :key="item.id" :value="item.id">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="标签">
              <a-select mode="multiple" placeholder="请选择标签" allowClear v-model:value="modal.form.tags">
                <a-select-option v-for="item in modal.tagData" :key="item.id" :value="item.id">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="价格" name="price">
              <a-input-number style="width: 100%" placeholder="请输入价格" v-model:value="modal.form.price" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="年龄">
              <a-input placeholder="请输入年龄" v-model:value="modal.form.age" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="性别">
              <a-input placeholder="请输入性别" v-model:value="modal.form.sex" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="地区">
              <a-input placeholder="请输入地区" v-model:value="modal.form.location" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="状态" name="status">
              <a-select placeholder="请选择状态" allowClear v-model:value="modal.form.status">
                <a-select-option value="0">上架</a-select-option>
                <a-select-option value="1">下架</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系电话">
              <a-input placeholder="请输入联系电话" v-model:value="modal.form.mobile" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="服务介绍">
              <a-textarea placeholder="请输入服务介绍" :rows="4" v-model:value="modal.form.description" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="封面">
              <a-upload-dragger name="file" accept="image/*" :multiple="false" :before-upload="beforeUpload">
                <div class="upload-slot">
                  <FileImageOutlined class="upload-icon" />
                  <p class="ant-upload-text">点击或拖拽上传封面图片</p>
                </div>
              </a-upload-dragger>
              <div class="cover-preview" v-if="modal.form.coverUrl">
                <img :src="modal.form.coverUrl" alt="cover" />
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </teleport>
</template>

<script setup lang="ts">
import { FormInstance, message } from 'ant-design-vue';
import { createApi, listApi, updateApi, deleteApi } from '/@/api/thing';
import { listApi as listClassificationApi } from '/@/api/classification';
import { listApi as listTagApi } from '/@/api/tag';
import { BASE_URL } from '/@/store/constants';
import { FileImageOutlined } from '@ant-design/icons-vue';

const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 70,
    align: 'center',
  },
  {
    title: '服务名称',
    dataIndex: 'title',
    key: 'title',
    width: 180,
    ellipsis: true,
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    width: 80,
    align: 'center',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80,
    align: 'center',
  },
  {
    title: '地区',
    dataIndex: 'location',
    key: 'location',
    width: 120,
    align: 'center',
  },
  {
    title: '服务介绍',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    ellipsis: true,
    customRender: ({ text }) => (text ? text.substring(0, 20) + '...' : '--'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
    customRender: ({ text }) => (text === '0' ? '上架' : '下架'),
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'operation',
    align: 'center',
    fixed: 'right',
    width: 150,
  },
]);

const beforeUpload = (file: File) => {
  const fileName = new Date().getTime().toString() + '.' + file.type.substring(6);
  const copyFile = new File([file], fileName);
  modal.form.imageFile = copyFile;
  return false;
};

const fileList = ref<any[]>([]);

const data = reactive({
  dataList: [],
  loading: false,
  keyword: '',
  selectedRowKeys: [] as any[],
  pageSize: 10,
  page: 1,
  total: 0,
});

const modal = reactive({
  visible: false,
  editFlag: false,
  title: '',
  cData: [] as any[],
  tagData: [] as any[],
  form: {
    id: undefined as any,
    title: undefined as any,
    classificationId: undefined as any,
    tags: [] as any[],
    repertory: undefined as any,
    price: undefined as any,
    mobile: undefined as any,
    age: undefined as any,
    sex: undefined as any,
    location: undefined as any,
    status: undefined as any,
    cover: undefined as any,
    coverUrl: undefined as any,
    imageFile: undefined as any,
    description: undefined as any,
  },
  rules: {
    title: [{ required: true, message: '请输入服务名称', trigger: 'change' }],
    classificationId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    price: [{ required: true, message: '请输入价格', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  },
});

const myform = ref<FormInstance>();

onMounted(() => {
  getDataList();
  getCDataList();
  getTagDataList();
});

const getDataList = () => {
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
      });
      data.dataList = payload.list;
      data.total = payload.total || 0;
    })
    .catch((err) => {
      data.loading = false;
      console.log(err);
    });
};

const getCDataList = () => {
  listClassificationApi({}).then((res) => {
    modal.cData = res.data;
  });
};

const getTagDataList = () => {
  listTagApi({}).then((res) => {
    res.data.forEach((item: any, index: any) => {
      item.index = index + 1;
    });
    modal.tagData = res.data;
  });
};

const onSearchChange = (e: Event) => {
  data.keyword = (e?.target as HTMLInputElement)?.value;
};

const onSearch = () => {
  getDataList();
};

const rowSelection = ref({
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    data.selectedRowKeys = selectedRowKeys;
  },
});

const handleAdd = () => {
  resetModal();
  modal.visible = true;
  modal.editFlag = false;
  modal.title = '新增';
  for (const key in modal.form) {
    modal.form[key] = undefined as any;
  }
  modal.form.tags = [];
  modal.form.cover = undefined;
  modal.form.coverUrl = undefined;
};

const handleEdit = (record: any) => {
  resetModal();
  modal.visible = true;
  modal.editFlag = true;
  modal.title = '编辑';
  for (const key in modal.form) {
    modal.form[key] = undefined as any;
  }
  for (const key in record) {
    if (record[key] !== undefined) {
      modal.form[key] = record[key];
    }
  }
  if (modal.form.cover) {
    modal.form.coverUrl = BASE_URL + '/api/staticfiles/image/' + modal.form.cover;
    modal.form.cover = undefined;
  }
};

const confirmDelete = (record: any) => {
  deleteApi({ ids: record.id })
    .then(() => {
      getDataList();
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
      getDataList();
    })
    .catch((err) => {
      message.error(err.msg || '操作失败');
    });
};

const handleOk = () => {
  myform.value
    ?.validate()
    .then(() => {
      const formData = new FormData();
      if (modal.editFlag) {
        formData.append('id', modal.form.id);
      }
      formData.append('title', modal.form.title);
      if (modal.form.classificationId) {
        formData.append('classificationId', modal.form.classificationId);
      }
      if (modal.form.tags) {
        modal.form.tags.forEach((value: any) => {
          if (value) {
            formData.append('tags[]', value);
          }
        });
      }
      if (modal.form.imageFile) {
        formData.append('imageFile', modal.form.imageFile);
      }
      formData.append('description', modal.form.description || '');
      formData.append('price', modal.form.price || '');
      if (modal.form.mobile) {
        formData.append('mobile', modal.form.mobile);
      }
      if (modal.form.age) {
        formData.append('age', modal.form.age);
      }
      if (modal.form.sex) {
        formData.append('sex', modal.form.sex);
      }
      if (modal.form.location) {
        formData.append('location', modal.form.location);
      }
      if (modal.form.status) {
        formData.append('status', modal.form.status);
      }
      const request = modal.editFlag ? updateApi(formData) : createApi(formData);
      request
        .then(() => {
          hideModal();
          getDataList();
        })
        .catch((err) => {
          message.error(err.msg || '操作失败');
        });
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
  fileList.value = [];
};

const hideModal = () => {
  modal.visible = false;
};
</script>

<style lang="less">
/* 全局样式 - 模态框强制居中 */
.thing-modal-wrap {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  overflow: auto !important;
  outline: 0 !important;
  z-index: 1000 !important;
  pointer-events: none !important;
}

.thing-modal-wrap > * {
  pointer-events: auto !important;
}

.thing-modal-wrap .ant-modal {
  position: relative !important;
  top: 100px !important;
  width: 520px !important;
  max-width: calc(100vw - 32px) !important;
  margin: 0 auto 100px !important;
  padding-bottom: 0 !important;
}

/* 多选标签横向排列 */
.thing-modal-wrap .ant-select-selection-overflow {
  flex-direction: row !important;
  flex-wrap: wrap !important;
  max-height: 100px !important;
  overflow-y: auto !important;
}

.thing-modal-wrap .ant-select-selection-overflow-item {
  display: inline-flex !important;
  flex: 0 0 auto !important;
  margin-right: 4px !important;
  margin-bottom: 4px !important;
}

.thing-modal-wrap .ant-select-multiple .ant-select-selector {
  padding: 4px 8px !important;
  min-height: 40px !important;
  display: flex !important;
  flex-wrap: wrap !important;
}
</style>

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

.table-operations :deep(.ant-input-search) {
  min-width: 320px;
}

.table-operations :deep(.ant-input-group-addon) {
  background: linear-gradient(135deg, #E8F5E9, #FFF9E6);
  border: 2px solid #C8E6C9;
  color: #2E7D32;
  border-radius: 12px 0 0 12px;
  font-size: 14px;
  padding: 0 16px;
  font-weight: 600;
}

.table-operations :deep(.ant-input) {
  border: 2px solid #FFF3E0;
  border-left: none;
  border-right: none;
  border-radius: 0;
  height: 40px;
  font-size: 14px;
  background: linear-gradient(135deg, #ffffff 0%, #FFFEF7 100%);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.table-operations :deep(.ant-input:hover) {
  border-color: #FFE082 !important;
}

.table-operations :deep(.ant-input:focus) {
  border-color: #FFA726 !important;
  box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.12) !important;
}

.table-operations :deep(.ant-input-affix-wrapper:hover) {
  border-color: #FFE082 !important;
}

.table-operations :deep(.ant-input-affix-wrapper:focus),
.table-operations :deep(.ant-input-affix-wrapper-focused) {
  border-color: #FFA726 !important;
  box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.12) !important;
}

.table-operations :deep(.ant-btn-primary.ant-input-search-button) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
  border: none !important;
  border-radius: 0 12px 12px 0 !important;
  height: 40px !important;
  box-shadow: 0 4px 12px rgba(77, 182, 172, 0.25) !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  color: #ffffff !important;
}

.table-operations :deep(.ant-btn-primary.ant-input-search-button:hover) {
  background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%) !important;
  box-shadow: 0 6px 16px rgba(77, 182, 172, 0.35) !important;
  transform: translateY(-2px) !important;
}

:deep(.ant-table) {
  background: transparent;
  font-size: 14px;
}

:deep(.ant-table-thead > tr > th) {
  background: linear-gradient(to bottom, #f8f9fa 0%, #f1f3f5 100%);
  font-weight: 600;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding: 16px;
  font-size: 14px;
}

:deep(.ant-table-tbody > tr) {
  transition: all 0.25s ease-out !important;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #F1F8E9 !important;
  padding: 16px;
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.25s ease-out !important;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%) !important;
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.1) !important;
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

:deep(.ant-table-cell) {
  vertical-align: middle;
}

:deep(.ant-tag) {
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 13px;
  border: none;
}

:deep(.ant-tag-success) {
  background: #e8f5e9;
  color: #4caf50;
}

.upload-slot {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  color: @text-secondary;
  padding: 20px;
}

.upload-icon {
  font-size: 32px;
  color: #2196F3;
}

.cover-preview {
  margin-top: 12px;
  width: 160px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background: #f5f6fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 模态框强制居中样式 */
.thing-modal-wrap {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  overflow: auto !important;
  outline: 0 !important;
  z-index: 1000 !important;
}

.thing-modal-wrap .ant-modal {
  position: relative !important;
  top: 100px !important;
  width: auto !important;
  max-width: calc(100vw - 32px) !important;
  margin: 0 auto 100px !important;
  padding-bottom: 0 !important;
}

:deep(.ant-modal-header) {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px;
  border-radius: 12px 12px 0 0;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

:deep(.ant-modal-content) {
  border-radius: 12px;
}

:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-modal-body .ant-select-selection-overflow) {
  flex-wrap: wrap !important;
  max-height: 100px !important;
  overflow-y: auto !important;
}

:deep(.ant-modal-body .ant-select-selection-overflow-item) {
  display: inline-flex !important;
  margin-right: 4px !important;
  margin-bottom: 4px !important;
}

:deep(.ant-modal-body .ant-select-multiple .ant-select-selector) {
  padding: 4px !important;
  min-height: 40px !important;
}

:deep(.ant-modal-footer) {
  border-top: 1px solid #f0f0f0;
  padding: 10px 16px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #2c3e50;
}

:deep(.ant-upload-drag) {
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
  background: #f5f6fa;
}

:deep(.ant-upload-drag:hover) {
  border-color: #FFA726 !important;
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

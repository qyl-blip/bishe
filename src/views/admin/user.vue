<template>
  <div class="page-surface">
    <div class="page-view page-view--user">
      <div class="table-operations">
        <a-space>
          <a-button type="primary" @click="handleAdd">新增</a-button>
          <a-button @click="handleBatchDelete">批量删除</a-button>
          <a-input-search
            addon-before="用户�?
            placeholder="请输入用户名"
            enter-button
            @search="onSearch"
            @change="onSearchChange"
          />
        </a-space>
      </div>
      <a-table
        size="middle"
        rowKey="id"
        :loading="data.loading"
        :columns="columns"
        :data-source="data.userList"
        :scroll="{ x: 1200 }"
        :row-selection="rowSelection"
        :pagination="{
          size: 'default',
          current: data.page,
          pageSize: data.pageSize,
          total: data.total,
          onChange: (current) => {
            data.page = current;
            getUserList();
          },
          showSizeChanger: false,
          showQuickJumper: false,
          hideOnSinglePage: false,
          showTotal: (total) => `�?{total}条数据`,
        }"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key === 'role'">
            <a-tag v-if="text === '3'" color="processing">管理�?/a-tag>
            <a-tag v-else-if="text === '2'" color="blue">演示账号</a-tag>
            <a-tag v-else color="green">普通用�?/a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="text === '0' ? 'success' : 'error'">{{ text === '0' ? '正常' : '封号' }}</a-tag>
          </template>
          <template v-else-if="column.key === 'operation'">
            <span class="action-space">
              <a class="operation-btn" @click="handleEdit(record)">编辑</a>
              <a-popconfirm title="确定删除?" ok-text="�? cancel-text="�? @confirm="confirmDelete(record)">
                <a class="delete-btn">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
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
        wrapClassName="user-modal-wrap"
        :bodyStyle="{ maxHeight: '55vh', overflowY: 'auto', padding: '20px' }"
        centered
        @cancel="handleCancel"
        @ok="handleOk"
      >
        <a-form ref="myform" :label-col="{ style: { width: '80px' } }" :model="modal.form" :rules="modal.rules">
          <a-row :gutter="0">
            <a-col span="24">
              <a-form-item label="用户�? name="username">
                <a-input :disabled="modal.editFlag" placeholder="请输入用户名" v-model:value="modal.form.username" allowClear />
              </a-form-item>
            </a-col>
            <a-col span="24" v-if="!modal.editFlag">
              <a-form-item label="密码" name="password">
                <a-input placeholder="请输入密�? type="password" v-model:value="modal.form.password" allowClear />
              </a-form-item>
            </a-col>
            <a-col span="24">
              <a-form-item label="昵称" name="nickname">
                <a-input placeholder="请输入昵�? v-model:value="modal.form.nickname" allowClear />
              </a-form-item>
            </a-col>
            <a-col span="24">
              <a-form-item label="角色" name="role">
                <a-select placeholder="请选择角色" allowClear v-model:value="modal.form.role">
                  <template v-for="item in modal.roleData" :key="item.id">
                    <a-select-option :value="item.id">{{ item.title }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="24">
              <a-form-item label="状�? name="status">
                <a-select placeholder="请选择状�? allowClear v-model:value="modal.form.status">
                  <a-select-option key="0" value="0">正常</a-select-option>
                  <a-select-option key="1" value="1">封号</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="24">
              <a-form-item label="邮箱" name="email">
                <a-input placeholder="请输入邮�? v-model:value="modal.form.email" allowClear />
              </a-form-item>
            </a-col>
            <a-col span="24">
              <a-form-item label="手机�? name="mobile">
                <a-input placeholder="请输入手机号" v-model:value="modal.form.mobile" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { FormInstance, message } from 'ant-design-vue';
import { createApi, listApi, updateApi, deleteApi } from '/@/api/user';
import { getFormatTime } from '/@/utils';

const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
  },
  {
    title: '用户�?,
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    align: 'center',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    align: 'center',
  },
  {
    title: '状�?,
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    align: 'center',
  },
  {
    title: '手机�?,
    dataIndex: 'mobile',
    key: 'mobile',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
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
  userList: [],
  loading: false,
  currentAdminUserName: '',
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
  roleData: [
    { id: '1', title: '普通用�? },
    { id: '2', title: '演示账号' },
    { id: '3', title: '管理�? },
  ],
  form: {
    id: undefined,
    username: undefined,
    password: undefined,
    role: undefined,
    status: undefined,
    nickname: undefined,
    email: undefined,
    mobile: undefined,
  },
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
    password: [{ required: true, message: '请输入密�?, trigger: 'change' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    status: [{ required: true, message: '请选择状�?, trigger: 'change' }],
  },
});

const myform = ref<FormInstance>();

onMounted(() => {
  getUserList();
});

const getUserList = () => {
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
      data.userList = payload.list;
      data.total = payload.total || 0;
    })
    .catch((err) => {
      data.loading = false;
      console.log(err);
    });
};

const onSearchChange = (e: Event) => {
  data.keyword = e?.target?.value;
};

const onSearch = () => {
  getUserList();
};

const rowSelection = ref({
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    data.selectedRowKeys = selectedRowKeys;
  },
});

const handleAdd = () => {
  resetModal();
  modal.visible = true;
  modal.editFlag = false;
  modal.title = '新增';
  for (const key in modal.form) {
    modal.form[key] = undefined;
  }
};

const handleEdit = (record: any) => {
  resetModal();
  modal.visible = true;
  modal.editFlag = true;
  modal.title = '编辑';
  for (const key in modal.form) {
    modal.form[key] = undefined;
  }
  for (const key in record) {
    modal.form[key] = record[key];
  }
};

const confirmDelete = (record: any) => {
  deleteApi({ ids: record.id })
    .then(() => {
      getUserList();
    })
    .catch((err) => {
      message.warn(err.msg || '操作失败');
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
      getUserList();
    })
    .catch((err) => {
      message.warn(err.msg || '操作失败');
    });
};

const handleOk = () => {
  myform.value
    ?.validate()
    .then(() => {
      const formData = new FormData();
      if (modal.form.id) {
        formData.append('id', modal.form.id);
      }
      if (modal.form.username) {
        formData.append('username', modal.form.username);
      }
      if (modal.form.password) {
        formData.append('password', modal.form.password);
      }
      if (modal.form.nickname) {
        formData.append('nickname', modal.form.nickname);
      }
      if (modal.form.role) {
        formData.append('role', modal.form.role);
      }
      if (modal.form.status) {
        formData.append('status', modal.form.status);
      }
      if (modal.form.mobile) {
        formData.append('mobile', modal.form.mobile);
      }
      if (modal.form.email) {
        formData.append('email', modal.form.email);
      }
      if (modal.editFlag) {
        updateApi(formData)
          .then(() => {
            hideModal();
            getUserList();
          })
          .catch((err) => {
            message.warn(err.msg || '操作失败');
          });
      } else {
        createApi(formData)
          .then(() => {
            hideModal();
            getUserList();
          })
          .catch((err) => {
            message.warn(err.msg || '操作失败');
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
  modal.visible = false;
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

/* 滚动条样�?*/
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

/* 模态框强制居中样式 */
.user-modal-wrap {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  overflow: auto !important;
  outline: 0 !important;
  z-index: 1000 !important;
}

.user-modal-wrap .ant-modal {
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

:deep(.ant-modal-footer) {
  border-top: 1px solid #f0f0f0;
  padding: 10px 16px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #2c3e50;
}

/* 修复输入框宽度问�?*/
:deep(.user-modal-wrap .ant-input),
:deep(.user-modal-wrap .ant-input-affix-wrapper),
:deep(.user-modal-wrap .ant-select),
:deep(.user-modal-wrap .ant-select-selector) {
  width: 100% !important;
}

:deep(.user-modal-wrap .ant-form-item-control-input) {
  width: 100% !important;
}

:deep(.user-modal-wrap .ant-form-item-control-input-content) {
  width: 100% !important;
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




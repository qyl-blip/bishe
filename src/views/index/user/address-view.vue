<template>
  <div class="address-page">
    <div class="page-header">
      <div class="page-title">地址管理</div>
      <span class="add-new-btn" @click="handleAdd">新建地址</span>
    </div>
    <div class="address-content">
      <div class="address-item flex-view" v-for="item in pageData.addressData" :key="item.id">
        <div class="infos">
          <div class="name-box">
            <span class="name">{{ item.name }}</span>
            <span class="tel">{{ item.mobile }}</span>
          </div>
          <p class="address-box">{{ item.description }}</p>
        </div>
        <div class="do-box">
          <div class="btns">
            <span class="edit" @click="handleEdit(item)">编辑</span>
            <a-popconfirm title="确定删除地址？" ok-text="是" cancel-text="否" @confirm="handleDelete(item)">
              <span class="delete">删除</span>
            </a-popconfirm>
          </div>
          <div class="default-box" v-if="item.def === '1'">
            <img :src="AddressIcon">
            <span>默认地址</span>
          </div>
        </div>
      </div>
      <div v-if="pageData.addressData.length === 0" class="empty-state">
        <div class="empty-title">暂无地址</div>
        <div class="empty-subtitle">点击右侧“新建地址”添加</div>
      </div>
    </div>
  </div>
  <a-modal
      :visible="modal.visile"
      :forceRender="true"
      :title="modal.title"
      ok-text="确认"
      cancel-text="取消"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form ref="myform" :label-col="{ style: { width: '80px' } }" :model="modal.form" :rules="modal.rules">
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item label="收货人" name="name">
              <a-input placeholder="请输入收货人" v-model:value="modal.form.name"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item label="电话号码" name="mobile">
              <a-input placeholder="请输入电话号码" v-model:value="modal.form.mobile"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item label="送货地址" name="description">
              <a-input placeholder="请输入送货地址" v-model:value="modal.form.description"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item label="默认地址">
              <a-switch v-model:checked="modal.form.default"></a-switch>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { FormInstance, message } from 'ant-design-vue';
import { listApi, deleteApi } from '/@/api/address';
import { createApi, updateApi } from '/@/api/address';
import { useUserStore } from '/@/store';
import AddressIcon from '/@/assets/images/address-right-icon.svg';

const userStore = useUserStore();

const pageData = reactive({
  addressData: [],
});

const modal = reactive({
  visile: false,
  editFlag: false,
  title: '',
  form: {
    id: undefined,
    name: undefined,
    mobile: undefined,
    description: undefined,
    default: false,
  },
  rules: {
    link: [{ required: true, message: '请输入地址', trigger: 'change' }],
  },
});

const myform = ref<FormInstance>();

onMounted(() => {
  listAddressData();
});

const listAddressData = () => {
  let userId = userStore.user_id;
  listApi({ userId: userId }).then((res) => {
    pageData.addressData = res.data;
  });
};

const handleAdd = () => {
  resetModal();
  modal.visile = true;
  modal.editFlag = false;
  modal.title = '新增';
  for (const key in modal.form) {
    modal.form[key] = undefined;
  }
};

const handleEdit = (item) => {
  resetModal();
  modal.visile = true;
  modal.editFlag = true;
  modal.title = '编辑';
  for (const key in modal.form) {
    modal.form[key] = undefined;
  }
  for (const key in item) {
    modal.form[key] = item[key];
  }
  modal.form.default = item.def === '1';
};

const handleDelete = (item) => {
  deleteApi({ ids: item.id }).then(() => {
    listAddressData();
  });
};

const handleOk = () => {
  const formData = new FormData();
  formData.append('userId', userStore.user_id);
  formData.append('def', modal.form.default ? '1' : '0');
  if (modal.form.name) {
    formData.append('name', modal.form.name);
  }
  if (modal.form.mobile) {
    formData.append('mobile', modal.form.mobile);
  }
  if (modal.form.description) {
    formData.append('description', modal.form.description);
  }
  if (modal.editFlag) {
    formData.append('id', modal.form.id);
    updateApi(formData)
      .then(() => {
        hideModal();
        listAddressData();
      })
      .catch((err) => {
        message.warn(err.msg || '操作失败');
      });
  } else {
    createApi(formData)
      .then(() => {
        hideModal();
        listAddressData();
      })
      .catch((err) => {
        message.warn(err.msg || '操作失败');
      });
  }
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

.address-page {
  width: 100%;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 3px solid transparent;
    background: linear-gradient(90deg, #66BB6A 0%, #FFA726 50%, transparent 100%) bottom / 100% 3px no-repeat;
  }

  .page-title {
    color: #2E7D32;
    font-weight: 700;
    font-size: 24px;
  }

  .add-new-btn {
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 50%, #FFA726 100%);
    border-radius: 32px;
    padding: 0 24px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 16px rgba(102, 187, 106, 0.3);
    display: inline-block;
  }

  .add-new-btn:hover {
    background: linear-gradient(135deg, #5CB860 0%, #45A89E 50%, #FF9800 100%);
    box-shadow: 0 6px 20px rgba(102, 187, 106, 0.4);
    transform: translateY(-2px);
  }
}

.address-content {
  .address-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
    border: 2px solid rgba(129, 199, 132, 0.2);
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    .infos {
      flex: 1;

      .name-box {
        margin-bottom: 12px;

        .name {
          color: #2E7D32;
          font-weight: 700;
          font-size: 16px;
          margin-right: 16px;
        }

        .tel {
          color: #6b7280;
          font-size: 14px;
        }
      }

      .address-box {
        color: #1c2233;
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
      }
    }

    .do-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;

      .btns {
        display: flex;
        gap: 12px;

        .edit,
        .delete {
          cursor: pointer;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .edit {
          color: #66BB6A;
          background: rgba(102, 187, 106, 0.1);
        }

        .edit:hover {
          background: rgba(102, 187, 106, 0.2);
        }

        .delete {
          color: #FF7043;
          background: rgba(255, 112, 67, 0.1);
        }

        .delete:hover {
          background: rgba(255, 112, 67, 0.2);
        }
      }

      .default-box {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #FFA726;
        font-size: 13px;
        font-weight: 600;
        padding: 4px 12px;
        background: linear-gradient(135deg, #FFF9E6 0%, #FFFEF7 100%);
        border-radius: 8px;
        border: 1px solid rgba(255, 167, 38, 0.3);

        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  .address-item:hover {
    border-color: rgba(102, 187, 106, 0.5);
    box-shadow: 0 6px 20px rgba(102, 187, 106, 0.15);
    transform: translateY(-2px);
  }

  .empty-state {
    margin-top: 48px;
    padding: 64px 24px;
    text-align: center;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 245, 233, 0.3) 100%);
    border: 2px dashed rgba(129, 199, 132, 0.3);
    border-radius: 20px;

    &::before {
      content: '📍';
      font-size: 64px;
      display: block;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-title {
      font-size: 18px;
      font-weight: 700;
      color: #2E7D32;
      margin-bottom: 8px;
    }

    .empty-subtitle {
      font-size: 14px;
      color: #6b7280;
    }
  }
}
</style>

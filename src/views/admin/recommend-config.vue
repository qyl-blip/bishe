<template>
  <div class="page-surface">
    <div class="page-view page-view--recommend">
      <!-- 说明卡片 -->
      <div class="tip-card">
        <span class="tip-title">💡 智能推荐权重说明</span>
        <span class="tip-desc">综合得分 = 浏览量 × 浏览权重 + 心愿数 × 心愿权重 + 收藏数 × 收藏权重 + 评分 × 评分权重。启用的配置将实时影响前台智能推荐排序结果，每次只能有一条配置处于启用状态。</span>
      </div>

      <div class="table-operations">
        <a-button type="primary" @click="handleAdd">新增配置</a-button>
      </div>

      <a-table
        size="middle"
        rowKey="id"
        :loading="data.loading"
        :columns="columns"
        :data-source="data.list"
        :pagination="false"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key === 'enabled'">
            <a-tag :color="text === 1 ? 'success' : 'default'">{{ text === 1 ? '启用' : '禁用' }}</a-tag>
          </template>
          <template v-else-if="column.key === 'pvWeight' || column.key === 'wishWeight' || column.key === 'collectWeight' || column.key === 'scoreWeight'">
            <span>{{ text }}</span>
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
      :visible="modal.visible"
      :forceRender="true"
      :title="modal.title"
      ok-text="确认"
      cancel-text="取消"
      width="560px"
      centered
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form ref="myform" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :model="modal.form" :rules="modal.rules">
        <a-form-item label="配置名称" name="name">
          <a-input placeholder="如：默认配置" v-model:value="modal.form.name" />
        </a-form-item>

        <a-form-item name="pvWeight">
          <template #label>
            <span>浏览量权重</span>
            <a-tooltip title="用户每次查看服务详情，浏览量+1。权重越高，浏览量对推荐排名影响越大。">
              <question-circle-outlined style="margin-left: 4px; color: #aaa;" />
            </a-tooltip>
          </template>
          <a-input-number
            v-model:value="modal.form.pvWeight"
            :min="0" :max="10" :step="0.1" :precision="2"
            style="width: 100%"
            placeholder="建议 0~1"
          />
        </a-form-item>

        <a-form-item name="wishWeight">
          <template #label>
            <span>心愿数权重</span>
            <a-tooltip title="用户加入心愿单，心愿数+1。权重越高，心愿数对推荐排名影响越大。">
              <question-circle-outlined style="margin-left: 4px; color: #aaa;" />
            </a-tooltip>
          </template>
          <a-input-number
            v-model:value="modal.form.wishWeight"
            :min="0" :max="10" :step="0.1" :precision="2"
            style="width: 100%"
            placeholder="建议 0~1"
          />
        </a-form-item>

        <a-form-item name="collectWeight">
          <template #label>
            <span>收藏数权重</span>
            <a-tooltip title="用户收藏服务，收藏数+1。权重越高，收藏数对推荐排名影响越大。">
              <question-circle-outlined style="margin-left: 4px; color: #aaa;" />
            </a-tooltip>
          </template>
          <a-input-number
            v-model:value="modal.form.collectWeight"
            :min="0" :max="10" :step="0.1" :precision="2"
            style="width: 100%"
            placeholder="建议 0~1"
          />
        </a-form-item>

        <a-form-item name="scoreWeight">
          <template #label>
            <span>评分权重</span>
            <a-tooltip title="用户评价后的服务评分。权重越高，评分对推荐排名影响越大。">
              <question-circle-outlined style="margin-left: 4px; color: #aaa;" />
            </a-tooltip>
          </template>
          <a-input-number
            v-model:value="modal.form.scoreWeight"
            :min="0" :max="10" :step="0.1" :precision="2"
            style="width: 100%"
            placeholder="建议 0~1"
          />
        </a-form-item>

        <!-- 权重预览 -->
        <a-form-item label="权重比例预览" :wrapper-col="{ span: 17 }">
          <div class="weight-preview">
            <div v-for="item in weightPreview" :key="item.label" class="weight-bar-item">
              <span class="weight-label">{{ item.label }}</span>
              <a-progress
                :percent="item.percent"
                :stroke-color="item.color"
                size="small"
                :show-info="false"
                style="flex: 1; margin: 0 8px;"
              />
              <span class="weight-value">{{ item.value }}（{{ item.percent }}%）</span>
            </div>
          </div>
        </a-form-item>

        <a-form-item label="是否启用" name="enabled">
          <a-switch v-model:checked="modal.form.enabledBool" checked-children="启用" un-checked-children="禁用" />
        </a-form-item>

        <a-form-item label="备注">
          <a-textarea v-model:value="modal.form.remark" :rows="2" placeholder="可选备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { FormInstance, message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { listApi, createApi, updateApi, deleteApi } from '/@/api/recommendConfig';

const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', align: 'center' as const, width: 70 },
  { title: '配置名称', dataIndex: 'name', key: 'name', align: 'center' as const },
  { title: '浏览量权重', dataIndex: 'pvWeight', key: 'pvWeight', align: 'center' as const },
  { title: '心愿数权重', dataIndex: 'wishWeight', key: 'wishWeight', align: 'center' as const },
  { title: '收藏数权重', dataIndex: 'collectWeight', key: 'collectWeight', align: 'center' as const },
  { title: '评分权重', dataIndex: 'scoreWeight', key: 'scoreWeight', align: 'center' as const },
  { title: '状态', dataIndex: 'enabled', key: 'enabled', align: 'center' as const, width: 90 },
  { title: '备注', dataIndex: 'remark', key: 'remark', align: 'center' as const },
  { title: '操作', dataIndex: 'action', key: 'operation', align: 'center' as const, fixed: 'right' as const, width: 140 },
];

const data = reactive({ list: [] as any[], loading: false });

const modal = reactive({
  visible: false,
  editFlag: false,
  title: '',
  form: {
    id: undefined as any,
    name: undefined as any,
    pvWeight: 0.4,
    wishWeight: 0.2,
    collectWeight: 0.3,
    scoreWeight: 0.1,
    enabledBool: true,
    remark: undefined as any,
  },
  rules: {
    name: [{ required: true, message: '请输入配置名称', trigger: 'change' }],
    pvWeight: [{ required: true, message: '请输入浏览量权重', trigger: 'change' }],
    wishWeight: [{ required: true, message: '请输入心愿数权重', trigger: 'change' }],
    collectWeight: [{ required: true, message: '请输入收藏数权重', trigger: 'change' }],
    scoreWeight: [{ required: true, message: '请输入评分权重', trigger: 'change' }],
  },
});

const myform = ref<FormInstance>();

// 权重比例预览
const weightPreview = computed(() => {
  const f = modal.form;
  const total = (f.pvWeight || 0) + (f.wishWeight || 0) + (f.collectWeight || 0) + (f.scoreWeight || 0);
  const pct = (v: number) => total > 0 ? Math.round((v / total) * 100) : 0;
  return [
    { label: '浏览量', value: f.pvWeight || 0, percent: pct(f.pvWeight || 0), color: '#4DB6AC' },
    { label: '心愿数', value: f.wishWeight || 0, percent: pct(f.wishWeight || 0), color: '#FF8A65' },
    { label: '收藏数', value: f.collectWeight || 0, percent: pct(f.collectWeight || 0), color: '#66BB6A' },
    { label: '评分', value: f.scoreWeight || 0, percent: pct(f.scoreWeight || 0), color: '#FFA726' },
  ];
});

onMounted(() => getDataList());

const getDataList = () => {
  data.loading = true;
  listApi()
    .then((res) => {
      data.loading = false;
      const list = res.data || [];
      list.forEach((item: any, index: number) => { item.index = index + 1; });
      data.list = list;
    })
    .catch(() => { data.loading = false; });
};

const handleAdd = () => {
  myform.value?.resetFields();
  modal.visible = true;
  modal.editFlag = false;
  modal.title = '新增推荐配置';
  modal.form.id = undefined;
  modal.form.name = undefined;
  modal.form.pvWeight = 0.4;
  modal.form.wishWeight = 0.2;
  modal.form.collectWeight = 0.3;
  modal.form.scoreWeight = 0.1;
  modal.form.enabledBool = true;
  modal.form.remark = undefined;
};

const handleEdit = (record: any) => {
  myform.value?.resetFields();
  modal.visible = true;
  modal.editFlag = true;
  modal.title = '编辑推荐配置';
  modal.form.id = record.id;
  modal.form.name = record.name;
  modal.form.pvWeight = record.pvWeight;
  modal.form.wishWeight = record.wishWeight;
  modal.form.collectWeight = record.collectWeight;
  modal.form.scoreWeight = record.scoreWeight;
  modal.form.enabledBool = record.enabled === 1;
  modal.form.remark = record.remark;
};

const confirmDelete = (record: any) => {
  deleteApi({ ids: record.id })
    .then(() => { message.success('删除成功'); getDataList(); })
    .catch((err) => { message.error(err.msg || '操作失败'); });
};

const handleOk = () => {
  myform.value?.validate().then(() => {
    const payload = {
      ...modal.form,
      enabled: modal.form.enabledBool ? 1 : 0,
    };
    const api = modal.editFlag ? updateApi(payload) : createApi(payload);
    api
      .then(() => {
        message.success('操作成功');
        modal.visible = false;
        getDataList();
      })
      .catch((err) => { message.error(err.msg || '操作失败'); });
  });
};

const handleCancel = () => { modal.visible = false; };
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.tip-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%);
  border-left: 4px solid #4DB6AC;
  border-radius: 10px;
  margin-bottom: 20px;
}

.tip-title {
  font-size: 14px;
  font-weight: 600;
  color: #2E7D32;
}

.tip-desc {
  font-size: 13px;
  color: #555;
  line-height: 1.6;
}

.page-view {
  min-height: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.table-operations {
  margin-bottom: 20px;
}

.table-operations :deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 500 !important;
  height: 40px !important;
  padding: 0 24px !important;
  color: #ffffff !important;
}

.weight-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.weight-bar-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.weight-label {
  width: 48px;
  font-size: 13px;
  color: #555;
  flex-shrink: 0;
}

.weight-value {
  width: 110px;
  font-size: 12px;
  color: #888;
  text-align: right;
  flex-shrink: 0;
}

:deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF9E6 100%) !important;
  color: #2E7D32 !important;
  font-weight: 600;
  border-bottom: 2px solid #C8E6C9 !important;
}

:deep(.ant-table-tbody > tr > td a) {
  font-weight: 500;
  margin: 0 6px;
  padding: 4px 14px;
  border-radius: 8px;
  display: inline-block;
  text-decoration: none;
}

:deep(.ant-table-tbody > tr > td a:first-child) {
  color: #fff;
  background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
}

:deep(.ant-table-tbody > tr > td a:last-child) {
  color: #fff;
  background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
}
</style>

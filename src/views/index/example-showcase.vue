<template>
  <div class="example-showcase page-surface">
    <!-- 标题部分 -->
    <div class="showcase-header">
      <h1 class="text-gold">墨色黑金贵族主题示例</h1>
      <p class="text-secondary">完整的交互和动画演示</p>
    </div>

    <!-- 棰滆壊灞曠ず -->
    <a-card class="section-card slide-up">
      <template #title>
        <span class="text-gold">🎨 色彩体系</span>
      </template>

      <div class="color-grid">
        <div class="color-item">
          <div class="color-box" style="background: #1a1a2e;"></div>
          <p>娣卞ⅷ鑹蹭富鑹?br>#1a1a2e</p>
        </div>
        <div class="color-item">
          <div class="color-box" style="background: #d4af37;"></div>
          <p>榛戦噾鑹?br>#d4af37</p>
        </div>
        <div class="color-item">
          <div class="color-box" style="background: #16213e;"></div>
          <p>娣辫儗鏅?br>#16213e</p>
        </div>
        <div class="color-item">
          <div class="color-box" style="background: #e8eaf6;"></div>
          <p>娴呰儗鏅?br>#e8eaf6</p>
        </div>
      </div>
    </a-card>

    <!-- 按钮示例 -->
    <a-card class="section-card slide-up">
      <template #title>
        <span class="text-gold">馃敇 鎸夐挳浜や簰</span>
      </template>

      <div class="button-grid">
        <a-button type="primary" size="large">
          涓绘寜閽紙鎮仠鏌ョ湅鏁堟灉锛?
        </a-button>
        <a-button type="default" size="large">
          娆℃寜閽?
        </a-button>
        <a-button type="dashed" size="large">
          铏氱嚎鎸夐挳
        </a-button>
        <a-button type="text" size="large">
          文本按钮
        </a-button>
      </div>
    </a-card>

    <!-- 动画演示 -->
    <a-card class="section-card slide-up">
      <template #title>
        <span class="text-gold">鉁?鍔ㄧ敾鏁堟灉</span>
      </template>

      <div class="animation-grid">
        <div class="animation-box fade-in">
          <p>娣″叆 (Fade In)</p>
        </div>
        <div class="animation-box slide-up">
          <p>上升 (Slide Up)</p>
        </div>
        <div class="animation-box scale-in">
          <p>缂╂斁 (Scale In)</p>
        </div>
        <div class="animation-box pulse">
          <p>鑴夊啿 (Pulse)</p>
        </div>
        <div class="animation-box breathing">
          <p>鍛煎惛 (Breathing)</p>
        </div>
        <div class="animation-box gold-glow">
          <p>榛戦噾闂儊 (Gold Glow)</p>
        </div>
      </div>
    </a-card>

    <!-- 表单示例 -->
    <a-card class="section-card slide-up">
      <template #title>
        <span class="text-gold">📝 表单交互</span>
      </template>

      <a-form layout="vertical">
        <a-form-item label="用户名" required>
          <a-input placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item label="用户名" required>
          <a-input-password placeholder="请输入密码" />
        </a-form-item>

        <a-form-item label="邮箱">
          <a-input placeholder="请输入邮箱" />
        </a-form-item>

        <a-form-item>
          <a-checkbox>璁颁綇鎴?</a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" block>
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 表格示例 -->
    <a-card class="section-card slide-up">
      <template #title>
        <span class="text-gold">📊 表格样式</span>
      </template>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span class="operation-btn">编辑</span>
            <span class="operation-btn">删除</span>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 标签示例 -->
    <a-card class="section-card slide-up">
      <template #title>
        <span class="text-gold">馃彿锔?鏍囩鏍峰紡</span>
      </template>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a-tag color="success">成功</a-tag>
        <a-tag color="warning">璀﹀憡</a-tag>
        <a-tag color="error">閿欒</a-tag>
        <a-tag color="processing">澶勭悊涓?</a-tag>
        <a-tag color="blue">信息</a-tag>
        <a-tag color="gold">榛戦噾</a-tag>
      </div>
    </a-card>

    <!-- 通知示例 -->
    <a-card class="section-card slide-up">
      <template #title>
        <span class="text-gold">馃敂 浜や簰婕旂ず</span>
      </template>

      <div class="demo-buttons">
        <a-button @click="showSuccess" type="primary">
          成功提示
        </a-button>
        <a-button @click="showWarning" type="primary">
          璀﹀憡鎻愮ず
        </a-button>
        <a-button @click="showError" type="primary">
          閿欒鎻愮ず
        </a-button>
        <a-button @click="showInfo" type="primary">
          信息提示
        </a-button>
      </div>
    </a-card>

    <!-- 瑁呴グ绾?-->
    <div class="divider-gold"></div>

    <!-- 底部信息 -->
    <div class="footer-info">
      <p>🎨 <strong>墨色黑金贵族主题系统</strong></p>
      <p>閲囩敤楂樼骇鐨勮壊褰╀綋绯诲拰骞虫粦鐨勪氦浜掑姩鐢?</p>
      <p>鎵€鏈夎繃娓￠噰鐢?cubic-bezier(0.4, 0, 0.2, 1) 缂撳姩鍑芥暟</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '鍚嶇О',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const tableData = [
  { key: '1', id: '001', name: '示例项目 1', status: '进行中' },
  { key: '2', id: '002', name: '示例项目 2', status: '已完成' },
  { key: '3', id: '003', name: '示例项目 3', status: '处理中' },
];

const showSuccess = () => {
  message.success('操作成功');
};

const showWarning = () => {
  message.warning('请注意！⚠️');
};

const showError = () => {
  message.error('出现错误！❌');
};

const showInfo = () => {
  message.info('这是信息提示 ℹ️');
};
</script>

<style scoped lang="less">
@import '/@/styles/theme.less';

.example-showcase {
  padding: @spacing-2xl @spacing-lg;
  background: radial-gradient(900px 500px at 10% 0%, rgba(212, 175, 55, 0.08), transparent 60%),
    linear-gradient(135deg, @bg-secondary 0%, @bg-primary 100%);
  min-height: 100vh;

  .showcase-header {
    text-align: center;
    margin-bottom: @spacing-2xl;
    animation: fadeDown @transition-duration-base @transition-timing;

    h1 {
      font-family: @font-family-display;
      font-size: @font-size-4xl;
      font-weight: @font-weight-bold;
      margin-bottom: @spacing-sm;
      text-shadow: 0 6px 24px rgba(212, 175, 55, 0.4);
    }

    p {
      font-size: @font-size-lg;
      color: @text-secondary;
    }
  }

  .section-card {
    background: @surface-elevated;
    border: 1px solid @border-subtle;
    border-radius: @radius-lg;
    margin-bottom: @spacing-lg;
    transition: all @transition-duration-base @transition-timing;

    &:hover {
      box-shadow: @shadow-xl;
      border-color: rgba(212, 175, 55, 0.45);
    }
  }

  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: @spacing-lg;
    margin-top: @spacing-md;

    .color-item {
      text-align: center;
      animation: fadeScale @transition-duration-base @transition-timing;

      .color-box {
        width: 100%;
        height: 110px;
        border-radius: @radius-lg;
        margin-bottom: @spacing-sm;
        box-shadow: @shadow-lg;
        transition: transform @transition-duration-base @transition-timing;

        &:hover {
          transform: translateY(-4px);
          box-shadow: @shadow-xl;
        }
      }

      p {
        font-size: @font-size-sm;
        color: @text-primary;
        font-weight: @font-weight-medium;
      }
    }
  }

  .button-grid,
  .demo-buttons {
    display: flex;
    gap: @spacing-md;
    flex-wrap: wrap;
    margin-top: @spacing-md;
  }

  .animation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: @spacing-lg;
    margin-top: @spacing-md;

    .animation-box {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(244, 246, 251, 0.9));
      border: 1px solid @border-subtle;
      border-radius: @radius-lg;
      padding: @spacing-lg;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
      color: @text-primary;
      font-weight: @font-weight-semibold;
      text-align: center;
      font-size: @font-size-sm;
      box-shadow: @shadow-md;
    }
  }

  .divider-gold {
    height: 3px;
    background: linear-gradient(90deg, transparent, @secondary-color 20%, @secondary-color 80%, transparent);
    margin: @spacing-2xl 0;
    border-radius: 2px;
  }

  .footer-info {
    text-align: center;
    padding: @spacing-2xl @spacing-lg;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), transparent);
    border-radius: @radius-lg;
    border: 1px solid @border-subtle;
    animation: fade-in @transition-duration-base @transition-timing;

    p {
      color: @text-secondary;
      font-size: @font-size-base;
      margin: @spacing-sm 0;

      strong {
        color: @secondary-color;
      }
    }
  }
}
</style>







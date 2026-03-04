<template>
  <div v-if="visible" class="time-selector-overlay" @click.self="handleCancel">
    <div class="time-selector-modal">
      <div class="modal-header">
        <h3>选择预约时间</h3>
        <span class="close-btn" @click="handleCancel">&times;</span>
      </div>

      <div class="modal-body">
        <!-- 日期选择区域 -->
        <div class="date-section">
          <h4>选择日期</h4>
          <div v-if="loading" class="loading-indicator">加载中...</div>
          <div v-else class="date-list">
            <div
              v-for="date in availableDates"
              :key="date"
              :class="['date-item', { selected: selectedDate === date }]"
              @click="selectDate(date)"
            >
              {{ formatDate(date) }}
            </div>
          </div>
        </div>

        <!-- 时间段选择区域 -->
        <div v-if="selectedDate" class="slot-section">
          <h4>选择时间段</h4>
          <div v-if="loadingSlots" class="loading-indicator">加载时间段...</div>
          <div v-else-if="error" class="error-message">{{ error }}</div>
          <div v-else class="slot-list">
            <div
              v-for="slot in availableSlots"
              :key="slot.slotId"
              :class="[
                'slot-item',
                { selected: selectedSlot?.slotId === slot.slotId },
                { disabled: !slot.available }
              ]"
              @click="selectSlot(slot)"
            >
              <span class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</span>
              <span :class="['slot-status', { available: slot.available }]">
                {{ slot.available ? '可预约' : '已满' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div v-if="validationError" class="validation-error">
          {{ validationError }}
        </div>
        
        <div v-if="!selectedDate" class="info-message">
          请先选择预约日期
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-cancel" @click="handleCancel">取消</button>
        <button
          class="btn btn-confirm"
          :disabled="submitting"
          @click="handleConfirm"
        >
          {{ submitting ? '正在提交预约...' : '确认预约' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAvailableSlots, createAppointment } from '/@/api/appointment';

export default {
  name: 'TimeSelector',
  props: {
    thingId: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel', 'update:visible'],
  data() {
    return {
      selectedDate: null,
      selectedSlot: null,
      availableDates: [],
      availableSlots: [],
      loading: false,
      loadingSlots: false,
      submitting: false,
      error: null,
      validationError: null
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initDates();
      } else {
        this.reset();
      }
    }
  },
  methods: {
    /**
     * 初始化未来30天的日期列表
     */
    initDates() {
      this.loading = true;
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(this.formatDateToString(date));
      }
      
      this.availableDates = dates;
      this.loading = false;
    },

    /**
     * 选择日期
     */
    async selectDate(date) {
      this.selectedDate = date;
      this.selectedSlot = null;
      this.validationError = null;
      await this.loadTimeSlots(date);
    },

    /**
     * 加载指定日期的时间段
     */
    async loadTimeSlots(date) {
      this.loadingSlots = true;
      this.error = null;
      
      try {
        console.log('开始加载时间段, date:', date, 'thingId:', this.thingId);
        const res = await getAvailableSlots({ date: date, thingId: this.thingId });
        console.log('API响应:', res);
        if (res.code === 200) {
          this.availableSlots = res.data;
          console.log('时间段加载成功:', this.availableSlots);
        } else {
          this.error = res.msg || '加载时间段失败';
          console.error('API返回错误:', res);
        }
      } catch (err) {
        console.error('加载时间段失败:', err);
        this.error = '网络连接失败，请稍后重试';
      } finally {
        this.loadingSlots = false;
      }
    },

    /**
     * 选择时间段
     */
    selectSlot(slot) {
      if (!slot.available) {
        return;
      }
      this.selectedSlot = slot;
      this.validationError = null;
    },

    /**
     * 确认预约
     */
    async handleConfirm() {
      this.validationError = null;
      if (!this.selectedDate) {
        this.validationError = '请选择预约日期';
        return;
      }
      if (!this.selectedSlot) {
        this.validationError = '请选择预约时间段';
        return;
      }

      this.$emit('confirm', {
        date: this.selectedDate,
        slot: this.selectedSlot
      });
    },

    /**
     * 取消操作
     */
    handleCancel() {
      this.$emit('cancel');
      this.$emit('update:visible', false);
    },

    /**
     * 重置状态
     */
    reset() {
      this.selectedDate = null;
      this.selectedSlot = null;
      this.availableSlots = [];
      this.error = null;
      this.validationError = null;
    },

    /**
     * 格式化日期显示
     */
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      const weekDay = weekDays[date.getDay()];
      return `${month}月${day}日 周${weekDay}`;
    },

    /**
     * 格式化日期为字符串 (yyyy-MM-dd)
     */
    formatDateToString(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style scoped lang="less">
.time-selector-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9998 !important;
  animation: fadeIn 0.2s ease;
  overflow-y: auto;
  padding: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.time-selector-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 40px rgba(77, 182, 172, 0.2);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: auto;
  position: relative;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #E0F2F1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, #F1F8E9, #ffffff);
  border-radius: 16px 16px 0 0;

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }

  .close-btn {
    font-size: 28px;
    cursor: pointer;
    color: #A5D6A7;
    line-height: 1;
    transition: all 0.2s ease;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:hover {
      color: #66BB6A;
      background: #E8F5E9;
    }
  }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.date-section,
.slot-section {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    position: relative;
    padding-bottom: 8px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #66BB6A, #4DB6AC);
      border-radius: 2px;
    }
  }
}

.loading-indicator {
  text-align: center;
  padding: 32px;
  color: #81C784;
  font-size: 14px;
}

.error-message {
  color: #d32f2f;
  padding: 12px 16px;
  background: #ffebee;
  border-radius: 8px;
  border-left: 3px solid #f44336;
}

.validation-error {
  color: #d32f2f;
  padding: 12px 16px;
  background: #ffebee;
  border-radius: 8px;
  margin-top: 12px;
  border-left: 3px solid #f44336;
}

.info-message {
  color: #66BB6A;
  padding: 12px 16px;
  background: #E8F5E9;
  border-radius: 8px;
  margin-top: 12px;
  text-align: center;
  border-left: 3px solid #81C784;
}

.date-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.date-item {
  padding: 14px 12px;
  border: 2px solid #E0F2F1;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: #ffffff;

  &:hover {
    border-color: #81C784;
    background: #F1F8E9;
    color: #2E7D32;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(129, 199, 132, 0.2);
  }

  &.selected {
    border-color: #66BB6A;
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
    color: white;
    box-shadow: 0 6px 16px rgba(77, 182, 172, 0.3);
    transform: translateY(-2px);
  }
}

.slot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slot-item {
  padding: 16px 20px;
  border: 2px solid #E0F2F1;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;

  &:hover:not(.disabled) {
    border-color: #81C784;
    background: #F1F8E9;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(129, 199, 132, 0.15);
  }

  &.selected {
    border-color: #66BB6A;
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
    color: white;
    box-shadow: 0 6px 16px rgba(77, 182, 172, 0.3);

    .slot-time {
      color: white !important;
    }

    .slot-status {
      color: white !important;
      background: rgba(255, 255, 255, 0.25) !important;
    }

    .slot-status.available {
      color: white !important;
      background: rgba(255, 255, 255, 0.25) !important;
    }
  }

  &.disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.5;
    border-color: #e0e0e0;
  }

  .slot-time {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .slot-status {
    font-size: 13px;
    color: #9e9e9e;
    padding: 4px 12px;
    border-radius: 12px;
    background: #f5f5f5;

    &.available {
      color: #2E7D32;
      background: #E8F5E9;
    }
  }
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #E0F2F1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #F9FAFB;
  border-radius: 0 0 16px 16px;
}

.btn {
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &.btn-cancel {
    background: #ffffff;
    color: #6b7280;
    border: 2px solid #E0F2F1;

    &:hover {
      background: #F1F8E9;
      border-color: #81C784;
      color: #2E7D32;
    }
  }

  &.btn-confirm {
    background: linear-gradient(135deg, #66BB6A 0%, #4DB6AC 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(77, 182, 172, 0.3);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #5CB860 0%, #45A89E 100%);
      box-shadow: 0 6px 16px rgba(77, 182, 172, 0.4);
      transform: translateY(-2px);
    }

    &:disabled {
      background: #A5D6A7;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
  }
}
</style>

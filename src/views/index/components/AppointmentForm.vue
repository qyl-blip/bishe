<template>
  <div v-if="visible" class="form-overlay" @click.self="handleCancel">
    <div class="form-modal">
      <div class="modal-header">
        <h3>填写预约信息</h3>
        <span class="close-btn" @click="handleCancel">&times;</span>
      </div>

      <div class="modal-body">
        <div class="form-item">
          <label>预约日期</label>
          <div class="form-value">{{ appointmentData.date ? formatDate(appointmentData.date) : '未选择' }}</div>
        </div>

        <div class="form-item">
          <label>预约时间</label>
          <div class="form-value">{{ appointmentData.timeSlot || '未选择' }}</div>
        </div>

        <div class="form-item">
          <label>接收人姓名 <span class="required">*</span></label>
          <input 
            v-model="formData.receiverName" 
            placeholder="请输入接收人姓名"
            class="form-input"
          />
        </div>

        <div class="form-item">
          <label>接收人电话 <span class="required">*</span></label>
          <input 
            v-model="formData.receiverPhone" 
            placeholder="请输入接收人电话"
            class="form-input"
            type="tel"
            maxlength="11"
          />
        </div>

        <div class="form-item">
          <label>接收人地址 <span class="required">*</span></label>
          <textarea 
            v-model="formData.receiverAddress" 
            placeholder="请输入详细地址"
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>

        <div class="form-item">
          <label>备注</label>
          <textarea 
            v-model="formData.remark" 
            placeholder="其他需要说明的信息(选填)"
            class="form-textarea"
            rows="2"
          ></textarea>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-cancel" @click="handleCancel">取消</button>
        <button 
          class="btn btn-confirm" 
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ submitting ? '提交中...' : '确认预约' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppointmentForm',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appointmentData: {
      type: Object,
      required: true
    }
  },
  emits: ['confirm', 'cancel', 'update:visible'],
  data() {
    return {
      formData: {
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        remark: ''
      },
      submitting: false,
      error: null
    };
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      const weekDay = weekDays[date.getDay()];
      return `${dateStr} (周${weekDay})`;
    },

    validateForm() {
      if (!this.formData.receiverName.trim()) {
        this.error = '请输入接收人姓名';
        return false;
      }
      if (!this.formData.receiverPhone.trim()) {
        this.error = '请输入接收人电话';
        return false;
      }
      if (!/^1[3-9]\d{9}$/.test(this.formData.receiverPhone)) {
        this.error = '请输入正确的手机号码';
        return false;
      }
      if (!this.formData.receiverAddress.trim()) {
        this.error = '请输入接收人地址';
        return false;
      }
      return true;
    },

    handleSubmit() {
      this.error = null;
      
      if (!this.validateForm()) {
        return;
      }

      this.$emit('confirm', this.formData);
    },

    handleCancel() {
      this.$emit('cancel');
      this.$emit('update:visible', false);
    },

    resetForm() {
      this.formData = {
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        remark: ''
      };
      this.error = null;
      this.submitting = false;
    },

    setSubmitting(value) {
      this.submitting = value;
    }
  }
};
</script>

<style scoped lang="less">
.form-overlay {
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
  z-index: 9999 !important;
  animation: fadeIn 0.2s ease;
  overflow-y: auto;
  padding: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.form-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 520px;
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

.form-item {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #374151;
    font-weight: 600;

    .required {
      color: #f44336;
      margin-left: 2px;
    }
  }

  .form-value {
    padding: 12px 16px;
    background: #F1F8E9;
    border-radius: 10px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    border: 2px solid #E0F2F1;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #E0F2F1;
    border-radius: 10px;
    font-size: 14px;
    box-sizing: border-box;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    background: #ffffff;
    color: #1f2937;

    &:hover {
      border-color: #81C784;
    }

    &:focus {
      outline: none;
      border-color: #66BB6A;
      box-shadow: 0 0 0 3px rgba(102, 187, 106, 0.1);
      background: #F9FFF9;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .form-textarea {
    resize: vertical;
    font-family: inherit;
    min-height: 80px;
  }
}

.error-message {
  color: #d32f2f;
  padding: 12px 16px;
  background: #ffebee;
  border-radius: 10px;
  font-size: 14px;
  margin-top: 12px;
  border-left: 3px solid #f44336;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
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

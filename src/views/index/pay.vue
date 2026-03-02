<template>
  <div class="page-surface">
    <Header/>
    <div class="pay-content">
      <div class="title">订单提交成功</div>
      <div class="text time-margin">
        <span>请在 </span>
        <span class="time">{{ ddlTime }}</span>
        <span> 之前付款，超时订单将自动取消</span>
      </div>
      <div class="text">支付金额</div>
      <div class="price">
        <span class="num">{{ amount }}</span>
        <span>￥</span>
      </div>
      <div class="pay-choose-view">
        <div class="pay-choose-box flex-view">
          <div class="choose-box choose-box-active">
            <img :src="WxPayIcon">
            <span>微信支付</span>
          </div>
          <div class="choose-box">
            <img :src="AliPayIcon">
            <span>支付宝</span>
          </div>
        </div>
        <div class="tips">请选择任意一种支付方式</div>
        <button class="pay-btn pay-btn-active" @click="handlePay()">确认支付</button>
      </div>
      <div class="pay-qr-view" style="display: none;">
        <div class="loading-tip">正在生成二维码，请稍候...</div>
        <div class="qr-box" style="display: none;">
          <div id="qrCode" class="qr"></div>
          <div class="tips">请使用微信扫一扫进行支付</div>
          <button class="pay-finish-btn">支付完成</button>
          <button class="back-pay-btn">选择其他支付方式</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import Header from '/@/views/index/components/header.vue'
import {message} from "ant-design-vue";
import WxPayIcon from '/@/assets/images/wx-pay-icon.svg';
import AliPayIcon from '/@/assets/images/ali-pay-icon.svg';

const route = useRoute();

let ddlTime = ref()
let amount = ref()

onMounted(() => {
  amount.value = route.query.amount
  ddlTime.value = formatDate(new Date().getTime(), 'YY-MM-DD hh:mm:ss')
})

const handlePay = () => {
  message.warn('暂无支付功能')
}
const formatDate = (time, format = 'YY-MM-DD hh:mm:ss') => {
  const date = new Date(time)

  const year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate() + 1,
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds()
  const preArr = Array.apply(null, Array(10)).map(function (elem, index) {
    return '0' + index
  })

  return format.replace(/YY/g, year)
      .replace(/MM/g, preArr[month] || month)
      .replace(/DD/g, preArr[day] || day)
      .replace(/hh/g, preArr[hour] || hour)
      .replace(/mm/g, preArr[min] || min)
      .replace(/ss/g, preArr[sec] || sec)
}

</script>

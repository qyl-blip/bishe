import { get, post } from '/@/utils/http/axios';

/**
 * 预约 API 客户端模块
 * 封装预约时间选择相关的后端接口调用
 */

/**
 * 获取指定日期的可用时间段
 * @param date 日期 (格式: yyyy-MM-dd)
 * @param thingId 服务ID
 * @returns Promise<TimeSlotDTO[]>
 */
export function getAvailableSlots(date: string, thingId: string) {
  return get({
    url: '/api/appointment/availableSlots',
    params: { date, thingId },
    timeout: 10000, // 10秒超时
  });
}

/**
 * 创建预约
 * @param appointmentData 预约数据
 * @returns Promise<{appointmentId: string, appointmentNumber: string}>
 */
export function createAppointment(appointmentData: {
  thingId: string;
  appointmentDate: string;
  slotId: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  remark?: string;
}) {
  return post({
    url: '/api/appointment/create',
    params: appointmentData,
    timeout: 10000,
  });
}

/**
 * 获取用户的预约列表
 * @returns Promise<Appointment[]>
 */
export function getUserAppointments() {
  return get({
    url: '/api/appointment/list',
    timeout: 10000,
  });
}

/**
 * 获取收到的预约列表
 * @returns Promise<Appointment[]>
 */
export function getReceivedAppointments() {
  return get({
    url: '/api/appointment/received',
    timeout: 10000,
  });
}

/**
 * 更新预约状态
 * @param appointmentId 预约ID
 * @param status 新状态 (0:待服务, 1:已完成, 2:已取消, 3:已拒绝)
 * @returns Promise<any>
 */
export function updateAppointmentStatus(appointmentId: string, status: string) {
  return post({
    url: '/api/appointment/updateStatus',
    params: { appointmentId, status },
    timeout: 10000,
  });
}

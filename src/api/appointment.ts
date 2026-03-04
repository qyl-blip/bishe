import {get, post} from '/@/utils/http/axios';

enum URL {
    list = '/api/appointment/admin/list',
    updateStatus = '/api/appointment/updateStatus',
    getAvailableSlots = '/api/appointment/availableSlots',
    create = '/api/appointment/create',
    userList = '/api/appointment/list',
    receivedList = '/api/appointment/received',
}

const listApi = async (params: any) =>
    get<any>({url: URL.list, params: params, data: {}, headers: {}});

const updateStatusApi = async (data: any) =>
    post<any>({url: URL.updateStatus, params: {}, data: data, headers: {}});

const getAvailableSlots = async (params: any) =>
    get<any>({url: URL.getAvailableSlots, params: params, data: {}, headers: {}});

const createAppointment = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
        }
    });
    return post<any>({url: URL.create, params: {}, data: formData, headers: {}});
};

const getUserAppointments = async () =>
    get<any>({url: URL.userList, params: {}, data: {}, headers: {}});

const getReceivedAppointments = async () =>
    get<any>({url: URL.receivedList, params: {}, data: {}, headers: {}});

const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    const formData = new FormData();
    formData.append('appointmentId', appointmentId);
    formData.append('status', status);
    return post<any>({url: URL.updateStatus, params: {}, data: formData, headers: {}});
};

export {listApi, updateStatusApi, getAvailableSlots, createAppointment, getUserAppointments, getReceivedAppointments, updateAppointmentStatus};

import { get, post } from '/@/utils/http/axios';

enum URL {
    list = '/api/recommendConfig/list',
    active = '/api/recommendConfig/active',
    create = '/api/recommendConfig/create',
    update = '/api/recommendConfig/update',
    delete = '/api/recommendConfig/delete',
}

const listApi = async (params?: any) => get<any>({ url: URL.list, params: params || {} });
const activeApi = async () => get<any>({ url: URL.active, params: {} });
const createApi = async (data: any) =>
    post<any>({ url: URL.create, data, headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' } });
const updateApi = async (data: any) =>
    post<any>({ url: URL.update, data, headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' } });
const deleteApi = async (params: any) => post<any>({ url: URL.delete, params });

export { listApi, activeApi, createApi, updateApi, deleteApi };

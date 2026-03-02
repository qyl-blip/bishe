import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showMessage } from './status';
import { IResponse } from './type';
import { getToken } from '/@/utils/auth';
import { TokenPrefix } from '/@/utils/auth';
import {ADMIN_USER_TOKEN, USER_TOKEN, BASE_URL} from '/@/store/constants'

const service: AxiosInstance = axios.create({
  // baseURL: import.meta.env.BASE_URL + '',
  baseURL: BASE_URL + '',
  timeout: 15000,
});

// axios实例拦截请求
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 优先使用管理员TOKEN，如果不存在则使用普通用户TOKEN
    const adminToken = localStorage.getItem(ADMIN_USER_TOKEN);
    const userToken = localStorage.getItem(USER_TOKEN);
    
    // 后端只检查TOKEN header，所以我们需要将正确的token放到TOKEN header中
    if (adminToken) {
      config.headers.TOKEN = adminToken;
    } else if (userToken) {
      config.headers.TOKEN = userToken;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// axios实例拦截响应
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if(response.status == 200) {
      if(response.data.code == 0 || response.data.code == 200) {
        return response
      }else {
        return Promise.reject(response.data)
      }
    } else {
      return Promise.reject(response.data)
    }
  },
  // 请求失败
  (error: any) => {
    if (error.response) {
      console.log('响应错误状态码:', error.response.status)
      if(error.response.status == 404) {
        // todo
      } else if(error.response.status == 403) {
        // todo
      }
    } else if (error.request) {
      console.error('请求已发送但没有收到响应:', error.request)
    } else {
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  },
);



const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const conf = config;
  return new Promise((resolve, reject) => {
    service.request<any, AxiosResponse<IResponse>>(conf).then((res: AxiosResponse<IResponse>) => {
      const data = res.data
      resolve(data as T);
    }).catch(err => {
      reject(err)
    });
  });
};

export function get<T = any>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: 'GET' });
}

export function post<T = any>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: 'POST' });
}

export default request;

export type { AxiosInstance, AxiosResponse };

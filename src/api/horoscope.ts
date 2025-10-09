import axios from 'axios';
import type { ApiResponse, ApiResult, HoroscopeItem } from './types';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'https://apis.tianapi.com',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API 请求错误:', error);
    return Promise.reject(error);
  }
);

// 获取星座运势
export const getHoroscope = async (
  astro: string,
  apiKey: string = '251b6d9ae33c107e74d5e3d89ebd6ea1'
): Promise<ApiResponse<ApiResult>> => {
  try {
    const response = await api.get<any, ApiResponse<ApiResult>>('/star/index', {
      params: {
        key: apiKey,
        astro,
      },
    });
    return response;
  } catch (error) {
    // 如果 API 请求失败，返回模拟数据
    console.warn('API 请求失败，使用模拟数据:', error);
    return getMockHoroscope(astro);
  }
};

// 模拟数据（用于开发和测试）
const getMockHoroscope = (astro: string): ApiResponse<ApiResult> => {
  const mockList: HoroscopeItem[] = [
    { type: '综合指数', content: `${Math.floor(Math.random() * 40) + 60}%` },
    { type: '爱情指数', content: `${Math.floor(Math.random() * 40) + 60}%` },
    { type: '工作指数', content: `${Math.floor(Math.random() * 40) + 60}%` },
    { type: '财运指数', content: `${Math.floor(Math.random() * 40) + 60}%` },
    { type: '健康指数', content: `${Math.floor(Math.random() * 40) + 60}%` },
    { type: '幸运数字', content: String(Math.floor(Math.random() * 10)) },
    { type: '幸运颜色', content: ['红色', '蓝色', '绿色', '紫色', '黄色', '粉色'][Math.floor(Math.random() * 6)] },
    { type: '贵人星座', content: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座'][Math.floor(Math.random() * 6)] },
    { type: '今日概述', content: `今天的${astro}运势不错，适合进行新的尝试和挑战。保持积极的心态，好运自然会来到你身边。` }
  ];

  return {
    code: 200,
    msg: 'success',
    result: {
      list: mockList
    }
  };
};

export default api;
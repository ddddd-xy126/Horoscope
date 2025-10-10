// 星座类型定义
export interface HoroscopeData {
  astro: string;
  date: string;
  all: string;
  love: string;
  health: string;
  money: string;
  work: string;
  luckynumber: string;
  luckycolor: string;
  summary: string;
}

// 新的数组形式运势数据类型
export interface HoroscopeItem {
  type: string;
  content: string;
}

// 支持两种数据结构的联合类型
export type HoroscopeDataType = HoroscopeData | HoroscopeItem[];

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  msg: string;
  result: T;
}

// 新的API响应结果类型
export interface ApiResult {
  list: HoroscopeItem[];
}

// 星座枚举
export enum Constellation {
  ARIES = '白羊座',
  TAURUS = '金牛座',
  GEMINI = '双子座',
  CANCER = '巨蟹座',
  LEO = '狮子座',
  VIRGO = '处女座',
  LIBRA = '天秤座',
  SCORPIO = '天蝎座',
  SAGITTARIUS = '射手座',
  CAPRICORN = '摩羯座',
  AQUARIUS = '水瓶座',
  PISCES = '双鱼座',
}

// 星座选项类型
export interface ConstellationOption {
  label: string;
  value: string;
  icon: string;
}

// 日期类型
export type DateType = 'today' | 'other';
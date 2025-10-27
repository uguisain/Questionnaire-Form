import { Injectable } from '@angular/core';

export interface formElement {
  formId: number;                                 // 表單 ID
  formName: string;                               // 表單名稱
  status: string;                                 // 狀態（進行中／已結束）
  formfromDate: string;                           // 起始日期（字串）
  formToDate: string;                             // 結束日期（字串）
  fillOut: string;                                // 操作文字（例如：填寫）
}

// === 你的假資料（直接貼進來） ===
const ELEMENT_DATA: formElement[] = [
  {formId: 1, formName: '喜歡的動物', status: '進行中', formfromDate: '2025-10-01', formToDate: '2025-10-31', fillOut: '填寫'},
  {formId: 2, formName: '喜歡的花', status: '進行中', formfromDate: '2025-09-01', formToDate: '2025-11-30', fillOut: '填寫'},
  {formId: 3, formName: '喜歡的食物', status: '已結束', formfromDate: '2025-01-01', formToDate: '2025-10-01', fillOut: '填寫'},
  {formId: 4, formName: '喜歡的歌手', status: '進行中', formfromDate: '2025-01-01', formToDate: '2025-12-31', fillOut: '填寫'},
  {formId: 5, formName: '喜歡的國家', status: '已結束', formfromDate: '2025-10-01', formToDate: '2025-10-05', fillOut: '填寫'},
  {formId: 6, formName: '喜歡的音樂類型', status: '進行中', formfromDate: '2025-10-01', formToDate: '2025-10-30', fillOut: '填寫'},
  {formId: 7, formName: '喜歡的顏色', status: '進行中', formfromDate: '2025-10-01', formToDate: '2025-11-30', fillOut: '填寫'},
  {formId: 8, formName: '你是什麼星座', status: '已結束', formfromDate: '2025-10-01', formToDate: '2025-10-20', fillOut: '填寫'},
  {formId: 9, formName: '我最常用的平台', status: '已結束', formfromDate: '2025-01-01', formToDate: '2025-10-01', fillOut: '填寫'},
  {formId: 10, formName: '你喜歡哪個3C品牌', status: '已結束', formfromDate: '2024-10-01', formToDate: '2025-02-20', fillOut: '填寫'},
];

@Injectable({ providedIn: 'root' })                         // 全域可用
export class ExampleService {
  // 取得全部表單（同步回傳，最簡單）
  getForms(): formElement[] {                               // 回傳型別是陣列
    return ELEMENT_DATA;                                    // 回傳假資料
  }
}

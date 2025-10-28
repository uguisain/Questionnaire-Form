import { Injectable } from '@angular/core';

// === 列表的假資料 ===
export interface formElement {
  formId: number;                                 // 表單 ID
  formName: string;                               // 表單名稱
  status: string;                                 // 狀態（進行中／已結束）
  formfromDate: string;                           // 起始日期（字串）
  formToDate: string;                             // 結束日期（字串）
  fillOut: string;                                // 操作文字（例如：填寫）
  description: string;                            // 表單說明
  options: any[];                                 // 表單問題
}

const ELEMENT_DATA: formElement[] = [
  {
    formId: 1,
    formName: "喜歡的動物",
    formfromDate: "2025-10-01",
    formToDate: "2025-10-31",
    status: "進行中",
    fillOut: "填寫",
    description: "表單說明",
    options: [
      {
        id: 1,
        name: "你是甚麼派?",
        option: [
          { ans: "貓派", code: 1 },
          { ans: "狗派", code: 2 },
          { ans: "鳥派", code: 3 },
          { ans: "其他", code: 4 }
        ]
      },
      {
        id: 2,
        name: "你有養寵物嗎?",
        option: [
          { ans: "有", code: 1 },
          { ans: "從來沒有", code: 2 },
          { ans: "曾經有，現在沒有", code: 3 }
        ]
      }
    ]
  },
  {
    formId: 2,
    formName: "飲食習慣調查",
    formfromDate: "2025-09-01",
    formToDate: "2025-12-31",
    status: "進行中",
    fillOut: "填寫",
    description: "了解您的日常飲食偏好。",
    options: [
      {
        id: 1,
        name: "您每天吃幾餐？",
        option: [
          { ans: "兩餐", code: 1 },
          { ans: "三餐", code: 2 },
          { ans: "不固定", code: 3 }
        ]
      },
      {
        id: 2,
        name: "您是否避免特定食物？",
        option: [
          { ans: "是，避免肉類", code: 1 },
          { ans: "是，避免乳製品", code: 2 },
          { ans: "否，幾乎什麼都吃", code: 3 }
        ]
      }
    ]
  },
  {
    formId: 3,
    formName: "旅遊喜好調查",
    formfromDate: "2025-07-10",
    formToDate: "2025-12-10",
    status: "已截止",
    fillOut: "檢視",
    description: "蒐集大家的旅遊偏好以做出推薦。",
    options: [
      {
        id: 1,
        name: "你最想去哪種類型的地點？",
        option: [
          { ans: "海邊", code: 1 },
          { ans: "山區", code: 2 },
          { ans: "城市", code: 3 },
          { ans: "海外", code: 4 }
        ]
      },
      {
        id: 2,
        name: "旅行時你偏好？",
        option: [
          { ans: "自由行", code: 1 },
          { ans: "跟團旅遊", code: 2 },
          { ans: "隨性而行", code: 3 }
        ]
      }
    ]
  },
  {
    formId: 4,
    formName: "工作環境滿意度",
    formfromDate: "2025-10-01",
    formToDate: "2025-11-15",
    status: "進行中",
    fillOut: "填寫",
    description: "請評估您對工作環境的感受。",
    options: [
      {
        id: 1,
        name: "您對辦公空間舒適度的滿意程度？",
        option: [
          { ans: "非常滿意", code: 1 },
          { ans: "普通", code: 2 },
          { ans: "不滿意", code: 3 }
        ]
      },
      {
        id: 2,
        name: "同事之間的氛圍如何？",
        option: [
          { ans: "融洽", code: 1 },
          { ans: "一般", code: 2 },
          { ans: "緊張", code: 3 }
        ]
      }
    ]
  },
  {
    formId: 5,
    formName: "使用者介面回饋",
    formfromDate: "2025-05-01",
    formToDate: "2025-10-01",
    status: "已截止",
    fillOut: "檢視",
    description: "收集您對本系統操作介面的意見。",
    options: [
      {
        id: 1,
        name: "系統操作是否容易理解？",
        option: [
          { ans: "非常容易", code: 1 },
          { ans: "尚可", code: 2 },
          { ans: "很困難", code: 3 }
        ]
      },
      {
        id: 2,
        name: "版面設計是否清晰？",
        option: [
          { ans: "清晰", code: 1 },
          { ans: "普通", code: 2 },
          { ans: "混亂", code: 3 }
        ]
      }
    ]
  },
  {
    formId: 6,
    formName: "早晨習慣調查",
    formfromDate: "2025-08-15",
    formToDate: "2025-11-15",
    status: "進行中",
    fillOut: "填寫",
    description: "調查大家早上起床後的習慣。",
    options: [
      {
        id: 1,
        name: "起床後第一件事是？",
        option: [
          { ans: "滑手機", code: 1 },
          { ans: "喝水或吃早餐", code: 2 },
          { ans: "賴床", code: 3 }
        ]
      },
      {
        id: 2,
        name: "您幾點起床？",
        option: [
          { ans: "5-6點", code: 1 },
          { ans: "7-8點", code: 2 },
          { ans: "9點以後", code: 3 }
        ]
      }
    ]
  },
  {
    formId: 7,
    formName: "節日活動偏好",
    formfromDate: "2025-11-01",
    formToDate: "2025-12-31",
    status: "預告中",
    fillOut: "尚未開放",
    description: "請分享您最期待的節慶活動！",
    options: [
      {
        id: 1,
        name: "您最喜歡的節日是？",
        option: [
          { ans: "聖誕節", code: 1 },
          { ans: "中秋節", code: 2 },
          { ans: "新年", code: 3 },
          { ans: "萬聖節", code: 4 }
        ]
      },
      ]}

]

// === 回傳 ===
@Injectable({ providedIn: 'root' })                         // 全域可用
export class ExampleService {
  // 取得全部表單（同步回傳，最簡單）
  getForms(): formElement[] {                               // 回傳型別是陣列
    return ELEMENT_DATA;                                    // 回傳假資料
  }
}

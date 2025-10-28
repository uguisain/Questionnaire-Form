import { Injectable } from '@angular/core';

// === 列表的假資料 ===
export interface formElement {
  id: number;                                 // 表單 ID
  name: string;                               // 表單名稱
  startDate: string;                           // 起始日期（字串）
  endDate: string;                             // 結束日期（字串）
  description: string;                            // 表單說明
  options: any[];                                 // 表單問題
}

const ELEMENT_DATA: formElement[] = [
  {
    id: 1,
    name: "喜歡的動物",
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    description: "表單說明",
    options: [
      {
        questionId: 1,
        question: "你是甚麼派?",
        option: [
          { ans: "貓派", code: 1 },
          { ans: "狗派", code: 2 },
          { ans: "鳥派", code: 3 },
          { ans: "其他", code: 4 }
        ]
      },
      {
        questionId: 2,
        question: "你有養寵物嗎?",
        option: [
          { ans: "有", code: 1 },
          { ans: "從來沒有", code: 2 },
          { ans: "曾經有，現在沒有", code: 3 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "飲食習慣調查",
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    description: "了解您的日常飲食偏好。",
    options: [
      {
        questionId: 1,
        question: "您每天吃幾餐？",
        option: [
          { ans: "兩餐", code: 1 },
          { ans: "三餐", code: 2 },
          { ans: "不固定", code: 3 }
        ]
      },
      {
        questionId: 2,
        question: "您是否避免特定食物？",
        option: [
          { ans: "是，避免肉類", code: 1 },
          { ans: "是，避免乳製品", code: 2 },
          { ans: "否，幾乎什麼都吃", code: 3 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "旅遊喜好調查",
    startDate: "2025-07-10",
    endDate: "2025-12-10",
    description: "蒐集大家的旅遊偏好以做出推薦。",
    options: [
      {
        questionId: 1,
        question: "你最想去哪種類型的地點？",
        option: [
          { ans: "海邊", code: 1 },
          { ans: "山區", code: 2 },
          { ans: "城市", code: 3 },
          { ans: "海外", code: 4 }
        ]
      },
      {
        questionId: 2,
        question: "旅行時你偏好？",
        option: [
          { ans: "自由行", code: 1 },
          { ans: "跟團旅遊", code: 2 },
          { ans: "隨性而行", code: 3 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "工作環境滿意度",
    startDate: "2025-10-01",
    endDate: "2025-11-15",
    description: "請評估您對工作環境的感受。",
    options: [
      {
        questionId: 1,
        question: "您對辦公空間舒適度的滿意程度？",
        option: [
          { ans: "非常滿意", code: 1 },
          { ans: "普通", code: 2 },
          { ans: "不滿意", code: 3 }
        ]
      },
      {
        questionId: 2,
        question: "同事之間的氛圍如何？",
        option: [
          { ans: "融洽", code: 1 },
          { ans: "一般", code: 2 },
          { ans: "緊張", code: 3 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "使用者介面回饋",
    startDate: "2025-05-01",
    endDate: "2025-10-01",
    description: "收集您對本系統操作介面的意見。",
    options: [
      {
        questionId: 1,
        question: "系統操作是否容易理解？",
        option: [
          { ans: "非常容易", code: 1 },
          { ans: "尚可", code: 2 },
          { ans: "很困難", code: 3 }
        ]
      },
      {
        questionId: 2,
        question: "版面設計是否清晰？",
        option: [
          { ans: "清晰", code: 1 },
          { ans: "普通", code: 2 },
          { ans: "混亂", code: 3 }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "早晨習慣調查",
    startDate: "2025-08-15",
    endDate: "2025-11-15",
    description: "調查大家早上起床後的習慣。",
    options: [
      {
        questionId: 1,
        question: "起床後第一件事是？",
        option: [
          { ans: "滑手機", code: 1 },
          { ans: "喝水或吃早餐", code: 2 },
          { ans: "賴床", code: 3 }
        ]
      },
      {
        questionId: 2,
        question: "您幾點起床？",
        option: [
          { ans: "5-6點", code: 1 },
          { ans: "7-8點", code: 2 },
          { ans: "9點以後", code: 3 }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "節日活動偏好",
    startDate: "2025-11-01",
    endDate: "2025-12-31",
    description: "請分享您最期待的節慶活動！",
    options: [
      {
        questionId: 1,
        question: "您最喜歡的節日是？",
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

  getFormById(id: number): formElement | undefined {
  return ELEMENT_DATA.find(x => x.id === id);
}
}

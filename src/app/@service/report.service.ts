import { Injectable } from '@angular/core';

const ReporData = [
  {
    id: 1,
    name: "喜歡的動物",
    status: "success",
    message: "統計成功",
    timestamp: "2025-10-30",
    statisticsVoList: [
        {
            questionId: 1,
            question: "你是甚麼派?",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "貓派", count: 42 },
                { option: "狗派", count: 37 },
                { option: "鳥派", count: 5 },
                { option: "其他", count: 3 }
            ]
        },
        {
            questionId: 2,
            question: "你有養寵物嗎?",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "有", count: 33 },
                { option: "沒有", count: 28 },
                { option: "曾經有，現在沒有", count: 26 }
            ]
        }
    ]
},
{
    id: 2,
    name: "飲食習慣調查",
    status: "success",
    message: "統計成功",
    timestamp: "2025-10-30",
    statisticsVoList: [
        {
            questionId: 1,
            question: "您每天吃幾餐？",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "兩餐", count: 21 },
                { option: "三餐", count: 44 },
                { option: "不固定", count: 14 }
            ]
        },
        {
            questionId: 2,
            question: "您是否避免特定食物？",
            type: "singleChoice",
            required: false,
            optionCountVoList: [
                { option: "是，避免肉類", count: 9 },
                { option: "是，避免乳製品", count: 6 },
                { option: "否，幾乎什麼都吃", count: 64 }
            ]
        }
    ]
},
{
    id: 10,
    name: "睡眠品質調查",
    status: "success",
    message: "統計成功",
    timestamp: "2025-10-30",
    statisticsVoList: [
        {
            questionId: 1,
            question: "平均每日睡眠時數？",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "少於5小時", count: 12 },
                { option: "6-7小時", count: 31 },
                { option: "8小時以上", count: 18 }
            ]
        },
        {
            questionId: 2,
            question: "入睡是否容易？",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "很容易入睡", count: 14 },
                { option: "偶爾失眠", count: 28 },
                { option: "經常難以入睡", count: 19 }
            ]
        }
    ]
},
{
    id: 5,
    name: "使用者介面回饋",
    status: "success",
    message: "統計成功",
    timestamp: "2025-10-30",
    statisticsVoList: [
        {
            questionId: 1,
            question: "系統操作是否容易理解？",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "非常容易", count: 36 },
                { option: "尚可", count: 28 },
                { option: "很困難", count: 6 }
            ]
        },
        {
            questionId: 2,
            question: "版面設計是否清晰？",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "清晰", count: 40 },
                { option: "普通", count: 22 },
                { option: "混亂", count: 8 }
            ]
        }
    ]
},
{
    id: 8,
    name: "手機使用狀況",
    status: "success",
    message: "統計成功",
    timestamp: "2025-10-30",
    statisticsVoList: [
        {
            questionId: 1,
            question: "每日使用手機時間？",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "1小時以內", count: 9 },
                { option: "1-4小時", count: 31 },
                { option: "超過4小時", count: 45 }
            ]
        },
        {
            questionId: 2,
            question: "主要使用手機用途？",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "社群媒體", count: 38 },
                { option: "工作/學習", count: 22 },
                { option: "遊戲娛樂", count: 25 }
            ]
        }
    ]
},
{
    id: 7,
    name: "節日活動偏好",
    status: "success",
    message: "統計成功",
    timestamp: "2025-10-30",
    statisticsVoList: [
        {
            questionId: 1,
            question: "您最喜歡的節日是？",
            type: "singleChoice",
            required: true,
            optionCountVoList: [
                { option: "聖誕節", count: 33 },
                { option: "中秋節", count: 15 },
                { option: "新年", count: 28 },
                { option: "萬聖節", count: 12 }
            ]
        },
        {
            questionId: 2,
            question: "節日期間您會？",
            type: "singleChoice",
            required: false,
            optionCountVoList: [
                { option: "與家人聚會", count: 41 },
                { option: "外出旅行", count: 24 },
                { option: "在家休息", count: 23 }
            ]
        }
    ]
}
]

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor() { }
  // 取得全部結果報表（同步回傳）
  getReport(): any[] {
    return ReporData;
  }
  // 依 ID 取得單一結果
  getReportById(id: number): any | undefined {
    return ReporData.find(x => x.id === id);
  }
}

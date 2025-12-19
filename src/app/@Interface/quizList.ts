export interface QuizList {}

// API 最外層格式
export interface ApiResponse<T> {
  code: string;
  message: string;
  quizList: T[]; // 告訴他這邊是陣列[]
}

// 首頁清單
export interface HomeList {
  id: number;          // 問卷 ID
  title: string;       // 問卷標題
  description: string; // 問卷描述
  startDate: string;   // 開始時間
  endDate: string;     // 結束時間
  published: boolean;  // 是否公開
}



export interface AuthModel {
}

// 定義使用者與登入狀態的基本型別，之後串接 API 只要保持欄位相同即可
export interface UserProfile {
  id: number;          // 使用者 ID（假資料）
  name: string;        // 姓名
  email: string;       // 信箱
  phone?: string;      // 電話（可選）
  age?: number;        // 年齡（可選）
}

export interface QuestionnaireSummary {
  id: number;          // 問卷 ID
  title: string;       // 問卷標題
  createdAt: string;   // 建立時間（字串即可）
}

export interface AuthState {
  token: string | null;                 // 假的登入憑證
  user: UserProfile | null;             // 當前登入使用者
  // myCreated: QuestionnaireSummary[];    // 我建立的問卷
  myAnswered: QuestionnaireSummary[];   // 我填過的問卷
}

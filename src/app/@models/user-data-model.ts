export interface UserDataModel {
}

export type UserRole = 'USER' | 'ADMIN';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  role: UserRole;
}

// 問卷摘要（沿用你現在的 QuestionnaireSummary 寫法）
export interface QuestionnaireSummary {
  id: number;
  title: string;
  createdAt: string; // yyyy-MM-dd
}

// 帶密碼的完整用戶紀錄（這個會對應未來 API 回傳的一整包 user json）
// 現在密碼就當假資料用，未來會只從後端拿，不會存在前端
export interface UserRecord extends UserProfile {
  password: string;
}

// 「用戶資料 JSON」的整包格式
export interface UserDataStore {
  user: UserRecord;                  // 用戶資訊
  myCreated: QuestionnaireSummary[]; // 我新增的表單
  myAnswered: QuestionnaireSummary[];// 我填寫過的表單
}

export interface AuthState {
  token: string | null;                 // 假的登入憑證
  user: UserProfile | null;             // 當前登入使用者
  myCreated: QuestionnaireSummary[];    // 我建立的問卷
  myAnswered: QuestionnaireSummary[];   // 我填過的問卷
}

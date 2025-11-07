import { Injectable, EventEmitter } from '@angular/core';
import { AuthState, UserProfile, QuestionnaireSummary } from '../@models/auth-model';

const STORAGE_KEY = 'mock_auth_state'; // localStorage 的鍵名

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 用 EventEmitter 通知各處（像 Toolbar）登入狀態改變
  authChanged = new EventEmitter<AuthState>();

  private state: AuthState = {
    token: null,       // 預設未登入
    user: null,        // 無使用者
    myCreated: [],     // 我建立的問卷清單
    myAnswered: [],    // 我填過的問卷清單
  };

  constructor() {
    // 啟動時嘗試從 localStorage 還原狀態
    const raw = localStorage.getItem(STORAGE_KEY);        // 讀取字串
    if (raw) {
      this.state = JSON.parse(raw);                       // 還原為物件
    } else {
      // 第一次可放一點示範資料（之後可改為空）
      this.seed();                                        // 建立示範帳號與問卷
      this.save();                                        // 存進 localStorage
    }
  }

  private seed() {
    // 建立一個示範使用者與兩個清單
    const demoUser: UserProfile = {
      id: 1,
      name: '示範用戶',
      email: 'demo@example.com',
      phone: '0912-345-678',
      age: 22,
    };
    const created: QuestionnaireSummary[] = [
      { id: 101, title: '我的第一份問卷', createdAt: '2025-10-10' },
      { id: 102, title: '顧客滿意度小調查', createdAt: '2025-10-18' },
    ];
    const answered: QuestionnaireSummary[] = [
      { id: 201, title: '校園午餐口味調查', createdAt: '2025-09-30' },
    ];
    // 注意：seed 不登入，只是提供假資料庫概念
    this.state.myCreated = created;     // 假資料（我的問卷）
    this.state.myAnswered = answered;   // 假資料（我填過的）
  }

  private save() {
    // 把現在的狀態寫回 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    // 通知畫面更新（Toolbar、頁面等）
    this.authChanged.emit(this.state);
  }

  login(email: string, password: string): boolean {
    // 假驗證規則：只要 Email 為 demo@example.com、密碼任意就放行
    if (email === 'demo@example.com' && password.length > 0) {
      this.state.user = {
        id: 1,
        name: '示範用戶',
        email: 'demo@example.com',
        phone: '0912-345-678',
        age: 22,
      };
      this.state.token = 'MOCK_TOKEN_ABC123'; // 假 token 字串
      this.save();                             // 存檔與廣播
      return true;                             // 回傳成功
    }
    return false; // 其他帳密視為失敗
  }

  logout() {
    // 登出：清除 token 與使用者（清單保留以示範，但你也可以清空）
    this.state.token = null;     // 無 token
    this.state.user = null;      // 無使用者
    this.save();                 // 存檔與廣播
  }

  isLoggedIn(): boolean {
    // 有 token 視為登入
    return !!this.state.token;
  }

  getState(): AuthState {
  return {
    ...this.state,
    myCreated: [...this.state.myCreated],
    myAnswered: [...this.state.myAnswered],
  };
}

  updateProfile(patch: Partial<UserProfile>) {
    // 修改使用者資料（例如 name/phone/age）
    if (!this.state.user) return;             // 未登入就不處理
    this.state.user = { ...this.state.user, ...patch }; // 合併變更
    this.save();                               // 存檔與廣播
  }

  getMyCreated(): QuestionnaireSummary[] {
    // 取得我建立的問卷清單
    return [...this.state.myCreated];          // 回傳拷貝
  }

  getMyAnswered(): QuestionnaireSummary[] {
    // 取得我填過的問卷清單
    return [...this.state.myAnswered];         // 回傳拷貝
  }

  deleteMyCreated(id: number) {
    // 刪除自己建立的問卷（僅從假清單移除）
    this.state.myCreated = this.state.myCreated.filter(q => q.id !== id);
    this.save();                               // 存檔與廣播
  }
}

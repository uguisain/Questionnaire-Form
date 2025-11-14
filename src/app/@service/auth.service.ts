import { Injectable, EventEmitter } from '@angular/core';
import { UserProfile, QuestionnaireSummary, AuthState } from '../@models/user-data-model';
import { UserDataService } from "../@service/user-data.service";
// import { AuthState } from '../@models/auth-model';

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

  constructor(private userData: UserDataService) {
    // 啟動時嘗試從 localStorage 還原狀態
    const raw = localStorage.getItem(STORAGE_KEY);        // 讀取字串
    if (raw) {
      this.state = JSON.parse(raw);                       // 還原為物件
    } else {
      // 第一次啟動時，從 UserDataService 拿「用戶資料 JSON」
      const profile = this.userData.getUserProfile();
      this.state.user = profile;                // 注意：這裡沒有 token，只是預設使用者
      this.state.myCreated = this.userData.getMyCreated();
      this.state.myAnswered = this.userData.getMyAnswered();
      this.save();
    }
  }

  // private seed() {
  //   // 示範使用者與兩個清單
  //   const demoUser: UserProfile = {
  //     id: 1,
  //     name: '示範用戶',
  //     email: 'demo@example.com',
  //     phone: '0912-345-678',
  //     age: 22,
  //   };
  //   const created: QuestionnaireSummary[] = [
  //     { id: 101, title: '我的第一份問卷', createdAt: '2025-10-10' },
  //     { id: 102, title: '顧客滿意度小調查', createdAt: '2025-10-18' },
  //   ];
  //   const answered: QuestionnaireSummary[] = [
  //     { id: 201, title: '校園午餐口味調查', createdAt: '2025-09-30' },
  //   ];
  //   // 注意：seed 不登入，只是提供假資料庫概念
  //   this.state.myCreated = created;     // 假資料（我的問卷）
  //   this.state.myAnswered = answered;   // 假資料（我填過的）
  // }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.authChanged.emit(this.state);
  }

  login(email: string, password: string): boolean {
    // 向 UserDataService 查詢這組帳密是哪個 user
    const record = this.userData.getUserByCredentials(email, password);

    if (!record) {
      // 沒找到 → 登入失敗
      return false;
    }

    // 告訴 UserDataService：現在是這個 user 登入
    this.userData.setCurrentUser(record);

    // 拿目前 user 的 profile（不含 password）
    const profile = this.userData.getUserProfile();

    // 塞進 AuthState
    this.state.user = profile;
    this.state.myCreated = this.userData.getMyCreated();
    this.state.myAnswered = this.userData.getMyAnswered();
    this.state.token = 'MOCK_TOKEN_ABC123'; // 假 token

    this.save();
    return true;
  }

  isAdmin(): boolean {
    return this.state.user?.role === 'ADMIN';
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
    if (!this.state.user) return;

    // 交給 UserDataService 更新資料庫
    const updated = this.userData.updateUserProfile(patch);

    // 再把最新資料同步回 AuthState
    this.state.user = updated;
    this.save();
  }

  getMyCreated(): QuestionnaireSummary[] {
    return [...this.state.myCreated];
  }

  getMyAnswered(): QuestionnaireSummary[] {
    return [...this.state.myAnswered];
  }

  addMyCreated(title: string) {
    // 讓 UserDataService 實際產生一筆問卷摘要
    const created = this.userData.addMyCreated(title);

    // 同步更新 AuthState 裡的 myCreated
    this.state.myCreated = this.userData.getMyCreated();
    this.save();
  }

  deleteMyCreated(id: number) {
    // 實際刪除交給 UserDataService
    this.userData.deleteMyCreated(id);

    // 再同步最新清單
    this.state.myCreated = this.userData.getMyCreated();
    this.save();
  }
}

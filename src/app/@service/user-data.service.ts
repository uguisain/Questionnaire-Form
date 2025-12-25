import { Injectable } from '@angular/core';
import { UserDataStore, UserRecord, QuestionnaireSummary } from '../@models/user-data-model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

// 這裡就當成「前端版資料庫」
  // 假帳號清單：只有這裡有密碼
  // private readonly mockUsers: UserRecord[] = [
  //   {
  //     id: 1,
  //     name: '示範用戶',
  //     email: 'demo@example.com',
  //     phone: '0912-345-678',
  //     age: 22,
  //     password: '1234567890',
  //     role: 'USER',          // 一般用戶
  //   },
  //   {
  //     id: 99,
  //     name: '管理者',
  //     email: 'admin@example.com',
  //     phone: '0000-000-000',
  //     age: 30,
  //     password: 'admin1234',
  //     role: 'ADMIN',         // 管理者
  //   },
  // ];

  // 目前「登入中的那個人」的資料
  // 這裡你可以沿用你原本的 store，只是我用一個預設：demo 用戶
  // private store: UserDataStore = {
  //   user: this.mockUsers[0],   // 預設先放示範用戶
  //   // myCreated: [],             // 不額外塞假表單，讓前端功能新增
  //   myAnswered: [],
  // };

  // /** 依 email + password 找出是哪個用戶 → 給 AuthService 登入用 */
  // getUserByCredentials(email: string, password: string): UserRecord | null {
  //   const found = this.mockUsers.find(
  //     u => u.email === email && u.password === password
  //   );
  //   return found ? { ...found } : null;
  // }

  // /** 登入成功後，切換目前的 user */
  // setCurrentUser(user: UserRecord) {
  //   this.store.user = { ...user };
  // }

  // // 取得完整的用戶紀錄（包括密碼）→ 給 AuthService 用
  // getUserRecord(): UserRecord {
  //   return { ...this.store.user };
  // }

  // // 取得「前端畫面用的 profile」→ 給 Profile / Toolbar 用
  // getUserProfile() {
  //   const { password, ...profile } = this.store.user;
  //   return { ...profile }; // 不把 password 給出去
  // }

  // // 更新用戶基本資料（名字 / 電話 / 年齡 etc.）
  // updateUserProfile(patch: Partial<UserRecord>) {
  //   this.store.user = { ...this.store.user, ...patch };
  //   return this.getUserProfile(); // 回傳更新後的 profile
  // }

  // // 取得「我新增的表單」清單
  // // getMyCreated(): QuestionnaireSummary[] {
  // //   return [...this.store.myCreated];
  // // }

  // // 取得「我填寫過的表單」清單
  // getMyAnswered(): QuestionnaireSummary[] {
  //   return [...this.store.myAnswered];
  // }

  // 新增一個「我建立的問卷」，
  // 這裡直接幫你產生 id / 建立日期，未來接後端就改成用 API 回傳
  // addMyCreated(title: string): QuestionnaireSummary {
  //   const newForm: QuestionnaireSummary = {
  //     id: Date.now(), // 先用 timestamp 當假 ID
  //     title,
  //     createdAt: new Date().toISOString().slice(0, 10),
  //   };

  //   this.store.myCreated = [newForm, ...this.store.myCreated];
  //   return newForm;
  // }

  // 刪除一個「我建立的問卷」
  // deleteMyCreated(id: number) {
  //   this.store.myCreated = this.store.myCreated.filter(f => f.id !== id);
  // }

  // 之後你有「填寫問卷」功能，就可以做類似：
  // addMyAnswered(summary: QuestionnaireSummary) { ... }

}


import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  pageMode: 'login' | 'register' | 'forgot' = 'login'; // 預設停在登入頁

  // 使用者輸入的帳密 -----------------------------------------
  username: string = '';        // 帳號（用輸入框綁定）
  password: string = '';        // 密碼（用輸入框綁定）

  // --- 註冊用欄位 ---
  regUsername: string = '';  // 新帳號
  regEmail: string = '';     // 新Email
  regPassword: string = '';  // 新密碼
  regConfirm: string = '';   // 確認密碼

  // --- 忘記密碼用欄位 ---
  forgotEmail: string = '';  // 要寄重設連結的Email

  // 登入狀態與目前登入者 -------------------------------------
  isLoggedIn: boolean = false;  // 是否已登入（用來切畫面）
  loginError: boolean = false;  // 是否登入失敗（顯示錯誤提示）
  currentUser: any = null;      // 登入成功後的使用者物件

  // 假資料：模擬後端的使用者清單 ----------------------------
  // 之後接後端時，把這段換成 call API 驗證
  private fakeUsers = [
    { id: 1, username: 'demo',  password: '1234', name: '示範用戶',   email: 'demo@example.com' },
    { id: 2, username: 'alice', password: '0000', name: '小艾 Alice', email: 'alice@example.com' },
  ];

  // 登入流程 ---------------------------------------------------
  login() {
    // 1) 先清空錯誤狀態
    this.loginError = false;        // 每次登入先把錯誤提示關掉

    // 2) 在假資料中找「帳號密碼都符合」的人
    const found = this.fakeUsers.find(u =>
      u.username === this.username && u.password === this.password
    );
    // 假碼示範：呼叫 API，把帳密送去後端驗證
    // this.authService.login(this.username, this.password).subscribe(res => {
    //   if (res.ok) { this.currentUser = res.user; this.isLoggedIn = true; }
    //   else { this.loginError = true; }
    // });

    // 3) 判斷是否找到對應使用者
    if (found) {
      // 3a) 登入成功 → 設定狀態與目前使用者
      this.isLoggedIn = true;       // 已登入
      this.currentUser = {          // 存一份使用者資訊（不含密碼）
        id: found.id,
        name: found.name,
        email: found.email,
      };

      // 3b)（可選）存在 localStorage：讓你重新整理也能保持登入狀態
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      // 3c) 測試用：印出成功訊息，確認流程
      console.log('✅ 登入成功：', this.currentUser);
    } else {
      // 3d) 登入失敗 → 顯示錯誤提示
      this.isLoggedIn = false;      // 未登入
      this.currentUser = null;      // 清空使用者
      this.loginError = true;       // 顯示「帳號或密碼錯誤」
      console.log('❌ 帳號或密碼錯誤');
    }
  }

  // （可選）登出 ----------------------------------------------------------------
  logout() {
    this.isLoggedIn = false;        // 變回未登入
    this.currentUser = null;        // 清空使用者
    localStorage.removeItem('currentUser'); // 清掉本機保存
  }

  // （可選）一進來就嘗試讀取本機的登入狀態（方便你測試）
  ngOnInit() {
    const saved = localStorage.getItem('currentUser'); // 從本機取回使用者
    if (saved) {
      this.currentUser = JSON.parse(saved); // 還原成物件
      this.isLoggedIn = true;               // 視為已登入
    }
  }

  // 註冊模式
  goRegister() { this.pageMode = 'register'; } // 切到註冊
  goLogin()    { this.pageMode = 'login'; }    // 回登入
  goForgot()   { this.pageMode = 'forgot'; }   // 切到忘記密碼

  // --- 註冊流程（最小驗證）---
  register() {
    // 1) 空值檢查
    if (!this.regUsername || !this.regEmail || !this.regPassword || !this.regConfirm) {
      alert('請填完所有欄位');            // 必填檢查
      return;                               // 中止
    }
    // 2) 密碼一致性
    if (this.regPassword !== this.regConfirm) {
      alert('兩次輸入的密碼不一致');       // 密碼確認
      return;                               // 中止
    }
    // 3) 帳號是否已存在
    const exists = this.fakeUsers.some(u => u.username === this.regUsername);
    if (exists) {
      alert('此帳號已被使用');              // 帳號重複
      return;                               // 中止
    }
    // 4) 寫進假資料（模擬後端建立使用者）
    const newUser = {
      id: Date.now(),                       // 簡單用時間戳當 id
      username: this.regUsername,           // 新帳號
      password: this.regPassword,           // 新密碼（真實後端不會存明碼）
      name: this.regUsername,               // 先用帳號當名稱
      email: this.regEmail,                 // Email
    };
    this.fakeUsers.push(newUser);           // 加進假資料
    alert('註冊成功，請使用新帳密登入');     // 提示成功
    this.goLogin();                         // 回登入頁
  }

  // --- 忘記密碼流程（最小版本：只檢查帳號是否存在，再提示）---
  sendReset() {
    if (!this.forgotEmail) {                // 檢查是否有填Email
      alert('請輸入 Email');
      return;                               // 中止
    }
    const exists = this.fakeUsers.some(u => u.email === this.forgotEmail);
    if (!exists) {
      alert('查無此 Email');               // 沒有這個Email
      return;                               // 中止
    }
    alert('已寄出重設密碼連結（模擬）');    // 模擬寄信
    this.goLogin();                          // 回登入頁
  }


















}



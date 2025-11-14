import { Component, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../@service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // dialog注入
  readonly dialog = inject(MatDialog);

  constructor(
    private auth: AuthService,   // 注入假登入服務
    private router: Router,      // 登入成功導頁
  ) {}

  pageMode: 'login' | 'register' | 'forgot' = 'login'; // 預設停在登入頁

  // 使用者輸入的帳密 -----------------------------------------
  email: string = '';        // 帳號（用輸入框綁定）
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
    const ok = this.auth.login(this.email, this.password); // true/false
    if (ok) {
      this.dialog.open(DialogComponent, {
        data: { title: '登入成功', Message: '歡迎回來！', status: 'success' },
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
      });
      this.router.navigateByUrl('/'); // 要改去 /profile 也可
    } else {
      this.dialog.open(DialogComponent, {
        data: { title: '登入失敗', Message: '帳號或密碼不正確', status: 'error' },
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
      });
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
      // 必填檢查
      this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: {title: '請填完所有欄位'},
        });
      return;                               // 中止
    }
    // 2) 密碼一致性
    if (this.regPassword !== this.regConfirm) {
      // 密碼確認
      this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: {title: '兩次輸入的密碼不一致'},
        });
      return;                               // 中止
    }
    // 3) 帳號是否已存在
    const exists = this.fakeUsers.some(u => u.username === this.regUsername);
    if (exists) {
      // 帳號重複
      this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: {title: '此帳號已被使用'},
        });
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
    // 提示成功
    this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: {title: '註冊成功，請使用新帳密登入'},
        });
    this.goLogin();                         // 回登入頁
  }

  // --- 忘記密碼流程（最小版本：只檢查帳號是否存在，再提示）---
  sendReset() {
    if (!this.forgotEmail) {                // 檢查是否有填Email
      this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: {title: '請輸入 Email'},
        });
      return;                               // 中止
    }
    const exists = this.fakeUsers.some(u => u.email === this.forgotEmail);
    if (!exists) {
      // 沒有這個Email
      this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: {title: '查無此 Email'},
        });
      return;                               // 中止
    }
    // 模擬寄信
    this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: {title: '已寄出重設密碼連結'},
        });
    this.goLogin();                          // 回登入頁
  }


















}



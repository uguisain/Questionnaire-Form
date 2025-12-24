import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../@service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpService } from '../@service/http.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  // dialog注入
  readonly dialog = inject(MatDialog);

  constructor(
    private auth: AuthService, // 注入假登入服務
    private router: Router, // 登入成功導頁
    private http: HttpService
  ) {}

  pageMode: 'login' | 'register' | 'forgot' = 'login'; // 預設停在登入頁

  // 使用者輸入的帳密 -----------------------------------------
  email: string = ''; // 帳號（用輸入框綁定）
  password: string = ''; // 密碼（用輸入框綁定）

  // --- 註冊用欄位 ---
  regUsername: string = ''; // 新帳號
  regEmail: string = ''; // 新Email
  regAge: number | null = null; // 新年齡
  regPhone: string = ''; // 新電話
  regPassword: string = ''; // 新密碼
  regConfirm: string = ''; // 確認密碼

  // --- 忘記密碼用欄位 ---
  forgotEmail: string = ''; // 要寄重設連結的Email

  // 登入狀態與目前登入者 -------------------------------------
  isLoggedIn: boolean = false; // 是否已登入（用來切畫面）
  loginError: boolean = false; // 是否登入失敗（顯示錯誤提示）
  currentUser: any = null; // 登入成功後的使用者物件

  // 假資料：模擬後端的使用者清單 ----------------------------
  // 之後接後端時，把這段換成 call API 驗證
  private fakeUsers = [
    {
      id: 1,
      username: 'demo',
      password: '1234',
      name: '示範用戶',
      email: 'demo@example.com',
    },
    {
      id: 2,
      username: 'alice',
      password: '0000',
      name: '小艾 Alice',
      email: 'alice@example.com',
    },
  ];

  // 登入流程 ---------------------------------------------------
  login() {
    const body = {
      email: this.email,
      password: this.password,
    };
    this.http.postApi('http://localhost:8080/user/login', body).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          // 把登入者存起來
          localStorage.setItem(
            'mock_user',
            JSON.stringify({
              email: res.email ?? body.email,
              name: res.name ?? '',
              phone: res.phone ?? '',
              age: res.age ?? ''
            })
          );
          this.router.navigate(['/home']);
        } else {
          this.dialog.open(DialogComponent, {
            data: { title: '登入失敗', Message: res.message },
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.dialog.open(DialogComponent, {
          data: { title: '登入失敗', Message: '伺服器錯誤' },
        });
      },
    });
  }

  // （可選）登出 ----------------------------------------------------------------
  logout() {
    this.isLoggedIn = false; // 變回未登入
    this.currentUser = null; // 清空使用者
    localStorage.removeItem('currentUser'); // 清掉本機保存
  }

  // （可選）一進來就嘗試讀取本機的登入狀態（方便你測試）
  ngOnInit() {
    const saved = localStorage.getItem('currentUser'); // 從本機取回使用者
    if (saved) {
      this.currentUser = JSON.parse(saved); // 還原成物件
      this.isLoggedIn = true; // 視為已登入
    }
  }

  // 註冊模式
  goRegister() {
    this.pageMode = 'register';
  } // 切到註冊
  goLogin() {
    this.pageMode = 'login';
  } // 回登入
  goForgot() {
    this.pageMode = 'forgot';
  } // 切到忘記密碼

  // --- 註冊流程（最小驗證）---
  register() {
    // 空值檢查
    if (
      !this.regUsername ||
      !this.regEmail ||
      !this.regPassword ||
      !this.regPhone ||
      !this.regAge ||
      !this.regConfirm
    ) {
      // 必填檢查
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '請填完所有欄位' },
      });
      return;
    }
    if (this.regUsername.length < 2) {
      // 用戶名檢查
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '用戶名需要大於一個字' },
      });
      return;
    }
    if (this.regPhone.length < 10) {
      // 手機號碼檢查
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '電話號碼至少需要10碼' },
      });
      return;
    }
    if (this.regPassword.length < 8) {
      // 密碼檢查
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '密碼至少需要8碼' },
      });
      return;
    }
    if (this.regEmail.length < 10) {
      // 信箱檢查
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '請輸入正確的信箱' },
      });
      return;
    }
    if (this.regAge < 18) {
      // 年齡檢查
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '年齡需要大於18歲' },
      });
      return;
    }
    // 密碼一致性
    if (this.regPassword !== this.regConfirm) {
      // 密碼確認
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '兩次輸入的密碼不一致' },
      });
      return;
    }
    // 信箱是否已存在
    const exists = this.fakeUsers.some((u) => u.email === this.regEmail);
    if (exists) {
      // 帳號重複
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '此帳號已被使用' },
      });
      return;
    }
    // 寫進入資料庫
    const reg = {
      name: this.regUsername,
      password: this.regPassword,
      phone: this.regPhone,
      email: this.regEmail,
      age: this.regAge,
    };
    console.log('送出最終註冊資料：' + JSON.stringify(reg, null, 2));
    this.http.postApi('http://localhost:8080/quiz/add_user', reg).subscribe({
      next: (res) => {
        console.log(res);
        // 提示成功
        this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: { title: '註冊成功，請使用新帳密登入' },
        });
        this.goLogin(); // 回登入頁
      },
      error: (err) => {
        console.error(err);
        // 提示失敗
        this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: { title: '註冊失敗，請重試' },
        });
      },
    });
  }

  // --- 忘記密碼流程（最小版本：只檢查帳號是否存在，再提示）---
  sendReset() {
    if (!this.forgotEmail) {
      // 檢查是否有填Email
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '請輸入 Email' },
      });
      return; // 中止
    }
    const exists = this.fakeUsers.some((u) => u.email === this.forgotEmail);
    if (!exists) {
      // 沒有這個Email
      this.dialog.open(DialogComponent, {
        enterAnimationDuration: '160ms',
        exitAnimationDuration: '120ms',
        data: { title: '查無此 Email' },
      });
      return; // 中止
    }
    // 模擬寄信
    this.dialog.open(DialogComponent, {
      enterAnimationDuration: '160ms',
      exitAnimationDuration: '120ms',
      data: { title: '已寄出重設密碼連結' },
    });
    this.goLogin(); // 回登入頁
  }
}

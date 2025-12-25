import { Injectable, EventEmitter, inject } from '@angular/core';
// import { UserProfile, AuthState } from '../@models/user-data-model';
import { UserDataService } from '../@service/user-data.service';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { throwError } from 'rxjs/internal/observable/throwError';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

const STORAGE_KEY = 'mock_auth_state'; // localStorage 的鍵名

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 用 EventEmitter 通知各處（像 Toolbar）登入狀態改變
  authChanged = new EventEmitter<AuthState>();
  // dialog注入
  readonly dialog = inject(MatDialog);

  private state: AuthState = {
    token: null, // 預設未登入
    user: null, // 無使用者
    // myCreated: [],     // 我建立的問卷清單
    myAnswered: [], // 我填過的問卷清單
  };

  constructor(private http: HttpService) {
    // 啟動時嘗試從 localStorage 還原狀態
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.state = JSON.parse(raw);
      } catch {
        // localStorage 壞掉就清掉
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    // 啟動時也廣播一次（讓畫面跟上）
    this.authChanged.emit(this.state);
  }

  /** 存檔 + 廣播 */
  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.authChanged.emit(this.state);
  }

  /** 登入2.0 */
  login(email: string, password: string) {
    const body = { email, password };

    return this.http
      .postApi<any>('http://localhost:8080/quiz/login', body)
      .pipe(
        tap((res: any) => {
          if (res?.code === 200) {
            // ✅ 後端回來的使用者資料，存到 state.user
            this.state.user = {
              name: res.name ?? '',
              email: res.email ?? email,
              phone: res.phone ?? '',
              age: res.age ?? 0,
            };

            // 你目前後端沒有 token，就不要硬塞
            this.state.token = null;

            // 你目前還沒做「已填清單」就先清空或保留都可
            // this.state.myAnswered = [];

            this.save();
          }
        })
      );
  }

  // 註冊2.0
  register(req: RegisterReq) {
    return this.http.postApi<RegisterRes>(
      'http://localhost:8080/quiz/add_user',
      req
    );
  }

  updateProfile(patch: {
    name: string;
    phone: string;
    age: number;
  }): Observable<any> {
    // 從目前登入者拿 email 當 PK
    const email = this.state.user?.email;
    if (!email) {
      return throwError(() => new Error('Not logged in'));
    }

    // 你如果堅持 req 要帶 email 也可以（照你說的）
    const body: UpdateProfileReq = {
      email,
      name: patch.name,
      phone: patch.phone,
      age: patch.age,
    };

    return this.http
      .postApi<any>(`http://localhost:8080/quiz/update_user`, body)
      .pipe(
        tap((res: any) => {
          if (res?.code === 200) {
            // 後端若有回最新 user，就用後端的（最準）
            // 如果後端只回 BasicRes 沒 user，就用 body 回寫也行（我下面也給）
            const nextUser = {
              name: res.name ?? body.name,
              email: res.email ?? email,
              phone: res.phone ?? body.phone,
              age: res.age ?? body.age,
            };

            this.state.user = nextUser;
            this.save();
          }
        })
      );
  }

  /** ✅ 登出 */
  logout() {
    this.state.token = null;
    this.state.user = null;
    this.state.myAnswered = [];
    this.save();
    this.dialog.open(DialogComponent, {
      enterAnimationDuration: '160ms',
      exitAnimationDuration: '120ms',
      data: { title: '登出成功' },
    });
  }

  /** ✅ 是否登入：改成「有 user 就算登入」 */
  isLoggedIn(): boolean {
    return !!this.state.user;
  }

  /** 取得整包狀態（給畫面用） */
  getState(): AuthState {
    return {
      ...this.state,
      myAnswered: [...this.state.myAnswered],
    };
  }

  /** ✅ 取得目前登入者 */
  getUser(): UserProfile | null {
    return this.state.user;
  }

  /** ✅ 取得 email（你很多 API 會用） */
  getEmail(): string {
    return this.state.user?.email ?? '';
  }

  getMyAnsweredId(email: String) {
    // 這邊之後再改成從當前登入狀態抓取email
    return this.http.getApi(
      'http://localhost:8080/quiz/get_answered?email=' + email
    );
  }
}

// ================================================ interface ==================================================
/** 使用者資料（登入成功後後端會回這些） */
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: number;
  // role?: 'ADMIN' | 'USER'; // 如果後端未提供，先不要放
}

/** 原本的 AuthState：token 先保留欄位，但現在不用它判斷登入 */
export interface AuthState {
  token: string | null; // 目前後端沒 token，就維持 null
  user: UserProfile | null;
  myAnswered: number[]; // 你原本保留
}

/** 後端：登入 req */
export interface LoginReq {
  email: string;
  password: string;
}

/** 後端：登入 res（你說成功會回 name/email/phone/age） */
export interface LoginRes {
  code: number;
  message: string;
  // 成功時帶 user 資料
  name: string;
  email: string;
  phone: string;
  age: number;
}

/** 後端：註冊 req */
export interface RegisterReq {
  name: string;
  email: string;
  phone: string;
  age: number;
  password: string;
}

/** 後端：更新 req（email 不改，所以不放） */
export interface UpdateProfileReq {
  name: string;
  phone: string;
  age: number;
  email: string;
}

/** 後端：更新 res（通常會回更新後的 user） */
export interface UpdateProfileRes {
  code: number;
  message: string;
  name: string;
  email: string;
  phone: string;
  age: number;
}

// 註冊 res（先用 any 最省事；之後要再補 interface 再補）
export interface RegisterRes {
  code: number;
  message: string;
}

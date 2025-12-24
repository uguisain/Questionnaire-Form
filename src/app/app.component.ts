import { Component, inject, ViewChild } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './@service/auth.service'; // 路徑依你的實際位置調整
import { AuthState } from './@models/auth-model'; // 同樣請用你的實際檔名
import {
  CreateFormDialogComponent,
  QuizCreateReq,
} from './create-form-dialog/create-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from './@service/http.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    HomeComponent,
    MatTabsModule,
    RouterLink,
    RouterLinkActive,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpService,
    private auth: AuthService
  ) {
    // 一進來先拿一次目前狀態（可能已登入或未登入）
    this.authState = this.auth.getState();

    // 當登入 / 登出時，AuthService 會發出 authChanged，我們就更新畫面用的狀態
    this.auth.authChanged.subscribe((state) => {
      this.authState = state;
    });
  }

  authState!: AuthState; // 用來存目前登入狀態

  // ===== Toolbar 需要的極少數屬性與方法 =====
  toolbarSearch: string = ''; // 搜尋框雙向綁定（你之後要用再接）
  menuOpen: boolean = false; // 小螢幕的導覽展開狀態

  toggleMenu() {
    // 點漢堡鈕時，切換導覽顯示/隱藏
    this.menuOpen = !this.menuOpen;
  }

  goLogin() {
    // 這裡用你的 Router 導向登入頁（依你的路由調整）
    this.router.navigate(['/Login']);
  }

  // 判斷現在是否登入
  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn(); // 直接問 AuthService
  }

  // 取得要顯示的名稱：登入時顯示用戶名，未登入顯示「遊客」
  get displayName(): string {
    if (this.authState && this.authState.user && this.authState.user.name) {
      return this.authState.user.name; // 有登入 → 顯示使用者姓名
    }
    return '遊客'; // 沒登入 → 顯示「遊客」
  }

  // 打開「新增問卷」Dialog
  openCreateFormDialog() {
    const dialogRef = this.dialog.open(CreateFormDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: QuizCreateReq | null) => {
      if (!result) return;

      // API
      this.http
        .postApi<any>('http://localhost:8080/quiz/create', result)
        .subscribe({
          next: (res) => {
            console.log('POST 成功回來', res);
            this.dialog.open(DialogComponent, {
              enterAnimationDuration: '160ms',
              exitAnimationDuration: '120ms',
              data: { title: '已新增表單' },
            });
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('POST 失敗', err);
          },
        });
    });
  }

  // 登出按鈕用
  logout(): void {
    this.auth.logout(); // 呼叫服務清掉登入狀態
    // 若你想登出後一定回首頁，可以順手導頁（看你有沒有注入 Router）
    this.router.navigateByUrl('/');
  }
}

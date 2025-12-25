import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../@service/auth.service';
// import { UserProfile, QuestionnaireSummary } from '../@models/auth-model';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import {
  CreateFormDialogComponent,
  QuizCreateReq,
} from '../create-form-dialog/create-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../@service/http.service';

@Component({
  selector: 'app-per-infor',
  imports: [CommonModule, FormsModule, MatTabsModule],
  templateUrl: './per-infor.component.html',
  styleUrl: './per-infor.component.scss',
})
export class PerInforComponent {
  user: any | null = null; // 用來綁定畫面顯示與編輯
  myAnswered: any[] = []; // 已填寫
  // myCreated: QuestionnaireSummary[] = []; // 我新增

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpService
  ) {
    // 一進來就從 AuthService 拿目前登入的使用者資料
    const state = this.auth.getState(); // 一次拿到現在狀態
    this.user = state.user;
  }

  save() {
    if (!this.user) return;
    if (this.user.age < 18) {
      this.dialog.open(DialogComponent, {
        data: { title: '用戶年齡必須大於18歲' },
      });
      return;
    }
    if (this.user.age > 120) {
      this.dialog.open(DialogComponent, {
        data: { title: '請輸入正確的用戶年齡' },
      });
      return;
    }
    if (this.user.name.length < 2) {
      this.dialog.open(DialogComponent, {
        data: { title: '用戶名至少須為2個字' },
      });
      return;
    }
    if (this.user.phone.length < 10) {
      this.dialog.open(DialogComponent, {
        data: { title: '請輸入正確的電話號碼' },
      });
      return;
    }

    this.auth
      .updateProfile({
        name: this.user.name,
        phone: this.user.phone,
        age: this.user.age,
      })
      .subscribe({
        next: (res: any) => {
          if (res?.code === 200) {
            this.dialog.open(DialogComponent, {
              data: { title: '已儲存' },
            });
          } else {
            this.dialog.open(DialogComponent, {
              data: {
                title: '儲存失敗',
                Message: res?.message || '請稍後再試',
              },
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.dialog.open(DialogComponent, {
            data: { title: '儲存失敗', Message: '伺服器錯誤' },
          });
        },
      });
  }

  // 放已填問卷的id陣列
  answeredId: any[] = [];
  // 放所有問卷資訊 (暫時)
  allQuiz: any[] = [];
  answeredQuiz: any[] = [];

  ngOnInit(): void {
    const email = this.auth.getEmail();
    this.auth.getMyAnsweredId(email).subscribe((res: any) => {
      console.log(res);

      // 假設後端回的是 quizIdList: [2,5,8]
      this.answeredId = res.quizIdList ?? [];
      console.log('answeredId:', this.answeredId);

      // getAll + filter
      this.http
        .getApi('http://localhost:8080/quiz/get_all')
        .subscribe((res: any) => {
          this.allQuiz = res.quizList;
          this.answeredQuiz = this.allQuiz.filter((q: any) =>
            this.answeredId.includes(q.id)
          );
          console.log(
            '篩選後已填寫問卷資料：' +
              JSON.stringify(this.answeredQuiz, null, 2)
          );
        });
    });
  }

  // 已填寫表單
  goAnsweredResult(id: number) {
    // 「結果頁路由」
    this.router.navigate(['/Report', id]);
  }
}

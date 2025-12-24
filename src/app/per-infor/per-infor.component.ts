import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../@service/auth.service';
import { UserProfile, QuestionnaireSummary } from '../@models/auth-model';
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
  user: UserProfile | null = null; // 用來綁定畫面顯示與編輯
  myAnswered: QuestionnaireSummary[] = []; // 已填寫
  myCreated: QuestionnaireSummary[] = []; // 我新增

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpService
  ) {
    // 一進來就從 AuthService 拿目前登入的使用者資料
    const state = this.auth.getState(); // 一次拿到現在狀態
    this.user = state.user;
    // this.myAnswered = this.auth.getMyAnswered(); // 從 service 抓清單
    // this.myCreated = this.auth.getMyCreated();   // 從 service 抓清單
  }

  save() {
    // 若沒有登入（user 為 null），就不處理
    if (!this.user) return;

    // 把修改後的值交給 AuthService，請它負責更新與儲存
    this.auth.updateProfile({
      name: this.user.name, // 使用畫面上已修改的資料
      phone: this.user.phone,
      age: this.user.age,
    });

    // 目前是存到 localStorage 的假資料，之後接 API 只要改 AuthService 實作
    const dialogData: any = {
      title: '已儲存',
    };
    // dialog
    this.dialog.open(DialogComponent, {
      data: dialogData,
    });
  }

  // 放已填問卷的id陣列
  answeredId: any[] = [];
  // 放所有問卷資訊 (暫時)
  allQuiz: any[] = [];
  answeredQuiz: any[] = [];

  ngOnInit(): void {
    this.auth.getMyAnsweredId('admin@example.com').subscribe((res: any) => {
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
          console.log('篩選後已填寫問卷資料：' + JSON.stringify(this.answeredQuiz, null, 2));
        });
    });
  }

  // 打開「新增問卷」Dialog
  // openCreateFormDialog() {
  //   const dialogRef = this.dialog.open(CreateFormDialogComponent, {
  //     autoFocus: false,
  //     restoreFocus: false,
  //   });

  //   dialogRef.afterClosed().subscribe((result: QuizCreateReq | null) => {
  //     if (!result) return;

  //   // API
  //   this.http.postApi<any>('http://localhost:8080/quiz/create', result)
  //     .subscribe({
  //       next: (res) => {
  //         // this.auth.addMyCreated(result.title);
  //         // this.myCreated = this.auth.getMyCreated();
  //         console.log('POST 成功回來', res)
  //       },
  //       error: (err) => {
  //         console.error('POST 失敗', err);
  //       }
  //     });
  //   });
  // }

  // deleteMyCreated(id: number) {
  // // 簡單版：直接刪，不確認
  // // 如果你想加「確認視窗」，可以用 window.confirm 或之後用 DialogComponent
  // const ok = confirm('確定要刪除這份問卷嗎？（此為假資料刪除）');
  // if (!ok) return;

  // this.auth.deleteMyCreated(id);       // 請 AuthService 刪除那一筆
  // this.myCreated = this.auth.getMyCreated(); // 重新抓一次最新清單，更新畫面
  // }

  // 1. 從「已填寫表單」進去看結果
  goAnsweredResult(id: number) {
    // 這裡請改成你現在專案的「結果頁路由」
    // 假設是 /statistical-report/:id
    this.router.navigate(['/Report', id]);
  }

  // 2. 我新增的表單：編輯
  editCreatedForm(id: number) {
    console.log(id);
    // 未來你可能會有 /builder/:id 或 /form-edit/:id 之類
    // 現在先導到填寫頁當「編輯頁」用也可以
    this.router.navigate(['/form', id]); // 自己換成實際路由
  }

  // 3. 我新增的表單：預覽（用填寫頁預覽）
  previewCreatedForm(id: number) {
    // 最簡單：先跟 edit 用同一頁，之後你再細分邏輯
    this.router.navigate(['/form', id]);
  }

  // 4. 我新增的表單：顯示結果（其實跟已填寫用同一個結果頁）
  viewCreatedResult(id: number) {
    this.router.navigate(['/Report', id]);
  }
}

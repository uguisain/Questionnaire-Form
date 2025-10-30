import { Component, OnInit } from '@angular/core';                     // 元件、生命週期
import { ActivatedRoute, Router } from '@angular/router';              // 讀參數、導頁
import { CommonModule } from '@angular/common';                         // *ngIf 等指令（standalone 需要）
import { RouterModule } from '@angular/router';                         // routerLink（standalone 需要）
import { ExampleService, formElement } from '../@service/example.service'; // 你的服務與型別
import { HomeComponent } from "../home/home.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [HomeComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
 // 單筆表單資料（從服務抓回來）
  form: any;                                                         // 後端原始格式（維持 any，先求能動）
  // 使用者信箱
  email: string = '';

  // 最終要送後端的「重組後」請求陣列
  FillinReq: any[] = [];

  constructor(
    private route: ActivatedRoute,                                    // 讀網址上的 :id
    private router: Router,                                           // 返回/導頁
    private example: ExampleService                                   // 從服務抓資料
  ) {}

  ngOnInit(): void {
    // 從路由參數拿 id（字串）→ 轉數字
    const id = +(this.route.snapshot.paramMap.get('id') || 0);

    // 依 id 取得單筆表單
    this.form = this.example.getFormById(id);

    // 找不到就導回首頁
    if (!this.form) {
      alert('找不到這份表單');
      this.router.navigate(['/home']);
      return;                                                         // 結束函式
    }

    // 把 this.form 統一成「陣列」來處理 (這個不知道到底需不需要)
    // const formsArray = Array.isArray(this.form) ? this.form : [this.form];

    // 重組資料 → 放進 FillinReq-----------------------------------------------
    let Req = {                            // 建立要送後端的請求物件
    quizId: this.form.id,                  // 問卷ID
    email: this.email,                     // 使用者 Email
    questionAnswerList: [] as any[],       // 先放空陣列，等下把每一題塞進來
    };

    for (let ans of this.form.options) {
      Req.questionAnswerList.push({
      questionId: ans.questionId,            // 題目ID
      answerList: '',
      });
    }

    console.log('Req：', Req); // 確認Req重組完的樣子

    this.FillinReq.push(Req); // 把Req丟進去FillinReq

    // 檢查FillinReq
    console.log('FillinReq 重組完成：', this.FillinReq);
  }

  // 送出答案（之後串 API）-------------------------------------
  send() {
  // 把輸入的 email 寫回 FillinReq
  if (this.FillinReq.length > 0) {
    this.FillinReq[0].email = this.email || '';
  }
  // 檢查
  console.log('email:', this.email);
  console.log('準備送出的資料：', this.FillinReq);

  // TODO: 之後改成呼叫 service API
  // this.example.submitAnswers(this.FillinReq).subscribe(...)
  }

  // 返回清單
  back() {
    this.router.navigate(['/home']);
  }
}

import { Component, inject, OnInit } from '@angular/core';                     // 元件、生命週期
import { ActivatedRoute, Router } from '@angular/router';              // 讀參數、導頁
import { CommonModule } from '@angular/common';                         // *ngIf 等指令（standalone 需要）
import { RouterModule } from '@angular/router';                         // routerLink（standalone 需要）
import { ExampleService, formElement } from '../@service/example.service'; // 你的服務與型別
import { HomeComponent } from "../home/home.component";
import { FormsModule } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpService } from "../@service/http.service";
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
// import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [HomeComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  // dialog注入
  readonly dialog = inject(MatDialog);

  pageMode = 'edit';
  // 'edit' = 填寫中
  // 'confirm' = 預覽確認中

  //時間計算(看有沒有過期)
  toDay = new Date();
  // 把今天轉成 YYYY-MM-DD 格式的字串（用來給 date 輸入框）
  toDayStr = this.buildTodayStrLocal();   // 今天（用本地時間轉 'YYYY-MM-DD'）

  // 取得今天的本地字串（避免 UTC 提早一天的小坑）
  private buildTodayStrLocal(): string {
    const d = new Date();                         // 取本地時間
    const yyyy = d.getFullYear();                 // 年
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // 月（補兩位）
    const dd = String(d.getDate()).padStart(2, '0');      // 日（補兩位）
    return `${yyyy}-${mm}-${dd}`;                 // 'YYYY-MM-DD'
  }

 // 單筆表單資料（從API抓回來）
  quiz: QuizReq | null = null;  // 這是問卷資訊
  questions:QuestionReq []=[];  // 這是問題

  // form: any;                                                         // 後端原始格式（維持 any，先求能動）
  // 使用者資訊
  userName: string = '';
  userPhoneNumber: string = '';
  email: string = '';
  userAge!: number;

  // 最終要送後端的「重組後」請求陣列
  FillinReq: any[] = [];

  constructor(
    private route: ActivatedRoute,                                    // 讀網址上的 :id
    private router: Router,                                           // 返回/導頁
    // private example: ExampleService,                               // 從服務抓資料
    private http: HttpService,                                        // API
    // private overlay: Overlay,
  ) {}

  ngOnInit(): void {
    // // 進入時回到最上方
    // window.scrollTo(0, 0);

    // 從路由參數拿 id（字串）→ 轉數字
    const id = +(this.route.snapshot.paramMap.get('id') || 0);
    console.log("取得的表單id: " + id);

    // 依 id 取得單筆表單
    // this.form = this.example.getFormById(id);
    forkJoin({
        quiz: this.http.getApi<any>(`http://localhost:8080/quiz/get_quiz/${id}`),
        questions: this.http.getApi<any>(`http://localhost:8080/quiz/get_question2?quizId=${id}`),
      }).subscribe({
        next: ({ quiz, questions }) => {
          console.log('quiz', quiz);
          console.log('questions', questions);

          this.quiz = quiz?.quizList?.[0] ?? null;
          this.questions = questions?.questionVoList ?? [];

          // 找不到就導回首頁
          if (!this.quiz) {
            // alert('找不到這份表單');
            this.dialog.open(DialogComponent, {
                enterAnimationDuration: '160ms',
                exitAnimationDuration: '120ms',
                data: {title: '找不到這份表單'},
              });
            this.router.navigate(['/home']);
            return;                                                         // 結束函式
          }

          // 如果表單已超過填寫時間，就返回首頁
          const today = this.toDayStr;
          if (today > this.quiz.endDate) {
            // alert('表單已過期，將回到首頁');
            this.dialog.open(DialogComponent, {
                enterAnimationDuration: '160ms',
                exitAnimationDuration: '120ms',
                data: {title: '表單已過期，將回到首頁'},
              });
            this.router.navigate(['/home']);
            return;                                                         // 結束函式
          }

          const Req = {
            quizId: this.quiz.id,
            userName: this.userName,
            userPhoneNumber: this.userPhoneNumber,
            email: this.email,
            userAge: this.userAge,
            questionAnswerList: [] as any[],
          };

          for (let ans of this.questions) {
            Req.questionAnswerList.push({
              questionId: ans.questionId,
              question: ans.question,
              type: ans.type,
              answerList: ans.type === 'multiple' ? [] : '',
            });
          }

          console.log('Req：', Req);

          // ⚠️ 避免重複 push（如果 ngOnInit 因某些原因跑兩次會疊加）
          this.FillinReq = [];
          this.FillinReq.push(Req);

          console.log('FillinReq 重組完成：', this.FillinReq);

        },
        error: (err) => {
          console.error(err);
          this.dialog.open(DialogComponent, {
            enterAnimationDuration: '160ms',
            exitAnimationDuration: '120ms',
            data: { title: '讀取表單失敗' },
          });
          this.router.navigate(['/home']);
        },
      });
  }

  // 切換多選答案，把 optionCode 放進或拿出陣列
  toggleMulti(i: number, optionCode: number, event: any) {
  // event.target.checked = 是否勾選(true/false)

  // 先拿到這一題目前的答案陣列
  let list = this.FillinReq[0].questionAnswerList[i].answerList;

  // 如果目前不是陣列（保險一下），就變成陣列
  if (!Array.isArray(list)) {
    list = [];
    this.FillinReq[0].questionAnswerList[i].answerList = list;
  }

  if (event.target.checked) {
    // 勾選 -> 把這個 code 放進陣列（如果還沒在裡面）
    if (!list.includes(optionCode)) {
      list.push(optionCode);
    }
  } else {
    // 取消勾選 -> 從陣列移除這個 code
    const index = list.indexOf(optionCode);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }
  // 多選即時結果
  console.log('多選第', i, '題現在的答案 = ', this.FillinReq[0].questionAnswerList[i].answerList);
}

  // 把某一題的答案，轉成可以看得懂的文字
  getAnswerDisplay(i: number) {
  // i = 第幾題 ($index)
  const question = this.questions[i];
  // 例如 {
  //   questionId: 1,
  //   question: "你是甚麼派?",
  //   type: 'single',
  //   option: [ { ans: '貓派', code: 1 }, ... ]
  // }

  const answer = this.FillinReq[0].questionAnswerList[i].answerList;

  // 可能是數字 (single) 陣列 (multiple) 字串 (text)
  // 單選題：answer 是一個 code (比如 2)
  if (question.type === 'single') {
    // 去 options 裡找 code 相同的那一個
    const found = this.questions[i].optionsList.find((o: { code: any; }) => o.code === answer);
    return found ? found.optionName : answer;
    // 如果找到就回中文(貓派)，找不到就先回原本值
  }

  // 多選題：answer 是一個陣列 (比如 [1,3])
  if (question.type === 'multiple') {
    if (Array.isArray(answer)) {
      // 把每一個 code 轉成文字，再用逗號串起來
      const labels = answer.map(code => {
        const found = this.questions[i].optionsList.find((o: { code: any; }) => o.code === code);
        return found ? found.optionName : code;
      });
      return labels.join(', ');
    } else {
      // 保險：如果還不是陣列
      return '';
    }
  }

  // 文字題：answer 已經是使用者打的字串
  if (question.type === 'text') {
    return answer;
  }

  // 意外情況就回空字串
  return '';
}


  // 送出答案（之後串 API）-------------------------------------
  send() {
    // 進入時回到最上方
    window.scrollTo(0, 0);

    // 把輸入的用戶資料寫回 FillinReq
    if (this.FillinReq.length > 0) {
      this.FillinReq[0].email = this.email || '';
      this.FillinReq[0].userName = this.userName || '';
      this.FillinReq[0].userPhoneNumber = this.userPhoneNumber || '';
      this.FillinReq[0].userAge = this.userAge || '';
    }

    // 檢查是否有必填但沒填的題目
    for (let i = 0; i < this.questions.length; i++) {
    const q = this.questions[i]; // 這一題的設定 (包含 required, type)
    const ans = this.FillinReq[0].questionAnswerList[i].answerList; // 使用者填的內容

    if (q.required) { // 只檢查必填題
      // 判斷「有沒有填」
      // 規則：
      // - 多選: ans 是陣列，要至少有一個值
      // - 其他: ans 不能是空字串/undefined/null

      const notFilledMultiple =
        Array.isArray(ans) && ans.length === 0;

      const notFilledOther =
        !Array.isArray(ans) && (ans === '' || ans === undefined || ans === null);

      if (notFilledMultiple || notFilledOther) {
        this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: {Message: '有必填題尚未填寫，請先完成再繼續', title: '您尚未填寫完畢'},
        });
        return;
      }
    }
  }

    this.pageMode = 'confirm'; // 切換為確認模式
  }

  // 返回清單
  back() {
    this.router.navigate(['/home']);
  }


  // 以下是確認畫面用

  backToEdit() {
  // 用戶覺得哪題打錯了 -> 回去繼續改
  this.pageMode = 'edit';
  }

  finalSubmit() {
    console.log('送出最終資料：' + JSON.stringify(this.FillinReq, null, 2));
    // TODO: 之後改成呼叫 service API
    // this.example.submitAnswers(this.FillinReq).subscribe(...)

    // dialog資料
        const dialogData: any = {
          title: '表單已送出',
        };
        // dialog
        this.dialog.open(DialogComponent, {
          data: dialogData,
        });
    this.router.navigate(['/home']);
  }

}

// 這是問卷的 interface
export interface QuizReq {
  id:number;                         // 問卷ID
  title: string;                     // 問卷名稱
  description: string;               // 問卷說明（可空）
  startDate: string;                 // 開始日期 yyyy-MM-dd
  endDate: string;                   // 結束日期 yyyy-MM-dd
  published: boolean;                // 是否發佈
}

// 這是問題的 interface
export interface QuestionReq {
  quizId: number;                        // 問卷編號
  questionId: number;                    // 題目編號
  question: string;                      // 題目名稱
  type: 'single' | 'multiple' | 'text';  // 題目類型
  required: boolean;                     // 是否必填
  optionsList: OptionReq[];              // 題目選項（文字題可為空陣列）
}

// 這是選項的 interface
export interface OptionReq {
  code: number;
  optionName: string;
}

// API 接收原包 quiz
export interface GetQuizRes {
  code: number;
  message: string;
  quizList: QuizReq[];
}

// API 接收原包 Question
export interface GetQuestionRes {
  code: number;
  message: string;
  questionVoList: QuestionReq[];
}

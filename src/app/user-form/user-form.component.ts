import { Component, inject, OnInit } from '@angular/core'; // 元件、生命週期
import { ActivatedRoute, Router } from '@angular/router'; // 讀參數、導頁
import { CommonModule } from '@angular/common'; // *ngIf 等指令（standalone 需要）
import { RouterModule } from '@angular/router'; // routerLink（standalone 需要）
import { ExampleService, formElement } from '../@service/example.service'; // 你的服務與型別
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpService } from '../@service/http.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
// import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [HomeComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
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
  toDayStr = this.buildTodayStrLocal(); // 今天（用本地時間轉 'YYYY-MM-DD'）

  // 取得今天的本地字串（避免 UTC 提早一天的小坑）
  private buildTodayStrLocal(): string {
    const d = new Date(); // 取本地時間
    const yyyy = d.getFullYear(); // 年
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // 月（補兩位）
    const dd = String(d.getDate()).padStart(2, '0'); // 日（補兩位）
    return `${yyyy}-${mm}-${dd}`; // 'YYYY-MM-DD'
  }

  // 單筆表單資料（從API抓回來）
  quiz: QuizReq | null = null; // 這是問卷資訊
  questions: QuestionReq[] = []; // 這是問題

  // form: any;                                                         // 後端原始格式（維持 any，先求能動）
  // 使用者資訊
  name: string = '';
  phone: string = '';
  email: string = '';
  age!: number;

  // 最終要送後端的「重組後」請求陣列
  FillinReq: any[] = [];

  constructor(
    private route: ActivatedRoute, // 讀網址上的 :id
    private router: Router, // 返回/導頁
    // private example: ExampleService,                               // 從服務抓資料
    private http: HttpService // API // private overlay: Overlay,
  ) {}

  ngOnInit(): void {
    // // 進入時回到最上方
    // window.scrollTo(0, 0);

    // 從路由參數拿 id（字串）→ 轉數字
    const id = +(this.route.snapshot.paramMap.get('id') || 0);
    console.log('取得的表單id: ' + id);

    // 依 id 取得單筆表單
    // this.form = this.example.getFormById(id);
    forkJoin({
      quiz: this.http.getApi<GetQuizRes>(
        `http://localhost:8080/quiz/get_quiz/${id}`
      ),
      questions: this.http.getApi<GetQuestionRes>(
        `http://localhost:8080/quiz/get_question2?quizId=${id}`
      ),
    }).subscribe({
      next: ({ quiz, questions }) => {
        console.log('quiz：' + JSON.stringify(quiz, null, 2));
        console.log('questions：' + JSON.stringify(questions, null, 2));

        this.quiz = quiz?.quizList?.[0] ?? null;
        this.questions = questions?.questionVoList ?? [];

        // 找不到就導回首頁
        if (!this.quiz) {
          // alert('找不到這份表單');
          this.dialog.open(DialogComponent, {
            enterAnimationDuration: '160ms',
            exitAnimationDuration: '120ms',
            data: { title: '找不到這份表單' },
          });
          this.router.navigate(['/home']);
          return;
        }

        // 如果表單已超過填寫時間，就返回首頁
        const today = this.toDayStr;
        if (today > this.quiz.endDate) {
          // alert('表單已過期，將回到首頁');
          this.dialog.open(DialogComponent, {
            enterAnimationDuration: '160ms',
            exitAnimationDuration: '120ms',
            data: { title: '表單已過期，將回到首頁' },
          });
          this.router.navigate(['/home']);
          return;
        }
        // -------------------------------------------------------------------------------
        const Req = {
          quizId: this.quiz.id,
          name: this.name,
          phone: this.phone as String,
          email: this.email,
          age: this.age,
          answers: [] as QuestionAnswerReq[],
        };

        for (let q of this.questions) {
          if (q.type == 'single' || q.type == 'multiple') {
            const answerVoList: OptionAnsReq[] = (q.optionsList || []).map(
              (opt) => ({
                code: opt.code,
                optionName: opt.optionName,
                check: false,
              })
            );
            Req.answers.push({
              questionId: q.questionId,
              answerVoList: answerVoList,
            });
          }

          // 簡答題：塞一筆「空答案容器」
          if (q.type == 'text') {
            Req.answers.push({
              questionId: q.questionId,
              answerVoList: [
                {
                  code: 0, // 固定 0
                  optionName: '', // 使用者輸入文字
                  check: true, // 固定 true
                },
              ],
            });
          }

          // 選擇題：依 optionsList 建完整的 answerVoList（全 false）
          // const optionAnsList: OptionAnsReq[] = (q.optionsList || []).map(
          //   (opt) => ({
          //     code: opt.code,
          //     optionName: opt.optionName,
          //     check: false,
          //   })
          // );

          // Req.answers.push({
          //   questionId: q.questionId,
          //   answerVoList: q.type === 'text' ? "" : optionAnsList,
          // });
        }
        // -------------------------------------------------------------------------------
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

  // 切換多選答案
  toggleMulti(i: number, optionCode: number, event: any) {
    const checked = !!event.target.checked;

    const list = this.FillinReq[0].answers[i].answerVoList as OptionAnsReq[];

    const target = list.find((o) => o.code === optionCode);
    if (target) {
      target.check = checked ? true : false;
    }

    console.log('多選第', i, '題現在的答案 = ', list);
  }

  // 切換單選答案
  selectSingle(i: number, optionCode: number) {
    const list = this.FillinReq[0].answers[i].answerVoList as OptionAnsReq[];

    for (const o of list) {
      o.check = o.code === optionCode ? true : false;
    }

    console.log('單選第', i, '題現在的答案 = ', list);
  }

  isOptionTrue(i: number, optionCode: number): boolean {
    const list = this.FillinReq[0].answers[i].answerVoList;

    if (!Array.isArray(list)) return false;

    const found = (list as OptionAnsReq[]).find((o) => o.code === optionCode);
    return found?.check === true;
  }

  // 把某一題的答案，轉成可以看得懂的文字
  getAnswerDisplay(i: number) {
    const q = this.questions[i];
    const ans = this.FillinReq[0].answers[i].answerVoList;

    if (q.type === 'text') return ans as string;

    // single / multiple：挑 check === 'true' 的選項
    const list = ans as OptionAnsReq[];
    const labels = list
      .filter((o) => o.check === true)
      .map((o) => o.optionName);

    return labels.join(', ');
  }

  getTextDisplay(i: number): string {
    const voList = this.FillinReq[0].answers[i]?.answerVoList;
    if (!voList || voList.length === 0) return '';
    return voList[0].optionName || '';
  }

  // 送出答案（之後串 API）-------------------------------------
  send() {
    // 進入時回到最上方
    window.scrollTo(0, 0);

    // 把輸入的用戶資料寫回 FillinReq
    if (this.FillinReq.length > 0) {
      this.FillinReq[0].email = this.email || '';
      this.FillinReq[0].name = this.name || '';
      this.FillinReq[0].phone = this.phone || '';
      this.FillinReq[0].age = this.age || '';
    }

    // 檢查是否有必填但沒填的題目
    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i]; // 這一題的設定 (包含 required, type)
      const ans = this.FillinReq[0].answers[i].answerVoList; // 使用者填的內容

      if (q.required) {
        if (q.type === 'text') {
          const text = ans as string;
          if (!text || text.trim() === '') {
            this.dialog.open(DialogComponent, {
              enterAnimationDuration: '160ms',
              exitAnimationDuration: '120ms',
              data: {
                Message: '有必填題尚未填寫，請先完成再繼續',
                title: '您尚未填寫完畢',
              },
            });
            return;
          }
        } else {
          const list = ans as OptionAnsReq[];
          const hasAnyTrue = list.some((o) => o.check === true);
          if (!hasAnyTrue) {
            this.dialog.open(DialogComponent, {
              enterAnimationDuration: '160ms',
              exitAnimationDuration: '120ms',
              data: {
                Message: '有必填題尚未填寫，請先完成再繼續',
                title: '您尚未填寫完畢',
              },
            });
            return;
          }
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
    console.log('送出最終資料：' + JSON.stringify(this.FillinReq[0], null, 2));
    // TODO: 之後改成呼叫 service API
    // this.example.submitAnswers(this.FillinReq).subscribe(...)

    this.http.postApi('http://localhost:8080/quiz/fillin', this.FillinReq[0])
    .subscribe({
      next: (res) => {
        console.log(res);
        this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: { title: '表單送出成功' },
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: { title: '表單送出失敗' },
        });
        return;
    }});
  }
}

// 這是問卷的 interface
export interface QuizReq {
  id: number; // 問卷ID
  title: string; // 問卷名稱
  description: string; // 問卷說明（可空）
  startDate: string; // 開始日期 yyyy-MM-dd
  endDate: string; // 結束日期 yyyy-MM-dd
  published: boolean; // 是否發佈
}

// 這是問題的 interface
export interface QuestionReq {
  quizId: number; // 問卷編號
  questionId: number; // 題目編號
  question: string; // 題目名稱
  type: 'single' | 'multiple' | 'text'; // 題目類型
  required: boolean; // 是否必填
  optionsList: OptionReq[]; // 題目選項（文字題可為空陣列）
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

// 這裡是最後整理好要送出的 interface
// 送出答案用的選項格式
export interface OptionAnsReq {
  code: number;
  optionName: string;
  check: boolean;
}

// 每一題送出答案的格式
export interface QuestionAnswerReq {
  questionId: number;
  answerVoList: OptionAnsReq[] | string; // 單/多 => array，文字 => string
}

// 整個送出答案的格式
export interface FillinReqPayload {
  name: string;
  phone: string;
  email: string;
  age: number;
  quizId: number;
  answers: QuestionAnswerReq[];
}

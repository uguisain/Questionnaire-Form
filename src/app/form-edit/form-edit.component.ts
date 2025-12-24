import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../@service/http.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { DialogComponent } from '../dialog/dialog.component';
import { Dialog2Component } from '../dialog2/dialog2.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form-edit',
  imports: [CommonModule, FormsModule, MatTabsModule],
  templateUrl: './form-edit.component.html',
  styleUrl: './form-edit.component.scss',
})
export class FormEditComponent {
  [x: string]: any;
  constructor(
    private route: ActivatedRoute, // 讀網址上的 :id
    private router: Router, // 返回/導頁
    private http: HttpService // API
  ) {}

  // dialog注入
  readonly dialog = inject(MatDialog);

  // 單筆表單資料（從API抓回來）
  quiz: QuizReq | null = null; // 這是問卷資訊
  questions: QuestionReq[] = []; // 這是問題

  // 這個用來放最後重組完的資料
  updateReq: QuizUpdateReq | null = null;

  // 錯誤訊息用
  errorMsg = '';

  ngOnInit(): void {
    // 進入時回到最上方
    window.scrollTo(0, 0);

    // 從路由參數拿 id（字串）→ 轉數字
    const id = +(this.route.snapshot.paramMap.get('id') || 0);
    console.log('取得的表單id: ' + id);
    if (!id) return;

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
        console.log('quiz', quiz);
        console.log('questions', questions);

        this.quiz = quiz?.quizList?.[0] ?? null;
        this.questions = questions?.questionVoList ?? [];

        // 找不到就導回首頁
        if (!this.quiz) {
          this.dialog.open(DialogComponent, {
            enterAnimationDuration: '160ms',
            exitAnimationDuration: '120ms',
            data: { title: '找不到這份表單' },
          });
          this.router.navigate(['/home']);
          return; // 結束函式
        }
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

  maxQuestions = 10; // 最大題數

  // 新增題目
  addQuestion() {
    // 檢查最大題數
    if (this.questions.length >= this.maxQuestions) {
      this.errorMsg = `最多只能新增 ${this.maxQuestions} 題。`;
      return;
    }

    // 給UI用的新增的題目id，去抓最大值然後+1，否則1
    const nextQid =
      this.questions.length > 0
        ? Math.max(...this.questions.map((q) => q.questionId || 0)) + 1
        : 1;

    const newQ: QuestionReq = {
      quizId: this.quiz?.id ?? 0, // quiz 還沒載入時先給 0
      questionId: nextQid,
      question: '',
      type: 'single',
      required: false,
      optionsList: [{ code: 1, optionName: '' }],
    };

    this.questions.push(newQ);
    this.errorMsg = '';
  }

  // 重新編號小工具
  private reindexOptions(q: QuestionReq) {
    if (!q.optionsList) return;
    q.optionsList = q.optionsList.map((opt, i) => ({
      ...opt,
      code: i + 1,
    }));
  }

  // 刪除題目
  removeQuestion(i: number) {
    this.questions.splice(i, 1);
  }

  // 改變題型
  onTypeChange(q: QuestionReq) {
    if (q.type === 'text') {
      q.optionsList = [];
    } else {
      if (!q.optionsList || q.optionsList.length === 0) {
        q.optionsList = [{ code: 1, optionName: '' }];
      } else {
        // 保險：重新整理 code（避免之前有刪掉）
        this.reindexOptions(q);
      }
    }
  }

  // 新增選項
  addOption(q: QuestionReq) {
    if (q.type === 'text') return;
    if (!q.optionsList) q.optionsList = [];
    if (q.optionsList.length >= 8) {
      this.errorMsg = '選項數量最多為 8';
      return;
    }
    q.optionsList.push({
      code: q.optionsList.length + 1,
      optionName: '',
    });
    this.errorMsg = '';
  }

  // 刪除選項
  removeOption(q: QuestionReq, index: number) {
    if (!q.optionsList) return;
    q.optionsList.splice(index, 1);
    this.reindexOptions(q);
  }

  // 取消編輯
  cancel() {
    this.router.navigate(['/home']);
  }

  // 儲存變更
  saveUpdate() {
    this.errorMsg = '';

    if (!this.quiz) {
      this.errorMsg = '問卷資料尚未載入完成';
      return;
    }

    if (!this.quiz.title.trim()) {
      this.errorMsg = '請輸入問卷名稱';
      return;
    }
    if (
      !this.quiz.startDate.trim() ||
      !this.quiz.endDate.trim() ||
      this.quiz.startDate > this.quiz.endDate
    ) {
      this.errorMsg = '請輸入正確日期';
      return;
    }

    console.log('quiz（編輯後）=', JSON.stringify(this.quiz, null, 2));
    console.log(
      'questions（編輯後）=',
      JSON.stringify(this.questions, null, 2)
    );

    // 以下重組資料
    const updateReq = {
      id: this.quiz.id,
      title: this.quiz.title,
      description: this.quiz.description,
      startDate: this.quiz.startDate,
      endDate: this.quiz.endDate,
      published: this.quiz.published,
      questionVoList: this.questions.map((q, index) => ({
        ...q,
        quizId: this.quiz!.id, // 保險：統一補 quizId
        questionId: index + 1, // 問題重新編號
      })),
    };

    console.log('updateReq =', JSON.stringify(updateReq, null, 2));

    this.http
      .postApi('http://localhost:8080/quiz/update', updateReq)
      .subscribe({
        next: (res) => {
          console.log('成功', res);
          this.dialog.open(DialogComponent, {
            enterAnimationDuration: '160ms',
            exitAnimationDuration: '120ms',
            data: { title: '更新表單成功' },
          });
          this.router.navigate(['/home']);
          return;
        },
        error: (err) => {
          console.error('失敗', err);
          this.dialog.open(DialogComponent, {
            enterAnimationDuration: '160ms',
            exitAnimationDuration: '120ms',
            data: { title: '更新表單失敗' },
          });
        },
      });
  }
}

// 更新用
export interface QuizUpdateReq {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  published: boolean;
  questionVoList: QuestionReq[]; // 直接沿用你現在的 QuestionReq
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

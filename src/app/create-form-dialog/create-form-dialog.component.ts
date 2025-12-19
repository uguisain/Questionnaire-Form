import { Component, inject } from '@angular/core';
import {MatDialogModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormsModule } from "@angular/forms";
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from "@angular/common";
import { HttpService } from '../@service/http.service';


@Component({
  selector: 'app-create-form-dialog',
  imports: [MatDialogTitle, MatDialogModule, FormsModule, MatDialogActions, MatDialogContent, CommonModule],
  templateUrl: './create-form-dialog.component.html',
  styleUrl: './create-form-dialog.component.scss'
})
export class CreateFormDialogComponent {
  // 最多題數（之後想開放就改這裡）
  maxQuestions = 10;

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

  // 題型選項給下拉選用
  questionTypes: Array<QuizQuestionForm['type']> = ['single', 'multiple', 'text'];

  // 問卷表單主體
  form: QuizCreateForm = {
  title: '',
  description: '',
  startDate: '',
  endDate: null,
  published: false,
  questionVoList: [],
};

  // 簡單錯誤訊息顯示用
  errorMsg: string = '';

  constructor(
    private dialogRef: MatDialogRef<CreateFormDialogComponent>,
    private http: HttpService,
  ) {}

  // 新增一題
  addQuestion() {
    if (this.form.questionVoList.length >= this.maxQuestions) {
      this.errorMsg = `最多只能新增 ${this.maxQuestions} 題。`;
      return;
    }

    // TODO: 編號更新要做
    const newQ: QuizQuestionForm = {
      quizId: 0,
      question: '',
      type: 'single',   // 預設單選
      required: false,
      optionsList: [''],    // 單選/多選預設一個空選項
    };

    this.form.questionVoList.push(newQ);
    this.errorMsg = '';
  }

  // 刪除一題
  removeQuestion(index: number) {
    this.form.questionVoList.splice(index, 1);
  }

  // 當題型切換時，如果是文字題就清空選項
  onTypeChange(q: QuizQuestionForm) {
    if (q.type === 'text') {
      q.optionsList = [];
    } else {
      if (!q.optionsList || q.optionsList.length === 0) {
        q.optionsList = [''];
      }
    }
  }

  // 單選/多選題新增選項
  addOption(q: QuizQuestionForm) {
    if (q.type === 'text') return; // 文字題不需要選項
    if (!q.optionsList) q.optionsList = [];
    if (q.optionsList.length >= 8) return; // 先限制最多 8 個選項
    q.optionsList.push('');
  }

  trackByIndex(index: number, _item: any): number {
    return index;
  }

  // 移除某一個選項
  removeOption(q: QuizQuestionForm, index: number) {
    if (!q.optionsList) return;
    q.optionsList.splice(index, 1);
  }

  // 儲存並關閉：回傳完整 QuizCreateReq
  save() {
    this.errorMsg = '';

    // 基本驗證：問卷名稱必填
    if (!this.form.title.trim()) {
      this.errorMsg = '請輸入問卷名稱。';
      return;
    }

    // 基本驗證：問卷日期必填
    const start = (this.form.startDate ?? '').trim();
    const end = (this.form.endDate ?? '').trim();
    if (!start || !end) {
      this.errorMsg = '請輸入問卷開始與結束日期。';
      return;
    }

    // 開始／結束日期（簡單檢查，不寫太嚴格）
    if (this.form.startDate && this.form.endDate) {
      if (this.form.startDate > this.form.endDate) {
        this.errorMsg = '結束日期不能早於開始日期。';
        return;
      }
    }

    // 題目基本檢查（可視需求加強）
    for (const q of this.form.questionVoList) {
      if (!q.question.trim()) {
        this.errorMsg = '有題目尚未填寫題目名稱。';
        return;
      }
      if (q.type !== 'text') {
        // 選項題至少要一個非空選項
        const validOptions = (q.optionsList || []).map(o => o.trim()).filter(o => o);
        if (validOptions.length === 0) {
          this.errorMsg = '單選／多選題至少需要一個選項。';
          return;
        }
      }
    }

    // 送後端的資料（Req）
    const cleaned: QuizCreateReq = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      startDate: this.form.startDate.trim(),
      endDate: this.form.endDate,     // 先原樣，因為它可能是 null
      published: this.form.published,

      questionVoList: this.form.questionVoList.map((q, index) => {
        const optionNames = (q.optionsList || [])
          .map(o => (o ?? '').trim())
          .filter(o => o.length > 0);

        return {
          quizId: 0,
          questionId: index + 1,
          question: (q.question ?? '').trim(),
          type: q.type,
          required: q.required,

          optionsList: q.type === 'text'
            ? []
            : optionNames.map((name, i) => ({
                code: i + 1,
                optionName: name,
              })),
        };
      }),
    };

    // 關閉 Dialog，回傳整理好的資料給呼叫端
    console.log(cleaned);
    this.dialogRef.close(cleaned);
  }

  // 取消不送資料
  cancel() {
    this.dialogRef.close(null);
  }

}

// 表單用問題
export interface QuizQuestionForm {
  quizId: number; // 你說固定 0，可以保留
  questionId?: number; // UI 階段可以不用管，送出再排
  question: string;
  type: 'single' | 'multiple' | 'text';
  required: boolean;
  optionsList: string[]; //  UI 用字串
}

// 表單用問卷
export interface QuizCreateForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  published: boolean;
  questionVoList: QuizQuestionForm[]; // UI 用
}

// 這是問題的 interface
export interface QuizQuestionReq {
  quizId: number;                        // 問卷編號
  questionId: number;                    // 題目編號
  question: string;                      // 題目名稱
  type: 'single' | 'multiple' | 'text';  // 題目類型
  required: boolean;                     // 是否必填
  optionsList: QuizOptionReq[];          // 題目選項（文字題可為空陣列）
}

// 這是問卷的 interface
export interface QuizCreateReq {
  title: string;                     // 問卷名稱
  description: string;               // 問卷說明（可空）
  startDate: string;                 // 開始日期 yyyy-MM-dd
  endDate: string | null;            // 結束日期 yyyy-MM-dd
  published: boolean;                // 是否發佈
  questionVoList: QuizQuestionReq[]; // 題目清單
}

// 這是選項的 interface
export interface QuizOptionReq {
  code: number;
  optionName: string;
}

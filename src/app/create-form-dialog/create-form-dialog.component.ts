import { Component, inject } from '@angular/core';
import {MatDialogModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormsModule } from "@angular/forms";
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-create-form-dialog',
  imports: [MatDialogTitle, MatDialogModule, FormsModule, MatDialogActions, MatDialogContent, CommonModule],
  templateUrl: './create-form-dialog.component.html',
  styleUrl: './create-form-dialog.component.scss'
})
export class CreateFormDialogComponent {
  // 最多題數（之後想開放就改這裡）
  maxQuestions = 10;

  // 題型選項給下拉選用
  questionTypes: Array<QuizQuestionReq['type']> = ['single', 'multiple', 'text'];

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

  // 問卷表單主體
  form: QuizCreateReq = {
    name: '',
    description: '',
    startDate: '',
    endDate: null,
    published: false,
    questionList: [],
  };

  // 簡單錯誤訊息顯示用
  errorMsg: string = '';

  constructor(
    private dialogRef: MatDialogRef<CreateFormDialogComponent>
  ) {}

  // 新增一題
  addQuestion() {
    if (this.form.questionList.length >= this.maxQuestions) {
      this.errorMsg = `最多只能新增 ${this.maxQuestions} 題（之後可再放寬）。`;
      return;
    }

    const newQ: QuizQuestionReq = {
      question: '',
      type: 'single',   // 預設單選
      required: false,
      options: [''],    // 單選/多選預設一個空選項
    };

    this.form.questionList.push(newQ);
    this.errorMsg = '';
  }

  // 刪除一題
  removeQuestion(index: number) {
    this.form.questionList.splice(index, 1);
  }

  // 當題型切換時，如果是文字題就清空選項
  onTypeChange(q: QuizQuestionReq) {
    if (q.type === 'text') {
      q.options = [];
    } else {
      if (!q.options || q.options.length === 0) {
        q.options = [''];
      }
    }
  }

  // 單選/多選題新增選項
  addOption(q: QuizQuestionReq) {
    if (q.type === 'text') return; // 文字題不需要選項
    if (!q.options) q.options = [];
    if (q.options.length >= 8) return; // 先限制最多 8 個選項
    q.options.push('');
  }

  // 移除某一個選項
  removeOption(q: QuizQuestionReq, index: number) {
    if (!q.options) return;
    q.options.splice(index, 1);
  }

  // 儲存並關閉：回傳完整 QuizCreateReq
  save() {
    this.errorMsg = '';

    // 基本驗證：問卷名稱必填
    if (!this.form.name.trim()) {
      this.errorMsg = '請輸入問卷名稱。';
      return;
    }

    // 基本驗證：問卷日期必填
    if (!this.form.startDate.trim() || !this.form.endDate?.trim()) {
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
    for (const q of this.form.questionList) {
      if (!q.question.trim()) {
        this.errorMsg = '有題目尚未填寫題目名稱。';
        return;
      }
      if (q.type !== 'text') {
        // 選項題至少要一個非空選項
        const validOptions = (q.options || []).map(o => o.trim()).filter(o => o);
        if (validOptions.length === 0) {
          this.errorMsg = '單選／多選題至少需要一個選項。';
          return;
        }
      }
    }

    // 清空多餘空白、處理 options
    const cleaned: QuizCreateReq = {
      ...this.form,
      name: this.form.name.trim(),
      description: this.form.description.trim(),
      questionList: this.form.questionList.map(q => ({
        ...q,
        question: q.question.trim(),
        options: q.type === 'text'
          ? [] // 文字題不送 options
          : (q.options || []).map(o => o.trim()).filter(o => o),
      })),
    };

    // 關閉 Dialog，回傳整理好的資料給呼叫端
    this.dialogRef.close(cleaned);
  }

  // 取消不送資料
  cancel() {
    this.dialogRef.close(null);
  }

}


export interface QuizQuestionReq {
  question: string;      // 題目名稱
  type: 'single' | 'multiple' | 'text'; // 題目類型
  required: boolean;     // 是否必填
  options: string[];     // 題目選項（文字題可為空陣列）
}

export interface QuizCreateReq {
  name: string;                 // 問卷名稱
  description: string;          // 問卷說明（可空）
  startDate: string;            // 開始日期 yyyy-MM-dd
  endDate: string | null;              // 結束日期 yyyy-MM-dd
  published: boolean;           // 是否發佈
  questionList: QuizQuestionReq[]; // 題目清單
}

import { Component, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ExampleService } from '../@service/example.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../@service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpService } from "../@service/http.service";
import { ApiResponse, HomeList, } from "../@Interface/quizList";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

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

  // ===== 用日期判斷狀態（核心邏輯）=====
  // 傳回 'notStarted' | 'open' | 'closed'
  getState(row: HomeList): 'notStarted' | 'open' | 'closed' {
    const today = this.toDayStr;                  // 今天（字串）
    // 都是 'YYYY-MM-DD' → 直接用字串比較即可（字典順序 = 日期順序）
    if (today < row.startDate) return 'notStarted';     // 今天在開始前 → 尚未開始
    if (today > row.endDate)  return 'closed';          // 今天在結束後 → 已結束
    return 'open';                                      // 其餘 → 進行中（含邊界）
    // 其實這裡的row就是HTML中的(f)
  }

  // 把狀態轉成中文顯示（純顯示用）
  stateLabel(state: 'notStarted' | 'open' | 'closed'): string {
    if (state === 'notStarted') return '未開始';
    if (state === 'closed')     return '已結束';
    return '進行中';
  }

  // ===== 導頁事件（之後會真接表單/結果）=====
  goFill(id: number) {
    // 先判斷是否登入
    if (!this.auth.isLoggedIn()) {
      // 未登入 → 提示 + 導頁
      const dialogData: any = {
          title: '請先登入',
        };
        // dialog
        this.dialog.open(DialogComponent, {
          data: dialogData,
        });
      this.router.navigateByUrl('/Login');
      return;
    }

    this.router.navigate(['/form', id]);
    window.scrollTo(0, 0);
  }

  edit(id: number) {
    this.router.navigate(['/formEdit', id]);
    window.scrollTo(0, 0);
  }

  viewResult(id: number) {
    this.router.navigate(['/Report', id]);
    window.scrollTo(0, 0);
  }

  // 這個要做刪除表單
  delFill(id: number) {
    this.quiz = this.quiz.filter(f => f.id !== id);

    // return this.http.delete(`/api/forms/${id}`); // 未來接api時完善
  }

  // 存使用者選的開始日期
  fromDate: string | null = null;
  // 存使用者選的結束日期
  toDate: string | null = null;

  // 存使用者輸入的搜尋內容
  searchname: string = '';


  // 表單----------------------------------------------------------
  // 存放從服務拿到的資料
  // forms: formElement[] = [];
  quiz: HomeList[] = []; // 這是問卷陣列必須用迴圈取值

  // 注入服務------------------------------------------------------
  constructor(
    private example: ExampleService,
    private router: Router,
    public auth: AuthService,
    private http: HttpService,
    private dialog: MatDialog ) {}

  // 當畫面載入時執行
  ngOnInit(): void {
    this.http.getApi<ApiResponse<HomeList>>('http://localhost:8080/quiz/get_all')
    .subscribe((res) => {
      this.quiz = res.quizList;
      console.log(res);
    });

    // 進入時回到最上方
    window.scrollTo(0, 0);

    // this.forms = this.example.getForms(); // 取得假資料
    // // this.quiz = this.http.getApi('http://localhost:8080/quiz/get_all');
    // console.log('載入資料:', this.forms); // 看看有沒有拿到

    // 排序用(id)
    this.quiz.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
  }

  // ===== 即時篩選（關鍵字 + 日期 + 狀態）=====
  get filteredForms(): HomeList[] {
    // 1) 關鍵字（小寫、去空白）
    const kw = (this.searchname || '').trim().toLowerCase();

    // 2) 日期條件（都是 'YYYY-MM-DD' → 字串比較OK）
    const from = this.fromDate || '';
    const to   = this.toDate   || '';

    // 3) 過濾（每一筆 row 都做檢查）
    return this.quiz.filter(row => {
      // (a) 名稱條件
      const name = (row.title || '').toLowerCase();
      const nameOK = kw === '' || name.includes(kw);

      // (b) 日期條件
      const onlyFrom = !!from && !to;
      const onlyTo   = !from && !!to;
      const both     = !!from && !!to;

      let dateOK = true;
      if (onlyFrom) {
        dateOK = row.endDate >= from;
      } else if (onlyTo) {
        dateOK = row.startDate <= to;
      } else if (both) {
        // 區間重疊： [startDate, endDate] vs [from, to]
        dateOK = row.startDate <= to && row.endDate >= from;
      }

      // (c) 狀態條件：呼叫你下面寫好的 matchStatus()
      const statusOK = this.matchStatus(row);

      // 三個條件都 true 才保留
      return nameOK && dateOK && statusOK;
    });
  }

  // 目前篩選的狀態：all = 不篩，全部顯示
statusFilter: 'all' | 'open' | 'closed' | 'notStarted' = 'all';

// 點狀態按鈕時呼叫，切換狀態
setStatusFilter(filter: 'all' | 'open' | 'closed' | 'notStarted') {
  this.statusFilter = filter; // 記住目前篩選是哪一種
}

// 判斷某一個表單是否通過「狀態篩選」
matchStatus(form: any): boolean {
  if (this.statusFilter === 'all') {
    return true; // 不篩選 → 全部通過
  }

  const state = this.getState(form); // 你原本的狀態判斷函式

  // ⚠️ 下面這段要依照你 getState 回傳的實際字串改
  if (this.statusFilter === 'open') {
    return state === 'open';           // 進行中
  }
  if (this.statusFilter === 'closed') {
    return state === 'closed';       // 已結束（請改成你實際用的字串）
  }
  if (this.statusFilter === 'notStarted') {
    return state === 'notStarted';     // 未開始（同樣請改成實際字串）
  }

  return true;
}

  // --- 分頁設定區 ---
  pageSize: number = 5;           // 一頁幾筆（可改）；預設 5
  currentPage: number = 1;        // 目前在第幾頁；從 1 開始

  // 這裡假設你有 filteredList（篩選後的陣列）；
  // 若沒有，就先讓它指向原本的 formList（顯示全部）：
  get filteredList(): HomeList[] { return this.filteredForms; }

  get totalItems(): number {      // 計算目前要顯示的總筆數（走篩選結果）
    return this.filteredList?.length ?? 0;   // 沒資料就回 0
  }

  get totalPages(): number {      // 計算總頁數
    if (this.totalItems === 0) return 1;     // 沒資料時維持 1 頁，避免除以 0
    return Math.ceil(this.totalItems / this.pageSize);  // 無條件進位
  }

  get pagedList(): any[] {        // 依目前頁碼切出要顯示的 5 筆（或你設定的 pageSize）
    const start = (this.currentPage - 1) * this.pageSize; // 本頁起始索引
    const end = start + this.pageSize;                    // 本頁結束索引（不含）
    return this.filteredList?.slice(start, end) ?? [];    // 安全地回傳切片
  }

  goToPage(page: number): void {  // 跳到指定頁（含邊界保護）
    if (page < 1) page = 1;                       // 小於 1 就設為第 1 頁
    if (page > this.totalPages) page = this.totalPages; // 大於總頁就設為最後一頁
    this.currentPage = page;                      // 更新目前頁碼
  }

  prev(): void {                   // 上一頁（含邊界保護）
    this.goToPage(this.currentPage - 1);         // 呼叫 goToPage 自帶保護
  }

  next(): void {                   // 下一頁（含邊界保護）
    this.goToPage(this.currentPage + 1);         // 呼叫 goToPage 自帶保護
  }

  // 當你執行「篩選」或「關鍵字搜尋」時，請在更新 filteredList 後重置頁碼：
  // 例：this.filteredList = 某個篩選結果; this.goToPage(1); // 讓列表回到第 1 頁

  // 只顯示「目前頁附近 5 頁」的頁碼列
  get pageNumbers(): number[] {
    const total = this.totalPages;      // 總頁數
    const current = this.currentPage;   // 目前頁
    const windowSize = 5;               // 要顯示的頁碼數（你可改成 7 或 9）
    const half = Math.floor(windowSize / 2); // 一半範圍（5 → 前後各 2）

    // 起始頁 = 目前頁 - 2（但至少要 1）
    let start = Math.max(1, current - half);
    // 結束頁 = 起始 + 4（但不能超過總頁數）
    let end = Math.min(total, start + windowSize - 1);

    // 若靠近尾端時不夠 5 頁，往前補滿
    start = Math.max(1, end - windowSize + 1);

    // 產生連續頁碼 [start, ..., end]
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

}

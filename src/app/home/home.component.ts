import { Component, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ExampleService, formElement } from '../@service/example.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // 存使用者輸入的搜尋內容
  searchFormName: any = '';

  toDay = new Date();
  // 把今天轉成 YYYY-MM-DD 格式的字串（用來給 date 輸入框）
  toDayStr = this.toDay.toISOString().split('T')[0];

  // 存使用者選的開始日期
  fromDate: string | null = null;
  // 存使用者選的結束日期
  toDate: string | null = null;

  // 點搜尋按鈕時，目前用來看有沒有成功接到值
  search() {
    console.log('搜尋名字:', this.searchFormName);
    console.log('開始日期:', this.fromDate);
    console.log('結束日期:', this.toDate);
  }


  // 表單
  // ===== 分頁狀態（這些就是模板裡用到的 page / pageSize 等）=====
  page: number = 1;                                          // 目前頁碼（從 1 開始）
  pageSize: number = 10;                                     // 每頁筆數
  totalItems: number = 0;                                    // 總筆數（rows 長度）

  // ===== 真正資料（從服務取回來放這裡）=====
  rows: formElement[] = [];                                  // 全部資料

  // 透過建構子注入服務
  constructor(private example: ExampleService) {}

  // 元件初始化時把資料抓回來
  ngOnInit() {
    this.rows = this.example.getForms();                     // 從服務拿假資料
    this.totalItems = this.rows.length;                      // 設定總筆數（給分頁計算用）
  }

  // 目前頁面的資料（用 slice 切出要顯示的那段）
  get pagedData(): formElement[] {                           // 讓模板直接用 {{ pagedData }}
    const start = (this.page - 1) * this.pageSize;           // 起始索引
    const end = start + this.pageSize;                       // 結束索引
    return this.rows.slice(start, end);                      // 回傳該頁資料
  }

  // 總頁數（至少 1 頁）
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); // 向上取整
  }

  // 換頁（含邊界保護）
  goTo(p: number) {
    const safe = Math.min(Math.max(1, p), this.totalPages);  // 夾在 1～總頁
    this.page = safe;                                        // 寫回頁碼
  }
  prev() { this.goTo(this.page - 1); }                       // 上一頁
  next() { this.goTo(this.page + 1); }                       // 下一頁

}


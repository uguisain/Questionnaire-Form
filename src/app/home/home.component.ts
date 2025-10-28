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

  toDay = new Date();
  // 把今天轉成 YYYY-MM-DD 格式的字串（用來給 date 輸入框）
  toDayStr = this.toDay.toISOString().split('T')[0];

  // 存使用者選的開始日期
  fromDate: string | null = null;
  // 存使用者選的結束日期
  toDate: string | null = null;

  // 即時搜尋(點搜尋按鈕時，目前用來看有沒有成功接到值)
  search() {
    console.log('搜尋名字:', this.searchFormName);
    console.log('開始日期:', this.fromDate);
    console.log('結束日期:', this.toDate);
  }
  // 存使用者輸入的搜尋內容
  searchFormName: string = '';


  // 表單----------------------------------------------------------
  // 存放從服務拿到的資料
  forms: formElement[] = [];

  // 注入服務------------------------------------------------------
  constructor(private example: ExampleService) {}

  // 當畫面載入時執行
  ngOnInit(): void {
    this.forms = this.example.getForms(); // 取得假資料
    console.log('載入資料:', this.forms); // 看看有沒有拿到

    // 排序用(id)
    this.forms.sort((a, b) => {
      if (a.formId < b.formId) {
        return -1;
      }
      if (a.formId > b.formId) {
        return 1;
      }
      return 0;
    });
  }

  // ===== 即時篩選（最關鍵）：每次畫面讀到它時都「用當前條件」重新過濾 =====
    get filteredForms(): formElement[] {
    // 1) 準備關鍵字（小寫、去頭尾空白）
    const kw = (this.searchFormName || '').trim().toLowerCase();

    // 2) 準備日期（字串比較可用，因為都是 'YYYY-MM-DD'）
    const from = this.fromDate || '';   // 若為 null → 當空字串
    const to   = this.toDate   || '';   // 若為 null → 當空字串

    // 3) 用最直覺的規則過濾：
    //    - 名稱：包含關鍵字才算（關鍵字空白就不限制）
    //    - 日期：用「區間重疊」的直覺規則，簡單又好懂：
    //        * 只有開始日：挑「表單結束 >= 開始日」的（還沒結束/還在期間）
    //        * 只有結束日：挑「表單開始 <= 結束日」的（在結束日前就開跑過）
    //        * 同時有開始＋結束：挑「表單期間 *有重疊* 你選的期間」的
    return this.forms.filter(row => {
      // 名稱是否符合
      const nameOK = kw === '' || row.formName.toLowerCase().includes(kw);

      // 日期是否符合
      const onlyFrom = from && !to;
      const onlyTo   = !from && to;
      const both     = from && to;

      // 三種情況分開寫，超直覺好讀
      let dateOK = true; // 預設通過
      if (onlyFrom) {
        dateOK = row.formToDate >= from;                       // 表單結束不早於開始條件
      } else if (onlyTo) {
        dateOK = row.formfromDate <= to;                       // 表單開始不晚於結束條件
      } else if (both) {
        // 區間重疊判斷： [Afrom, Ato] 與 [Bfrom, Bto] 有交集 ↔ Afrom <= Bto 且 Ato >= Bfrom
        dateOK = row.formfromDate <= to && row.formToDate >= from;
      }
      // 若 from、to 都沒填，dateOK 保持 true

      return nameOK && dateOK;                                 // 兩個條件都要成立
    });
  }
}


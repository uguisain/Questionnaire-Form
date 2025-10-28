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
  // 存放從服務拿到的資料
  forms: formElement[] = [];

  // 注入服務
  constructor(private example: ExampleService) {}

  // 當畫面載入時執行
  ngOnInit(): void {
    this.forms = this.example.getForms(); // 取得假資料
    console.log('載入資料:', this.forms); // 看看有沒有拿到
  }
}


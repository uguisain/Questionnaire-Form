import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';          // 基本指令（如 @if）用
import { FormsModule } from '@angular/forms';            // [(ngModel)] 用
import { AuthService } from '../@service/auth.service';  // 你的 AuthService 路徑
import { UserProfile, QuestionnaireSummary } from '../@models/auth-model';      // 你的介面路徑
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-per-infor',
  imports: [CommonModule, FormsModule, MatTabsModule],
  templateUrl: './per-infor.component.html',
  styleUrl: './per-infor.component.scss'
})
export class PerInforComponent {

  user: UserProfile | null = null; // 用來綁定畫面顯示與編輯
  myAnswered: QuestionnaireSummary[] = []; // 已填寫
  myCreated: QuestionnaireSummary[] = [];  // 我新增

    constructor(private auth: AuthService) {
      // 一進來就從 AuthService 拿目前登入的使用者資料
      const state = this.auth.getState(); // 一次拿到現在狀態
      this.user = state.user;
      this.myAnswered = this.auth.getMyAnswered(); // 從 service 抓清單
      this.myCreated = this.auth.getMyCreated();   // 從 service 抓清單
      }

    save() {
      // 若沒有登入（user 為 null），就不處理
      if (!this.user) return;

      // 把修改後的值交給 AuthService，請它負責更新與儲存
      this.auth.updateProfile({
        name: this.user.name,   // 使用畫面上已修改的資料
        phone: this.user.phone,
        age: this.user.age,
      });

      // 目前是存到 localStorage 的假資料，之後接 API 只要改 AuthService 實作
      alert('已儲存（目前為假資料，儲存在瀏覽器）');
    }

}

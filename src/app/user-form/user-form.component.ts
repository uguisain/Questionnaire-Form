import { Component, OnInit } from '@angular/core';                     // 元件、生命週期
import { ActivatedRoute, Router } from '@angular/router';              // 讀參數、導頁
import { CommonModule } from '@angular/common';                         // *ngIf 等指令（standalone 需要）
import { RouterModule } from '@angular/router';                         // routerLink（standalone 需要）
import { ExampleService, formElement } from '../@service/example.service'; // 你的服務與型別
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [HomeComponent, CommonModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
 // 存這份表單的資料（找不到就會是 undefined）
  form?: formElement;

  constructor(
    private route: ActivatedRoute,                                      // 讀取網址上的 :id
    private router: Router,                                             // 返回/導頁
    private example: ExampleService                                      // 從服務抓資料
  ) {}

  ngOnInit(): void {
    // 1) 從路由參數拿 id（字串）→ 用 + 轉成 number
    const id = +(this.route.snapshot.paramMap.get('id') || 0);

    // 2) 用 service 依 id 取得單筆
    this.form = this.example.getFormById(id);

    // 3) 若找不到 → 簡單提示並導回首頁
    if (!this.form) {
      alert('找不到這份表單');                                         // 簡單提示
      this.router.navigate(['/home']);                                      // 導回首頁
    }
  }

  // 返回清單（最常用）
  back() {
    this.router.navigate(['/']);                                        // 導回首頁
  }
}



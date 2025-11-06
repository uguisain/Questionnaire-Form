import { LoadingService } from './@service/loading.service';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { TestComponent } from "./test/test.component";
import { MatTabsModule } from '@angular/material/tabs';
import { Test2Component } from './test2/test2.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    FormsModule,
    CommonModule,
    HomeComponent,
    TestComponent,
    MatTabsModule,
    RouterLink,
    RouterLinkActive,
    Test2Component,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatButtonModule, MatListModule, MatToolbarModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private router: Router) {}

  // ===== Toolbar 需要的極少數屬性與方法 =====
toolbarSearch: string = '';       // 搜尋框雙向綁定（你之後要用再接）
menuOpen: boolean = false;        // 小螢幕的導覽展開狀態

toggleMenu() {
  // 點漢堡鈕時，切換導覽顯示/隱藏
  this.menuOpen = !this.menuOpen;
}

goLogin() {
  // 這裡用你的 Router 導向登入頁（依你的路由調整）
  this.router.navigate(['/Login']);
}





  }


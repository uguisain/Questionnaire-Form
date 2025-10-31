import { LoadingService } from './@service/loading.service';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { TestComponent } from "./test/test.component";
import { MatTabsModule } from '@angular/material/tabs';
import { Test2Component } from './test2/test2.component';
import { MatDialog } from '@angular/material/dialog';
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

  // readonly dialog = inject(MatDialog);

  // openDialog() {
  //   let openDialog = this.dialog.open(TestComponent, {
  //     data: '你好',
  //     width: '300px',
  //     height: '300px',
  //   });
  //   openDialog.afterClosed().subscribe((res) => {
  //     console.log(res);
  //   })
  // }

  showLoading!: boolean;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((res) => {
      this.showLoading = res;
    })
  }





  }


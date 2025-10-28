import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { TestComponent } from "./test/test.component";
import { MatTabsModule } from '@angular/material/tabs';
import { Test2Component } from './test2/test2.component';

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
    Test2Component,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  }


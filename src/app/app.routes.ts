import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserFormComponent } from "./user-form/user-form.component";
import { Test4Component } from './test4/test4.component';
import { StatisticalReportComponent } from './statistical-report/statistical-report.component';
import { LoginComponent } from './login/login.component';
import { PerInforComponent } from './per-infor/per-infor.component';


export const routes: Routes = [
  { path: "home", component: HomeComponent},
  { path: "UserForm", component: UserFormComponent},
  { path: 'form/:id', component: UserFormComponent }, // 表單頁
  { path: "Report", component: StatisticalReportComponent},
  { path: 'Report/:id', component: StatisticalReportComponent }, // 統計頁
  { path: "test4", component: Test4Component},
  { path: "Login", component: LoginComponent},
  { path: 'profile', loadComponent: () =>
    import('./per-infor/per-infor.component').then(m => m.PerInforComponent)},





  { path: "**", component: HomeComponent},

];

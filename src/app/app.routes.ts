import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { Test2Component } from './test2/test2.component';
import { UserFormComponent } from "./user-form/user-form.component";
import { Test3Component } from './test3/test3.component';
import { Test4Component } from './test4/test4.component';
import { StatisticalReportComponent } from './statistical-report/statistical-report.component';


export const routes: Routes = [
  { path: "home", component: HomeComponent},
  { path: "test", component: TestComponent},
  { path: "test2", component: Test2Component},
  { path: "UserForm", component: UserFormComponent},
  { path: 'form/:id', component: UserFormComponent }, // 表單頁
  { path: "Report", component: StatisticalReportComponent},
  { path: 'Report/:id', component: StatisticalReportComponent }, // 統計頁
  { path: "test3", component: Test3Component},
  { path: "test4", component: Test4Component},

];

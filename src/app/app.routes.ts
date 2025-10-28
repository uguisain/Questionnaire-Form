import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { Test2Component } from './test2/test2.component';
import { UserFormComponent } from "./user-form/user-form.component";


export const routes: Routes = [
  { path: "home", component: HomeComponent},
  { path: "test", component: TestComponent},
  { path: "test2", component: Test2Component},
  { path: "UserForm", component: UserFormComponent},
  { path: 'form/:id', component: UserFormComponent } // 表單頁

];

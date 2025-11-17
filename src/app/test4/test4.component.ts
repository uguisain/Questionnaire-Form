import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-test4',
  imports: [FormsModule, CommonModule],
  templateUrl: './test4.component.html',
  styleUrl: './test4.component.scss'
})
export class Test4Component {
  users = [
    { id: 1, name: '花子', age: 17 },
    { id: 2, name: '太郎', age: 22 },
    { id: 3, name: '小白', age: 15 },
    { id: 4, name: '大熊', age: 30 }
  ];

  nameM() {
    let n = this.users.map(m => m.name);
    console.log(n);
  }

  ageM() {
    let a = this.users.map(m => { return {...m, age: m.age+5}});
    console.log(a);
  }

  stringM() {
    let s = this.users.map(m => m.name + "(" + m.age + "歲)");
    console.log(s);
  }



  }

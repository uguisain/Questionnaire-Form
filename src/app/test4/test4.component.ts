import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpService } from "../@service/http.service";
import { ApiResponse, HomeList, } from "../@Interface/quizList";

@Component({
  selector: 'app-test4',
  imports: [FormsModule, CommonModule],
  templateUrl: './test4.component.html',
  styleUrl: './test4.component.scss'
})
export class Test4Component {

  constructor(private http: HttpService) {}

  quiz: HomeList[] = []; // 這是問卷陣列必須用迴圈取值

  ngOnInit(): void {
    this.http.getApi<ApiResponse<HomeList>>('http://localhost:8080/quiz/get_all')
    .subscribe((res) => {
      this.quiz = res.quizList;
      console.log(res);
    });
  }



}

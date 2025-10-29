import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-test',
  imports: [RouterOutlet, RouterLink, HomeComponent, FormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  josnData = {
    title: '練習',
    questions: [
      {
        id: 1,
        questionName: '問題1',
        options: [
          { name: '選項A', code: 'A'},
          { name: '選項B', code: 'B'},
          { name: '選項C', code: 'C'},
        ]
      },
      {
        id: 2,
        questionName: '問題2',
        options: [
          { name: '選項a', code: 'a'},
          { name: '選項b', code: 'b'},
          { name: '選項c', code: 'c'},
        ]
      }
    ]
  }

  test = '';
  resAns = [];

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.


  }

  res() {
    console.log(this.resAns)
    console.log(this.test)
  }





}

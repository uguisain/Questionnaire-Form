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

  height: number | null = null;
  weight: number | null = null;

  bmiResult: number | string= '';
  statusText: string = '';

  checkBmi() {
    this.bmiResult = this.getBmi();
    this.statusText = this.getResult(this.bmiResult);
  }

  getBmi() {
    let w = this.weight;
    let h = this.height;
    if (w === null || h === null || w <= 0 || h <= 0) {return "請填寫正確身高和體重"};

    let bmi = (w / ((h * 0.01) ** 2));
    // this.bmiResult = bmi;
    return bmi;
  }

  getResult(bmi: number | string) {
    if (bmi === "請填寫正確身高和體重") return '-';
    const b = Number(bmi);
    if (b < 18.5) return '體重過輕';
    else if (b < 24) return '健康體重';
    else if (b < 27) return '體重過重';
    return '肥胖';
  }

}

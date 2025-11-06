import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-test4',
  imports: [FormsModule],
  templateUrl: './test4.component.html',
  styleUrl: './test4.component.scss'
})
export class Test4Component {

  onAge: number | null = null;

  get ageStatus() {
    const age = Number(this.onAge);

    if (!Number.isFinite(age)) {
      return '請輸入年齡';
    } if(age < 18) {
      return '未成年';
    } else {
      return '成年人';
    }
  }

}

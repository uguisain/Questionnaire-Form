import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-test4',
  imports: [FormsModule],
  templateUrl: './test4.component.html',
  styleUrl: './test4.component.scss'
})
export class Test4Component {

  age: number | null = null; // 年齡
  temp: number | null = null; // 體溫
  isMember: 'yes' | 'no' | null = null; // 是否為會員
  preOrder: boolean = false; // 是否已購票

  enterResult: string = ''; // 是否可入場
  priceResult: string = ''; // 票價

  // 帶入是否為會員
  onMemberChange(event: Event) {
    const m = event.target as any;
    this.isMember = m.value;
  }

  onPreOrderChange(event: Event) {
    const o = event.target as HTMLInputElement;
    this.preOrder = o.checked;
    console.log(this.preOrder);
  }

  check() {
    const a = Number(this.age);
    const t = Number(this.temp);

    this.enterResult =
    !Number.isFinite(t) || t < 35 || t > 45 ? "請輸入正確體溫" :
    t >= 38 ? '您發燒囉，無法入場' :
    this.preOrder === false ? '您尚未購票喔' :
    '成功入場' ;

    this.priceResult =
    !Number.isFinite(a) || a <= 0 || a > 120 || a === null ? "請輸入正確年齡" :
    this.isMember === null ? "請選擇是否為會員" :
    this.isMember === 'yes' ? "會員票價100元!" :
    a <= 17 ? "非會員未成年票價150元!" :
    "非會員成年票價200元!" ;
  }
}

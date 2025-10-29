import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from "@angular/forms";
import Chart from 'chart.js/auto';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-test2',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './test2.component.html',
  styleUrl: './test2.component.scss'
})
export class Test2Component {
// selected = 'option2';
// test: string = '';

  arrayData = [
    {
      id: '1',
      labels: ['籃球', '足球', '羽球'],
      label: '類型',
      data: ['30', '12', '50'],
      backgroundColor: [
        '#a62727',
        '#4011c9',
        '#11c928'
      ]
    },
    {
      id: '2',
      labels: ['早餐', '午餐', '晚餐'],
      label: '類型',
      data: ['10', '120', '500'],
      backgroundColor: [
        '#1a4e58',
        '#581a2f',
        '#583e1a'
      ]
    }
  ]

  ngAfterViewInit(): void {
    for (let array of this.arrayData) {
      // 獲取 canvas 元素
      let ctx = document.getElementById(array.id) as HTMLCanvasElement;

      // 設定數據
      let data = {
      // x 軸文字
      labels: array.labels,
      datasets: [
        {
          // 上方分類文字
          label: array.label,
          // 數據
          data: array.data,
          // 線與邊框顏色
          backgroundColor: array.backgroundColor,
          //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
          hoverOffset: 4,
        },
      ],
    };

    // 創建圖表
    let chart = new Chart(ctx, {
      //pie是圓餅圖,doughnut是環狀圖
      type: 'pie',
      data: data,
      });
    }


  }





}


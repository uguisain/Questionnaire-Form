import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReportService } from '../@service/report.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistical-report',
  imports: [RouterModule],
  templateUrl: './statistical-report.component.html',
  styleUrl: './statistical-report.component.scss'
})
export class StatisticalReportComponent {

  constructor(
    private route: ActivatedRoute,                                    // 讀網址上的 :id
    private router: Router,                                           // 返回/導頁
    private reportService: ReportService                              // 從服務抓資料                                   // 從服務抓資料
  ) {}

  Report: any;                                                        // 裝後端原始格式陣列

  ngOnInit(): void {
    // 從路由參數拿 id（字串）→ 轉數字
    const id = +(this.route.snapshot.paramMap.get('id') || 0);

    // 依 id 取得單筆表單
    this.Report = this.reportService.getReportById(id);

    // 找不到就導回首頁
    if (!this.Report) {
      alert('找不到這份報表');
      this.router.navigate(['/home']);
      return;
    }

    console.log(this.Report);

    // TODO: 需要把 this.Report 統一成「陣列」來處理???
    // const reportArray = Array.isArray(this.Report) ? this.Report : [this.Report];
  }

  ngAfterViewInit(): void {
    // FIXME:
    for (let Re of this.Report) {
      // 獲取 canvas 元素
      let ctx = document.getElementById(Re.id) as HTMLCanvasElement;
        for (let Re2 of Re.statisticsVoList) {
          for (let Re3 of Re.optionCountVoList) {

            // 設定數據
            let data = {
            // x 軸文字
            labels: Re3.option,
            datasets: [{
            // 上方分類文字
            label: Re2.type,
            // 數據
            data: Re3.count,
            // 線與邊框顏色
            backgroundColor: [
            '#a62727',
            '#4011c9',
            '#11c928',
            '#f6e33cff'
            ],
            //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
            hoverOffset: 4,
            },],
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











  }

}

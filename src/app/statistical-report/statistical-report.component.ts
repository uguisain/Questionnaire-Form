import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReportService } from '../@service/report.service';
import Chart from 'chart.js/auto';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  // dialog注入
  readonly dialog = inject(MatDialog);

  Report: any = {
  statisticsVoList: []
  };                                                                 // 裝後端格式陣列

  // 返回清單
  back() {
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
    // 進入時回到最上方
    window.scrollTo(0, 0);

    // 從路由參數拿 id（字串）→ 轉數字
    const id = +(this.route.snapshot.paramMap.get('id') || 0);

    // 依 id 取得單筆表單
    this.Report = this.reportService.getReportById(id);

    // 找不到就導回首頁
    if (!this.Report) {
      // alert('找不到這份報表');
      this.dialog.open(DialogComponent, {
                enterAnimationDuration: '160ms',
                exitAnimationDuration: '120ms',
                data: {title: '找不到這份報表'},
              });
      this.router.navigate(['/home']);
      return;
    }

    console.log(this.Report);

    // TODO: 需要把 this.Report 統一成「陣列」來處理???
    // const reportArray = Array.isArray(this.Report) ? this.Report : [this.Report];
  }

  ngAfterViewInit(): void {
    for (let Re of this.Report.statisticsVoList) {
      // 獲取 canvas 元素
      let ctx = document.getElementById(Re.questionId) as HTMLCanvasElement;
      let labelsData = [];
      let optionData = [];
          for (let Re2 of Re.optionCountVoList) {
            labelsData.push(Re2.option);
            optionData.push(Re2.count);
          }
            // 設定數據
            let data = {
            // x 軸文字
            labels: labelsData,
            datasets: [{
            // 上方分類文字
            label: Re.type,
            // 數據
            data: optionData,
            // 線與邊框顏色
            backgroundColor: [
            '#d47bacff',
            '#a37bd4ff',
            '#7bd47cff',
            '#d4cf7bff',
            '#7bd4d4ff',
            '#d4a07bff',
            '#636363ff',
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

  getTotalCount(list: OptionCountVo[]): number {
    if (!list) return 0;
    return list.reduce((sum, o) => sum + (o.count ?? 0), 0);
  }

  getPercent(count: number, list: OptionCountVo[]): number {
    const total = this.getTotalCount(list);
    if (!total) return 0;
    return Math.round((count / total) * 100);
  }

  getTopOption(list: OptionCountVo[]): OptionCountVo | null {
    if (!list || list.length === 0) return null;
    return list.reduce((max, cur) => (cur.count > max.count ? cur : max), list[0]);
  }

  getBottomOption(list: OptionCountVo[]): OptionCountVo | null {
    if (!list || list.length === 0) return null;
    return list.reduce((min, cur) => (cur.count < min.count ? cur : min), list[0]);
  }

}

interface OptionCountVo {
  option: string;
  count: number;
}

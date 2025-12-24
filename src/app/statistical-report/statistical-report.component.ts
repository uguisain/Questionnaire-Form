import {
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReportService } from '../@service/report.service';
import Chart from 'chart.js/auto';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../@service/http.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-statistical-report',
  imports: [RouterModule],
  templateUrl: './statistical-report.component.html',
  styleUrl: './statistical-report.component.scss',
})
export class StatisticalReportComponent implements AfterViewInit, OnDestroy {
  constructor(
    private route: ActivatedRoute, // 讀網址上的 :id
    private router: Router, // 返回/導頁
    private http: HttpService // private reportService: ReportService                              // 從服務抓資料                                   // 從服務抓資料
  ) {}

  // dialog注入
  readonly dialog = inject(MatDialog);

  @ViewChildren('chartCanvas') canvases!: QueryList<
    ElementRef<HTMLCanvasElement>
  >;
  // 避免重複畫
  private hasDrawn = false;
  // 如果你會重進這頁（或資料會刷新），用 Map 存 chart 實例避免重複 new
  private chartMap = new Map<string, Chart>();

  // 單筆表單資料（從API抓回來）
  quiz: any | null = null; // 這是問卷資訊
  questions: any[] = []; // 這是問題
  Report: any[] = []; // 這是報表

  // 返回清單
  back() {
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
    // 進入時回到最上方
    window.scrollTo(0, 0);

    // 從路由參數拿 id（字串）→ 轉數字
    const id = +(this.route.snapshot.paramMap.get('id') || 0);

    this.http;
    forkJoin({
      quiz: this.http.getApi(`http://localhost:8080/quiz/get_quiz/${id}`),
      questions: this.http.getApi(
        `http://localhost:8080/quiz/get_question2?quizId=${id}`
      ),
      Report: this.http.getApi(
        'http://localhost:8080/quiz/get_statistics/' + id
      ),
    }).subscribe({
      next: ({ quiz, questions, Report }: any) => {
        this.Report = Report.statisticsList ?? [];
        this.quiz = quiz?.quizList?.[0] ?? null;
        this.questions = questions?.questionVoList ?? [];
        console.log('Report：' + JSON.stringify(Report, null, 2));
        // 等 HTML 把 @for 產生的 canvas 都 render 完再畫
        setTimeout(() => this.drawCharts(), 0);
      },
      error: (err: any) => {
        console.error(err);
        this.dialog.open(DialogComponent, {
          enterAnimationDuration: '160ms',
          exitAnimationDuration: '120ms',
          data: { title: '找不到這份報表' },
        });
        this.router.navigate(['/home']);
        return;
      },
    });
  }

  private drawCharts() {
    console.log('Report 長度', this.Report?.length);
    for (const Re of this.Report ?? []) {
      // ✅ 1) 取得 canvas（注意 id 要對到 HTML）
      const canvasId = 'q' + Re.questionId; // 如果你 HTML 是 id="q{{questionId}}"
      const canvas = document.getElementById(
        canvasId
      ) as HTMLCanvasElement | null;

      if (!canvas) {
        console.log('找不到 canvas：', canvasId);
        continue;
      }

      // ✅ 2) 整理資料
      const labelsData: string[] = [];
      const optionData: number[] = [];

      for (const Re2 of Re.opCountList ?? []) {
        labelsData.push(Re2.optionName);
        optionData.push(Re2.count);
      }

      // 如果這題沒有資料，就跳過
      if (labelsData.length === 0) continue;

      // 如果這張圖曾經畫過，先銷毀再重畫（保險）
      const old = this.chartMap.get(canvasId);
      if (old) {
        old.destroy();
        this.chartMap.delete(canvasId);
      }

      const data = {
        labels: labelsData,
        datasets: [
          {
            label: this.getQ(Re.questionId)?.type ?? '統計',
            data: optionData,
            backgroundColor: [
              '#d47bacff',
              '#a37bd4ff',
              '#7bd47cff',
              '#d4cf7bff',
              '#7bd4d4ff',
              '#d4a07bff',
              '#636363ff',
            ],
            hoverOffset: 4,
          },
        ],
      };

      // ✅ 3) 畫圖
      new Chart(canvas, {
        type: 'pie',
        data,
      });
    }
  }

  ngAfterViewInit(): void {
    // 畫面上的 canvas 列表只要變了（通常是資料回來後 @for 才渲染），就會觸發
    this.canvases.changes.subscribe(() => {
      this.tryDrawCharts();
    });

    // 第一次也試著畫一次（如果一開始就有 canvas）
    this.tryDrawCharts();
  }

  private tryDrawCharts() {
    // 必要條件：有資料 + canvas 已經渲染出來
    if (!this.Report || this.Report.length === 0) return;
    if (!this.canvases || this.canvases.length === 0) return;

    // 如果你希望每次進來只畫一次（避免重複建立）
    if (this.hasDrawn) return;

    this.drawCharts();
    this.hasDrawn = true;
  }

  // ngAfterViewInit(): void {
  //   for (let Re of this.Report) {
  //     // 獲取 canvas 元素
  //     const canvas = document.getElementById(
  //       'q' + Re.questionId
  //     ) as HTMLCanvasElement | null;
  //     if (!canvas) {
  //       console.log('找不到 canvas：', 'q' + Re.questionId);
  //       continue;
  //     }
  //     let labelsData = [];
  //     let optionData = [];
  //     for (let Re2 of Re.opCountList) {
  //       labelsData.push(Re2.optionName);
  //       optionData.push(Re2.count);
  //     }
  //     // 設定數據
  //     let data = {
  //       // x 軸文字
  //       labels: labelsData,
  //       datasets: [
  //         {
  //           // 上方分類文字
  //           label: Re.type,
  //           // 數據
  //           data: optionData,
  //           // 線與邊框顏色
  //           backgroundColor: [
  //             '#d47bacff',
  //             '#a37bd4ff',
  //             '#7bd47cff',
  //             '#d4cf7bff',
  //             '#7bd4d4ff',
  //             '#d4a07bff',
  //             '#636363ff',
  //           ],
  //           //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
  //           hoverOffset: 4,
  //         },
  //       ],
  //     };

  //     // 創建圖表
  //     let chart = new Chart(ctx, {
  //       //pie是圓餅圖,doughnut是環狀圖
  //       type: 'pie',
  //       data: data,
  //     });
  //   }
  // }

  getQ(questionId: number) {
    // 從 questions 陣列裡找出 questionId 一樣的那一題
    return this.questions.find((q: any) => q.questionId === questionId);
  }

  getTotalCount(list: any[]): number {
    // 把每個選項的 count 加總
    return (list || []).reduce((sum, row) => sum + (row.count || 0), 0);
  }

  getPercent(count: number, list: any[]): number {
    const total = this.getTotalCount(list);
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }

  getTopOption(list: any[]) {
    if (!list || list.length === 0) return null;
    return list.reduce((max, cur) => (cur.count > max.count ? cur : max));
  }

  getBottomOption(list: any[]) {
    if (!list || list.length === 0) return null;
    return list.reduce((min, cur) => (cur.count < min.count ? cur : min));
  }

  ngOnDestroy(): void {
    // 銷毀所有 Chart 實例
    this.chartMap.forEach((chart) => {
      chart.destroy();
    });

    // 清空 Map（保險）
    this.chartMap.clear();

    console.log('統計頁 chart 已銷毀');
  }
}

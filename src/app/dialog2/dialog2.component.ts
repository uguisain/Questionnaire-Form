import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MatDialogTitle,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog2',
  imports: [
    MatDialogTitle,
    MatDialogModule,
    FormsModule,
    MatDialogActions,
    MatDialogContent,
    CommonModule,
  ],
  templateUrl: './dialog2.component.html',
  styleUrl: './dialog2.component.scss',
  // 動畫區
  animations: [
    // dialogEnter：進場淡入＋微縮放；退場淡出
    trigger('dialogEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('160ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '120ms ease-in',
          style({ opacity: 0, transform: 'scale(0.98)' })
        ),
      ]),
    ]),
    trigger('pop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.6) rotate(-8deg)' }),
        animate(
          '220ms cubic-bezier(.2,.8,.2,1)',
          style({ opacity: 1, transform: 'scale(1) rotate(0)' })
        ),
      ]),
    ]),
  ],
})
export class Dialog2Component {
  // 關閉用
  readonly dialogRef = inject(MatDialogRef<Dialog2Component>);
  // 接收資料用
  readonly data = inject<any>(MAT_DIALOG_DATA);

  // 回傳「取消」
  cancel() {
    this.dialogRef.close(false);
  }

  // 回傳「確認」
  confirm() {
    this.dialogRef.close(true);
  }

}

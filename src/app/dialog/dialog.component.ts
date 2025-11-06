import { Component, inject } from '@angular/core';
import {MatDialogModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormsModule } from "@angular/forms";
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dialog',
  imports: [MatDialogTitle, MatDialogModule, FormsModule, MatDialogActions, MatDialogContent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  // 關閉用
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  // 接收資料用
  readonly data = inject<any>(MAT_DIALOG_DATA)



  end() {
  this.dialogRef.close();
}



}

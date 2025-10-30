import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { FormsModule } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-test',
  imports: [RouterOutlet, RouterLink, HomeComponent, FormsModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

readonly dialogRef = inject(MatDialogRef<TestComponent>);
readonly data = inject<any>(MAT_DIALOG_DATA)

end() {
  this.dialogRef.close();
}

save() {
  let data = '安安';
  this.dialogRef.close(data);
}



}

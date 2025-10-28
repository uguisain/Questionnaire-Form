import { Component } from '@angular/core';
import { ExampleService } from '../@service/example.service';

@Component({
  selector: 'app-user-form',
  imports: [],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  // 注入服務------------------------------------------------------
  constructor(private example: ExampleService) {}


}

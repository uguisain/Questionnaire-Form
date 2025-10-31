import { Component } from '@angular/core';
import { LoadingService } from '../@service/loading.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-test3',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './test3.component.html',
  styleUrl: './test3.component.scss'
})
export class Test3Component {

  constructor(private loadingService: LoadingService) {}

  logIn() {
    this.loadingService.show();
  }
}

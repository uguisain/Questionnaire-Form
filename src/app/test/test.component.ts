import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-test',
  imports: [RouterOutlet, RouterLink, HomeComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {


}

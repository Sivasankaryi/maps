import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PushpinComponent } from './component/pushpin/pushpin.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PushpinComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'arcgis-concept';
}

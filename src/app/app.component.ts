import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PushpinComponent } from './component/pushpin/pushpin.component';
import { CustomClusterComponent } from "./component/custom-cluster/custom-cluster.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PushpinComponent, CustomClusterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'arcgis-concept';
}

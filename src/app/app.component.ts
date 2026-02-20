import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
=======
import { SupportTopologyComponent } from './component/support-topology/support-topology.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SupportTopologyComponent],
>>>>>>> GoJS
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
<<<<<<< HEAD
  title = 'arcgis-concept';
=======
  title = 'goJS';
>>>>>>> GoJS
}

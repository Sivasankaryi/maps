import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupportTopologyComponent } from './component/support-topology/support-topology.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SupportTopologyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'goJS';
}

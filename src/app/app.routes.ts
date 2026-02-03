import { Routes } from '@angular/router';
import { CustomClusterComponent } from './component/custom-cluster/custom-cluster.component';
import { GeojsonComponent } from './component/geojson/geojson.component';
import { PushpinComponent } from './component/pushpin/pushpin.component';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'geojson', component: GeojsonComponent },
  { path: 'pushpin', component: PushpinComponent },
  { path: 'custom-cluster', component: CustomClusterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

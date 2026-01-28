import { AfterViewInit, Component } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

@Component({
  selector: 'app-pushpin',
  templateUrl: './pushpin.component.html',
  styleUrl: './pushpin.component.scss'
})
export class PushpinComponent implements AfterViewInit {

  ngAfterViewInit(): void {

    const map = new Map({
      basemap: 'hybrid'
    });

    const view = new MapView({
      container: 'mapView',
      map: map,
      center: [78.9629, 20.5937],
      zoom: 10
    });

    const point = new Point({
      longitude: 77.5946,
      latitude: 12.9716
    });

    const markerSymbol = new SimpleMarkerSymbol({
      color: 'red',
      size: 12,
      outline: {
        color: 'white',
        width: 1
      }
    });

const pointGraphic = new Graphic({
  geometry: point,
  symbol: markerSymbol,
  attributes: {
    city: 'Bangalore',
    state: 'Karnataka'
  },
  popupTemplate: {
    title: '{city}',
    content: `
      <b>State:</b> {state}<br/>
      <b>Latitude:</b> 12.9716<br/>
      <b>Longitude:</b> 77.5946
    `
  }
});


    view.graphics.add(pointGraphic);
  }
}

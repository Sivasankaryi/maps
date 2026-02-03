import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import Graphic from '@arcgis/core/Graphic';

@Component({
  selector: 'app-geojson',
  templateUrl: './geojson.component.html',
  styleUrl: './geojson.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class GeojsonComponent implements OnInit {
  @ViewChild('mapViewDiv', { static: true })
  mapViewEl!: ElementRef<HTMLDivElement>;

  view!: MapView;

  selectedFeature: any = null;

  ngOnInit(): void {
    const geojsonLayer = new GeoJSONLayer({
      url: 'geo.json',
      outFields: ['*'],
      popupEnabled: false,
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-marker',
          color: '#ff5722',
          size: '10px',
          outline: {
            color: '#ffffff',
            width: 1,
          },
        },
      },
    });

    const map = new ArcGISMap({
      basemap: 'streets-navigation-vector',
      layers: [geojsonLayer],
    });

    this.view = new MapView({
      container: this.mapViewEl.nativeElement,
      map,
    });


    geojsonLayer.when(() => {
  if (geojsonLayer.fullExtent) {
    this.view.goTo(
      geojsonLayer.fullExtent.expand(1.2)
    );
  }
});


    this.view.on('click', (event) => {
      this.view.hitTest(event).then((response) => {
        const hit = response.results.find((r: any) => 'graphic' in r) as any;

        if (hit && hit.graphic) {
          this.selectedFeature = hit.graphic.attributes;
        } else {
          this.selectedFeature = null;
        }
      });
    });
  }
}

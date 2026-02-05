import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';

@Component({
  selector: 'app-geojson',
  templateUrl: './geojson.component.html',
  styleUrl: './geojson.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class GeojsonComponent implements AfterViewInit {

  @ViewChild('mapViewDiv')
  mapViewEl!: ElementRef<HTMLDivElement>;
  view!: MapView;
  selectedFeature: any = null;
  
constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    const geojsonLayer = new GeoJSONLayer({
      url: 'point.geojson',
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

    const lineLayer = new GeoJSONLayer({
  url: 'line.geojson',
  outFields: ['*'],
  renderer: {
    type: 'simple',
    symbol: {
      type: 'simple-line',
      color: '#2196f3',
      width: 2
    }
  }
});

const polygonLayer = new GeoJSONLayer({
  url: 'polygon.geojson',
  outFields: ['*'],
  renderer: {
    type: 'simple',
    symbol: {
      type: 'simple-fill',
      color: [76, 175, 80, 0.4], 
      outline: {
        color: '#2e7d32',
        width: 1
      }
    }
  }
});



    const map = new ArcGISMap({
      basemap: 'streets-navigation-vector',
      layers: [geojsonLayer,polygonLayer, lineLayer],
    });

    this.view = new MapView({
      container: this.mapViewEl.nativeElement,
      map,
    });

// Previous auto zoom 
//     geojsonLayer.when(() => {
//   if (geojsonLayer.fullExtent) {
//     this.view.goTo(
//       geojsonLayer.fullExtent.expand(1.2)
//     );
//   }
// });


// auto zoom to all 

Promise.all([
  geojsonLayer.when(),
  lineLayer.when(),
  polygonLayer.when()
]).then(() => {
  const extents = [
    geojsonLayer.fullExtent,
    lineLayer.fullExtent,
    polygonLayer.fullExtent
  ].filter(Boolean);

  if (extents.length) {
    this.view.goTo(extents);
  }
});


    this.view.on('click', (event) => {
      this.view.hitTest(event).then((response) => {
        const hit = response.results.find((r: any) => 'graphic' in r) as any;

        this.zone.run(() => {
          this.selectedFeature = hit.graphic.attributes;
        });
      });
    });
  }
}

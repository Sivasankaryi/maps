import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';

@Component({
  selector: 'app-custom-cluster',
  template: `<div #mapViewDiv style="height:100vh;width:100%"></div>`,
})
export class CustomClusterComponent implements AfterViewInit {
  @ViewChild('mapViewDiv', { static: true })
  mapViewEl!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    const graphics: Graphic[] = [
      this.createPoint(80.2707, 13.0827, 'Chennai', 1),
      this.createPoint(72.8777, 19.076, 'Mumbai', 2),
      this.createPoint(77.5946, 12.9716, 'Bengaluru', 3),
      this.createPoint(78.4867, 17.385, 'Hyderabad', 4),
      this.createPoint(88.3639, 22.5726, 'Kolkata', 5),
      this.createPoint(76.2673, 9.9312, 'Kochi', 6),
      this.createPoint(76.9366, 8.5241, 'Trivandrum', 7),
      this.createPoint(74.856, 12.9141, 'Mangaluru', 8),
      this.createPoint(73.8567, 18.5204, 'Pune', 9),
      this.createPoint(77.209, 28.6139, 'Delhi', 10),
      this.createPoint(75.8577, 22.7196, 'Indore', 11),
      this.createPoint(72.5714, 23.0225, 'Ahmedabad', 12),
      this.createPoint(85.8245, 20.2961, 'Bhubaneswar', 13),
      this.createPoint(83.2185, 17.6868, 'Vizag', 14),
      this.createPoint(79.0882, 21.1458, 'Nagpur', 15),
    ];

    const layer = new FeatureLayer({
      source: graphics,
      objectIdField: 'ObjectID',
      geometryType: 'point',
      fields: [
        { name: 'ObjectID', type: 'oid' },
        { name: 'city', type: 'string' },
      ],

      // individual point
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          size: 12,
          color: '#2BB4A0',
          outline: {
            color: 'white',
            width: 1,
          },
        },
      },
      // point labels
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: 'Text($feature.ObjectID)',
          },
          labelPlacement: 'center-center',
          symbol: {
            type: 'text',
            color: 'white',
            haloColor: '#2BB4A0',
            haloSize: 1,
            font: {
              size: 10,
              weight: 'bold',
            },
          },
        },
      ],

      // clusters
      featureReduction: {
        type: 'cluster',
        clusterRadius: '100px',

        popupTemplate: {
          title: 'Cluster',
          content: 'Contains <b>{cluster_count}</b> locations',
        },
        //   cluster symbol
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-marker',
            style: 'circle',
            color: '#2BB4A0',
            outline: {
              color: 'white',
              width: 1.5,
            },
          },
          // Total cluster count based size
          visualVariables: [
            {
              type: 'size',
              field: 'cluster_count',
              stops: [
                { value: 2, size: 22 },
                { value: 5, size: 32 },
                { value: 10, size: 42 },
                { value: 20, size: 52 },
              ],
            },
          ] as any[],
        },
        // cluster labels
        labelingInfo: [
          {
            labelExpressionInfo: {
              expression: 'Text($feature.cluster_count)',
            },
            labelPlacement: 'center-center',
            symbol: {
              type: 'text',
              color: 'white',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
        ],
      },
    });

    const map = new Map({
      basemap: 'gray-vector',
      layers: [layer],
    });

    new MapView({
      container: this.mapViewEl.nativeElement,
      map,
      center: [78.9629, 20.5937],
      zoom: 4,
    });
  }

  createPoint(lon: number, lat: number, city: string, id: number): Graphic {
    return new Graphic({
      geometry: {
        type: 'point',
        longitude: lon,
        latitude: lat,
      },
      attributes: {
        ObjectID: id,
        city,
      },
    });
  }
}

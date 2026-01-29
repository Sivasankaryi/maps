import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";

@Component({
  selector: 'app-custom-cluster',
  imports: [],
  templateUrl: './custom-cluster.component.html',
  styleUrl: './custom-cluster.component.scss'
})

export class CustomClusterComponent implements AfterViewInit {

@ViewChild('mapViewNode', { static: true })
  mapViewNode!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    const points = [
      { id: 1, lat: 12.9716, lon: 77.5946 },
      { id: 2, lat: 12.9720, lon: 77.5949 },
      { id: 3, lat: 12.9730, lon: 77.5955 },
      { id: 4, lat: 12.9750, lon: 77.5965 },
      { id: 5, lat: 13.0827, lon: 80.2707 },
      { id: 6, lat: 13.0830, lon: 80.2710 },
      { id: 7, lat: 13.0840, lon: 80.2720 },
      { id: 8, lat: 28.6139, lon: 77.2090 },
      { id: 9, lat: 28.6145, lon: 77.2100 },
      { id: 10, lat: 19.0760, lon: 72.8777 }
    ];

    const graphics = points.map(p =>
      new Graphic({
        geometry: {
          type: "point",
          latitude: p.lat,
          longitude: p.lon
        },
        attributes: {
          ObjectID: p.id
        }
      })
    );

    const clusterLayer = new FeatureLayer({
      source: graphics,
      geometryType: "point",
      objectIdField: "ObjectID",

      fields: [
        { name: "ObjectID", type: "oid" }
      ],

      featureReduction: {
        type: "cluster",
        clusterRadius: "80px"
      }
    });

    clusterLayer.renderer = {
      type: "simple",

      symbol: {
        type: "simple-marker",
        style: "circle",
        outline: {
          color: "#ffffff",
          width: 1.5
        }
      },

      visualVariables: [
        {
          type: "size",
          field: "cluster_count",
          stops: [
            { value: 1, size: 10 },   
            { value: 5, size: 24 },
            { value: 15, size: 38 },
            { value: 30, size: 56 }
          ]
        },
        {
          type: "color",
          field: "cluster_count",
          stops: [
            { value: 1, color: "#93c5fd" },
            { value: 5, color: "#3b82f6" },
            { value: 15, color: "#1d4ed8" },
            { value: 30, color: "#1e3a8a" }
          ]
        }
      ] as any[]
    };


    clusterLayer.labelingInfo = [
      {
        labelPlacement: "center-center",

        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')"
        },

        symbol: {
          type: "text",
          color: "white",
          haloColor: "#1e3a8a",
          haloSize: 1,
          font: {
            size: 12,
            weight: "bold"
          }
        }
      }
    ];

    const map = new Map({
      basemap: "streets-navigation-vector",
      layers: [clusterLayer]
    });

    new MapView({
      container: this.mapViewNode.nativeElement,
      map,
      center: [78.9629, 20.5937], 
      zoom: 4
    });
  }

}


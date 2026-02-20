import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';

@Component({
  selector: 'app-olt-ont-mdu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './olt-ont-mdu.component.html',
  styleUrl: './olt-ont-mdu.component.scss',
})
export class OltOntMduComponent implements AfterViewInit {

  @ViewChild('mapViewDiv', { static: true })
  mapViewDiv!: ElementRef<HTMLDivElement>;

  map!: Map;
  view!: MapView;

  oltLayer!: FeatureLayer;
  ontLayer!: FeatureLayer;
  mduLayer!: FeatureLayer;

  oltTableData: any[] = [];
  ontMduTableData: any[] = [];

  showOltTable = false;
  showOntMduTable = false;

  searchTerm = '';
  sortField = '';
  sortAsc = true;

  private highlightHandle: __esri.Handle | null = null;
  private hoverTimeout: any;

  fields: __esri.FieldProperties[] = [
    { name: 'objectId', type: 'oid' },
    { name: 'deviceName', type: 'string' },
    { name: 'deviceType', type: 'string' },
    { name: 'severity', type: 'string' },
    { name: 'rgFsan', type: 'string' },
    { name: 'deviceModel', type: 'string' },
    { name: 'networkgroup_name', type: 'string' },
    { name: 'systemAlarmCount', type: 'integer' },
    { name: 'transformedAlarmCount', type: 'integer' },
    { name: 'cloudHealthCount', type: 'integer' },
    { name: 'cloudConnectivityCount', type: 'integer' },
  ];

  async ngAfterViewInit() {
    await this.initMap();
    const data = await this.loadJson();
    this.createLayers(data);
    this.setupEvents();
  }

  async initMap() {
    this.map = new Map({ basemap: 'streets-navigation-vector' });

    this.view = new MapView({
      container: this.mapViewDiv.nativeElement,
      map: this.map,
      center: [0, 20],
      zoom: 2,
      popup: { autoCloseEnabled: false },
      highlightOptions: {
        color: '#000000',
        haloOpacity: 0.9,
        fillOpacity: 0.1
      }
    });

    await this.view.when();
  }

  async loadJson(): Promise<any[]> {
    const res = await fetch('OLT-OND-MDU.json');
    return res.json();
  }

  getRenderer(style: 'circle' | 'square' | 'diamond') {
    return new UniqueValueRenderer({
      field: 'severity',
      defaultSymbol: {
        type: 'simple-marker',
        style,
        size: 12,
        color: '#9e9e9e',
        outline: { color: '#ffffff', width: 1 }
      } as any,
      uniqueValueInfos: [
        { value: 'CRITICAL', symbol: { type: 'simple-marker', style, color: '#d32f2f', size: 12 } },
        { value: 'MAJOR', symbol: { type: 'simple-marker', style, color: '#fbc02d', size: 12 } },
        { value: 'MINOR', symbol: { type: 'simple-marker', style, color: '#388e3c', size: 12 } },
      ]
    });
  }

getClusterConfig(name: string) {
  return {
    type: "cluster",
    clusterRadius: "100px",

    symbol: {
      type: "simple-marker",
      style: "circle",
      size: 40,
      color: "#007bff",
      outline: {
        color: "white",
        width: 2
      }
    },

    labelingInfo: [{
      labelExpressionInfo: {
        expression: "Text($feature.cluster_count, '#,###')"
      },
      symbol: {
        type: "text",
        color: "white",
        font: {
          size: 14,
          weight: "bold"
        }
      },
      labelPlacement: "center-center"
    }],

    popupEnabled: false
  };
}

  createGraphics(data: any[]): Graphic[] {
    let oid = 1;
    return data
      .filter(d => d.longitude && d.latitude)
      .map(d => new Graphic({
        geometry: new Point({ longitude: d.longitude, latitude: d.latitude }),
        attributes: {
          objectId: oid++,
          deviceName: d.deviceName ?? '-',
          deviceType: d.deviceType ?? '-',
          severity: d.nonZeroSev?.toUpperCase() ?? 'NORMAL',
          deviceModel: d.deviceModel ?? '-',
          networkgroup_name: d.deviceLocation?.networkgroup_name ?? '-',
          rgFsan: d.rgFsan ?? '-',
          systemAlarmCount: d.systemAlarmCount ?? 0,
          transformedAlarmCount: d.transformedAlarmCount ?? 0,
          cloudHealthCount: d.cloudHealthCount ?? 0,
          cloudConnectivityCount: d.cloudConnectivityCount ?? 0,
        }
      }));
  }

  createLayers(data: any[]) {

    this.oltLayer = new FeatureLayer({
      source: this.createGraphics(data.filter(d => d.deviceType === 'OLT')),
      fields: this.fields,
      objectIdField: 'objectId',
      renderer: this.getRenderer('square'),
        popupTemplate: {
    title: "{deviceName}",
    content: `
      <b>Location:</b> {networkgroup_name}<br/>
      <b>Model:</b> {deviceModel}<br/>
      <b>System:</b> {systemAlarmCount}<br/>
      <b>Health:</b> {cloudHealthCount}
    `
  },
      // featureReduction: this.getClusterConfig('OLT') as any
    });

    this.ontLayer = new FeatureLayer({
      source: this.createGraphics(data.filter(d => d.deviceType === 'ONT')),
      fields: this.fields,
      objectIdField: 'objectId',
      renderer: this.getRenderer('circle'),
        popupTemplate: {
    title: "{deviceName}",
    content: `
      <b>Location:</b> {networkgroup_name}<br/>
      <b>Model:</b> {deviceModel}<br/>
      <b>System:</b> {systemAlarmCount}<br/>
      <b>Health:</b> {cloudHealthCount}
    `
  },
      featureReduction: this.getClusterConfig('ONT') as any
    });

    this.mduLayer = new FeatureLayer({
      source: this.createGraphics(data.filter(d => d.deviceType === 'MDU')),
      fields: this.fields,
      objectIdField: 'objectId',
        popupTemplate: {
    title: "{deviceName}",
    content: `
      <b>Location:</b> {networkgroup_name}<br/>
      <b>Model:</b> {deviceModel}<br/>
      <b>System:</b> {systemAlarmCount}<br/>
      <b>Health:</b> {cloudHealthCount}
    `
  },
      renderer: this.getRenderer('diamond')
    });

    this.map.addMany([this.oltLayer, this.mduLayer, this.ontLayer]);
  }

  setupEvents() {

this.view.on("pointer-move", async (event) => {
  const hit = await this.view.hitTest(event);

  if (!hit.results.length) {
    this.view.popup?.close();
    return;
  }

  const result = hit.results[0];

  // ✅ Check if this result has graphic property
  if (result.type === "graphic") {
    const graphic = result.graphic;

    if ((graphic as any).isAggregate) {
      this.view.popup?.close();
      return;
    }

    // ✅ Normal point → show popup
    this.view.popup?.open({
      features: [graphic],
      location: graphic.geometry as __esri.Point
    }) as any;
  }
});


    // Click cluster
    this.view.on('click', async (event) => {

      const hit = await this.view.hitTest(event);
      if (!hit.results.length) {
        this.clearSelection();
        return;
      }

      const graphicHit = hit.results.find(
        (r): r is __esri.GraphicHit => r.type === 'graphic'
      );

      if (!graphicHit) return;

      const graphic = graphicHit.graphic;
      const layer = graphic.layer as FeatureLayer;

      this.clearSelection();
      this.applyHighlight(graphic);

      if (!graphic.isAggregate) return;

      const objectId = graphic.getObjectId();
      if (objectId == null) return;

      const query = layer.createQuery();
      query.aggregateIds = [objectId];
      query.outFields = ['*'];
      query.returnGeometry = false;

      const results = await layer.queryFeatures(query);
      const rows = results.features.map(f => f.attributes);

      this.oltTableData = rows.filter(r => r.deviceType === 'OLT');
      this.ontMduTableData = rows.filter(
        r => r.deviceType === 'ONT' || r.deviceType === 'MDU'
      );

      this.showOltTable = this.oltTableData.length > 0;
      this.showOntMduTable = this.ontMduTableData.length > 0;

      this.view.popup?.close();
    });
  }

  async applyHighlight(graphic: Graphic) {
    const layerView = await this.view.whenLayerView(graphic.layer as FeatureLayer);
    this.highlightHandle = layerView.highlight(graphic);
  }

  clearSelection() {
    this.highlightHandle?.remove();
    this.highlightHandle = null;
    this.closeTable();
    this.view.popup?.close();
  }

  closeTable() {
    this.showOltTable = false;
    this.showOntMduTable = false;
    this.searchTerm = '';
    this.highlightHandle?.remove();
    this.highlightHandle = null;
  }

  get filteredOltData() {
    return this.filterAndSort(this.oltTableData);
  }

  get filteredOntMduData() {
    return this.filterAndSort(this.ontMduTableData);
  }

filterAndSort(data: any[]) {

  let filtered = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  );

  if (!this.sortField) return filtered;

  return filtered.sort((a, b) => {

    const v1 = a[this.sortField];
    const v2 = b[this.sortField];

    if (typeof v1 === 'number' && typeof v2 === 'number') {
      return this.sortAsc ? v1 - v2 : v2 - v1;
    }

    return this.sortAsc
      ? String(v1).localeCompare(String(v2))
      : String(v2).localeCompare(String(v1));
  });
}


  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
  }
}

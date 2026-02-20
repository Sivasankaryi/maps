import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-support-topology',
  templateUrl: './support-topology.component.html',
  styleUrls: ['./support-topology.component.scss'],
})
export class SupportTopologyComponent implements AfterViewInit {
  @ViewChild('diagramDiv', { static: false }) diagramRef!: ElementRef;

  diagram!: go.Diagram;
  showConnectivity = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initDiagram();
      this.loadStaticData();
    }, 200);
  }

  initDiagram() {
    const $ = go.GraphObject.make;

    this.diagram = $(go.Diagram, this.diagramRef.nativeElement, {
      layout: $(go.TreeLayout, {
        angle: 0,
        layerSpacing: 80,
        nodeSpacing: 30,
      }),
      initialContentAlignment: go.Spot.Center,
      'undoManager.isEnabled': true,
    });

    this.diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;

    this.createNodeTemplate();
  }

  loadStaticData() {
    const data = [
      { key: '1', name: 'CXNK0411129', type: 'APS', passed: 13, failed: 7 },
      { key: '2', parent: '1', name: 'CXNK0058A8B7', type: 'APS', passed: 7, failed: 3 },
      { key: '3', parent: '1', name: 'CXNK00587A4B', type: 'Mesh', passed: 0, failed: 0 },
      { key: '4', parent: '2', name: 'CXNK005879F8', type: 'SAT', passed: 2, failed: 1 },
    ];

    const model = new go.TreeModel();
    model.nodeKeyProperty = 'key';
    model.nodeParentKeyProperty = 'parent';
    model.nodeDataArray = data;

    this.diagram.model = model;

    this.diagram.delayInitialization(() => {
      this.diagram.zoomToFit();
    });
  }

  createNodeTemplate() {
    const $ = go.GraphObject.make;

    this.diagram.nodeTemplate =
      $(go.Node, 'Auto',

        // Node shape
        $(go.Shape, 'RoundedRectangle',
          {
            strokeWidth: 2,
            stroke: 'transparent'
          },
          new go.Binding('stroke', 'isHighlighted', (h) =>
            h ? '#2196F3' : 'transparent'
          ).ofObject(),
          new go.Binding('fill', 'type', (t) => {
            if (t === 'APS') return '#fff4bb';
            if (t === 'Mesh') return '#eeeeee';
            if (t === 'SAT') return '#e8f5e9';
            if (t === 'Connectivity') return '#e3f2fd';
            if (t === 'Client') return '#ffffff';
            return '#fff4bb';
          })
        ),

        $(go.Panel, 'Horizontal',
          { margin: 8 },

          $("TreeExpanderButton"),

          // Icon
          $(go.Picture,
            {
              width: 18,
              height: 18,
              margin: new go.Margin(0, 6, 0, 4)
            },
            new go.Binding('source', 'type', (t) => {
              if (t === 'APS') return '/topology-icons/icons8-router-50.png';
              if (t === 'Mesh') return '/topology-icons/icons8-wifi-48.png';
              if (t === 'SAT') return '/topology-icons/icons8-settings-48.png';
              if (t === 'Connectivity') return '/topology-icons/icons8-lan-64.png';
              if (t === 'Client') return '/topology-icons/icons8-hub-64.png';
              return '/topology-icons/icons8-hub-64.png';
            })
          ),

          // Device name
          $(go.TextBlock,
            {
              margin: 4,
              font: 'bold 12px sans-serif'
            },
            new go.Binding('text', 'name')
          ),

          // Passed bubble
          $(go.Panel, 'Auto',
            {
              margin: 6,
              click: (e, obj) => {
                const node = obj.part as go.Node;
                this.toggleClients(node, 'passed');
              }
            },
            new go.Binding('visible', 'passed', (v) => v !== undefined),

            $(go.Shape, 'Circle',
              {
                fill: 'white',
                stroke: '#4CAF50',
                strokeWidth: 2,
                width: 20,
                height: 20
              }
            ),
            $(go.TextBlock,
              { font: '10px sans-serif', stroke: '#4CAF50' },
              new go.Binding('text', 'passed')
            )
          ),

          // Failed bubble
          $(go.Panel, 'Auto',
            {
              margin: 6,
              click: (e, obj) => {
                const node = obj.part as go.Node;
                this.toggleClients(node, 'failed');
              }
            },
            new go.Binding('visible', 'failed', (v) => v !== undefined),

            $(go.Shape, 'Circle',
              {
                fill: 'white',
                stroke: '#f44336',
                strokeWidth: 2,
                width: 20,
                height: 20
              }
            ),
            $(go.TextBlock,
              { font: '10px sans-serif', stroke: '#f44336' },
              new go.Binding('text', 'failed')
            )
          )
        )
      );
  }

  toggleClients(node: go.Node, type: 'passed' | 'failed') {
    const count = node.data[type];

    const existing = this.diagram.model.nodeDataArray.filter(
      (n: any) => n.parent === node.data.key && n.clientType === type
    );

    if (existing.length > 0) {
      existing.forEach((n: any) => this.diagram.model.removeNodeData(n));
      return;
    }

    const clients = [];

    for (let i = 0; i < count; i++) {
      clients.push({
        key: node.data.key + '_' + type + '_' + i,
        parent: node.data.key,
        name: `${type} Client ${i + 1}`,
        type: 'Client',
        clientType: type,
      });
    }

    this.diagram.model.addNodeDataCollection(clients);
  }

  toggleConnectivity() {
    this.showConnectivity = !this.showConnectivity;

    this.diagram.nodes.each((node) => {
      if (node.data.type === 'Client' || node.data.type === 'Connectivity') return;

      if (this.showConnectivity) {
        this.addConnectivity(node);
      } else {
        this.removeConnectivity(node);
      }
    });
  }

  addConnectivity(node: go.Node) {
    const key = node.data.key + '_conn';

    if (!this.diagram.findNodeForKey(key)) {
      this.diagram.model.addNodeData({
        key: key,
        parent: node.data.key,
        name: 'Connectivity',
        type: 'Connectivity',
      });
    }
  }

  removeConnectivity(node: go.Node) {
    const key = node.data.key + '_conn';
    const conn = this.diagram.findNodeForKey(key);

    if (conn) {
      this.diagram.model.removeNodeData(conn.data);
    }
  }

  search(event: any) {
    const text = event.target.value.toLowerCase().trim();

    this.diagram.clearHighlighteds();

    if (!text) return;

    this.diagram.nodes.each((node) => {
      const name = node.data.name?.toLowerCase();

      if (name && name.includes(text)) {
        node.isHighlighted = true;
      }
    });
  }

  zoomIn() {
    this.diagram.commandHandler.increaseZoom();
  }

  zoomOut() {
    this.diagram.commandHandler.decreaseZoom();
  }
}
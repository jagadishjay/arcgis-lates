import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Map from "@arcgis/core/Map";
import { loadModules } from 'esri-loader';
import esri = __esri;
@Component({
  selector: 'app-arcgis',
  templateUrl: './arcgis.component.html',
  styleUrls: ['./arcgis.component.css']
})
export class ArcgisComponent implements OnInit {
  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  private _zoom: number = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap: string = 'gray-vector';
  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor() { }

  async initializeMap() {
    try {
      
      // const [EsriMap, EsriMapView,SceneView, BasemapGallery] = await loadModules([
      //   'esri/Map',
      //   "esri/views/SceneView",  'esri/views/MapView',"esri/widgets/BasemapGallery"
      // ]);
      const [Map, Locate,CoordinateConversion, SceneView,Expand, BasemapGallery] = await loadModules([
        "esri/Map", "esri/widgets/Locate", "esri/widgets/CoordinateConversion",
        "esri/views/SceneView", "esri/widgets/Expand",
        "esri/widgets/BasemapGallery",  "esri/WebMap"
      ]);
      // Set type of map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

     // const map: esri.Map = new EsriMap(mapProperties);
      const map1 = new Map({
        basemap: "gray-vector"
      });

      // Set type of map view
      const mapViewProperties: esri.MapViewProperties = {
        container: "viewDiv",
        center: this._center,
        zoom: this._zoom,
        map: map1
      };
     
      //const mapView: esri.MapView = new EsriMapView(mapViewProperties);

      const view = new SceneView({
        container: "viewDiv",
        map: map1,
        center: [139.68, 35.68],
        zoom: 3
      });
      const basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement("div")
      });
      const bgExpand = new Expand({
        view: view,
        content: basemapGallery
      });
     // close the expand whenever a basemap is selected
     basemapGallery.watch("activeBasemap", () => {
      const mobileSize =
        view.heightBreakpoint === "xsmall" ||
        view.widthBreakpoint === "xsmall";

      if (mobileSize) {
        bgExpand.collapse();
      }
    });
    
      view.ui.add(bgExpand, {
        position: "top-right"
      });
      const ccWidget = new CoordinateConversion({
        view: view
      });

      view.ui.add(ccWidget, "bottom-left");
 
      const locateBtn = new Locate({
        view: view
      });

      // Add the locate widget to the top left corner of the view
      view.ui.add(locateBtn, {
        position: "top-left"
      });
      // All resources in the MapView and the map have loaded.
      // Now execute additional processes
      view.when(() => {
        this.mapLoaded.emit(true);
      });
    } catch (error) {
      alert('We have an error: ' + error);
    }
    // Add the widget to the top-right corner of the view
    
  }


  ngOnInit(): void {
    this.initializeMap();
    console.log("hi")
  }


}

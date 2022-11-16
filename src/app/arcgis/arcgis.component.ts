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

  constructor() { }

  async initializeMap() {
    try {
      
    
      const [Map,MapView, GroupLayer, MapImageLayer, LayerList, Slider,Directions, RouteLayer,Locate,CoordinateConversion, SceneView, Home,Expand, BasemapGallery,Legend,WebMap] = await loadModules([
        "esri/Map", "esri/views/MapView","esri/layers/GroupLayer",
        "esri/layers/MapImageLayer",
        "esri/widgets/LayerList",
        "esri/widgets/Slider", "esri/widgets/Directions",
        "esri/layers/RouteLayer","esri/widgets/Locate", "esri/widgets/CoordinateConversion",
        "esri/views/SceneView", "esri/widgets/Home","esri/widgets/Expand",
        "esri/widgets/BasemapGallery",  "esri/widgets/Legend",
        "esri/WebMap"
      ]);
      const apiKey = "";

        // create a new RouteLayer, required for Directions widget
        const routeLayer = new RouteLayer();
   // Create layer showing sample data of the United States.
   const USALayer = new MapImageLayer({
    url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
          title: "US Sample Data"
  });

  // Create layer showing sample census data of the United States.
  // Set visibility to false so it's not visible on startup.

  const censusLayer = new MapImageLayer({
    url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer",
    title: "US Sample Census",
    visible: false
  });
   // Create GroupLayer with the two MapImageLayers created above
        // as children layers.

        const demographicGroupLayer = new GroupLayer({
          title: "US Demographics",
          visible: true,
          visibilityMode: "exclusive",
          layers: [USALayer, censusLayer],
          opacity: 0.75
        });

// Create a map and add the group layer to it

const map3 = new Map({
  basemap: "gray-vector",
  layers: [demographicGroupLayer]
});

// Add the map to a MapView

const view3 = new MapView({
  center: [-98.5795, 39.8282],
  zoom: 4,
  container: "viewDiv",
  map: map3
});


      const webmap = new WebMap({
        portalItem: {
          // autocasts as new PortalItem()
          id: "10f5128431d44f9180d9936834100ac5"
        }
      });
      const view2 = new MapView({
        container: "viewDiv",
        map: webmap
      });
     // const map: esri.Map = new EsriMap(mapProperties);
      const map1 = new Map({
        basemap: "gray-vector",
        layers: [routeLayer]
      });

 
     
      //const mapView: esri.MapView = new EsriMapView(mapViewProperties);

      const view = new SceneView({
        container: "viewDiv",
        map: map1,
        center: [139.68, 35.68],
        zoom: 3
      });
      const homeBtn = new Home({
        view: view
      });

      // Add the home button to the top left corner of the view
      view.ui.add(homeBtn, "top-left");
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
      // new RouteLayer must be added to Directions widget
      let directionsWidget = new Directions({
        layer: routeLayer,
        apiKey,
        view
      });

      // Add the Directions widget to the top right corner of the view
      view.ui.add(directionsWidget, {
        position: "top-right"
      });
       // add a legend widget instance to the view
        // and set the style to 'card'. This is a
        // responsive style, which is good for mobile devices

        const legend = new Expand({
          content: new Legend({
            view: view2,
            style: "card" // other styles include 'classic'
          }),
          view: view,
          expanded: true
        });
        view.ui.add(legend, "bottom-left");
 // Creates actions in the LayerList.

 async function defineActions(event: any) {
  // The event object contains an item property.
  // is is a ListItem referencing the associated layer
  // and other properties. You can control the visibility of the
  // item, its title, and actions using this object.

  const item = event.item;

  await item.layer.when();

  if (item.title === "US Demographics") {
    // An array of objects defining actions to place in the LayerList.
    // By making this array two-dimensional, you can separate similar
    // actions into separate groups with a breaking line.

    item.actionsSections = [
      [
        {
          title: "Go to full extent",
          className: "esri-icon-zoom-out-fixed",
          id: "full-extent"
        },
        {
          title: "Layer information",
          className: "esri-icon-description",
          id: "information"
        }
      ],
      [
        {
          title: "Increase opacity",
          className: "esri-icon-up",
          id: "increase-opacity"
        },
        {
          title: "Decrease opacity",
          className: "esri-icon-down",
          id: "decrease-opacity"
        }
      ]
    ];
  }

  // Adds a slider for updating a group layer's opacity
  if (item.children.length > 1 && item.parent) {
    const slider = new Slider({
      min: 0,
      max: 1,
      precision: 2,
      values: [1],
      visibleElements: {
        labels: true,
        rangeLabels: true
      }
    });

    item.panel = {
      content: slider,
      className: "esri-icon-sliders-horizontal",
      title: "Change layer opacity"
    };

    slider.on("thumb-drag", (event:any) => {
      const { value } = event;
      item.layer.opacity = value;
    });
  }
}


      // All resources in the MapView and the map have loaded.
      // Now execute additional processes
      view.when(() => {
        this.mapLoaded.emit(true);
          // Create the LayerList widget with the associated actions
          // and add it to the top-right corner of the view.

          const layerList = new LayerList({
            view: view3,
            // executes for each ListItem in the LayerList
            listItemCreatedFunction: defineActions
          });

          // Event listener that fires each time an action is triggered

          layerList.on("trigger-action", (event:any) => {
            // The layer visible in the view at the time of the trigger.
            const visibleLayer = USALayer.visible ? USALayer : censusLayer;

            // Capture the action id.
            const id = event.action.id;

            if (id === "full-extent") {
              // if the full-extent action is triggered then navigate
              // to the full extent of the visible layer
              view.goTo(visibleLayer.fullExtent).catch((error: { name: string; }) => {
                if (error.name != "AbortError") {
                  console.error(error);
                }
              });
            } else if (id === "information") {
              // if the information action is triggered, then
              // open the item details page of the service layer
              window.open(visibleLayer.url);
            } else if (id === "increase-opacity") {
              // if the increase-opacity action is triggered, then
              // increase the opacity of the GroupLayer by 0.25

              if (demographicGroupLayer.opacity < 1) {
                demographicGroupLayer.opacity += 0.25;
              }
            } else if (id === "decrease-opacity") {
              // if the decrease-opacity action is triggered, then
              // decrease the opacity of the GroupLayer by 0.25

              if (demographicGroupLayer.opacity > 0) {
                demographicGroupLayer.opacity -= 0.25;
              }
            }
          });

          // Add widget to the top right corner of the view
          view.ui.add(layerList, "top-left");
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

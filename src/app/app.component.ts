import { Component } from "@angular/core";
import {
  CustomImageEvent,
  ImageViewerConfig,
} from "@saini22g/angular-image-viewer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "angular-image-viewer";
  images = [
    {
      src: "https://storage.googleapis.com/capexpert-prod-bucket/inventory/images/4100133jp_1710741006131.jpg",
    },
    {
      src: "https://storage.googleapis.com/capexpert-prod-bucket/inventory/images/1jpe_1722614028815.jpeg",
    },
  ];

  imageIndexOne = 0;

  config: ImageViewerConfig = {
    btnContainerClass: "", // The CSS class(es) to be applied to the button container
    btnClass: "default", // The CSS class(es) that will be applied to the buttons e.g. default is needed for FontAwesome icons, while not needed for Material Icons
    btnSubClass: "material-icons", // The CSS class(es) that will be applied to span elements inside material buttons (a Elements)
    zoomFactor: 0.1, // The amount that the scale will be increased by
    containerBackgroundColor: "#ccc", // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true, // If true, the mouse wheel can be used to zoom in
    allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to enter fullscreen mode
    allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
    btnShow: {
      // Control which icons should be visible
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: true,
      rotateCounterClockwise: true,
      next: true,
      prev: true,
      reset: true,
    },
    customButtons: [
      {
        name: "Crop",
        icon: {
          classes: "fa fa-solid fa-crop",
        },
        uniqueId: "crop-button",
      },
    ],
  };

  handleEvent(event: CustomImageEvent) {
    console.log(
      `${event.name} has been clicked on img ${event.imageIndex + 1}`
    );

    switch (event.name) {
      case "print":
        console.log("run print logic");
        break;
    }
  }
}

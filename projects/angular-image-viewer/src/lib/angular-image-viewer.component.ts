import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CustomImageEvent } from "./models/custom-image-event-model";
import {
  IImageSrc,
  ImageViewerConfig,
} from "./models/image-viewer-config.model";

const DEFAULT_CONFIG: ImageViewerConfig = {
  btnContainerClass: "btn-container",
  btnClass: "default",
  btnSubClass: "material-icons",
  zoomFactor: 0.1,
  containerBackgroundColor: "#ccc",
  wheelZoom: false,
  allowFullscreen: true,
  allowKeyboardNavigation: true,
  btnShow: {
    zoomIn: true,
    zoomOut: true,
    rotateClockwise: true,
    rotateCounterClockwise: true,
    next: true,
    prev: true,
    reset: true,
  },
};

@Component({
  selector: "angular-image-viewer",
  templateUrl: "./angular-image-viewer.component.html",
  styleUrls: ["./angular-image-viewer.component.scss"],
})
export class AngularImageViewerComponent implements OnInit, OnChanges {
  @ViewChild("imageElement") imageElement!: ElementRef;
  @ViewChild("containerElement") containerElement!: ElementRef;
  @Input() images: Array<IImageSrc>;
  @Input() screenHeightOccupied: 0; // In Px
  @Input() index = 0;

  @Input() config: ImageViewerConfig;

  @Output() indexChange: EventEmitter<number> = new EventEmitter();

  @Output() configChange: EventEmitter<ImageViewerConfig> = new EventEmitter();

  @Output() customImageEvent: EventEmitter<CustomImageEvent> =
    new EventEmitter();

  styleHeight = "100%";

  public style = {
    transform: "",
    msTransform: "",
    oTransform: "",
    webkitTransform: "",
  };
  public fullscreen = false;
  public loading = true;
  private scale = 1;
  private rotation = 0;
  private translateX = 0;
  private translateY = 0;
  private prevX: number;
  private prevY: number;
  private hovered = false;

  constructor(
    @Optional() @Inject("config") public moduleConfig: ImageViewerConfig,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.screenHeightOccupied) {
      this.styleHeight = "calc(100% - " + this.screenHeightOccupied + "px)";
      // console.log('Style Height:', this.styleHeight);
    }
  }

  ngOnInit() {
    const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
    this.config = this.mergeConfig(merged, this.config);
    this.triggerConfigBinding();
  }

  @HostListener("window:keyup.ArrowRight", ["$event"])
  nextImage(event) {
    if (this.canNavigate(event) && this.index < this.images.length - 1) {
      this.loading = true;
      this.index++;
      this.triggerIndexBinding();
      this.reset();
    }
  }

  @HostListener("window:keyup.ArrowLeft", ["$event"])
  prevImage(event) {
    if (this.canNavigate(event) && this.index > 0) {
      this.loading = true;
      this.index--;
      this.triggerIndexBinding();
      this.reset();
    }
  }

  zoomIn() {
    this.scale *= 1 + this.config.zoomFactor;
    this.updateStyle();
  }

  zoomOut() {
    if (this.scale > this.config.zoomFactor) {
      this.scale /= 1 + this.config.zoomFactor;
    }
    this.updateStyle();
  }

  scrollZoom(evt) {
    if (this.config.wheelZoom) {
      evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
      return false;
    }
  }

  rotateClockwise() {
    this.rotation += 90;
    this.updateStyle();
  }

  rotateCounterClockwise() {
    this.rotation -= 90;
    this.updateStyle();
  }

  onLoad(url) {
    this.loading = false;
  }

  onLoadStart(url) {
    this.loading = true;
  }

  imageNotFound(url) {
    // console.log('Image not found Url:', url);
  }

  onDragOver(evt) {
    this.translateX += evt.clientX - this.prevX;
    this.translateY += evt.clientY - this.prevY;
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;

    // Update the style with the new translation values
    this.updateStyle();
  }

  onDragStart(evt) {
    if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
      evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
    }
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
  }

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    if (!this.fullscreen) {
      this.reset();
    }
  }

  triggerIndexBinding() {
    this.indexChange.emit(this.index);
  }

  triggerConfigBinding() {
    this.configChange.next(this.config);
  }

  fireCustomEvent(name: string, uniqueId: string, imageIndex: number) {
    this.customImageEvent.emit(
      new CustomImageEvent(name, uniqueId, imageIndex)
    );
  }

  reset() {
    this.scale = 1;
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.updateStyle();
  }

  @HostListener("mouseover")
  onMouseOver() {
    this.hovered = true;
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.hovered = false;
  }

  private canNavigate(event: any) {
    return (
      event == null || (this.config.allowKeyboardNavigation && this.hovered)
    );
  }

  private updateStyle() {
    this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    this.style.msTransform = this.style.transform;
    this.style.webkitTransform = this.style.transform;
    this.style.oTransform = this.style.transform;
  }

  private mergeConfig(
    defaultValues: ImageViewerConfig,
    overrideValues: ImageViewerConfig
  ): ImageViewerConfig {
    let result: ImageViewerConfig = { ...defaultValues };
    if (overrideValues) {
      result = { ...defaultValues, ...overrideValues };

      if (overrideValues.btnIcons) {
        result.btnIcons = {
          ...defaultValues.btnIcons,
          ...overrideValues.btnIcons,
        };
      }
    }
    return result;
  }
}

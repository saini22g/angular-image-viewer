export class CustomImageEvent {
  name: string;
  imageIndex: number;
  uniqueId: string;

  constructor(name: string, uniqueId: string, imageIndex: number) {
    this.name = name;
    this.uniqueId = uniqueId;
    this.imageIndex = imageIndex;
  }
}

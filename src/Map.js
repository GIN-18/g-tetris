export class Map {
  constructor() {
    this.width = 10; // 列
    this.height = 20; // 行
    this.area = [...new Array(this.height)].map(() =>
      new Array(this.width).fill(0)
    );
  }
}

class RectShape {
  constructor(x, y, width, height, color, filled = false, stroke = "#000", lineWidth = 2, radius = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.filled = filled;
    this.stroke = stroke;
    this.lineWidth = lineWidth;
    this.radius = radius;
  }

  draw(ctx, camera) {
    ctx.beginPath();
    
    // Check for modern roundRect support
    if (ctx.roundRect) {
      ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
    } else {
      ctx.rect(this.x, this.y, this.width, this.height);
    }

    if (this.filled) {
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.lineWidth / camera.zoom;
    ctx.stroke();
  }
}
export default RectShape;
console.log("RectShape loaded");
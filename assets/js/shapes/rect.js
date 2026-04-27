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
    this.metadata = null;
    this.cursor = "default";
    this.isHovered = false;
    this.hoverGroupId = null;
    this.hoverColor = null;
    this.hoverStroke = null;
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
      ctx.fillStyle = (this.isHovered && this.hoverColor) ? this.hoverColor : this.color;
      ctx.fill();
    }

    ctx.strokeStyle = (this.isHovered && this.hoverStroke) ? this.hoverStroke : this.stroke;
    ctx.lineWidth = this.lineWidth / camera.zoom;
    ctx.stroke();
  }

  /**
   * Checks if a point (in world coordinates) is inside the rectangle.
   */
  isPointInside(px, py) {
    return px >= this.x && px <= this.x + this.width &&
           py >= this.y && py <= this.y + this.height;
  }
}
export default RectShape;
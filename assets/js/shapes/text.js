class TextShape {
  constructor(x, y, text, color = "#000", font = "Arial", fontSize = 20) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.font = font;
    this.fontSize = fontSize;
    this.isHovered = false;
    this.hoverGroupId = null;
    this.hoverColor = null;
  }

  draw(ctx) {
    ctx.fillStyle = (this.isHovered && this.hoverColor) ? this.hoverColor : this.color;
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x, this.y);
  }
}

export default TextShape;
console.log("TextShape loaded");
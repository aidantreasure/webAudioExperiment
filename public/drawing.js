

CanvasRenderingContext2D.prototype.circle = function(x, y, r, fillStyle) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI, false);
    if (fillStyle) {
        this.fillStyle = fillStyle;
    }
    this.fill();
};

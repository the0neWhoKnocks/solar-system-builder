export default class Grid {
  constructor({
    className,
    columns = 20,
    columnSpacing = 50,
    lineColor,
    rows = 10,
    rowSpacing = 50,
  } = {}) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.canvas.width = columns * columnSpacing;
    this.canvas.height = rows * rowSpacing;
    this.columns = columns;
    this.columnSpacing = columnSpacing;
    this.rows = rows;
    this.rowSpacing = rowSpacing;
    this.lineColor = lineColor;
    
    this.renderGrid();
    
    if(className) this.canvas.classList.add(className);
    
    return this.canvas;
  }
  
  renderGrid() {
    const sprite = document.createElement('canvas');
    const ctx = sprite.getContext('2d');
    const scale = 0.3;
    
    sprite.width = this.columnSpacing * scale;
    sprite.height = this.rowSpacing * scale;
    ctx.lineWidth = 1;
    
    if(this.lineColor) ctx.strokeStyle = this.lineColor;
    
    ctx.beginPath();
    ctx.moveTo(sprite.width / 2, 0);
    ctx.lineTo(sprite.width / 2, sprite.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, sprite.height / 2);
    ctx.lineTo(sprite.width, sprite.height / 2);
    ctx.stroke();
    
    for(let row=0; row<=this.rows; row++){
      const rowPadding = (row === this.rows) ? -0.5 : 0.5;
      
      for(let col=0; col<=this.columns; col++){
        const colPadding = (col === this.columns) ? -0.5 : 0.5;
        
        this.ctx.drawImage(
          sprite,
          0,
          0,
          this.canvas.width,
          this.canvas.height,
          ((col * this.columnSpacing) - sprite.width / 2) + colPadding, 
          ((row * this.rowSpacing) - sprite.height / 2) + rowPadding,
          this.canvas.width,
          this.canvas.height
        );
      }
    }
  }
}
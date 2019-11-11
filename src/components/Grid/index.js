export default class Grid {
  constructor({
    className,
    columns = 20,
    columnSpacing = 50,
    lineColor,
    rows = 10,
    rowSpacing = 50,
  } = {}) {
    this.container = document.createElement('div');
    this.gridCanvas = document.createElement('canvas');
    this.gridCtx = this.gridCanvas.getContext('2d');
    this.hoverCanvas = document.createElement('canvas');
    this.hoverCtx = this.hoverCanvas.getContext('2d');
    
    this.gridCanvas.width = columns * columnSpacing;
    this.gridCanvas.height = rows * rowSpacing;
    this.hoverCanvas.width = this.gridCanvas.width;
    this.hoverCanvas.height = this.gridCanvas.height;
    
    this.columns = columns;
    this.columnSpacing = columnSpacing;
    this.rows = rows;
    this.rowSpacing = rowSpacing;
    this.lineColor = lineColor;
    
    this.renderGrid();
    
    if(className) this.container.classList.add(className);
    this.gridCanvas.classList.add('grid-canvas');
    this.hoverCanvas.classList.add('hover-canvas');
    
    this.container.append(this.gridCanvas);
    this.container.append(this.hoverCanvas);
    
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.addListeners();
    
    this.xPos = 0;
    this.yPos = 0;
    this.domCheck = setInterval(() => {
      if( document.body.contains(this.container) ){
        clearInterval(this.domCheck);
        this.handleResize();
      }
    }, 1000);
    
    return this.container;
  }
  
  addListeners() {
    window.addEventListener('resize', this.handleResize);
    this.hoverCanvas.addEventListener('mousemove', this.handleMouseMove);
  }
  
  checkHoverPoint(pointX, pointY, mouseX, mouseY, radius) {
    const squaredDistance = (pointX - mouseX) * (pointX - mouseX) + (pointY - mouseY) * (pointY - mouseY);
    const squaredRadius = radius * radius;
    
    return {
      inRadius: squaredDistance <= squaredRadius,
      scale: ((squaredRadius - squaredDistance) / 100) * 0.001,
    };
  }
  
  handleMouseMove(ev) {
    const mouseX = Math.max(0, ev.x - this.xPos);
    const mouseY = Math.max(0, ev.y - this.yPos);
    const radius = this.columnSpacing * (this.columns / 3);
    const dotSize = 10;
    const dotRadius = dotSize / 2;
    const pixelAdjustment = 0.5;
    
    this.hoverCtx.clearRect(0, 0, this.hoverCanvas.width, this.hoverCanvas.height);
    this.hoverCtx.fillStyle = 'red';
    this.hoverCtx.beginPath();
    for(let row=0; row<=this.rows; row++){
      for(let col=0; col<=this.columns; col++){
        const pointX = (col * this.columnSpacing) + pixelAdjustment;
        const pointY = (row * this.rowSpacing) + pixelAdjustment;
        const { inRadius, scale } = this.checkHoverPoint(pointX, pointY, mouseX, mouseY, radius);
        
        if( inRadius ){
          const scaledRadius = dotRadius * scale;
          this.hoverCtx.moveTo(pointX, pointY);
          this.hoverCtx.arc(pointX, pointY, scaledRadius, 0, Math.PI * 2, true);
        }
      }
    }
    this.hoverCtx.fill();
  }
  
  handleResize() {
    const { left, top } = this.container.getBoundingClientRect();
    this.xPos = left;
    this.yPos = top;
  }
  
  renderGrid() {
    const sprite = document.createElement('canvas');
    const ctx = sprite.getContext('2d');
    const scale = 0.3;
    const pixelAdjustment = 0.5;
    
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
      const rowPadding = (row === this.rows) ? -pixelAdjustment : pixelAdjustment;
      
      for(let col=0; col<=this.columns; col++){
        const colPadding = (col === this.columns) ? -pixelAdjustment : pixelAdjustment;
        
        this.gridCtx.drawImage(
          sprite,
          0,
          0,
          this.gridCanvas.width,
          this.gridCanvas.height,
          // bitwise operator to get non-aliased lines https://www.html5rocks.com/en/tutorials/canvas/performance/
          (colPadding + ((col * this.columnSpacing) - sprite.width / 2)) | 0, 
          (rowPadding + ((row * this.rowSpacing) - sprite.height / 2)) | 0,
          this.gridCanvas.width,
          this.gridCanvas.height
        );
      }
    }
  }
}
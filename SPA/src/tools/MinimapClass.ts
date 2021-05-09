import * as FabricJs from 'fabric';

export class MinimapClass {

    private bigCanvas: FabricJs.fabric.Canvas;
    private minimap: FabricJs.fabric.Canvas;
    private minimapView;
    private readonly ratioGeneral = 0.05;
    private viewPortMiniMap: {width: number, height: number};
    
    /**
     *
     */
    constructor(canvas: FabricJs.fabric.Canvas) {            
        FabricJs.fabric.Object.prototype.objectCaching = false;
        this.bigCanvas = canvas;
        this.minimap = new FabricJs.fabric.Canvas('mini',  
        { 
            containerClass: 'mini',
             selection: false 
        });
        this.setWidthHeightMini();
        this.setDevice();
        this.viewPortMiniMap = {
            width: (this.device.width/this.bigCanvas.width) * this.minimap.width, 
            height: (this.device.height/this.bigCanvas.height) * this.minimap.height
        };
        this.initMinimap();
        this.initialBehavior();
        // setTimeout(() => {
        //   // this.updateMiniMap.bind(this);
        //   // //@ts-ignore
        //   // this.bigCanvas.setCoords();
        // }, 100);
    }
    


   private device: {width: number, height: number} = {} as {width: number, height: number};
   setDevice() {
     this.device = { width: window.innerWidth, height: window.innerHeight };
   }
   
 
 

 private setWidthHeightMini()  {
   this.minimap.setWidth(this.bigCanvas.width * this.ratioGeneral);
   this.minimap.setHeight(this.bigCanvas.height * this.ratioGeneral);
   this.minimap.renderAll();
 }
 
 createCanvasEl() {
   this.bigCanvas.viewportTransform[0] = this.bigCanvas.viewportTransform[3] = this.ratioGeneral;

   const center = !this.minimapView ? {x:0, y:0} : this.minimapView.getCenterPoint();
   const designInitPoint = {x:((center.x - this.viewPortMiniMap.width/2)/this.ratioGeneral),
     y:((center.y - this.viewPortMiniMap.height/2)/this.ratioGeneral)};
     
   if(this.minimapView) this.bigCanvas.absolutePan({x:0, y:0} as FabricJs.fabric.Point);
   //@ts-ignore
   var canvas = this.bigCanvas.toCanvasElement();
   if(this.minimapView) this.bigCanvas.absolutePan(designInitPoint as FabricJs.fabric.Point);
   this.bigCanvas.viewportTransform = [1, 0, 0, 1, 0, 0]; 
   this.bigCanvas.requestRenderAll();
   return canvas;
 }

 private updateMiniMap() {
   var canvas = this.createCanvasEl();
   //@ts-ignore
   this.minimap.backgroundImage._element = canvas;
   this.minimap.renderAll();
   console.log('updated');
 }

 private initMinimap() {
   if (this.minimapView) {
    this.minimap.remove(this.minimapView);
   }
   var canvas = this.createCanvasEl();
   var backgroundImage = new FabricJs.fabric.Image(canvas);
   backgroundImage.scaleX = 1 //(1 + (minimap.width/design.width)) / design.getRetinaScaling();
   backgroundImage.scaleY = 1 // (1 + (minimap.height/design.height)) / design.getRetinaScaling();
   // minimap.centerObject(backgroundImage);
   this.minimap.backgroundColor = 'white';
   this.minimap.backgroundImage = backgroundImage;
   this.minimap.renderAll();
   this.minimapView = new FabricJs.fabric.Rect({
     top: 0,
     left: 0,
     width: this.ratioGeneral * this.device.width, //backgroundImage.width / design.getRetinaScaling(),
     height: this.ratioGeneral * this.device.height, //backgroundImage.height/ design.getRetinaScaling(),
     fill: 'rgba(0, 0, 255, 0.3)',
     cornerSize: 6,
     transparentCorners: false,
     cornerColor: 'blue',
     strokeWidth: 0,
   });
   this.minimapView.controls = {
   //   br: fabric.Object.prototype.controls.br,
   };

   this.minimapView.on('modified', this.setMinimapView.bind(this));

   this.minimap.add(this.minimapView);
   setTimeout(() =>{
     console.log('timeout')
     this.minimapView.set('top', this.ratioGeneral * (this.bigCanvas.height - this.device.height) / 2);
     this.minimapView.left = this.ratioGeneral * (this.bigCanvas.width - this.device.width) / 2;

     this.minimapView.setCoords();
     
     this.minimap.renderAll();
     this.setMinimapView();
   }, 1)
 }

 // var debouncedMiniMap = _.debounce(updateMiniMap, 2500);

 initialBehavior()
 {
    this.bigCanvas.on('object:added', function() {
      this.bigCanvas.renderAll();
      this.updateMiniMap();
      this.setMinimapView();
    }.bind(this))

    this.bigCanvas.on('mouse:down', function(opt) {
      var evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    }.bind(this));

    this.minimap.on('object:moving', function (e) {
      var obj = e.target;
      // if object is too big ignore
      if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
        return;
      }
      obj.setCoords();
      // top-left  corner
      if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
      }
      // bot-right corner
      if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
      }
    }.bind(this));
 }


  private setMinimapView() {
   const center = this.minimapView.getCenterPoint(); console.log(center);
   const designInitPoint = {x:((center.x - this.viewPortMiniMap.width/2)/this.ratioGeneral),
     y:((center.y - this.viewPortMiniMap.height/2)/this.ratioGeneral)};
     this.bigCanvas.absolutePan(designInitPoint as FabricJs.fabric.Point);
   // design.renderAll();
   // minimap.renderAll();
   
   
  }

  onResize() {
    
    this.setMinimapView();
    
    this.setDevice();
    this.viewPortMiniMap = {
      width: (this.device.width/this.bigCanvas.width) * this.minimap.width, 
      height: (this.device.height/this.bigCanvas.height) * this.minimap.height
  };
    this.initMinimap();
    this.updateMiniMap();
  }



}

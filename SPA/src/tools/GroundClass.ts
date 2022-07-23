import * as FabricJs from 'fabric';
import { CanvasProfile } from './canvas-profile';
import { RealGamePin } from './GamePinClass';
import { Helper } from './Helper';
import { MinimapClass } from './MinimapClass';
import { Pin } from './pin';
import { Player } from './player';

export class GroundClass {
    canvas: FabricJs.fabric.Canvas;
    private readonly BIG_SCREEN_MIN_HEIGHT = 768;
    private readonly _gamePin: RealGamePin;
    private canvasProfile: CanvasProfile = Helper.REGULAR_PROFILE;
    private lastProfile: CanvasProfile;
    private winningLine: FabricJs.fabric.Line;
    get gamePin(): RealGamePin{
        return this._gamePin; 
    }
    
    private readonly _host: Player;
    private readonly _guest: Player;
    // private play: (pin: Pin) => void;
    // width = 2000;
    // height = 1600;
    // private sideUnit: number = 10; 
    private next: (winner) => void;

    private tmp: FabricJs.fabric.Object;
    private lastPin: FabricJs.fabric.Object;
    minimap: MinimapClass;

    getPlayer(playerId: string): Player{
        return [this._host, this._guest].find(x => x.playerId == playerId);
    }

    /**
     *
     */
    constructor(host: Player, guest: Player, next: (winner) => void) {
    
        this._host = host;
        this._guest = guest;
        this.next = next;
        // this.setProfile();
        this.canvas = new  FabricJs.fabric.Canvas('c', 
        {
            selection : false,
            controlsAboveOverlay:true,
            centeredScaling:true,
            allowTouchScrolling: true,
            width: this.canvasProfile.width,
            height: this.canvasProfile.height
        });

        this.initialBehavior();
        this.setBackgroundImage();

        this._gamePin = new RealGamePin(this.canvasProfile.width/this.canvasProfile.cellSideSize, 
            this.canvasProfile.height/this.canvasProfile.cellSideSize,
            this._host, this._guest, this.canvas, this.addCirclePin.bind(this), 
            this.addLastCircle.bind(this),
            this.play.bind(this));

        this.minimap = new MinimapClass(this.canvas);

        this._gamePin.automaticPlay();
    }

    private setBackgroundImage() {
        this.canvas.setBackgroundImage(this.canvasProfile.image,
        (() => {
            this.canvas.renderAll();
        }).bind(this), {scaleX: 1, scaleY:1});
    }

    private convertPinToUnit(pin: Pin, inverse = false, last = false): Pin{

        let result = Object.assign({}, pin);
        const cellSideSize = last ? this.lastProfile.cellSideSize : this.canvasProfile.cellSideSize;
        result.x = !inverse ? pin.x / cellSideSize : pin.x * cellSideSize; 
        result.y = !inverse ? pin.y / cellSideSize : pin.y * cellSideSize; 
        return result;
    }

    
    private get playerTurn() : Player {
        return this._host.currentTurn ? this._host : this._guest;
    }

    onResize() {
        // this.setProfile(true);
        this.minimap.onResize();
    }

    setProfile(resize = false) {
        this.lastProfile = this.canvasProfile;
        if(window.innerWidth < this.BIG_SCREEN_MIN_HEIGHT) {
            if(this.canvasProfile != Helper.MOBILE_PROFILE ){
                this.canvasProfile = Helper.MOBILE_PROFILE
                if (resize) {
                    // this.minimap.onResize();
                    this.resizeMap();
                }
            }
        } else {
            if (this.canvasProfile != Helper.REGULAR_PROFILE) {
                this.canvasProfile = Helper.REGULAR_PROFILE
                if (resize) {
                    // this.minimap.onResize();
                    this.resizeMap();
                }
            }
        }
    }
    
    private initialBehavior() {
        
        this.canvas.on('mouse:move', (this.OnMouseMove).bind(this));
        this.canvas.on('mouse:out', (this.OnMouseOut).bind(this));
        this.canvas.on('mouse:up', (this.OnMouseUp).bind(this));
    }

    private OnMouseMove (options) {

        const pointer = this.canvas.getPointer(options.e);
        let pinPointer = this.convertPinToUnit({x: pointer.x, y: pointer.y} as Pin);
        let result = this.calculatePosition(pinPointer.x, pinPointer.y); 
    
        if(this.tmp) this.canvas.remove(this.tmp);
        this.tmp = this.addCirclePin(result.left, result.top, this.playerTurn.color, 0.4);
    
    }

    private OnMouseOut (options) {
        if(this.tmp) this.canvas.remove(this.tmp);
    }

    private OnMouseUp (options) {
        var pointer = this.canvas.getPointer(options.e);
        let pinPointer = this.convertPinToUnit({x: pointer.x, y: pointer.y} as Pin);
        var result = this.calculatePosition(pinPointer.x, pinPointer.y); 
        var pin = {x:result.left, y:result.top};

        this.play(pin as Pin);
    }

    calculatePosition(left, top, width = 1) {
       var calculateLeft = Math.round(left / (width*4));
       var calculateTop = Math.round(top / (width*4));
  
       return {
         top:  calculateTop*4*width,
         left: calculateLeft*4*width
       }
  
    }

    private addCirclePin(x: number, y: number, color='black', opacity=1) {
        if( !this._gamePin.isPinValid({x:x, y:y} as Pin ) || this._gamePin.isEnded) return;
        if(this._gamePin.pins.find(p => p.x === x && p.y ===y)) return;
        const pin = this.convertPinToUnit({x: x, y: y} as Pin, true);
        return this.addCircle(pin, color, opacity);
    }

    private addCircle(pin: Pin, color: string, opacity: number){
        var circle = new FabricJs.fabric.Circle({ 
            angle: 30,
            radius: this.canvasProfile.cellSideSize,
            top: pin.y,
            left: pin.x,
            opacity: opacity,
            fill:color,
            originX: 'center',
            originY: 'center'
        });
        circle.selectable = false;
        circle.hoverCursor = 'default';
        this.canvas.add(circle);
        return circle;
    }


    addLastCircle(left, top, color='black', opacity= 0.5) {
        let pinToAdd = this.convertPinToUnit({x: left, y: top} as Pin, true);
        var circle = new FabricJs.fabric.Circle({ 
          angle: 30, 
          radius: this.canvasProfile.cellSideSize, 
          top: pinToAdd.y, 
          left: pinToAdd.x, 
          opacity: opacity, 
          fill:color,
          originX: 'center',
          originY: 'center',
        });
        circle.selectable = false;
        circle.hoverCursor = 'default';
        this.canvas.add(circle);
      
        this.animateCircle(circle, 1);
      
        this._gamePin.checkIsMapIsFull();
      
        return circle;
    }

    
    
  private play(pin: Pin) {
    
    var circleResult = this.addCirclePin(pin.x, pin.y, this.playerTurn.color);
    if (!circleResult) return circleResult;

    if(this.lastPin) this.canvas.remove(this.lastPin);
    this.lastPin = this.addLastCircle(pin.x, pin.y, this.playerTurn.color);

    pin.playerId = this.playerTurn.playerId;
    pin.id = this._gamePin.pins.length;

    this._gamePin.pushPin(pin);
        
    var alignPins = this._gamePin.isComplete(pin); 
    if (alignPins) {
      this.addLine(alignPins[0], alignPins[alignPins.length-1], this.getPlayer(alignPins[0].playerId).color);
      this._gamePin.isEnded = true;
    }

    this._gamePin.changePlayer();
    this._gamePin.automaticPlay();

    return circleResult;
  }


    private changeTurn() {
        if (this._host === this.playerTurn) {
            this._host.currentTurn = false;
            this._guest.currentTurn = true;
        } else {
            this._host.currentTurn = true;
            this._guest.currentTurn = false;
        }
    }

    
    private addLine(pinFirst: Pin, pinLast: Pin, color='black') {
        let pinFirstToAdd = this.convertPinToUnit(pinFirst, true);
        let pinLastToAdd = this.convertPinToUnit(pinLast, true);
        var playerTurn = this.playerTurn;
        this.winningLine = new FabricJs.fabric.Line([pinFirstToAdd.x, pinFirstToAdd.y, pinFirstToAdd.x, pinFirstToAdd.y], {
        stroke: color,
        strokeWidth: 3,
        originX: 'center',
        originY: 'center'
        });
        this.winningLine.selectable = false;
        this.winningLine.hoverCursor = 'default';
        this.canvas.add(this.winningLine);
        this.winningLine.animate({
        x2: pinLastToAdd.x,
        y2: pinLastToAdd.y
        }, {
        onChange: this.canvas.renderAll.bind(this.canvas),
        onComplete: function() {
            this.winningLine.setCoords();
            this.next(playerTurn);
            
        }.bind(this),
        duration: 2000
        });
    }
  
    private animateCircle(circle, dir, max=1) {
        const minScale = 1;
        const maxScale = 1.5;
        let counter = 1;
        this.action(dir, circle, minScale, maxScale, counter, max);
  
    }

    private action(dir, circle, minScale, maxScale, counter, max) {
        return new Promise(resolve => {
            circle.animate({
            scaleX: dir ? maxScale : minScale,
            scaleY: dir ? maxScale : minScale
            }, {
            easing: FabricJs.fabric.util.ease.easeOutCubic,
            duration: 1000,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: function() {
                if (counter >= max) {
                resolve('finished animating the point');
                } else {
                if (dir == 1)
                    this.action(0, circle, minScale, maxScale, counter);
                else
                    this.action(1, circle, minScale, maxScale, counter);
        
                }
                counter++;
            }.bind(this)
        
            });
        });
    }

    resizeMap() {
        this.canvas.clear();
        this.canvas.setDimensions({height: this.canvasProfile.height, width: this.canvasProfile.width});
        this.gamePin.pins.forEach((p) => {
            const player = this.getPlayer(p.playerId);
            this.addCircle(this.convertPinToUnit(p, true), player.color, 1);
        });
        if(this.lastPin){
            const pin = this.convertPinToUnit({x: this.lastPin.left, y: this.lastPin.top} as Pin,
                false, true); 
            this.lastPin = this.addLastCircle(pin.x, pin.y, 
                this.getPlayer(this.gamePin.pins[this.gamePin.pins.length - 1].playerId).color);
        }
        if (this.winningLine) {
            let point1 = this.convertPinToUnit({x: this.winningLine.x1, y: this.winningLine.y1} as Pin, false, true);
            point1 = this.convertPinToUnit(point1, true);
           
            let point2 = this.convertPinToUnit({x: this.winningLine.x2, y: this.winningLine.y2} as Pin, false, true);
            point2 = this.convertPinToUnit(point2, true);

            this.winningLine.x1 = point1.x;
            this.winningLine.y1 = point1.y;

            this.winningLine.x2 = point2.x;
            this.winningLine.y2 = point2.y;
            
            this.winningLine.set(this.winningLine);
            this.canvas.add(this.winningLine);
            this.winningLine.setCoords();
        }
        this.setBackgroundImage();
    }
    newGame(){
        this.canvas.clear();
        this.setBackgroundImage();
        this._gamePin.clearGroups();
        this._gamePin.setAutomaticPlayerTurn();
        this._gamePin.isEnded = false;
        this._gamePin.automaticPlay();
        console.log("isEnded->",this._gamePin.isEnded);
        
    }
}

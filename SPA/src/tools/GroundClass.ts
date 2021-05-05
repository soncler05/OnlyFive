import * as FabricJs from 'fabric';
import { RealGamePin } from './GamePinClass';
import { Pin } from './pin';
import { Player } from './player';

export class GroundClass {
    canvas: FabricJs.fabric.Canvas;
    private readonly _gamePin: RealGamePin;
    get gamePin(): RealGamePin{
        return this._gamePin; 
    }
    
    private readonly _host: Player;
    private readonly _guest: Player;
    // private play: (pin: Pin) => void;
    readonly width = 2000;
    readonly height = 1600;
    private readonly _sideUnit: number = 10; 

    private tmp: FabricJs.fabric.Object;
    private lastPin: FabricJs.fabric.Object;

    getPlayer(playerId: string): Player{
        return [this._host, this._guest].find(x => x.playerId == playerId);
    }

    /**
     *
     */
    constructor(host: Player, guest: Player) {console.log('ground');
    
        this._host = host;
        this._guest = guest;

        this.canvas = new  FabricJs.fabric.Canvas('c', 
        {
            selection : false,
            controlsAboveOverlay:true,
            centeredScaling:true,
            allowTouchScrolling: true,
            width: this.width,
            height: this.height
        });

        this.initialBehavior();
        this.canvas.setBackgroundImage("./assets/img/pinBcg.jpg",
        (() => {
            this.canvas.renderAll();
        }).bind(this), {scaleX: 1, scaleY:1});

        this._gamePin = new RealGamePin( this._sideUnit, this.width, this.height,
            this._host, this._guest, this.canvas, this.addCircle.bind(this), 
            this.addLastCircle.bind(this),
            this.play.bind(this));

        this._gamePin.automaticPlay();
    }

    
    private get playerTurn() : Player {
        return this._host.currentTurn ? this._host : this._guest;
    }
     

    private initialBehavior() {
        
        this.canvas.on('mouse:move', (this.OnMouseMove).bind(this));
        this.canvas.on('mouse:out', (this.OnMouseOut).bind(this));
        this.canvas.on('mouse:up', (this.OnMouseUp).bind(this));
    }

    private OnMouseMove (options) {

        var result = this.calculatePosition(options.e.layerX, options.e.layerY, this._sideUnit); 
    
        if(this.tmp) this.canvas.remove(this.tmp);
        this.tmp = this.addCircle(result.left, result.top, this.playerTurn.color, 0.4);
    
    }

    private OnMouseOut (options) {
        if(this.tmp) this.canvas.remove(this.tmp);
    }

    private OnMouseUp (options) {
        var pointer = this.canvas.getPointer(options.e);
        var result = this.calculatePosition(pointer.x, pointer.y, this._sideUnit); 
        var pin = {x:result.left, y:result.top};

        this.play(pin as Pin);
    }

    calculatePosition(left, top, width) {
       var calculateLeft = Math.round(left / (width*4));
       var calculateTop = Math.round(top / (width*4));
  
       return {
         top:  calculateTop*4*width,
         left: calculateLeft*4*width
       }
  
    }

    private addCircle(x: number, y: number, color='black', opacity=1) {
        if( !this._gamePin.isPinValid({x:x, y:y} as Pin ) || this._gamePin.isEnded) return;
        if(this._gamePin.pins.find(p => p.x === x && p.y ===y)) return;
        var circle = new FabricJs.fabric.Circle({ 
          angle: 30,
          radius: this._sideUnit,
          top: y,
          left: x,
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
        var circle = new FabricJs.fabric.Circle({ 
          angle: 30, 
          radius: this._sideUnit, 
          top: top, 
          left: left, 
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
    
    var circleResult = this.addCircle(pin.x, pin.y, this.playerTurn.color);
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
        var playerTurn = this.playerTurn;
        const line = new FabricJs.fabric.Line([pinFirst.x, pinFirst.y, pinFirst.x, pinFirst.y], {
        stroke: color,
        strokeWidth: 3,
        originX: 'center',
        originY: 'center'
        });
        line.selectable = false;
        line.hoverCursor = 'default';
        this.canvas.add(line);
        line.animate({
        x2: pinLast.x,
        y2: pinLast.y
        }, {
        onChange: this.canvas.renderAll.bind(this.canvas),
        onComplete: function() {
            line.setCoords();
            alert(` ${playerTurn.userName} ha completado un cinco!!!` );
        },
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
    
}

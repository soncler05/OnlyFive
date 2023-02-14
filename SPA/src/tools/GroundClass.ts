import * as FabricJs from 'fabric';
import { Observable } from 'rxjs';
import { Game } from 'src/Types/Game';
import { CanvasProfile } from './canvas-profile';
import { RealGamePin } from './GamePinClass';
import { Helper } from './Helper';
import { MinimapClass } from './MinimapClass';
import { Pin } from './pin';
import { Player } from './player';

export class GroundClass {
    private _actualPlayerId: string;
    canvas: FabricJs.fabric.Canvas;
    private readonly BIG_SCREEN_MIN_HEIGHT = 768;
    private readonly _gamePin: RealGamePin;
    private canvasProfile: CanvasProfile = Helper.REGULAR_PROFILE;
    private lastProfile: CanvasProfile;
    private winningLine: FabricJs.fabric.Line;
    get gamePin(): RealGamePin{
        return this._gamePin; 
    }
    
    private isPlaying: boolean = false;
    private _newPin: (pin: Pin) => Observable<Pin>;
    private _onTwoDevicesComplete: (playerId: string) => void;
    private readonly _host: Player;
    private readonly _guest: Player;
    private get Players() : Player[] {
        return [this._host, this._guest];
    }
    private readonly _deviceId: string;
    private readonly _isOneDevice: boolean;
    private next: (winner) => void;
    public onComplete: (winnerId: string) => void;

    private tmp: FabricJs.fabric.Object;
    private lastPin: FabricJs.fabric.Object;
    minimap: MinimapClass;

    getPlayer(playerId: string): Player{
        return Helper.PLAYERS.find(x => x.playerId == playerId);
    }
    _game: Game;
    /**
     *
     */
    constructor(game: Game, isOneDevice: boolean, deviceId: string, actualPlayerId: string, next: (winner) => void, onComplete: (winnerId: string) => void,
        newPin: (pin: Pin) => Observable<Pin>, onTwoDevicesComplete: (playerId: string) => void) {
    
        this._newPin = newPin;
        this._host = game.host;
        this._guest = game.guest;
        this._actualPlayerId = actualPlayerId;
                
        this._deviceId = deviceId;
        this.next = next;
        this.onComplete = onComplete;
        this._onTwoDevicesComplete = onTwoDevicesComplete;
        this._isOneDevice = isOneDevice;
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

        if(this._isOneDevice) this._gamePin.automaticPlay();
        else if(game.lastRound && !game.lastRound.endDate && game.lastRound.pawnMap?.length > 0 ){
            const pins = JSON.parse(game.lastRound.pawnMap) as Pin[];
            this.initMapWithPins(pins);
        }
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
        if(this._isOneDevice)
            return this._host.currentTurn ? this._host : this._guest;
        
        const lastPin = this.lastPlay();
        if(!lastPin) return this._host;
        return this.Players.find(p => p.playerId != lastPin.playerId);
    }
    private lastPlay(): Pin {
        return this.gamePin.pins[this.gamePin.pins.length - 1];
    }
    private findPlayer(playerId: string): Player {
        return this.Players.find(p => p.playerId == playerId)
    }
    private get actualPlayer() : Player {
        if(this._isOneDevice) return this._guest;
        if (this._host.deviceId === this._deviceId) return this._host;
        if (this._guest.deviceId === this._deviceId) return this._guest;
        return null;
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
        this.tmp = this.addCirclePin(result.left, result.top, this.actualPlayer.color, 0.4);
    
    }

    private OnMouseOut (options) {
        if(this.tmp) this.canvas.remove(this.tmp);
    }

    private OnMouseUp (options) {
        if(this.isPlaying || (!this._isOneDevice && this.playerTurn.deviceId != this._deviceId))
            return;
            
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

  initMapWithPins(pins: Pin[]) {
     if(pins.length > 0) {
        const colors : Record <string, string> = {};
        this.Players.forEach(player => {
            colors[player.playerId] = player.color;
        });
        
        pins.forEach(pin => {
            this.addCircle(this.convertPinToUnit(pin, true), colors[pin.playerId], 1);
            this.gamePin.pushPin(pin);
        });
        const lastPin = pins[pins.length - 1];
        this.lastPin = this.addLastCircle(lastPin.x, lastPin.y, colors[lastPin.playerId]);
     }
  }  
    
  public play(pin: Pin) {
        this.isPlaying = true;
        var circleResult = this.addCirclePin(pin.x, pin.y, this.playerTurn.color);
        if(!circleResult) {
            this.isPlaying = false;
            return circleResult;
        }

        if(this.lastPin) this.canvas.remove(this.lastPin);
        this.lastPin = this.addLastCircle(pin.x, pin.y, this.playerTurn.color);

        pin.playerId = this.playerTurn.playerId;
        pin.id = this._gamePin.pins.length;
        pin.date = this._isOneDevice ? new Date() : null;

        if(this._isOneDevice || this.findPlayer(pin.playerId)?.deviceId != this._deviceId) 
        {
            this.isPlaying = false;
            return this.playAction(pin, circleResult);
        }
        else {
            this._newPin(pin).subscribe((data) => {
                this.playAction(data, circleResult);
                this.isPlaying = false;
            })
        }
    }

    private playAction(pin: Pin, circleResult: any) {
        
        this._gamePin.pushPin(pin);
            
        var alignPins = this._gamePin.isComplete(pin); 
        if (alignPins) {
            const player = this.getPlayer(alignPins[0].playerId);
            this.onComplete(player.playerId);
            this.addLine(alignPins[0], alignPins[alignPins.length-1], player.color);
            this._gamePin.isEnded = true;
            if(!this._isOneDevice) this._onTwoDevicesComplete(pin.playerId);
        }

        this._gamePin.changePlayer();
        if(this._isOneDevice) this._gamePin.automaticPlay();

        return circleResult;
    }

    private addLine(pinFirst: Pin, pinLast: Pin, color='black') {
        let pinFirstToAdd = this.convertPinToUnit(pinFirst, true);
        let pinLastToAdd = this.convertPinToUnit(pinLast, true);
        var playerTurn = this.findPlayer(this.lastPlay().playerId);
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
        if(this._isOneDevice) this._gamePin.automaticPlay();        
    }
}

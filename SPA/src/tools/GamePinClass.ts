import { BasePin, IsValidGroup, IsValidGroupResult, Pin, PinGroup } from "./pin";
import { Player } from "./player";
import { Helper } from "./Helper";
import * as FabricJs from 'fabric';

export class RealGamePin {
    private _pins: Pin[] = [];
    private _isEnded = false;
    private get _playerTurn(): Player{
        if(this._host.currentTurn) {
            return this._host;
        } else {
           return this._guest;
        }
    }
    private set _playerTurn(player: Player){
        if(this._host.playerId === player.playerId) {
           this._host.currentTurn = true;
           this._guest.currentTurn = false;
        } else {
          this._host.currentTurn = false;
          this._guest.currentTurn = true;
        }
    }
    private get _playerNotTurn(): Player{
        if(this._host.currentTurn) {
            return this._guest;
        } else {
            return this._host;
        }
    }
    private getOtherPlayer(playerId: string): Player{
      if(this._host.playerId === playerId) {
          return this._guest;
        } else {
          return this._host;
        }
    }
    
    private play: (pin: Pin) => FabricJs.fabric.Circle;
    
    private addCircle: (x: number, y: number, color?: string, opacity?: number) => FabricJs.fabric.Circle;
    private addLastCircle: (x: number, y: number, color?: string, opacity?: number) => FabricJs.fabric.Circle;
    private _lastPin: FabricJs.fabric.Object;
    private _canvas: FabricJs.fabric.Canvas;

    private readonly _directions: BasePin[] = [{x:0, y:1}, {x:1, y:0}, {x:1, y:1}, {x:-1, y:1} ];
    private _onePins: PinGroup[] = [];
    private _twoPins: PinGroup[] = []; 
    private _threePins: PinGroup[] = [];
    private _fourPins: PinGroup[] = [];

    get onePins(): PinGroup[]{
      return this._onePins 
    }
    get twoPins(): PinGroup[]{
      return this._twoPins 
    }
    get threePins(): PinGroup[]{
      return this._threePins 
    }
    get fourPins(): PinGroup[]{
      return this._fourPins 
    }



    private _host: Player;
    private _guest: Player;

    /**
     *
     */
    constructor(
        xBigSide: number, yBigSide: number, host: Player, guest: Player, canvas: FabricJs.fabric.Canvas,
        addCircle: (x: number, y: number, color?: string, opacity?: number) => FabricJs.fabric.Circle,
        addLastCircle: (x: number, y: number, color?: string, opacity?: number) => FabricJs.fabric.Circle,
        play: (pin: Pin) => FabricJs.fabric.Circle
    ) {
        this._xBigSide = xBigSide;
        this._yBigSide = yBigSide;
        this._host = host;
        this._guest = guest;
        this._canvas = canvas;
        this.addCircle = addCircle;
        this.addLastCircle = addLastCircle;
        this.play = play;
        
    }

    
    private readonly _xBigSide: number;
    private readonly _yBigSide: number;
    private get sideCell(): number{
        return 4;
    } 


    isPinValid(pin: Pin): boolean {
        return !(pin.x <  2 || pin.y < 2 || pin.x > this._xBigSide - 2 || 
            pin.y > this._yBigSide - 2);
    }
    get isEnded(): boolean {
        return this._isEnded;
    }
    set isEnded(v: boolean) {
        this._isEnded = v;
    }
    get pins(): Pin[] {
        return this._pins;
    }
    automaticPlay(): void {
        if(this._playerTurn.playerId != Helper.AUTOMATIC_PLAYER.playerId) return;

        //first player, first pin
        if (this._pins.length === 0) {
            this.play(this.calculateCenter());
            return;
        }
        //first player, second pin
        if (this._pins.length === 2) {
            this.play(this.calculateSecondPin(this._pins[0]));
            return;
        }
        //first player, third pin
        if (this._pins.length === 4) {
            this.play(this.calculateSecondPin(this._pins[0]));
            return;
        }
        else {
            this.smartPlay();
        }
    }
    changePlayer(): void {
        if(this._host.currentTurn) {
            this._host.currentTurn = false;
            this._guest.currentTurn = true;
        } else {
            this._host.currentTurn = true;
            this._guest.currentTurn = false;
        }
    }
    checkIsMapIsFull(): void {
        let totalPins = ((this._xBigSide / this.sideCell) - 1) * ((this._yBigSide / this.sideCell) - 1);
        if (totalPins === this._pins.length) {
            this.isEnded = true;
            alert('Ya no hay más jugada posible');
            }
    }
    pushPin(pin: Pin): void {
        this._pins.push(pin);
    }
    // isComplete(pin: Pin): Pin {
    //     throw new Error("Method not implemented.");
    // }

    getPinById(id, simple = false) {
      const pin: Pin = this._pins.find(x => x.id === id);
      if(!simple)
        return pin;
      else
        return {x: pin.x, y: pin.y} as BasePin;
    }
    private getPinByXY(pin) {
        return this._pins.find(p => p.x === pin.x && p.y === pin.y);
    }
    private getPinByXYAndUserId(pin: Pin, playerId?: string) {
        return this._pins.find(p => p.x === pin.x && p.y === pin.y &&
             p.playerId === (playerId ? playerId : pin.playerId));
    }


    smartPlay() {

        //------------filterPinsGroup Auto
        let isValidAutoFourPinGroups:IsValidGroup[] =  [];
        let isValidAutoThreePinGroups:IsValidGroup[] =  [];
        let isValidAutoTwoPinGroups:IsValidGroup[] =  [];
        let isValidAutoOnePinGroups:IsValidGroup[] =  [];
        //------------filterPinsGroup Player
        let isValidPlayerFourPinGroups:IsValidGroup[] =  [];
        let isValidPlayerThreePinGroups:IsValidGroup[] =  [];
        let isValidPlayerTwoPinGroups:IsValidGroup[] =  [];
        let isValidPlayerOnePinGroups:IsValidGroup[] =  [];
      
        this.action_smartPlay(
            isValidAutoFourPinGroups,
            isValidAutoThreePinGroups,
            isValidAutoTwoPinGroups,
            isValidAutoOnePinGroups,
            isValidPlayerFourPinGroups,
            isValidPlayerThreePinGroups,
            isValidPlayerTwoPinGroups,
            isValidPlayerOnePinGroups,
        );
      
      }

      //#region smartPlay

      private action_smartPlay(
        isValidAutoFourPinGroups:IsValidGroup[],
        isValidAutoThreePinGroups:IsValidGroup[],
        isValidAutoTwoPinGroups:IsValidGroup[],
        isValidAutoOnePinGroups:IsValidGroup[],
        isValidPlayerFourPinGroups:IsValidGroup[],
        isValidPlayerThreePinGroups:IsValidGroup[],
        isValidPlayerTwoPinGroups:IsValidGroup[],
        isValidPlayerOnePinGroups:IsValidGroup[],
      ) {
          
        //fourPins --automaticPlayer
        isValidAutoFourPinGroups = isValidAutoFourPinGroups.length > 0 ? isValidAutoFourPinGroups : this.mapToIsGroupValid(this.filterPins(this._fourPins, Helper.AUTOMATIC_PLAYER.playerId));
        if(isValidAutoFourPinGroups.length > 0) {
          this.processSmartPlay(isValidAutoFourPinGroups, this._fourPins, this.action_smartPlay.bind(this),
            isValidAutoFourPinGroups,
            isValidAutoThreePinGroups,
            isValidAutoTwoPinGroups,
            isValidAutoOnePinGroups,
            isValidPlayerFourPinGroups,
            isValidPlayerThreePinGroups,
            isValidPlayerTwoPinGroups,
            isValidPlayerOnePinGroups,
        );
          return;
        } else {
          if(this.subtituteAction_smartPlay(isValidAutoThreePinGroups, this._threePins, 4, Helper.AUTOMATIC_PLAYER.playerId)) return;
          if(this.subtituteAction_smartPlay(isValidAutoTwoPinGroups, this._twoPins, 4, Helper.AUTOMATIC_PLAYER.playerId)) return;
        }
    
        //fourPins --player
        isValidPlayerFourPinGroups = isValidPlayerFourPinGroups.length > 0 ? isValidPlayerFourPinGroups : this.mapToIsGroupValid(this.filterPins(this._fourPins, this._playerNotTurn.playerId));
        if(isValidPlayerFourPinGroups.length > 0) {
          this.processSmartPlay(isValidPlayerFourPinGroups, this._fourPins, this.action_smartPlay.bind(this),
            isValidAutoFourPinGroups,
            isValidAutoThreePinGroups,
            isValidAutoTwoPinGroups,
            isValidAutoOnePinGroups,
            isValidPlayerFourPinGroups,
            isValidPlayerThreePinGroups,
            isValidPlayerTwoPinGroups,
            isValidPlayerOnePinGroups,
        );
          return;
        } else {
          if(this.subtituteAction_smartPlay(isValidPlayerThreePinGroups, this._threePins, 4, this._playerNotTurn.playerId)) return;
          if(this.subtituteAction_smartPlay(isValidPlayerTwoPinGroups, this._twoPins, 4, this._playerNotTurn.playerId)) return;
        }
        
        //threePins --automaticPlayer
        isValidAutoThreePinGroups = isValidAutoThreePinGroups.length > 0 ? isValidAutoThreePinGroups : this.mapToIsGroupValid(this.filterPins(this._threePins, Helper.AUTOMATIC_PLAYER.playerId));
        if(isValidAutoThreePinGroups.length > 0) {
            this.processSmartPlay(isValidAutoThreePinGroups, this._threePins, this.action_smartPlay.bind(this),
            isValidAutoFourPinGroups,
            isValidAutoThreePinGroups,
            isValidAutoTwoPinGroups,
            isValidAutoOnePinGroups,
            isValidPlayerFourPinGroups,
            isValidPlayerThreePinGroups,
            isValidPlayerTwoPinGroups,
            isValidPlayerOnePinGroups,
        );
          return;
        } else {
          if(this.subtituteAction_smartPlay(isValidAutoTwoPinGroups, this._twoPins, 3, Helper.AUTOMATIC_PLAYER.playerId)) return;
          if(this.subtituteAction_smartPlay(isValidAutoOnePinGroups, this._onePins, 3, Helper.AUTOMATIC_PLAYER.playerId)) return;
        }   
        
        //threePins --player
        isValidPlayerThreePinGroups = isValidPlayerThreePinGroups.length > 0 ? isValidPlayerThreePinGroups : this.mapToIsGroupValid(this.filterPins(this._threePins, this._playerNotTurn.playerId));
        isValidPlayerTwoPinGroups = isValidPlayerTwoPinGroups.length > 0 ? isValidPlayerTwoPinGroups : this.mapToIsGroupValid(this.filterPins(this._twoPins, this._playerNotTurn.playerId));
        if(isValidPlayerThreePinGroups.length > 0) {
          if(!isValidPlayerThreePinGroups.some(g => g.isGroupValid.start && g.isGroupValid.end))
            if(this.subtituteAction_smartPlay(isValidPlayerTwoPinGroups, this._twoPins, 3, this._playerNotTurn.playerId, true)) return;
          
          this.processSmartPlay(isValidPlayerThreePinGroups, this._threePins, this.action_smartPlay.bind(this),
          isValidAutoFourPinGroups,
          isValidAutoThreePinGroups,
          isValidAutoTwoPinGroups,
          isValidAutoOnePinGroups,
          isValidPlayerFourPinGroups,
          isValidPlayerThreePinGroups,
          isValidPlayerTwoPinGroups,
          isValidPlayerOnePinGroups,
        );
          return;
        } else {
          if(this.subtituteAction_smartPlay(isValidPlayerTwoPinGroups, this._twoPins, 3, this._playerNotTurn.playerId)) return;
          if(this.subtituteAction_smartPlay(isValidAutoOnePinGroups, this._onePins, 3, this._playerNotTurn.playerId)) return;
        } 
    
        //twoPins --automaticPlayer
        isValidAutoTwoPinGroups = isValidAutoTwoPinGroups.length > 0 ? isValidAutoTwoPinGroups : this.mapToIsGroupValid(this.filterPins(this._twoPins, Helper.AUTOMATIC_PLAYER.playerId));
        if(isValidAutoTwoPinGroups.length > 0) {
            this.processSmartPlay(isValidAutoTwoPinGroups, this._twoPins, this.action_smartPlay.bind(this),
            isValidAutoFourPinGroups,
            isValidAutoThreePinGroups,
            isValidAutoTwoPinGroups,
            isValidAutoOnePinGroups,
            isValidPlayerFourPinGroups,
            isValidPlayerThreePinGroups,
            isValidPlayerTwoPinGroups,
            isValidPlayerOnePinGroups,
        );
          return;
        } 
    
        //twoPins --player
        isValidPlayerTwoPinGroups = isValidPlayerTwoPinGroups.length > 0 ? isValidPlayerTwoPinGroups : this.mapToIsGroupValid(this.filterPins(this._twoPins, this._playerNotTurn.playerId));
        if(isValidPlayerTwoPinGroups.length > 0) {
            this.processSmartPlay(isValidPlayerTwoPinGroups, this._twoPins, this.action_smartPlay.bind(this),
            isValidAutoFourPinGroups,
            isValidAutoThreePinGroups,
            isValidAutoTwoPinGroups,
            isValidAutoOnePinGroups,
            isValidPlayerFourPinGroups,
            isValidPlayerThreePinGroups,
            isValidPlayerTwoPinGroups,
            isValidPlayerOnePinGroups,
        );
          return;
        }
    
        //onePins --automaticPlayer
        isValidAutoOnePinGroups = isValidAutoOnePinGroups.length > 0 ? isValidAutoOnePinGroups : this.mapToIsGroupValid(this.filterPins(this._onePins, Helper.AUTOMATIC_PLAYER.playerId));
        if(isValidAutoOnePinGroups.length > 0) {
            this.processSmartPlay(isValidAutoOnePinGroups, this._onePins, this.action_smartPlay.bind(this),
            isValidAutoFourPinGroups,
            isValidAutoThreePinGroups,
            isValidAutoTwoPinGroups,
            isValidAutoOnePinGroups,
            isValidPlayerFourPinGroups,
            isValidPlayerThreePinGroups,
            isValidPlayerTwoPinGroups,
            isValidPlayerOnePinGroups,
        );
          return;
        } 
    
        //onePins --player
        isValidPlayerOnePinGroups = isValidPlayerOnePinGroups.length > 0 ? isValidPlayerOnePinGroups : this.mapToIsGroupValid(this.filterPins(this._onePins, this._playerNotTurn.playerId));
        if(isValidPlayerOnePinGroups.length > 0) {
          this.processSmartPlay(isValidPlayerOnePinGroups, this._onePins, this.action_smartPlay.bind(this),
            isValidAutoFourPinGroups,
            isValidAutoThreePinGroups,
            isValidAutoTwoPinGroups,
            isValidAutoOnePinGroups,
            isValidPlayerFourPinGroups,
            isValidPlayerThreePinGroups,
            isValidPlayerTwoPinGroups,
            isValidPlayerOnePinGroups,
        );
          return;
        }
    
        this.playLastPin();
    
    
      }

      private processSmartPlay(isValidPinGroups, bigGroup, callBack?, isValidAutoFourPinGroups?,
        isValidAutoThreePinGroups?,
        isValidAutoTwoPinGroups?,
        isValidAutoOnePinGroups?,
        isValidPlayerFourPinGroups?,
        isValidPlayerThreePinGroups?,
        isValidPlayerTwoPinGroups?,
        isValidPlayerOnePinGroups?) {

        let additionalGroupPin;
      
        switch (bigGroup) {
          case this._fourPins:
            additionalGroupPin = 0;
            break;
          case this._threePins:
            additionalGroupPin = 1;
            break;
          case this._twoPins:
            additionalGroupPin = 2;
            break;
          case this._onePins:
            additionalGroupPin = 3;
            break;
      
          default:
            break;
        }
      
        
          
          isValidPinGroups.filter(x => !x.isGroupValid.result).forEach(element => {
            bigGroup.splice(bigGroup.findIndex(grp => grp === element.group), 1);
            isValidPinGroups.splice(isValidPinGroups.findIndex(isVGrp => isVGrp === element), 1);
          });
          
          const validPins = isValidPinGroups.filter(x => x.isGroupValid.result);
          const twoWaysValidPins = validPins.filter(x => 
            (x.isGroupValid.start && x.isGroupValid.end) || 
            (x.isGroupValid.start && x.isGroupValid.endPattern[x.isGroupValid.endPattern.length - 1] === 0) ||
            (x.isGroupValid.end && x.isGroupValid.startPattern[x.isGroupValid.startPattern.length - 1] === 0)
            );
          const oneWayValidPins = validPins.filter(x => !twoWaysValidPins.find(y => y === x ));
          const orderedPins = [...twoWaysValidPins, ...oneWayValidPins];
        console.log(orderedPins);
          if(orderedPins.length > 0) {
            let isValidGroupToPlay;
            // let isValidGroupToPlay = orderedPins.find(x => x.isGroupValid.startAdditionalPins === additionalGroupPin || x.isGroupValid.endAdditionalPins === additionalGroupPin);
      
            for (let index = 0; index < additionalGroupPin; index++) {
              if (isValidGroupToPlay) break;
              isValidGroupToPlay = orderedPins.find(x => x.isGroupValid.startAdditionalPins === additionalGroupPin - index);
            }
      
            isValidGroupToPlay = isValidGroupToPlay ? isValidGroupToPlay : orderedPins[0]; 
      
            this.processGroupToPlay(isValidGroupToPlay.isGroupValid, isValidGroupToPlay.group);
          } else {
            callBack(
                isValidAutoFourPinGroups,
                isValidAutoThreePinGroups,
                isValidAutoTwoPinGroups,
                isValidAutoOnePinGroups,
                isValidPlayerFourPinGroups,
                isValidPlayerThreePinGroups,
                isValidPlayerTwoPinGroups,
                isValidPlayerOnePinGroups,
            );
          }
        
          return;
      }

      
    processGroupToPlay(isGValid, group) {

        const startPin =  isGValid.start ? this.calculateNextPin(this.getPinById(group.pinIds[0]), this._directions[group.directionIndex], -1, 1) : null;
        const endPin =  isGValid.end ? this.calculateNextPin(this.getPinById(group.pinIds[group.pinIds.length - 1]), this._directions[group.directionIndex], 1, 1) : null;
    
        if(isGValid.start && isGValid.end) {
    
    
        if (isGValid.startAdditionalPins > isGValid.endAdditionalPins) {
            this.play(startPin);
        } else if((isGValid.startAdditionalPins < isGValid.endAdditionalPins)) {
            this.play(endPin);
        } else {
            this.playRandom([startPin, endPin]);
        }
    
        return;
        }
        if(isGValid.start) {
    
        this.play(startPin);
        return;
        }
        if(isGValid.end) {
        this.play(endPin);
        return;
        }
        console.log('error: processGroupToPlay');
    }

    private subtituteAction_smartPlay(isValidGroup: IsValidGroup[], bigGroup: PinGroup[], alignPinNumber: number, playerId: string, twoSide = false) {

        switch (bigGroup) {
          case this._threePins:
            alignPinNumber = alignPinNumber - 2;
            break;
          case this._twoPins:
            alignPinNumber = alignPinNumber - 1;
            break;
        
          default:
            break;
        }
    
        isValidGroup = isValidGroup.length > 0 ? isValidGroup : this.mapToIsGroupValid(this.filterPins(bigGroup, playerId));
      const isValidAutoThreeMoreOnePinGroups = isValidGroup.filter(x => x.isGroupValid.result && (!twoSide || (x.isGroupValid.start && x.isGroupValid.end)) &&
        (this.sumPattern(x.isGroupValid.startPattern) === alignPinNumber || this.sumPattern(x.isGroupValid.endPattern) === alignPinNumber));
      
      if(isValidAutoThreeMoreOnePinGroups.length > 0) {
        this.processSmartPlay(isValidAutoThreeMoreOnePinGroups, bigGroup);
        return true;
      } else {
        return false;
    
      }
      
    }

    private playRandom(pinGroup) {
        let rdmPin;
            
            while (pinGroup.length > 0) {
            rdmPin = pinGroup[this.getRandomInt(0, pinGroup.length - 1)];
            if(this.play(rdmPin)) {
                return true;
            } else {
                pinGroup.splice(pinGroup.findIndex(p => p.x === rdmPin.x && p.y === rdmPin.y), 1);
            }
            }
            return false;
    }

    private sumPattern(pattern) {
        return pattern.reduce((x, s) => x+s);
    }

    private playLastPin() {
        let totYs = this._yBigSide / this.sideCell;
        let totXs = this._xBigSide / this.sideCell;
        let theYs = [];
        
        for (let index = 1; index < totYs; index++) {
          theYs.push(index * this.sideCell);
        }
      
        while (theYs.length > 0) {
          let aleatoryPin = {y: this.getRandomInt(0, theYs.length - 1)} as Pin;
          for (let index = 1; index < totXs; index++) {
            aleatoryPin.x = (index * this.sideCell);
      
            if(this.getPinByXY(aleatoryPin)) break;
          }
          if(this.getPinByXY(aleatoryPin)) break;
      
          theYs.splice(theYs.findIndex(y => y === aleatoryPin.y), 1);
        }
        
      }

      //#endregion
      

    isComplete(pin: Pin, toGroup=true, directionIndex: number = null, otherPlayer= false) {
        var alignPins = [];
      
        let localDirections = directionIndex ? [ this._directions[directionIndex] ] : this._directions;
        
      
        for (let ind = 0; ind < localDirections.length; ind++) {
          const element = localDirections[ind];
          alignPins = [...this.getAligns_isComplete(pin, element, -1, otherPlayer), ...this.getAligns_isComplete(pin, element, 1, otherPlayer)];
      
          if (alignPins.length === 5) {
            return alignPins;
          }
          else if(toGroup && alignPins.length < 5) this.group(alignPins, ind);
      
        }
      
    }

    private getAligns_isComplete(pin, element, sign, otherPlayer) {
        var alignPins = [];
        const playerId = !otherPlayer ? this._playerTurn.playerId : this._playerTurn.playerId;  
        if(sign === 1) alignPins.push(pin);
        for (let index = 1; index <= 6; index++) {
          var nextPin = this.calculateNextPin(pin, element, sign, index);
          nextPin.playerId = playerId;
          nextPin = this.getPinByXYAndUserId(nextPin);
          if(nextPin) 
            if(sign === 1) alignPins.push(nextPin);
            else alignPins.unshift(nextPin);
          else break;      
        }
        return alignPins;
    }

    group(pins, directionIndex) {
        const pinsGroup: PinGroup = {playerId:pins[0].playerId, directionIndex: directionIndex, pinIds: pins.map(x => x.id)} as PinGroup;
      
        if (pins.length > 1) {
         //se puede borrar
            const badOnesFilter = this._onePins.filter(x => pinsGroup.pinIds.find(p => p === x.pinIds[0]) && x.directionIndex === pinsGroup.directionIndex);
          badOnesFilter.forEach(element => {
            this.removeSubGroupFromGroup(this._onePins, element);
          });
        }
      
        switch (pins.length) {
          case 1:
            const isOnePinValid = this.isGroupValid(pinsGroup);
              if ( isOnePinValid.result && 
                  ((isOnePinValid.startAdditionalPins > 0 && this.isValidOnePattern(isOnePinValid.startPattern)) || 
                    (isOnePinValid.endAdditionalPins > 0 && this.isValidOnePattern(isOnePinValid.endPattern)))
              ) {
                this._onePins.push(pinsGroup);
              }
            break;
          case 2:
            this._twoPins.push(pinsGroup);
            break;
          case 3:
            this._threePins.push(pinsGroup);
            this.removeSubGroupFromGroup(this._twoPins, pinsGroup);
            break;
          case 4:
            this._fourPins.push(pinsGroup);
            this.removeSubGroupFromGroup(this._threePins, pinsGroup);
            break;
        
          default:
            break;
        }
      
    }

    private isValidOnePattern(pattern) {
        let element = pattern[0];
        for (let index = 0; index < pattern.length - 1; index++) {
          const elementTmp = pattern[index + 1];
          if(element === 1 && element === elementTmp)
            return false;
          
          element = elementTmp;
        }
        return true;
    }
    private removeSubGroupFromGroup(bigGroup:PinGroup[], pinsGroup: PinGroup) {
        var indexToRemove = bigGroup.findIndex(x => 
          pinsGroup.directionIndex === x.directionIndex &&  
          pinsGroup.pinIds.findIndex(p => p === x.pinIds[0]) > -1 &&  
          pinsGroup.pinIds.findIndex(p => p === x.pinIds[x.pinIds.length-1]) > -1)
        if(indexToRemove > -1) {
            bigGroup.splice(indexToRemove,1);
          }
    }
      
    private isGroupValid(group: PinGroup): IsValidGroupResult{

        const otherPlayerId = this.getOtherPlayer(group.playerId).playerId;
      
        const start = this.operation_isGroupValid(this.getPinById(group.pinIds[0]), -1, group, otherPlayerId);
        const end = this.operation_isGroupValid(this.getPinById(group.pinIds[group.pinIds.length-1]), 1, group, otherPlayerId);
        
      
        const result = {
          result: start.count === 5 || end.count === 5,
          start: start.count === 5,
          end: end.count === 5,
          startAdditionalPins: start.additionalPinsCount,
          endAdditionalPins: end.additionalPinsCount,
          startPattern: start.pattern,
          endPattern: end.pattern
        } as IsValidGroupResult;
      
      
        return result;
      
    }

    private operation_isGroupValid(pin, sign, group, otherPlayerId) {
      const freePlace = 0;
      const busyPlace = 1;
        let count = group.pinIds.length;
        const c = 7 - group.pinIds.length;
        let additionalPinsCount = 0;
    
        let pattern = [busyPlace];
    
        for (let index = 1; index < c; index++) {
          const nextPin = this.calculateNextPin(pin, this._directions[group.directionIndex], sign, index);
          if (count < 5) {
            if(!this.isPinValid(nextPin) || this.getPinByXYAndUserId(nextPin, otherPlayerId)) break;
            else {
              count++;
              if(this.getPinByXYAndUserId(nextPin, group.playerId)) 
              {
                additionalPinsCount++;
                pattern.push(busyPlace);
              }
              else {
                 pattern.push(freePlace);
              }
            } 
          } else {
            if(this.getPinByXYAndUserId(nextPin, group.playerId)) count++;
          }
        }
    
        return {
          count: count,
          additionalPinsCount: additionalPinsCount,
          pattern: pattern,
        };
    }
    
    calculateNextPin(originPin, direction, sign, distance): Pin {
        return {
            x: originPin.x + (direction.x*this.sideCell*distance*sign), 
            y: originPin.y + (direction.y*this.sideCell*distance*sign)
        } as Pin
    }

    calculateCenter(): Pin {


        return this.randomCenter_calculateCenter({
            x: this.correctCenter_calculateCenter(this._xBigSide),
             y: this.correctCenter_calculateCenter(this._yBigSide)} as Pin) as Pin;
      
    }
    private randomCenter_calculateCenter(pin: Pin) {
          
        var localDirections = [
          ...[{x:0, y:0}], 
          ...this._directions, 
          ...this._directions.map(p => { return {x:p.x * 2, y:p.y *2} }),
        ];
    
        let rnd = this.getRandomInt(0,localDirections.length - 1);
        const result ={x: pin.x + this.sideCell * localDirections[rnd].x , y: pin.y + this.sideCell * localDirections[rnd].y}
        return result;
    }

    //#region Helpers

        private getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        private mapToIsGroupValid(pinsGroup: PinGroup[]): IsValidGroup[] {
            return pinsGroup.map(group => {
              return {
                isGroupValid: this.isGroupValid(group), 
                group: group
              } as IsValidGroup;
            });
        }

        private filterPins(pinGroups: PinGroup[], playerId): PinGroup[] {
            return pinGroups.filter(x => x.playerId === playerId)
        }
    //#endregion


    private correctCenter_calculateCenter(num): number {
        var middleNum = (num/2);
        return  middleNum - (middleNum % this.sideCell);
    }

    private calculateSecondPin(pin, distance = 1): Pin {
        let possibilities = this._directions.map(p => {
          return {x: pin.x + this.sideCell * distance * p.x , y: pin.y + this.sideCell * distance * p.y}
        });
      
        possibilities = possibilities.filter(x => this._pins.filter(p => p.x === x.x && p.y === x.y).length === 0 );
      
        return possibilities[this.getRandomInt(0, possibilities.length - 1)] as Pin;
      
      }

      setAutomaticPlayerTurn(){
       this._playerTurn = Helper.AUTOMATIC_PLAYER; 
      }

    clearGroups() {
      this._pins = [];
      this._onePins = [];
      this._twoPins = [];
      this._threePins = [];
      this._fourPins = [];
    }
}

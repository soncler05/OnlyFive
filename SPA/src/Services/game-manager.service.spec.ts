/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { GameManagerService } from './game-manager.service';

describe('Service: GameManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameManagerService]
    });
  });

  it('should ...', inject([GameManagerService], (service: GameManagerService) => {
    expect(service).toBeTruthy();
  }));
});

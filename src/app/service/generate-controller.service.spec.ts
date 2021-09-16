import { TestBed } from '@angular/core/testing';

import { GenerateControllerService } from './generate-controller.service';

describe('GenerateControllerService', () => {
  let service: GenerateControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

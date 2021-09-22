import { TestBed } from '@angular/core/testing';

import { GenerateMainService } from './generate-main.service';

describe('GenerateMainService', () => {
  let service: GenerateMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

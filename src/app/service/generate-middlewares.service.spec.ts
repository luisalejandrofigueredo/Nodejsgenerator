import { TestBed } from '@angular/core/testing';

import { GenerateMiddlewaresService } from './generate-middlewares.service';

describe('GenerateMiddlewaresService', () => {
  let service: GenerateMiddlewaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateMiddlewaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

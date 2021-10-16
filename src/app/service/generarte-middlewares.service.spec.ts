import { TestBed } from '@angular/core/testing';

import { GenerarteMiddlewaresService } from './generarte-middlewares.service';

describe('GenerarteMiddlewaresService', () => {
  let service: GenerarteMiddlewaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarteMiddlewaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

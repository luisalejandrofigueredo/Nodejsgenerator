import { TestBed } from '@angular/core/testing';

import { GenerateRoutesService } from './generate-routes.service';

describe('GenerateRoutesService', () => {
  let service: GenerateRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

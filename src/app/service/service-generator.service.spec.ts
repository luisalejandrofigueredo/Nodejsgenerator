import { TestBed } from '@angular/core/testing';

import { ServiceGeneratorService } from './service-generator.service';

describe('ServiceGeneratorService', () => {
  let service: ServiceGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

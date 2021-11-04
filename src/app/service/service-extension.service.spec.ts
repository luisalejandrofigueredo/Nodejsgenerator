import { TestBed } from '@angular/core/testing';

import { ServiceExtensionService } from './service-extension.service';

describe('ServiceExtensionService', () => {
  let service: ServiceExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

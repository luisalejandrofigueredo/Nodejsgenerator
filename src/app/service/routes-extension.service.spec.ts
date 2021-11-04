import { TestBed } from '@angular/core/testing';

import { RoutesExtensionService } from './routes-extension.service';

describe('RoutesExtensionService', () => {
  let service: RoutesExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutesExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

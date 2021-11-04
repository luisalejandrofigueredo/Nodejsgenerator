import { TestBed } from '@angular/core/testing';

import { SeviceExtensionService } from './sevice-extension.service';

describe('SeviceExtensionService', () => {
  let service: SeviceExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeviceExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

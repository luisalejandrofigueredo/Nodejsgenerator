import { TestBed } from '@angular/core/testing';

import { ControllersExtensionService } from './controllers-extension.service';

describe('ControllersExtensionService', () => {
  let service: ControllersExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControllersExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

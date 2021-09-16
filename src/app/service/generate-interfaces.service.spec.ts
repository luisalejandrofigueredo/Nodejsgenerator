import { TestBed } from '@angular/core/testing';

import { GenerateInterfacesService } from './generate-interfaces.service';

describe('GenerateInterfacesService', () => {
  let service: GenerateInterfacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateInterfacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SerschemaService } from './serschema.service';

describe('SerschemaService', () => {
  let service: SerschemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerschemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

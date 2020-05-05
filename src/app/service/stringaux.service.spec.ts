import { TestBed } from '@angular/core/testing';

import { StringauxService } from './stringaux.service';

describe('StringauxService', () => {
  let service: StringauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

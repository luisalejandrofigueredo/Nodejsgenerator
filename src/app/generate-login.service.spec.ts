import { TestBed } from '@angular/core/testing';

import { GenerateLoginService } from './generate-login.service';

describe('GenerateLoginService', () => {
  let service: GenerateLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MenuserviceService } from './menuservice.service';

describe('MenuserviceService', () => {
  let service: MenuserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

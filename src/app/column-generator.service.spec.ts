import { TestBed } from '@angular/core/testing';

import { ColumnGeneratorService } from './column-generator.service';

describe('ColumnGeneratorService', () => {
  let service: ColumnGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

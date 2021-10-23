import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nextstep2Component } from './nextstep2.component';

describe('Nextstep2Component', () => {
  let component: Nextstep2Component;
  let fixture: ComponentFixture<Nextstep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Nextstep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Nextstep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

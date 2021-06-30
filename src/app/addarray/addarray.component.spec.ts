import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddarrayComponent } from './addarray.component';

describe('AddarrayComponent', () => {
  let component: AddarrayComponent;
  let fixture: ComponentFixture<AddarrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddarrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

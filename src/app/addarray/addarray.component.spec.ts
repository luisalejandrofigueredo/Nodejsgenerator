import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddarrayComponent } from './addarray.component';

describe('AddarrayComponent', () => {
  let component: AddarrayComponent;
  let fixture: ComponentFixture<AddarrayComponent>;

  beforeEach(waitForAsync(() => {
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

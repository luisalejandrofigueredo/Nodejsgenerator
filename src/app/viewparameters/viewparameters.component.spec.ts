import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewparametersComponent } from './viewparameters.component';

describe('ViewparametersComponent', () => {
  let component: ViewparametersComponent;
  let fixture: ComponentFixture<ViewparametersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewparametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewparametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

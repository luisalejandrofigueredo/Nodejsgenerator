import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParametersmodalComponent } from './parametersmodal.component';

describe('ParametersmodalComponent', () => {
  let component: ParametersmodalComponent;
  let fixture: ComponentFixture<ParametersmodalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametersmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

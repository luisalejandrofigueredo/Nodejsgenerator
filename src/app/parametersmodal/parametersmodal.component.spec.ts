import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersmodalComponent } from './parametersmodal.component';

describe('ParametersmodalComponent', () => {
  let component: ParametersmodalComponent;
  let fixture: ComponentFixture<ParametersmodalComponent>;

  beforeEach(async(() => {
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormschemamodalComponent } from './formschemamodal.component';

describe('FormschemamodalComponent', () => {
  let component: FormschemamodalComponent;
  let fixture: ComponentFixture<FormschemamodalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormschemamodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormschemamodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

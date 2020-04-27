import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormschemamodalComponent } from './formschemamodal.component';

describe('FormschemamodalComponent', () => {
  let component: FormschemamodalComponent;
  let fixture: ComponentFixture<FormschemamodalComponent>;

  beforeEach(async(() => {
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

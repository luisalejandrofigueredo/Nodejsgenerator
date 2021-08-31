import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApidatamodalComponent } from './apidatamodal.component';

describe('ApidatamodalComponent', () => {
  let component: ApidatamodalComponent;
  let fixture: ComponentFixture<ApidatamodalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApidatamodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApidatamodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApidatamodalComponent } from './apidatamodal.component';

describe('ApidatamodalComponent', () => {
  let component: ApidatamodalComponent;
  let fixture: ComponentFixture<ApidatamodalComponent>;

  beforeEach(async(() => {
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

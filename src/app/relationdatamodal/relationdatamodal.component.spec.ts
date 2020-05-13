import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationdatamodalComponent } from './relationdatamodal.component';

describe('RelationdatamodalComponent', () => {
  let component: RelationdatamodalComponent;
  let fixture: ComponentFixture<RelationdatamodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationdatamodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationdatamodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

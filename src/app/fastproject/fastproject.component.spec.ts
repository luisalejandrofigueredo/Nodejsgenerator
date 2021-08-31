import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FastprojectComponent } from './fastproject.component';

describe('FastprojectComponent', () => {
  let component: FastprojectComponent;
  let fixture: ComponentFixture<FastprojectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FastprojectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

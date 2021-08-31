import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpconfigComponent } from './helpconfig.component';

describe('HelpconfigComponent', () => {
  let component: HelpconfigComponent;
  let fixture: ComponentFixture<HelpconfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

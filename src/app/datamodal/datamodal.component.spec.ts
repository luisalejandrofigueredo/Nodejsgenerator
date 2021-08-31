import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatamodalComponent } from './datamodal.component';

describe('DatamodalComponent', () => {
  let component: DatamodalComponent;
  let fixture: ComponentFixture<DatamodalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatamodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatamodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

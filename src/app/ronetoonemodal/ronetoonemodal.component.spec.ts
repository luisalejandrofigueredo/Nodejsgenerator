import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RonetoonemodalComponent } from './ronetoonemodal.component';

describe('RonetoonemodalComponent', () => {
  let component: RonetoonemodalComponent;
  let fixture: ComponentFixture<RonetoonemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RonetoonemodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RonetoonemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserelationsComponent } from './browserelations.component';

describe('BrowserelationsComponent', () => {
  let component: BrowserelationsComponent;
  let fixture: ComponentFixture<BrowserelationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserelationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowseonetomanyComponent } from './browseonetomany.component';

describe('BrowseonetomanyComponent', () => {
  let component: BrowseonetomanyComponent;
  let fixture: ComponentFixture<BrowseonetomanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseonetomanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseonetomanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

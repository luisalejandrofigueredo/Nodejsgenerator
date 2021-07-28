import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseonetomanyComponent } from './browseonetomany.component';

describe('BrowseonetomanyComponent', () => {
  let component: BrowseonetomanyComponent;
  let fixture: ComponentFixture<BrowseonetomanyComponent>;

  beforeEach(async(() => {
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

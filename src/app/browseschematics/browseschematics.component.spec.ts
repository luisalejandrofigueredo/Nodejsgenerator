import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseschematicsComponent } from './browseschematics.component';

describe('BrowseschematicsComponent', () => {
  let component: BrowseschematicsComponent;
  let fixture: ComponentFixture<BrowseschematicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseschematicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseschematicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchematicsComponent } from './schematics.component';

describe('SchematicsComponent', () => {
  let component: SchematicsComponent;
  let fixture: ComponentFixture<SchematicsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchematicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchematicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

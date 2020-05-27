import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationdatamodalonetomanyComponent } from './relationdatamodalonetomany.component';

describe('RelationdatamodalonetomanyComponent', () => {
  let component: RelationdatamodalonetomanyComponent;
  let fixture: ComponentFixture<RelationdatamodalonetomanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationdatamodalonetomanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationdatamodalonetomanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

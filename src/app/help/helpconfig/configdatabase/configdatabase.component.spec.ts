import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigdatabaseComponent } from './configdatabase.component';

describe('ConfigdatabaseComponent', () => {
  let component: ConfigdatabaseComponent;
  let fixture: ComponentFixture<ConfigdatabaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigdatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigdatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

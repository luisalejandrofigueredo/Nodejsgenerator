import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigprincipalComponent } from './configprincipal.component';

describe('ConfigprincipalComponent', () => {
  let component: ConfigprincipalComponent;
  let fixture: ComponentFixture<ConfigprincipalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigprincipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigprincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenoptionsComponent } from './genoptions.component';

describe('GenoptionsComponent', () => {
  let component: GenoptionsComponent;
  let fixture: ComponentFixture<GenoptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenoptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenoptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenoptionsComponent } from './genoptions.component';

describe('GenoptionsComponent', () => {
  let component: GenoptionsComponent;
  let fixture: ComponentFixture<GenoptionsComponent>;

  beforeEach(async(() => {
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

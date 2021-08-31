import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenoptionswithoperatorsComponent } from './genoptionswithoperators.component';

describe('GenoptionswithoperatorsComponent', () => {
  let component: GenoptionswithoperatorsComponent;
  let fixture: ComponentFixture<GenoptionswithoperatorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenoptionswithoperatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenoptionswithoperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

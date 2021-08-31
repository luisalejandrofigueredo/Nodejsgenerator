import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GensecurityComponent } from './gensecurity.component';

describe('GensecurityComponent', () => {
  let component: GensecurityComponent;
  let fixture: ComponentFixture<GensecurityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GensecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GensecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

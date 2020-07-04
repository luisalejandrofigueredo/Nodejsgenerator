import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GensecurityComponent } from './gensecurity.component';

describe('GensecurityComponent', () => {
  let component: GensecurityComponent;
  let fixture: ComponentFixture<GensecurityComponent>;

  beforeEach(async(() => {
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
